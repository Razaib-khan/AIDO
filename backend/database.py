import os
from dotenv import load_dotenv, find_dotenv
from sqlmodel import SQLModel, create_engine, Session

# Load environment variables from .env file
load_dotenv(find_dotenv(usecwd=True))

# Using the same DB as Better Auth
# In production, use os.getenv("DATABASE_URL")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:razaib@localhost:5432/fishera")

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
