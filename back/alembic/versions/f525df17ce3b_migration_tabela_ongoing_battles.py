"""Migration tabela ongoing_battles

Revision ID: f525df17ce3b
Revises: 
Create Date: 2024-08-02 15:06:51.702438

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f525df17ce3b'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ongoing_battles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('participant_list', sa.String(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('battle_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['battle_id'], ['battles.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ongoing_battles_id'), 'ongoing_battles', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_ongoing_battles_id'), table_name='ongoing_battles')
    op.drop_table('ongoing_battles')
    # ### end Alembic commands ###
