from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime
from database import Base



class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), index=True)     # ✅ Add length
    sender = Column(String(50))                    # ✅ Add length
    message = Column(String(1000))                 # ✅ Add length
    timestamp = Column(DateTime, default=datetime.utcnow)