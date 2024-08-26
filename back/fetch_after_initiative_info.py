from sqlalchemy import select
from database import SessionLocal
from models import OngoingBattle
import json

session = SessionLocal()

def fetch_after_initiative_info(battle_info):
    try:
        querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_info.battle_id).where(OngoingBattle.owner_id == battle_info.owner_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'ongoing_battle não encontrado'}    
            
        result = session.execute(querry)
        
        battle_row = result.scalars().first()

        fetched_battle_info = {'participant_characters': battle_row.participant_characters,
                    'participant_monsters': battle_row.participant_monsters,
                    'participants_initiative_order': battle_row.participants_initiative_order,
                    'battle_id':battle_row.battle_id,
                    'dead_participants': battle_row.dead_participants
                                        }

        return fetched_battle_info
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')