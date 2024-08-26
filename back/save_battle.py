from typing import Dict
from sqlalchemy import select, update
from models import OngoingBattle, Character
from database import SessionLocal
import requests
import json

session = SessionLocal()

def save_battle(battle_info):
    battle_id = battle_info.battle_id
    owner_id = battle_info.owner_id
    participants_initiative_order = battle_info.participants_initiative_order
    dead_participants = battle_info.dead_participants
    
    querry = select(OngoingBattle).where(OngoingBattle.battle_id == battle_id).where(OngoingBattle.owner_id == owner_id).where(OngoingBattle.status == 'after_initiative')
    result = session.execute(querry)
    if (len(result.all()) == 0):
        return {'erro': 'batalha nao encontrada'}
    
    dead_participants_list_to_post = []
    initiative_info_list_to_post = []
    
    for info in participants_initiative_order:
        initiative_info_list_to_post.append({
            'participant_name': info['participant_name'],
            'participant_character_id': info['participant_character_id'],
            'participant_monster_id': info['participant_monster_id'],
            'type': info['type'],
            'total_init': info['total_init'],
            'battle_position': info['battle_position'],
            'participant_generic_id': info['participant_generic_id'],
            'max_hp': info['max_hp'],
            'current_hp': info['current_hp'],
            'ac': info['ac'],
        })
        
    for info in dead_participants:
        dead_participants_list_to_post.append({
            'participant_name': info['participant_name'],
            'participant_character_id': info['participant_character_id'],
            'participant_monster_id': info['participant_monster_id'],
            'type': info['type'],
            'total_init': info['total_init'],
            'battle_position': info['battle_position'],
            'participant_generic_id': info['participant_generic_id'],
            'max_hp': info['max_hp'],
            'current_hp': info['current_hp'],
            'ac': info['ac'],
        })
        

    try:
        querry = update(OngoingBattle).where(OngoingBattle.battle_id == battle_id) \
        .where(OngoingBattle.owner_id == owner_id).where(OngoingBattle.status == 'after_initiative') \
        .values(status='saved_after_initiative', participants_initiative_order=str(initiative_info_list_to_post),
                dead_participants=str(dead_participants_list_to_post))
        
        session.execute(querry)
        session.commit()
        return {'mensagem': 'battle_alterada para saved_after_initiative'}
    
    except Exception as e:
        print(f'Erro ao criar {str(e)}')