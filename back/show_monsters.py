from typing import Dict
from sqlalchemy import select
from database import SessionLocal
from models import Monster

session = SessionLocal()

def show_monsters():
    try:
        querry = select(Monster)
        result = session.execute(querry) 
        
        monster_list = []
        
        for row in result.all():           
            monster_list.append({'id': row[0].id,
                                 'name': row[0].name,
                                    }
                                )

   
        return {'monster_list': monster_list}
        
    except Exception as e:
        print(f'Erro ao criar {str(e)}')