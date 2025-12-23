from fastapi import Depends, HTTPException, Header, Request
from sqlmodel import select, Session as SQLSession
from database import get_session
from models import Session, User
from datetime import datetime

async def get_current_user(
    request: Request,
    authorization: str = Header(None), 
    db: SQLSession = Depends(get_session)
):
    token = None
    
    # Try getting token from Authorization header
    if authorization:
        try:
            scheme, token_str = authorization.split()
            if scheme.lower() == 'bearer':
                token = token_str
        except ValueError:
            pass
            
    # If no token in header, try cookie
    if not token:
        token = request.cookies.get("better-auth.session_token")
        
    if not token:
        raise HTTPException(status_code=401, detail="Missing authentication token")

    # Query the session table
    statement = select(Session).where(Session.token == token)
    session_record = db.exec(statement).first()

    if not session_record:
        raise HTTPException(status_code=401, detail="Invalid session token")

    if session_record.expiresAt < datetime.now():
        raise HTTPException(status_code=401, detail="Session expired")

    # Get the user
    user = db.get(User, session_record.userId)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
