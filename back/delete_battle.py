from typing import Dict
from sqlalchemy import select, delete
from database import SessionLocal
from models import Battle

session = SessionLocal()

def delete_battle(delete_battle_info: Dict[str, str]):
    try:
        owner_id = delete_battle_info.owner_id
        battle_name = delete_battle_info.battle_name
        battle_id = delete_battle_info.battle_id
        
        querry = select(Battle).where(Battle.owner_id == owner_id).where(Battle.name == battle_name).where(Battle.id == battle_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'batalha não encontrada'}
        
        querry = delete(Battle).where(Battle.owner_id == owner_id).where(Battle.name == battle_name).where(Battle.id == battle_id)
        
        session.execute(querry)
        session.commit()         
        
        return {'sucesso': 'batalha deletada'}
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')