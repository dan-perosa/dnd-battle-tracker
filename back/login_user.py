from sqlalchemy import select
from database import SessionLocal, User
from fastapi import status
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "segredo"  # Troque isso por uma chave secreta segura
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 240

session = SessionLocal()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def login_user(response, username: str, password: str):
    try:
        querry = select(User.id).where(User.username == username).where(User.password == password)
        result = session.execute(querry)
        if len(result.all()) == 0:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return {'erro': 'usuario ou senha invalida'}
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": username}, expires_delta=access_token_expires
        )
        querry_id = select(User.id).where(User.username == username).where(User.password == password)
        result = session.execute(querry_id)
        user_id_row = result.first()
        
        return {'sucesso': 'usuario logado',
                'token': access_token,
                'id': user_id_row.id
                }
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')