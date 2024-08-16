from typing import Dict
from sqlalchemy import select, update
from models import OngoingBattle
from database import SessionLocal

session = SessionLocal()
  
def transform_to_after_initiative(battle_info):
    battle_id = battle_info.battle_id
    owner_id = battle_info.owner_id
    initiative_info_list = battle_info.initiative_info
    
    querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_id).where(OngoingBattle.owner_id == owner_id).where(OngoingBattle.status == 'initiative_roll')
    result = session.execute(querry)
    if (len(result.all()) == 0):
        return {'erro': 'batalha nao encontrada'}
    
    initiative_info_list_to_post = []
    
    for info in initiative_info_list:
        initiative_info_list_to_post.append({
            'participant_name': info['participant_name'],
            'participant_character_id': info['participant_character_id'],
            'participant_monster_id': info['participant_monster_id'],
            'type': info['type'],
            'total_init': info['total_init'],
            'battle_position': info['battle_position'],
        })
    
    print(initiative_info_list)

    try:
        querry = update(OngoingBattle).where(OngoingBattle.battle_id == battle_id) \
        .where(OngoingBattle.owner_id == owner_id).where(OngoingBattle.status == 'initiative_roll') \
        .values(status='after_initiative', participants_initiative_order=str(initiative_info_list_to_post))
        
        session.execute(querry)
        session.commit()
        return {'mensagem': 'battle_alterada para after_initiative'}
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')