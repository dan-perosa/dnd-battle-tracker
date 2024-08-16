from typing import Dict
from sqlalchemy import select
from database import SessionLocal
from models import OngoingBattle, Battle

session = SessionLocal()

def fetch_ongoing_battle(battle_id):
    try:
        querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'ongoing_battle não encontrado'}    
            
        result = session.execute(querry)
        
        battle_row = result.scalars().first()
        
        if battle_row.status == 'initiative_roll':
            battle_info = {'participant_characters': battle_row.participant_characters,
                        'participant_monsters': battle_row.participant_monsters,
                        'battle_id': battle_row.battle_id
                                            }
            
            querry_to_find_name = select(Battle.name).where(Battle.id == battle_info['battle_id'])
            result = session.execute(querry_to_find_name)
            battle_info['battle_name'] = result.first()[0]

            
        if battle_row.status == 'after_initiative':
            battle_info = {'participant_characters': battle_row.participant_characters,
                        'participant_monsters': battle_row.participant_monsters,
                        'characters_initiatives': battle_row.character_initiatives,
                        'monsters_initiatives': battle_row.character_initiatives,
                        'battle_id':battle_row.battle_id
                                            }
            
            querry_to_find_name = select(Battle.name).where(Battle.id == battle_info['battle_id'])
            result = session.execute(querry_to_find_name)
            battle_info['battle_name'] = result.first()[0]
        
        return battle_info
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')