#!/usr/bin/env python3
"""
GrooveHire WhatsApp Bot Runner
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    print("🚀 Starting GrooveHire WhatsApp Bot...")
    print(f"📱 Server will run on port {port}")
    print("🔗 Webhook URL: http://localhost:{port}/webhook/whatsapp")
    print("💳 M-Pesa Callback URL: http://localhost:{port}/webhook/mpesa")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )