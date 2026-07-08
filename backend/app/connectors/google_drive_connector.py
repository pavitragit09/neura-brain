import time
import os
import requests
from datetime import datetime
from pathlib import Path
from sqlalchemy.orm import Session

from app.connectors.base_connector import BaseConnector
from app.repositories import connector_repository
from app.services import connector_service
from app.services.ingestion_service import ingest_document
from app.models.connector import Connector
from app.models.document import Document

class GoogleDriveConnector(BaseConnector):
    """
    Google Drive Implementation of the BaseConnector interface.
    """

    def __init__(self, db: Session):
        self.db = db
        # Retrieve google connector record
        self.connector = db.query(Connector).filter(Connector.connector_type == "google").first()
        if not self.connector:
            raise ValueError("Google Drive connector configuration not found.")
        
        # Ensure fresh access token
        self._ensure_fresh_token()

    def _ensure_fresh_token(self):
        # Decrypt tokens (already handled by connector_repository)
        conn = connector_repository.get_connector(self.db, "google")
        if not conn:
            raise ValueError("Failed to retrieve Google credentials.")
        
        # Check if expired or expiring within 5 minutes
        if conn.expires_at:
            time_now = datetime.utcnow()
            # If expired or close to it
            if (conn.expires_at - time_now).total_seconds() < 300:
                print("[CONNECTOR] Refreshing Google Access Token...")
                try:
                    self.connector = connector_service.refresh_google_access_token(self.db, conn)
                except Exception as e:
                    print(f"[CONNECTOR] Error refreshing token: {e}")
                    # Re-retrieve to check if another process updated it
                    self.connector = connector_repository.get_connector(self.db, "google")
            else:
                self.connector = conn
        else:
            self.connector = conn

    def list_files(self) -> list:
        headers = {"Authorization": f"Bearer {self.connector.access_token}"}
        url = "https://www.googleapis.com/drive/v3/files"
        
        # Query supported MIME types or extensions, avoiding folders & trash
        q = (
            "trashed = false and ("
            "mimeType = 'application/pdf' or "
            "mimeType = 'application/vnd.google-apps.document' or "
            "mimeType = 'application/vnd.google-apps.spreadsheet' or "
            "mimeType = 'application/vnd.google-apps.presentation' or "
            "mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or "
            "mimeType = 'text/plain' or "
            "mimeType = 'text/markdown'"
            ")"
        )
        
        print(f"[GOOGLE DRIVE API] q query: {q}")
        
        params = {
            "q": q,
            "fields": "files(id, name, mimeType, modifiedTime, webViewLink, size)",
            "pageSize": 100
        }
        
        res = requests.get(url, headers=headers, params=params, timeout=10)
        if res.status_code != 200:
            raise ValueError(f"Failed to fetch Google Drive files: {res.text}")
            
        data = res.json()
        return data.get("files", [])

    def download_file(self, file_id: str, file_name: str, mime_type: str) -> str:
        headers = {"Authorization": f"Bearer {self.connector.access_token}"}
        
        # Create backend temp downloads directory
        temp_dir = Path("temp_downloads")
        temp_dir.mkdir(exist_ok=True)
        
        # Determine download vs export path
        is_google_workspace_type = mime_type.startswith("application/vnd.google-apps")
        
        # Determine local filename and url
        if mime_type == "application/vnd.google-apps.document":
            # Export Docs to txt
            export_url = f"https://www.googleapis.com/drive/v3/files/{file_id}/export?mimeType=text/plain"
            local_path = temp_dir / f"{file_name}.txt"
            res = requests.get(export_url, headers=headers, stream=True, timeout=15)
        elif mime_type == "application/vnd.google-apps.spreadsheet":
            # Export Sheets to CSV (plaintext CSV)
            export_url = f"https://www.googleapis.com/drive/v3/files/{file_id}/export?mimeType=text/csv"
            local_path = temp_dir / f"{file_name}.txt"
            res = requests.get(export_url, headers=headers, stream=True, timeout=15)
        elif mime_type == "application/vnd.google-apps.presentation":
            # Export Slides to PDF
            export_url = f"https://www.googleapis.com/drive/v3/files/{file_id}/export?mimeType=application/pdf"
            local_path = temp_dir / f"{file_name}.pdf"
            res = requests.get(export_url, headers=headers, stream=True, timeout=15)
        else:
            # Download other formats directly
            download_url = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media"
            local_path = temp_dir / file_name
            res = requests.get(download_url, headers=headers, stream=True, timeout=20)
            
        if res.status_code != 200:
            raise ValueError(f"Failed downloading file '{file_name}': {res.text}")
            
        with open(local_path, "wb") as f:
            for chunk in res.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    
        return str(local_path.resolve())

    def sync(self, db: Session) -> dict:
        start_time = time.time()
        
        # Ingestion metrics
        stats = {
            "total_files": 0,
            "indexed": 0,
            "updated": 0,
            "skipped": 0,
            "failed": 0,
            "duration_seconds": 0.0
        }
        
        try:
            files = self.list_files()
            stats["total_files"] = len(files)
            
            for f in files:
                file_id = f.get("id")
                name = f.get("name")
                mime_type = f.get("mimeType")
                web_view_link = f.get("webViewLink")
                
                # Local validation to ignore unsupported file extensions
                lower_name = name.lower()
                is_supported = (
                    lower_name.endswith(".pdf") or
                    lower_name.endswith(".docx") or
                    lower_name.endswith(".txt") or
                    lower_name.endswith(".md") or
                    mime_type in [
                        "application/pdf",
                        "application/vnd.google-apps.document",
                        "application/vnd.google-apps.spreadsheet",
                        "application/vnd.google-apps.presentation",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "text/plain",
                        "text/markdown"
                    ]
                )
                if not is_supported:
                    stats["skipped"] += 1
                    continue
                
                # Parse Google RFC3339 timestamp (e.g. 2026-07-07T07:25:00.000Z)
                mod_time_str = f.get("modifiedTime")
                # Replace 'Z' with '+00:00' to support standard isoformat parsing in python
                if mod_time_str.endswith("Z"):
                    mod_time_str = mod_time_str[:-1] + "+00:00"
                modified_time = datetime.fromisoformat(mod_time_str)
                
                # Check database for existing google_file_id
                existing = db.query(Document).filter(Document.google_file_id == file_id).first()
                
                if existing:
                    # Parse existing doc's modified time
                    # If mod times match, skip ingestion
                    if existing.google_modified_time and existing.google_modified_time.replace(tzinfo=None) == modified_time.replace(tzinfo=None):
                        stats["skipped"] += 1
                        continue
                    else:
                        is_update = True
                else:
                    is_update = False
                    
                # Download and process new/updated file
                temp_path = None
                try:
                    temp_path = self.download_file(file_id, name, mime_type)
                    
                    # Run the reuse pipeline ingestion
                    ingest_document(
                        db=db,
                        file_path=temp_path,
                        filename=name,
                        source_type="google_drive",
                        google_file_id=file_id,
                        google_modified_time=modified_time,
                        google_web_view_link=web_view_link
                    )
                    
                    if is_update:
                        stats["updated"] += 1
                    else:
                        stats["indexed"] += 1
                except Exception as e:
                    print(f"[CONNECTOR] Error syncing file '{name}': {e}")
                    stats["failed"] += 1
                finally:
                    # Clean up temporary downloads from disk immediately
                    if temp_path and os.path.exists(temp_path):
                        try:
                            os.remove(temp_path)
                        except Exception:
                            pass
            
            # Update connection metadata status
            self.connector.last_sync_at = datetime.utcnow()
            self.connector.last_sync_status = "success"
            self.connector.files_indexed = db.query(Document).filter(Document.source_type == "google_drive").count()
            self.connector.last_error = None
            db.commit()
            
        except Exception as e:
            error_str = str(e)
            print(f"[CONNECTOR] Sync critical failure: {error_str}")
            self.connector.last_sync_at = datetime.utcnow()
            self.connector.last_sync_status = "failed"
            self.connector.last_error = error_str
            db.commit()
            raise e
            
        stats["duration_seconds"] = round(time.time() - start_time, 2)
        return stats

    def disconnect(self, db: Session) -> bool:
        # Revoke Google OAuth permissions
        if self.connector.access_token:
            try:
                revoke_url = f"https://oauth2.googleapis.com/revoke?token={self.connector.access_token}"
                requests.post(revoke_url, timeout=5)
            except Exception:
                pass
                
        # Clean up database record
        db.delete(self.connector)
        db.commit()
        return True
