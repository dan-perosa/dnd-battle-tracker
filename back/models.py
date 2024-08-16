from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from sqlalchemy import select

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    password = Column(String)
    characters = relationship("Character", back_populates="owner")
    battles = relationship("Battle", back_populates="owner")
    ongoing_battles = relationship("OngoingBattle", back_populates="owner")
    
class Character(Base):
    __tablename__ = 'characters'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    class_name = Column(String, nullable=False)
    race = Column(String, nullable=False)
    level = Column(Integer, nullable=False)
    hp_max = Column(Integer, nullable=False)
    hp_current = Column(Integer, nullable=False)
    ac = Column(Integer, nullable=False)
    initiative = Column(Integer, nullable=False)
    strength = Column(Integer, nullable=False)
    dexterity = Column(Integer, nullable=False)
    constitution = Column(Integer, nullable=False)
    intelligence = Column(Integer, nullable=False)
    wisdom = Column(Integer, nullable=False)
    charisma = Column(Integer, nullable=False)
    status = Column(String, nullable=True, default='')
    owner_id = Column(ForeignKey('users.id'))
    owner = relationship("User", back_populates="characters", lazy='joined')

class Monster(Base):
    __tablename__ = 'monsters'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

class Battle(Base):
    __tablename__ = 'battles'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    participant_list = Column(String, nullable=True)
    participant_monsters = Column(String, nullable=True)
    participant_characters = Column(String, nullable=True)
    owner_id = Column(ForeignKey('users.id'))
    owner = relationship("User", back_populates="battles", lazy='joined')

class OngoingBattle(Base):
    __tablename__ = 'ongoing_battles'
    
    id = Column(Integer, primary_key=True, index=True)
    participant_characters = Column(String, nullable=True)
    participant_monsters = Column(String, nullable=True)
    owner_id = Column(ForeignKey('users.id'))
    battle_id = Column(ForeignKey('battles.id'))
    status = Column(String, nullable=False)
    owner = relationship("User", back_populates="ongoing_battles", lazy='joined')
    participants_initiative_order = Column(String, nullable=True)
