from typing import Dict
from sqlalchemy import select
from models import OngoingBattle
from database import SessionLocal

session = SessionLocal()
 
def transform_to_ongoing_battle(battle_info: Dict[str, (str | int)]):
    
    querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_info.battle_id)
    result = session.execute(querry)
    if (len(result.all()) != 0):
        return {'erro': 'já iniciado'}

    try:
        new_ongoing_battle = OngoingBattle(owner_id=battle_info.owner_id,
                                           battle_id=battle_info.battle_id,
                                            participant_characters=battle_info.participant_characters,
                                            participant_monsters=battle_info.participant_monsters,
                                            status=battle_info.status,
        )
        
        session.add(new_ongoing_battle)
        session.commit()
        return {'mensagem': 'ongoing battle criada'}
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')