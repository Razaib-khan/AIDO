"""
Initialize database tables.
Run this once to create all tables: python init_db.py
"""

from sqlmodel import SQLModel, create_engine
from database import DATABASE_URL
from models import User, Session, Product, CartItem, Order, OrderItem, Address, WishlistItem

def init_db():
    """Create all database tables"""
    engine = create_engine(DATABASE_URL, echo=True)

    # Create all tables
    SQLModel.metadata.create_all(engine)

    print("[SUCCESS] Database tables created successfully!")
    print("\nTables created:")
    print("  - user")
    print("  - session")
    print("  - product")
    print("  - cart_item")
    print("  - order")
    print("  - order_item")
    print("  - address")
    print("  - wishlist_item")

if __name__ == "__main__":
    init_db()
