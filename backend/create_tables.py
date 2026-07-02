from app.core.database import (
    engine,
    Base
)

from app.models.sop import SOP


Base.metadata.create_all(
    bind=engine
)

print(
    "Tables created successfully"
)