"""empty message

Revision ID: 4ea5a70a0f11
Revises: 7ba73ae112e3
Create Date: 2017-07-19 20:13:48.176393

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4ea5a70a0f11'
down_revision = '7ba73ae112e3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('course_major')
    op.drop_table('user_major')
    op.add_column('course', sa.Column('credits', sa.Integer(), nullable=True))
    op.add_column('course', sa.Column('semester', sa.Integer(), nullable=True))
    op.drop_column('course', 'credit')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('course', sa.Column('credit', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('course', 'semester')
    op.drop_column('course', 'credits')
    op.create_table('user_major',
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('major_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['major_id'], ['major.id'], name='user_major_major_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='user_major_user_id_fkey')
    )
    op.create_table('course_major',
    sa.Column('course_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('major_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['course_id'], ['course.id'], name='course_major_course_id_fkey'),
    sa.ForeignKeyConstraint(['major_id'], ['major.id'], name='course_major_major_id_fkey')
    )
    # ### end Alembic commands ###