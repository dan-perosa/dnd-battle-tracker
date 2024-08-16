from typing import Dict
from sqlalchemy import update, select
from database import SessionLocal, User

session = SessionLocal()

def change_user_password(change_user_password_info: Dict[str, str]):
    try:
        user_username = change_user_password_info.username
        user_password = change_user_password_info.password
        user_new_password = change_user_password_info.new_password
        querry = select(User.username).where(User.username == user_username).where(User.password == user_password)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'usuario ou senha invalida'}
        querry = update(User).where(User.username == user_username).where(User.password == user_password).values(password=user_new_password)
        session.execute(querry)
        session.commit()
        return {'sucesso': 'senha trocada'}
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')