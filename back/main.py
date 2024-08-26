from fastapi import FastAPI, HTTPException, Header, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from create_user import create_user
from create_character import create_character
from create_battle import create_battle
from login_user import login_user
from change_user_password import change_user_password
from show_battle import show_battle
from delete_battle import delete_battle
from delete_character import delete_character
from show_characters import show_characters
from validate_token import validate_token
from show_monsters import show_monsters
from show_specific_character import show_specific_character
from edit_character import edit_character
from check_if_ongoing import check_if_ongoing
from transform_to_ongoing_battle import transform_to_ongoing_battle
from fetch_ongoing_battle import fetch_ongoing_battle
from fetch_dexterity_info import fetch_dexterity_info
from fetch_mapped_participants import fetch_mapped_participants
from transform_to_after_initiative import transform_to_after_initiative
from fetch_after_initiative_info import fetch_after_initiative_info
from fetch_after_initiative_hps import fetch_after_initiative_hps
from save_battle import save_battle

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir requisições do frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos os métodos HTTP
    allow_headers=["*"],  # Permitir todos os cabeçalhos
)

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str

class UserUpdate(BaseModel):
    username: str
    password: str
    new_password: str

class CharacterCreate(BaseModel):
    name: str
    class_name: str
    race: str
    level: int
    hp_max: int
    ac: int
    initiative: int
    strength: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int
    owner_id: int
    
class BattleCreate(BaseModel):
    name: str
    participant_list: str
    participant_monsters: str
    participant_characters: str
    owner_id: int
    
class BattleShow(BaseModel):
    owner_id: int
    
class BattleDelete(BaseModel):
    owner_id: int
    battle_name: str
    battle_id: int
    
class CharacterDelete(BaseModel):
    owner_id: int
    character_name: str
    character_id: int
    
class CharacterShow(BaseModel):
    owner_id: str
    
class CharacterShowSpecific(BaseModel):
    owner_id: str
    character_id: str
    
class EditCharacter(BaseModel):
    name: str
    class_name: str
    race: str
    level: int
    hp_max: int
    hp_current: int
    ac: int
    initiative: int
    strength: int
    dexterity: int
    constitution: int
    intelligence: int
    wisdom: int
    charisma: int
    owner_id: str
    character_id: str
    status: str
    
class CheckIfOngoingBattle(BaseModel):
    owner_id: str
    battle_id: int
    
class TransformToOngoingBattle(BaseModel):
    owner_id: int
    battle_id: int
    participant_characters: str
    participant_monsters: str
    status: str
    
class FetchParticipantDex(BaseModel):
    owner_id: int
    participant_characters: str
    participant_monsters: str
    
class TransformToAfterInitiativeBattle(BaseModel):
    battle_id: int
    owner_id: int
    initiative_info: list
    
class FetchAfterInitiativeBattleInfo(BaseModel):
    battle_id: int
    owner_id: int
    
class FetchAfterInitiativeHps(BaseModel):
    battle_id: int
    owner_id: int
    
class SaveBattle(BaseModel):
    battle_id: int
    owner_id: int
    participants_initiative_order: list
    dead_participants: list
    
    
@app.post('/users/create_user')
def create_user_endpoint(user_info: UserCreate, response: Response):
    user_dict = user_info
    return create_user(user_dict, response=response)

    
@app.post('/character/create')
def create_character_endpoint(character_info: CharacterCreate):
    character_dict = character_info
    return create_character(character_dict)
        
@app.post('/battle/create')
def create_battle_endpoint(battle_info: BattleCreate):
    battle_dict = battle_info
    return create_battle(battle_dict)

@app.post('/users/login')
def login_user_endpoint(response: Response, username: str = Header(), password: str = Header()):
    user_username = username
    user_password = password
    return login_user(username=user_username, password=user_password, response=response)

@app.patch('/users/change_password')
def change_user_password_endpoint(change_user_password_info: UserUpdate):
    update_password_info = change_user_password_info
    
    return change_user_password(update_password_info)

@app.post('/battle/show')
def show_battle_endpoint(battle_info: BattleShow):
    battle_dict = battle_info
    return show_battle(battle_dict)

@app.delete('/battle/delete')
def delete_battle_endpoint(battle_info: BattleDelete):
    battle_dict = battle_info
    return delete_battle(battle_dict)

@app.delete('/character/delete')
def delete_character_endpoint(character_info: CharacterDelete):
    character_dict = character_info
    return delete_character(character_dict)

@app.post('/character/show')
def show_character_endpoint(character_info: CharacterShow):
    character_dict = character_info
    return show_characters(character_dict)

@app.get('/monster/show')
def show_monsters_endpoint():
    return show_monsters()

@app.get('/validate_token')
def validate_token(token: str = Header()):
    payload = validate_token(token)
    if payload:
        return {"valid": True}
    else:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

@app.post('/character/show_specific')
def show_specific_character_endpoint(character_info: CharacterShowSpecific):
    character_dict = character_info
    return show_specific_character(character_dict)

@app.put('/character/edit_character')
def edit_character_endpoint(character_info: EditCharacter):
    character_dict = character_info
    return edit_character(character_dict)

@app.post('/battle/check_if_ongoing')
def check_if_ongoing_battle_endpoint(battle_info: CheckIfOngoingBattle):
    battle_dict = battle_info
    return check_if_ongoing(battle_dict)

@app.post('/battle/transform_to_ongoing')
def transform_to_ongoing_battle_endpoint(battle_info: TransformToOngoingBattle):
    battle_dict = battle_info
    return transform_to_ongoing_battle(battle_dict)

@app.get('/battle/fetch_ongoing/{battle_id}')
def fetch_ongoing_battle_endpoint(battle_id):
    return fetch_ongoing_battle(battle_id)

@app.post('/fetch/participant_dexterities')
def fecth_dexterity_info_endpoint(participants_info: FetchParticipantDex):
    return fetch_dexterity_info(participants_info)

@app.post('/fetch/mapped_participants')
def fecth_mapped_participants_endpoint(participants_info: FetchParticipantDex):
    return fetch_mapped_participants(participants_info)

@app.post('/battle/transform_to_after_initiative')
def transform_to_after_initiative_endpoint(battle_info: TransformToAfterInitiativeBattle):
    return transform_to_after_initiative(battle_info)

@app.post('/battle/fetch_after_initiative_info')
def fetch_after_initiative_info_endpoint(battle_info: FetchAfterInitiativeBattleInfo):
    return fetch_after_initiative_info(battle_info)

@app.post('/battle/fetch_after_initiative_hps')
def fetch_after_initiative_hps_endpoint(battle_info: FetchAfterInitiativeHps):
    return fetch_after_initiative_hps(battle_info)

@app.post('/battle/save')
def save_battle_endpoint(battle_info: SaveBattle):
    return save_battle(battle_info)


 