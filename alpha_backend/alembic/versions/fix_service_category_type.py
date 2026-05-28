"""Fix service category type from enum to string

Revision ID: fix_service_category
Revises: 2a1f8ba00d5b
Create Date: 2026-05-28 02:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fix_service_category'
down_revision = '2a1f8ba00d5b'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    # Update any null values to 'additional' before changing the type
    op.execute("UPDATE services SET category = 'additional' WHERE category IS NULL")
    # Drop the enum constraint and recreate as varchar
    op.alter_column('services', 'category', 
                    existing_type=sa.Enum('outdoor', 'design', 'creative', 'marketing', 'events', 'additional', name='servicecategory'),
                    type_=sa.String(length=50),
                    existing_nullable=True,
                    nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Revert back to enum
    op.alter_column('services', 'category',
                    existing_type=sa.String(length=50),
                    type_=sa.Enum('outdoor', 'design', 'creative', 'marketing', 'events', 'additional', name='servicecategory'),
                    existing_nullable=False,
                    nullable=False)

