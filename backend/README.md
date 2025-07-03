# GrooveHire WhatsApp Bot Backend

This is the backend service for the GrooveHire WhatsApp bot that handles service provider booking via WhatsApp.

## Features

- 🤖 Intelligent WhatsApp chatbot
- 🔍 Service provider matching
- 📍 Location-based provider search
- 💳 M-Pesa STK Push integration
- 📊 Booking management
- 🔄 Real-time message processing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# M-Pesa Configuration (Sandbox)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_mpesa_passkey

# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=groovehire
```

### 3. Twilio WhatsApp Setup

1. Create a [Twilio account](https://www.twilio.com/try-twilio)
2. Set up WhatsApp Sandbox:
   - Go to Console → Messaging → Try it out → Send a WhatsApp message
   - Follow the instructions to join the sandbox
3. Configure webhook URL: `https://your-domain.com/webhook/whatsapp`

### 4. M-Pesa Setup 

1. Register for [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create a new app and get credentials
3. Use sandbox environment for testing

### 5. Run the Server

```bash
python run.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- `POST /webhook/whatsapp` - WhatsApp message webhook
- `POST /webhook/mpesa` - M-Pesa payment callback
- `GET /health` - Health check endpoint

## Bot Flow

1. **Welcome** - Greet user and show service options
2. **Service Selection** - User chooses service type
3. **Location Request** - Bot asks for user location
4. **Provider Matching** - Show top 3 providers
5. **Provider Selection** - User chooses provider
6. **Booking Details** - Collect service details
7. **Payment** - M-Pesa STK Push for booking fee
8. **Confirmation** - Send booking confirmation

## Testing

Send a WhatsApp message to your Twilio sandbox number to test the bot.

Example conversation:
```
User: Hi
Bot: 👋 Hi there! Welcome to GrooveHire! What service do you need today?
User: Plumbing
Bot: Great choice! 🔧 You've selected Plumbing. Please share your location...
```

## Deployment

### Using Railway/Heroku

1. Create a new app
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Using Docker

```bash
docker build -t groovehire-bot .
docker run -p 8000:8000 groovehire-bot
```

## Production Considerations

1. **Database**: Replace in-memory storage with MongoDB
2. **Security**: Add request validation and rate limiting
3. **Monitoring**: Add logging and error tracking
4. **Scaling**: Use Redis for session management
5. **SSL**: Ensure HTTPS for webhooks

## Support

For issues or questions, contact the development team.