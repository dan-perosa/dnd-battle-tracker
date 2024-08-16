from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from models import Base, User, Character, Monster
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import Session

host_pg = "localhost"
db_pg = "postgres"
user_pg = "postgres"
pw_pg = "postgres"
port_pg = "5432"
schema = "public"

SQLALCHEMY_DATABASE_URL = f"postgresql://{user_pg}:{pw_pg}@{host_pg}/{db_pg}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    if not database_exists(engine.url):
        create_database(engine.url)
    Base.metadata.create_all(bind=engine, checkfirst=True)

def delete_table(table_name):
    # Conecte-se ao banco de dados e carregue os metadados
    metadata = MetaData(bind=engine, schema='public')
    metadata.reflect()

    # Verifique se a tabela 'battle' existe
    if table_name in metadata.tables:
        # Carregue a tabela table_name
        battle_table = metadata.tables[table_name]
        
        # Deletar a tabela table_name
        battle_table.drop(engine)
        print("Tabela deletada com sucesso.")
    else:
        print("Tabela não encontrada.")