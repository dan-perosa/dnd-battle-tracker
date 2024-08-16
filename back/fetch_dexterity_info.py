from sqlalchemy import select
from database import SessionLocal
from models import Character, Monster
import requests
import json
import pprint

dex_bonus_list = [
    {"dex": [1], "bonus": -5},
    {"dex": [2, 3], "bonus": -4},
    {"dex": [4, 5], "bonus": -3},
    {"dex": [6, 7], "bonus": -2},
    {"dex": [8, 9], "bonus": -1},
    {"dex": [10, 11], "bonus": 0},
    {"dex": [12, 13], "bonus": 1},
    {"dex": [14, 15], "bonus": 2},
    {"dex": [16, 17], "bonus": 3},
    {"dex": [18, 19], "bonus": 4},
    {"dex": [20, 21], "bonus": 5},
    {"dex": [22, 23], "bonus": 6},
    {"dex": [24, 25], "bonus": 7},
    {"dex": [26, 27], "bonus": 8},
    {"dex": [28, 29], "bonus": 9},
    {"dex": [30], "bonus": 10}
]

session = SessionLocal()

def reformat_monster_names(monster):
    reformated = monster.replace('-', ' ').title()
    return reformated

def find_characters_initiative(owner_id, names_list):
    participant_characters_list = names_list.split(', ')
    character_dex_list = []
    for index, name in enumerate(participant_characters_list):
        querry = select(Character.initiative).where(Character.owner_id == owner_id).where(Character.name == name)
        result = session.execute(querry)
        character_dex = result.scalars().first()
        character_dex_list.append({'participant_character_id': (index + 1),name: character_dex})
        
    return character_dex_list

def find_monsters_initiative(monster_names):
    url = 'https://www.dnd5eapi.co/api/monsters/'
    participant_monsters_list = monster_names.split(', ')
    parsed_list = []
    monster_dex_list = []
    
    for monster in participant_monsters_list:
        parsed_list.append(monster.replace(' ', '-').lower())
        
    for index, monster in enumerate(parsed_list):
        response = requests.get(url + monster)
        loaded_json = json.loads(response.text)
        monster_dexterity = loaded_json['dexterity']
        
        for bonus in dex_bonus_list:
            if monster_dexterity in bonus['dex']:
                monster_dex_bonus = bonus['bonus']
                break
            
        monster_dex_list.append({'participant_monster_id': (index +1 ), reformat_monster_names(monster): monster_dex_bonus})
    
    return monster_dex_list

def fetch_dexterity_info(participants_info):
    
    character_list = participants_info.participant_characters
    monsters_list = participants_info.participant_monsters
    owner_id = participants_info.owner_id
    characters_initiative = find_characters_initiative(owner_id=owner_id, names_list=character_list)
    monsters_initiative = find_monsters_initiative(monsters_list)
    
    try:
        return {'characters_initiative': characters_initiative,
                'monsters_initiative': monsters_initiative}

    except Exception as e:
        print(f'Erro ao criar {str(e)}')