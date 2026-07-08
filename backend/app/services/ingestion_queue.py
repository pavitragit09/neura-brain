import time
import re
import threading
from datetime import datetime, timedelta
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.document import Document
from app.models.ingestion_job import IngestionJob
from app.models.sop import SOP
from app.repositories.sop_repository import create_sop
from app.services.sop_service import generate_sop_data
from app.services.audit_service import log_action
from app.vectorstore.qdrant_client import client
from app.core.config import settings
from qdrant_client.models import Filter, FieldCondition, MatchValue
from app.llm.gemini_client import generate_content

class IngestionQueueProcessor:
    def __init__(self):
        self.worker_thread = None
        self.lock = threading.Lock()
        self.is_running = False

    def start_worker(self):
        """
        Starts the background database polling worker if it is not already running.
        """
        with self.lock:
            if not self.is_running:
                self.is_running = True
                self.worker_thread = threading.Thread(target=self._worker_loop, daemon=True)
                self.worker_thread.start()
                print("[QUEUE] DB-backed Ingestion Queue Worker started.")

    def _worker_loop(self):
        while self.is_running:
            try:
                db = SessionLocal()
                try:
                    self._process_next_job(db)
                except Exception as e:
                    print(f"[QUEUE] Error processing next job: {e}")
                finally:
                    db.close()
            except Exception as e:
                print(f"[QUEUE] Database connection error in loop: {e}")
            
            # Poll every 5 seconds
            time.sleep(5)

    def _process_next_job(self, db: Session):
        now = datetime.utcnow()
        # Find next job: status is 'pending' or 'pending_retry' and (retry_after is null or past)
        job = db.query(IngestionJob).filter(
            IngestionJob.status.in_(["pending", "pending_retry"]),
            or_(IngestionJob.retry_after == None, IngestionJob.retry_after <= now)
        ).order_by(IngestionJob.created_at.asc()).first()

        if not job:
            return

        # Mark job as processing
        job.status = "processing"
        job.started_at = datetime.utcnow()
        db.commit()

        # Retrieve document record
        doc = db.query(Document).filter(Document.id == job.document_id).first()
        if not doc:
            print(f"[QUEUE] Document ID {job.document_id} not found in database. Marking job failed.")
            job.status = "failed"
            job.error_message = "Document not found"
            job.completed_at = datetime.utcnow()
            db.commit()
            return

        # Update document status to indicate SOP generation is running
        doc.processing_status = "generating_sop"
        db.commit()

        print(f"[QUEUE] Job {job.id}: Processing document '{doc.filename}'...")

        try:
            # 1. Fetch text chunks from Qdrant and rebuild full text
            full_text = self._rebuild_text_from_qdrant(doc.filename)
            if not full_text.strip():
                raise ValueError("No text content found in vector store chunks.")

            # 2. Heuristics & Policy classification
            is_policy = self._classify_document(full_text, doc.filename)

            if is_policy:
                print(f"[QUEUE] Job {job.id}: Document '{doc.filename}' classified as POLICY. Starting SOP generation...")
                # Run LangGraph chain
                sop_result = generate_sop_data(full_text)
                
                # Save SOP to database
                saved_sop = create_sop(
                    db=db,
                    document_name=doc.filename,
                    structured_sop=sop_result["structured_sop"],
                    hallucination_score=sop_result["hallucination_score"],
                    confidence_score=sop_result["confidence_score"],
                    review_status=sop_result["review_status"]
                )

                # Link SOP to document and update status to completed
                # Clear out any old SOP relation to prevent leaks
                old_sop_id = doc.sop_id
                doc.sop_id = saved_sop.id
                doc.processing_status = "completed"
                
                # Complete the job record
                job.status = "completed"
                job.completed_at = datetime.utcnow()
                db.commit()

                # Clean up old SOP record if present
                if old_sop_id:
                    old_sop = db.query(SOP).filter(SOP.id == old_sop_id).first()
                    if old_sop:
                        db.delete(old_sop)
                        db.commit()

                # Log audit trail
                log_action(
                    db=db,
                    action="INGEST",
                    entity_type="DOCUMENT",
                    entity_id=doc.id,
                    performed_by="system",
                    details=f"Generated SOP for policy document: {doc.filename}"
                )
                print(f"[QUEUE] Job {job.id}: Successfully completed SOP generation for '{doc.filename}'.")

            else:
                # Reference document: skip SOP generation
                print(f"[QUEUE] Job {job.id}: Document '{doc.filename}' is a REFERENCE document. Skipping SOP generation.")
                doc.processing_status = "indexed"
                job.status = "completed"
                job.completed_at = datetime.utcnow()
                db.commit()

                log_action(
                    db=db,
                    action="INGEST",
                    entity_type="DOCUMENT",
                    entity_id=doc.id,
                    performed_by="system",
                    details=f"Indexed reference document (no SOP generated): {doc.filename}"
                )

        except Exception as e:
            err_msg = str(e)
            print(f"[QUEUE] Job {job.id}: Error processing '{doc.filename}': {err_msg}")
            
            # Check if rate limit quota error
            is_rate_limit = "429" in err_msg or "quota" in err_msg.lower() or "limit" in err_msg.lower()
            job.attempts += 1
            
            if is_rate_limit and job.attempts < 3:
                # Attempt to extract explicit wait time (e.g. "wait 34 seconds")
                match = re.search(r'(?:wait|retry after|after)\s*(\d+)\s*(?:seconds|s)?', err_msg, re.IGNORECASE)
                wait_seconds = int(match.group(1)) if match else 35
                
                print(f"[QUEUE] Job {job.id}: Rate limit hit. Re-queuing job for retry after {wait_seconds} seconds.")
                job.status = "pending_retry"
                job.retry_after = datetime.utcnow() + timedelta(seconds=wait_seconds + 2)
                job.error_message = err_msg
                doc.processing_status = "indexed" # Search ready while waiting
                db.commit()
            else:
                # Mark job as permanently failed
                print(f"[QUEUE] Job {job.id}: Job failed permanently. Attempts: {job.attempts}")
                job.status = "failed"
                job.error_message = err_msg
                job.completed_at = datetime.utcnow()
                doc.processing_status = "indexed" # Fallback to indexed search ready
                db.commit()

                log_action(
                    db=db,
                    action="INGEST_FAIL",
                    entity_type="DOCUMENT",
                    entity_id=doc.id,
                    performed_by="system",
                    details=f"Failed background SOP generation for {doc.filename}. Error: {err_msg}"
                )

    def _rebuild_text_from_qdrant(self, doc_name: str) -> str:
        """
        Fetches text payload chunks from Qdrant and concatenates them in order.
        """
        try:
            scroll_filter = Filter(
                must=[
                    FieldCondition(key="source", match=MatchValue(value=doc_name))
                ]
            )
            points, _ = client.scroll(
                collection_name=settings.COLLECTION_NAME,
                scroll_filter=scroll_filter,
                limit=1000,
                with_payload=True,
                with_vectors=False
            )
            # Sort by chunk index
            sorted_points = sorted(points, key=lambda p: p.payload.get("chunk_index", 0))
            full_text = "\n\n".join(p.payload.get("text", "") for p in sorted_points)
            return full_text
        except Exception as e:
            print(f"[QUEUE] Error fetching chunks from Qdrant: {e}")
            return ""

    def _classify_document(self, text: str, filename: str) -> bool:
        """
        Classifies if a document is a policy vs reference using heuristics + Gemini fallback.
        """
        # 1. Heuristics check on filename and path
        lower_name = filename.lower()
        policy_keywords = [
            "policy", "sop", "procedure", "guideline", "handbook", "regulation", 
            "conduct", "standard", "governance", "agreement", "rules", "compliance",
            "code_of_conduct", "onboarding", "terms"
        ]
        if any(keyword in lower_name for keyword in policy_keywords):
            print(f"[CLASSIFIER] Fast-pass heuristic matched filename '{filename}'. Classified as POLICY.")
            return True

        # 2. Heuristics check on first 1000 characters
        preview_text = text[:1000].lower()
        if any(keyword in preview_text for keyword in policy_keywords):
            # Let's count matching keywords to avoid false positives in general notes
            matches = sum(1 for keyword in policy_keywords if keyword in preview_text)
            if matches >= 2:
                print(f"[CLASSIFIER] Fast-pass heuristic matched text keywords in '{filename}'. Classified as POLICY.")
                return True

        # 3. Gemini fallback classification
        sample_text = text[:1500]
        prompt = f"""
Analyze the following document title and preview text.
Determine if this document is a formal organization policy, Standard Operating Procedure (SOP), employee handbook, regulatory guideline, compliance code, contract agreement, or standard operating rules.
If it is a policy, SOP, or governance/compliance document, respond with exactly 'yes'.
If it is a syllabus, study notes, general article, presentation slides, course material, homework, or general reference information that does not dictate active company policy/rules, respond with exactly 'no'.

FILENAME: {filename}
CONTENT PREVIEW:
{sample_text}

Response (exactly 'yes' or 'no'):
"""
        try:
            print(f"[CLASSIFIER] Running Gemini classification fallback for '{filename}'...")
            res_text = generate_content(prompt, retries=2).strip().lower()
            is_policy = "yes" in res_text
            print(f"[CLASSIFIER] Gemini classification result for '{filename}': {'POLICY' if is_policy else 'REFERENCE'} (response: '{res_text}')")
            return is_policy
        except Exception as e:
            print(f"[CLASSIFIER] Gemini classification fallback failed for '{filename}', defaulting to False: {e}")
            return False

# Global instance of queue processor
queue_processor = IngestionQueueProcessor()
