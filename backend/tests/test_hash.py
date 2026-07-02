from app.security.hashing import (
    hash_password,
    verify_password
)

password = "admin123"

hashed = hash_password(
    password
)

print("Original Password:")
print(password)

print()

print("Hashed Password:")
print(hashed)

print()

print(
    verify_password(
        "admin123",
        hashed
    )
)

print(
    verify_password(
        "wrongpassword",
        hashed
    )
)