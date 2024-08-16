from typing import Dict
from sqlalchemy import select
from database import SessionLocal
from models import Character

session = SessionLocal()

def show_specific_character(show_specific_character_info: Dict[str, str]):
    try:
        owner_id = show_specific_character_info.owner_id
        character_id = show_specific_character_info.character_id
        querry = select(Character).where(Character.owner_id == owner_id).where(Character.id == character_id)
        result = session.execute(querry)
        if len(result.all()) == 0:
            return {'erro': 'personagem não encontrado'}    
            
        result = session.execute(querry)
        
        find_character = result.scalars().first()
               
        character_info = {'id': find_character.id, 'name': find_character.name,
                                        'class_name': find_character.class_name,
                                        'race': find_character.race,
                                        'level': find_character.level,
                                        'hp_max': find_character.hp_max,
                                        'hp_current': find_character.hp_current,
                                        'ac': find_character.ac,
                                        'initiative': find_character.initiative,
                                        'strength': find_character.strength,
                                        'dexterity': find_character.dexterity,
                                        'constitution': find_character.constitution,
                                        'intelligence': find_character.intelligence,
                                        'wisdom': find_character.wisdom,
                                        'charisma': find_character.charisma,
                                        'status': find_character.status,
                                        'owner_id': find_character.owner_id,
                                        }

        return character_info
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')