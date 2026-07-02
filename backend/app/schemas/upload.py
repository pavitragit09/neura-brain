from typing import Any

from pydantic import BaseModel


class UploadResponse(BaseModel):

    message: str

    result: dict[str, Any]
