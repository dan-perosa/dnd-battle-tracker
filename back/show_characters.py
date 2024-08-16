from typing import Dict
from sqlalchemy import select
from database import SessionLocal
from models import Character

session = SessionLocal()

def show_characters(show_characters_info: Dict[str, str]):
    try:
        owner_id = show_characters_info.owner_id
        querry = select(Character).where(Character.owner_id == owner_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'usuario não tem personagens'}
        
        user_character_list = []
        
        result = session.execute(querry)  
        
        for row in result.all():           
            user_character_list.append({'id': row[0].id, 'name': row[0].name,
                                        'class_name': row[0].class_name,
                                        'race': row[0].race,
                                        'level': row[0].level,
                                        'hp_max': row[0].hp_max,
                                        'hp_current': row[0].hp_current,
                                        'ac': row[0].ac,
                                        'initiative': row[0].initiative,
                                        'strength': row[0].strength,
                                        'dexterity': row[0].dexterity,
                                        'constitution': row[0].constitution,
                                        'intelligence': row[0].intelligence,
                                        'wisdom': row[0].wisdom,
                                        'charisma': row[0].charisma,
                                        'status': row[0].status,
                                        'owner_id': row[0].owner_id,
                                        })

   
        return {'user_characters': user_character_list}
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')