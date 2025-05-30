from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os
from modelsDBchatbot import ChatMessage

from fastapi.middleware.cors import CORSMiddleware
import json
from database import SessionLocal


app = FastAPI()

# CORS setup so frontend can access it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("models/gemini-1.5-flash")

# Emotional keyword mapping and system instructions
emotional_keywords = {
    "happy": "The user feels happy. Celebrate their positive mood, reflect their joy, and encourage them to savor and express gratitude for this moment.",
    "sad": "The user is feeling sad. Respond gently and supportively. Ask open-ended questions to help them express what’s making them feel this way. If sadness persists, remind them it's okay to seek help.",
    "angry": "The user feels angry. Acknowledge their frustration without judgment. Encourage them to talk about what's upsetting them and guide them toward calming techniques.",
    "fear": "The user feels afraid. Offer reassurance and safety. Ask what’s causing the fear and gently help them feel heard. Suggest grounding techniques.",
    "disgust": "The user is feeling disgusted or repulsed. Acknowledge the emotion respectfully and ask what triggered it. Guide them toward understanding and processing the experience.",
    "surprise": "The user is surprised. Ask if it's a pleasant or unpleasant surprise and respond accordingly with curiosity and empathy.",
    "neutral": "The user feels neutral or unsure. Gently ask how their day is going or if something is on their mind. Encourage them to open up without pressure.",
}

system_instruction = (
    "Buddy is a warm and therapeutic emotional companion who responds with empathy, kindness, and understanding. "
    "Buddy’s role is to provide emotional support like a gentle therapist: sometimes asking caring questions to help the user open up, "
    "especially when they seem unsure or reluctant. Buddy always validates feelings and encourages healthy expression. "
    "If the user still feels unwell after chatting, Buddy should gently suggest seeking support from a professional therapist and offer to help find resources. "
    "Avoid giving multiple options; instead, provide clear, compassionate, and supportive guidance tailored to the user's emotional state."
)

# Input model for request
class UserInput(BaseModel):
    user_id: str
    message: str


# Test route
@app.get("/")
def root():
    return {"message": "Chatbot is running"}


# Chatbot route
@app.post("/chatbot/")
async def chatbot(input: UserInput):
    db = SessionLocal()
    try:
        print("📨 Received message:", input.message)

        user_id = input.user_id
        user_messages = db.query(ChatMessage).filter(ChatMessage.user_id == user_id).order_by(ChatMessage.timestamp).all()
        history = [{"sender": m.sender, "message": m.message} for m in user_messages]

        prompt_history = "\n".join(f"{m['sender']}: {m['message']}" for m in history)
        full_prompt = f"{system_instruction}\n{prompt_history}\nuser: {input.message}\nbot:"
        print("🧠 Prompt sent to Gemini:\n", full_prompt)

        try:
            response = model.generate_content(full_prompt)
            reply = response.text.strip()
        except Exception as e:
            print("❌ Gemini API error:", e)
            reply = "I'm having trouble understanding you right now. Please try again later."

        db.add(ChatMessage(user_id=user_id, sender="user", message=input.message))
        db.add(ChatMessage(user_id=user_id, sender="bot", message=reply))
        db.commit()

        return {"reply": reply}
    except Exception as e:
        print("❌ Internal server error:", e)
        return {"error": str(e)}
    finally:
        db.close()


@app.get("/chatbot/resume")
def resume_session(user_id: str):
    db = SessionLocal()
    try:
        messages = db.query(ChatMessage).filter(ChatMessage.user_id == user_id).order_by(ChatMessage.timestamp).all()
        return {"session": [{"sender": m.sender, "message": m.message} for m in messages]}
    finally:
        db.close()


@app.post("/chatbot/new")
def new_session(user_id: str):
    db = SessionLocal()
    try:
        db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
        db.commit()
        return {"message": "New conversation started."}
    finally:
        db.close()

from modelsDBchatbot import ChatMessage
from database import Base, engine

Base.metadata.create_all(bind=engine)

