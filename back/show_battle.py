from typing import Dict
from sqlalchemy import select
from database import SessionLocal
from models import Battle

session = SessionLocal()

def show_battle(show_battle_info: Dict[str, str]):
    try:
        owner_id = show_battle_info.owner_id
        querry = select(Battle).where(Battle.owner_id == owner_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'usuario não tem batalhas'}
        
        user_battle_list = []
        
        result = session.execute(querry)  
        
        for row in result.all():           
            user_battle_list.append({'id': row[0].id, 'name': row[0].name,
                                     'created_on': row[0].created_on,
                                     'participant_list': row[0].participant_list,
                                     })

   
        return {'user_battles': user_battle_list}
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')