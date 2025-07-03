from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import PlainTextResponse
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
import os
from dotenv import load_dotenv
import logging
from typing import Dict, Any
import json
from datetime import datetime
from bot_logic import GrooveHireBot
from database import Database

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GrooveHire WhatsApp Bot", version="1.0.0")

# Initialize Twilio client
twilio_client = Client(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)

# Initialize database
db = Database()

# Initialize bot
bot = GrooveHireBot(db)

@app.get("/")
async def root():
    return {"message": "GrooveHire WhatsApp Bot is running!"}

@app.post("/webhook/whatsapp")
async def whatsapp_webhook(
    request: Request,
    From: str = Form(...),
    Body: str = Form(...),
    ProfileName: str = Form(None),
    MessageSid: str = Form(None)
):
    """Handle incoming WhatsApp messages"""
    try:
        logger.info(f"Received message from {From}: {Body}")
        
        # Extract phone number (remove whatsapp: prefix)
        phone_number = From.replace("whatsapp:", "")
        
        # Process message with bot
        response_text = await bot.process_message(
            phone_number=phone_number,
            message=Body,
            profile_name=ProfileName
        )
        
        # Create Twilio response
        resp = MessagingResponse()
        resp.message(response_text)
        
        logger.info(f"Sending response to {From}: {response_text}")
        
        return PlainTextResponse(str(resp), media_type="application/xml")
        
    except Exception as e:
        logger.error(f"Error processing WhatsApp message: {str(e)}")
        
        # Send error response
        resp = MessagingResponse()
        resp.message("Sorry, I'm having trouble right now. Please try again later.")
        return PlainTextResponse(str(resp), media_type="application/xml")

@app.post("/webhook/mpesa")
async def mpesa_callback(request: Request):
    """Handle M-Pesa payment callbacks"""
    try:
        data = await request.json()
        logger.info(f"M-Pesa callback received: {data}")
        
        # Process payment callback
        await bot.handle_payment_callback(data)
        
        return {"ResultCode": 0, "ResultDesc": "Success"}
        
    except Exception as e:
        logger.error(f"Error processing M-Pesa callback: {str(e)}")
        return {"ResultCode": 1, "ResultDesc": "Error"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "GrooveHire WhatsApp Bot"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)