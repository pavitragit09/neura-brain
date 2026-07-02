from app.security.jwt import (
    create_access_token,
    verify_access_token
)

token = create_access_token(
    {
        "sub": "admin"
    }
)

print("TOKEN:\n")
print(token)

print()

payload = verify_access_token(
    token
)

print(payload)