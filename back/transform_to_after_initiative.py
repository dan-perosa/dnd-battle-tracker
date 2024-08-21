from typing import Dict
from sqlalchemy import select, update
from models import OngoingBattle, Character
from database import SessionLocal
import requests
import json

session = SessionLocal()

def get_max_hp(type: str, owner_id: int, participant_name: str):
    if type == 'character':
        querry = select(Character).where(Character.name == participant_name).where(OngoingBattle.owner_id == owner_id)
        result = session.execute(querry)
        max_hp = result.scalars().first().hp_max
        return max_hp
    else:
        url = 'https://www.dnd5eapi.co/api/monsters/'
        formated_monster_name = participant_name.replace(' ', '-').lower()
        monster_url = url + formated_monster_name
        res = requests.get(monster_url)
        loaded_json = json.loads(res.text)
        max_hp = loaded_json['hit_points']
        return max_hp
    
def get_current_hp(type: str, owner_id: int, participant_name: str):
    if type == 'character':
        querry = select(Character).where(Character.name == participant_name).where(OngoingBattle.owner_id == owner_id)
        result = session.execute(querry)
        current_hp = result.scalars().first().hp_current
        return current_hp
    else:
        url = 'https://www.dnd5eapi.co/api/monsters/'
        formated_monster_name = participant_name.replace(' ', '-').lower()
        monster_url = url + formated_monster_name
        res = requests.get(monster_url)
        loaded_json = json.loads(res.text)
        current_hp = loaded_json['hit_points']
        return current_hp
    
def get_ac(type: str, owner_id: int, participant_name: str):
    if type == 'character':
        querry = select(Character).where(Character.name == participant_name).where(OngoingBattle.owner_id == owner_id)
        result = session.execute(querry)
        ac = result.scalars().first().ac
        return ac
    else:
        url = 'https://www.dnd5eapi.co/api/monsters/'
        formated_monster_name = participant_name.replace(' ', '-').lower()
        monster_url = url + formated_monster_name
        res = requests.get(monster_url)
        loaded_json = json.loads(res.text)
        armor_class = loaded_json['armor_class'][0]['value']
        return armor_class
  
def transform_to_after_initiative(battle_info):
    battle_id = battle_info.battle_id
    owner_id = battle_info.owner_id
    initiative_info_list = battle_info.initiative_info
    
    querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_id).where(OngoingBattle.owner_id == owner_id).where(OngoingBattle.status == 'initiative_roll')
    result = session.execute(querry)
    if (len(result.all()) == 0):
        return {'erro': 'batalha nao encontrada ou já passou da iniciativa'}
    
    initiative_info_list_to_post = []
    hp_and_ac_list_to_post = []
    
    for info in initiative_info_list:
        initiative_info_list_to_post.append({
            'participant_name': info['participant_name'],
            'participant_character_id': info['participant_character_id'],
            'participant_monster_id': info['participant_monster_id'],
            'type': info['type'],
            'total_init': info['total_init'],
            'battle_position': info['battle_position'],
        })
        
    for info in initiative_info_list:
        hp_and_ac_list_to_post.append({
            'participant_name': info['participant_name'],
            'participant_character_id': info['participant_character_id'],
            'participant_monster_id': info['participant_monster_id'],
            'type': info['type'],
            'battle_position': info['battle_position'],
            'max_hp': get_max_hp(type=info['type'], owner_id=owner_id, participant_name=info['participant_name']),
            'current_hp': get_current_hp(type=info['type'], owner_id=owner_id, participant_name=info['participant_name']),
            'ac': get_ac(type=info['type'], owner_id=owner_id, participant_name=info['participant_name'])
        })
    
    try:
        querry = update(OngoingBattle).where(OngoingBattle.battle_id == battle_id) \
        .where(OngoingBattle.owner_id == owner_id).where(OngoingBattle.status == 'initiative_roll') \
        .values(status='after_initiative', participants_initiative_order=str(initiative_info_list_to_post), \
            current_hps=str(hp_and_ac_list_to_post))
        
        session.execute(querry)
        session.commit()
        return {'mensagem': 'battle_alterada para after_initiative'}
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')