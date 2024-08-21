from typing import Dict
from sqlalchemy import select
from models import Battle, OngoingBattle
from database import SessionLocal

session = SessionLocal()
  
def check_if_ongoing(battle_info):
    
    querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_info.battle_id).where(OngoingBattle.owner_id == battle_info.owner_id)
    result = session.execute(querry)
    if len(result.all()) == 0:
        querry = select(Battle).where(Battle.id == battle_info.battle_id).where(Battle.owner_id == battle_info.owner_id)
        result = session.execute(querry)
        returned_dict = result.scalars().first().__dict__
        returned_dict['info'] = 'batalha vai para initiative'
        returned_dict['status'] = 'not_started'
             
        return returned_dict
    
    else:
        querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_info.battle_id).where(OngoingBattle.owner_id == battle_info.owner_id)
        result = session.execute(querry)
        returned_dict = result.scalars().first().__dict__
        print(returned_dict)

        return returned_dict
    
    
    # try:
    #     new_started_battle = OngoingBattle(participant_characters=correspondent_battle_row.participant_characters,
    #                             participant_monsters=correspondent_battle_row.participant_monsters,
    #                             status=correspondent_battle_row.status,
    #     )
        
    #     session.add(new_started_battle)
    #     session.commit()
    #     return {'mensagem': 'battle iniciada'}
    
    # except Exception as e:
    #     print(f'Erro ao criar {str(e)}')