from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

class BaseConnector(ABC):
    """
    Abstract Base Class defining the standard interface for all NEURA connectors.
    Any enterprise connector (Google Drive, Notion, Slack, Gmail, Confluence, etc.)
    must inherit from this base and implement all contract methods.
    """

    @abstractmethod
    def list_files(self) -> list:
        """
        List files available in the external service.
        Returns a list of dictionaries with standardized file metadata keys:
        [{"id": "...", "name": "...", "mimeType": "...", "modifiedTime": "...", "webViewLink": "..."}]
        """
        pass

    @abstractmethod
    def download_file(self, file_id: str, file_name: str, mime_type: str) -> str:
        """
        Download or export a file from the external service to a local temporary path.
        Returns the absolute path to the local temporary file.
        """
        pass

    @abstractmethod
    def sync(self, db: Session) -> dict:
        """
        Run the sync operation to compare, download, and ingest files into NEURA.
        Returns sync stats summary:
        {"total_files": X, "indexed": Y, "updated": Z, "skipped": W, "failed": K, "duration_seconds": S}
        """
        pass

    @abstractmethod
    def disconnect(self, db: Session) -> bool:
        """
        Revoke service credentials and delete the connector connection from database.
        """
        pass
