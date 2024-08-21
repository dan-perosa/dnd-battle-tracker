from sqlalchemy import select
from database import SessionLocal
from models import OngoingBattle

session = SessionLocal()

def fetch_after_initiative_hps(battle_info):
    try:
        querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_info.battle_id).where(OngoingBattle.owner_id == battle_info.owner_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'ongoing_battle não encontrado'}    
            
        result = session.execute(querry)
        
        battle_row = result.scalars().first()

        fetched_hps = {'participant_hps_and_ac': battle_row.current_hps,
                                        }
        return fetched_hps
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')