from typing import Dict
from sqlalchemy import select, delete
from database import SessionLocal
from models import Character

session = SessionLocal()

def delete_character(delete_character_info: Dict[str, str]):
    try:
        owner_id = delete_character_info.owner_id
        character_name = delete_character_info.character_name
        character_id = delete_character_info.character_id
        
        querry = select(Character).where(Character.owner_id == owner_id).where(Character.name == character_name).where(Character.id == character_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'character não encontrado'}
        
        querry = delete(Character).where(Character.owner_id == owner_id).where(Character.name == character_name).where(Character.id ==character_id)
        
        session.execute(querry)
        session.commit()         
        
        return {'sucesso': 'character deletado'}
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')