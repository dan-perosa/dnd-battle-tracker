from typing import Dict
from sqlalchemy import update, select
from database import SessionLocal, Character

session = SessionLocal()

def find_character(owner_id, character_id):
    querry = select(Character).where(Character.owner_id == owner_id).where(Character.id == character_id)
    result = session.execute(querry)
    if len(result.all()) == 0:
        return {'erro': 'personagem não encontrado'}
    result = session.execute(querry)
    return result.scalars().first()

def edit_character(character_info: Dict[str, str]):
    try:
        character_id = character_info.character_id
        owner_id = character_info.owner_id

        # Encontrando o personagem que precisa ser atualizado
        character = find_character(owner_id, character_id)
             
        # Preparando a atualização
        querry = (update(Character).where(Character.id == character_id).where(Character.owner_id == owner_id).values(
            name=character_info.name,
            class_name=character_info.class_name,
            race=character_info.race,
            level=character_info.level,
            hp_max=character_info.hp_max,
            hp_current=character_info.hp_current,
            ac=character_info.ac,
            initiative=character_info.initiative,
            strength=character_info.strength,
            dexterity=character_info.dexterity,
            constitution=character_info.constitution,
            intelligence=character_info.intelligence,
            wisdom=character_info.wisdom,
            charisma=character_info.charisma,
            status=character_info.status,
            )
        )
     
        # Executando a atualização
        session.execute(querry)
        session.commit()
        return {'message': 'Personagem atualizado com sucesso'}
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')