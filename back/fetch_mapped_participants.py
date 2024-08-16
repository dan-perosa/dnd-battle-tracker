from typing import Dict
from sqlalchemy import select
from database import SessionLocal
from models import Character

session = SessionLocal()

def map_monsters(monster_names):
    participant_monsters_list = monster_names.split(', ')
    mapped_monsters = []

    for index, monster in enumerate(participant_monsters_list):
        mapped_monsters.append({
            'monster_id': (index + 1),
            'monster_name': monster
        })

    return mapped_monsters

def fetch_mapped_participants(participant_info):
    character_mapped = []
    participant_characters_list = participant_info.participant_characters.split(', ')

    try:
        for index, character in enumerate(participant_characters_list):

            querry = select(Character).where(Character.owner_id == participant_info.owner_id).where(Character.name == character)
            result = session.execute(querry)
            if len(result.all()) == 0:
                return {'erro': 'personagem não encontrado'}    
                
            result = session.execute(querry)
            
            character_row = result.scalars().first()
            

            character_mapped.append({'participant_character_id': (index + 1),
                                    'character_id': character_row.id,
                                    'character_name': character_row.name,
                                            })

        
        mapped_participants = {
            'mapped_characters': character_mapped,
            'mapped_monsters': map_monsters(participant_info.participant_monsters)
        }
            
        return mapped_participants
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')