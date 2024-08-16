from typing import Dict
from models import Character
from database import SessionLocal
from sqlalchemy import select

session = SessionLocal()

def create_character(character_info: Dict[str, (str | int)]):     
    
    try:
        new_character = Character(name=character_info.name,
                                class_name=character_info.class_name,
                                race=character_info.race,
                                level=character_info.level,
                                hp_max=character_info.hp_max,
                                hp_current=character_info.hp_max,
                                ac=character_info.ac,
                                initiative=character_info.initiative,
                                strength=character_info.strength,
                                dexterity=character_info.dexterity,
                                constitution=character_info.constitution,
                                intelligence=character_info.intelligence,
                                wisdom=character_info.wisdom,
                                charisma=character_info.charisma,
                                owner_id=character_info.owner_id,
        )
        
        session.add(new_character)
        session.commit()
        return {'mensagem': 'character criado'}
        
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')