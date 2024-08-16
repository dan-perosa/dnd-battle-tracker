from typing import Dict
from models import User
from database import SessionLocal
from sqlalchemy import select, or_
from fastapi import status

session = SessionLocal()

def create_user(user_info: Dict[str, str], response):
    
    try:
        user_username = user_info.username
        user_email = user_info.email
        querry = select(User).where(
            or_(
                User.username == user_username,
                User.email == user_email
            )
        )
        result = session.execute(querry)
        
        if len(result.all()) != 0:
            response.status_code = status.HTTP_409_CONFLICT
            return {'erro': 'email ou username já cadastrado'}
        
        new_user = User(first_name=user_info.first_name,
                        last_name=user_info.last_name,
                        username=user_info.username,
                        email=user_info.email,
                        password=user_info.password,)
        
        session.add(new_user)
        session.commit()
        
        return {'mensagem': 'usuario criado'}
    
    except Exception as e:
        print(f'erro {e}')
        