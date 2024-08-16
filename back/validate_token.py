import jwt
from typing import Optional

# Configurações
SECRET_KEY = "segredo"
ALGORITHM = "HS256"

def validate_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None