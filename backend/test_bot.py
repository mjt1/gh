#!/usr/bin/env python3
"""
Test script for GrooveHire WhatsApp Bot
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from bot_logic import GrooveHireBot
from database import Database

async def test_bot():
    """Test bot conversation flow"""
    print("🤖 Testing GrooveHire Bot...")
    
    # Initialize bot
    db = Database()
    bot = GrooveHireBot(db)
    
    # Test phone number
    test_phone = "+254700000000"
    
    # Test conversation flow
    test_messages = [
        "Hi",
        "1",  # Plumbing
        "Westlands",  # Location
        "1",  # First provider
        "I need to fix a leaking tap in my kitchen. Available tomorrow morning.",  # Details
        "PAY"  # Payment
    ]
    
    print(f"\n📱 Starting conversation with {test_phone}")
    print("=" * 50)
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n👤 User: {message}")
        
        try:
            response = await bot.process_message(
                phone_number=test_phone,
                message=message,
                profile_name="Test User"
            )
            print(f"🤖 Bot: {response}")
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            break
        
        print("-" * 30)
    
    print("\n✅ Bot test completed!")

if __name__ == "__main__":
    asyncio.run(test_bot())