from typing import Dict
from sqlalchemy import select
from models import Battle
from database import SessionLocal

session = SessionLocal()
  
def create_battle(battle_info: Dict[str, (str | int)]):
    

    try:
        new_battle = Battle(name=battle_info.name,
                                participant_list=battle_info.participant_list,
                                participant_characters=battle_info.participant_characters,
                                participant_monsters=battle_info.participant_monsters,
                                owner_id=battle_info.owner_id,
        )
        
        session.add(new_battle)
        session.commit()
        return {'mensagem': 'battle criada'}
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')