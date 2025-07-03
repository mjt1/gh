import re
import json
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
from database import Database
from services import ServiceMatcher, PaymentService

logger = logging.getLogger(__name__)

class GrooveHireBot:
    def __init__(self, database: Database):
        self.db = database
        self.service_matcher = ServiceMatcher(database)
        self.payment_service = PaymentService()
        
        # Bot states
        self.STATES = {
            "WELCOME": "welcome",
            "SERVICE_SELECTION": "service_selection",
            "LOCATION_REQUEST": "location_request",
            "PROVIDER_SELECTION": "provider_selection",
            "BOOKING_DETAILS": "booking_details",
            "PAYMENT": "payment",
            "COMPLETED": "completed"
        }
        
        # Service categories
        self.SERVICES = {
            "1": {"name": "Plumbing", "emoji": "🔧"},
            "2": {"name": "Electrical", "emoji": "⚡"},
            "3": {"name": "Cleaning", "emoji": "🧹"},
            "4": {"name": "Tutoring", "emoji": "📚"},
            "5": {"name": "Car Repair", "emoji": "🚗"},
            "6": {"name": "Painting", "emoji": "🎨"}
        }

    async def process_message(self, phone_number: str, message: str, profile_name: str = None) -> str:
        """Process incoming WhatsApp message and return response"""
        try:
            # Get or create user session
            user_session = await self.get_user_session(phone_number, profile_name)
            
            # Clean and normalize message
            message = message.strip().lower()
            
            # Handle different states
            current_state = user_session.get("state", self.STATES["WELCOME"])
            
            if current_state == self.STATES["WELCOME"]:
                return await self.handle_welcome(phone_number, message, user_session)
            elif current_state == self.STATES["SERVICE_SELECTION"]:
                return await self.handle_service_selection(phone_number, message, user_session)
            elif current_state == self.STATES["LOCATION_REQUEST"]:
                return await self.handle_location_request(phone_number, message, user_session)
            elif current_state == self.STATES["PROVIDER_SELECTION"]:
                return await self.handle_provider_selection(phone_number, message, user_session)
            elif current_state == self.STATES["BOOKING_DETAILS"]:
                return await self.handle_booking_details(phone_number, message, user_session)
            elif current_state == self.STATES["PAYMENT"]:
                return await self.handle_payment(phone_number, message, user_session)
            else:
                return await self.handle_welcome(phone_number, message, user_session)
                
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            return "Sorry, I encountered an error. Please try again or type 'start' to begin."

    async def handle_welcome(self, phone_number: str, message: str, user_session: Dict) -> str:
        """Handle welcome state"""
        name = user_session.get("profile_name", "there")
        
        # Update user session
        await self.update_user_session(phone_number, {
            "state": self.STATES["SERVICE_SELECTION"],
            "last_interaction": datetime.now().isoformat()
        })
        
        services_text = "\n".join([
            f"{key}. {service['emoji']} {service['name']}" 
            for key, service in self.SERVICES.items()
        ])
        
        return f"""👋 Hi {name}! Welcome to GrooveHire!

I'm here to help you find trusted local service providers. What service do you need today?

{services_text}

Just reply with the number (1-6) or tell me what you need help with."""

    async def handle_service_selection(self, phone_number: str, message: str, user_session: Dict) -> str:
        """Handle service selection"""
        selected_service = None
        
        # Check if user selected by number
        if message in self.SERVICES:
            selected_service = self.SERVICES[message]
        else:
            # Try to match service by keywords
            for service_data in self.SERVICES.values():
                if service_data["name"].lower() in message:
                    selected_service = service_data
                    break
        
        if not selected_service:
            # Try to understand what they need
            if any(word in message for word in ["plumb", "pipe", "tap", "water"]):
                selected_service = self.SERVICES["1"]
            elif any(word in message for word in ["electric", "wire", "power", "light"]):
                selected_service = self.SERVICES["2"]
            elif any(word in message for word in ["clean", "house", "tidy"]):
                selected_service = self.SERVICES["3"]
            elif any(word in message for word in ["tutor", "teach", "lesson", "study"]):
                selected_service = self.SERVICES["4"]
            elif any(word in message for word in ["car", "vehicle", "mechanic"]):
                selected_service = self.SERVICES["5"]
            elif any(word in message for word in ["paint", "color", "wall"]):
                selected_service = self.SERVICES["6"]
        
        if selected_service:
            # Update session with selected service
            await self.update_user_session(phone_number, {
                "selected_service": selected_service["name"],
                "state": self.STATES["LOCATION_REQUEST"]
            })
            
            return f"""Great choice! {selected_service['emoji']} You've selected *{selected_service['name']}*.

To find the best providers near you, please share your location or tell me your area (e.g., Westlands, Karen, Kilimani, etc.)

You can also share your live location using WhatsApp's location feature! 📍"""
        else:
            services_text = "\n".join([
                f"{key}. {service['emoji']} {service['name']}" 
                for key, service in self.SERVICES.items()
            ])
            
            return f"""I didn't quite understand that. Please choose a service:

{services_text}

Reply with the number (1-6) or describe what you need."""

    async def handle_location_request(self, phone_number: str, message: str, user_session: Dict) -> str:
        """Handle location request"""
        # Extract location from message
        location = self.extract_location(message)
        
        if location:
            # Update session with location
            await self.update_user_session(phone_number, {
                "location": location,
                "state": self.STATES["PROVIDER_SELECTION"]
            })
            
            # Get providers for the service and location
            service_name = user_session.get("selected_service")
            providers = await self.service_matcher.find_providers(service_name, location)
            
            if providers:
                providers_text = ""
                for i, provider in enumerate(providers[:3], 1):
                    providers_text += f"\n{i}. *{provider['name']}*\n"
                    providers_text += f"   ⭐ {provider['rating']}/5 ({provider['reviews']} reviews)\n"
                    providers_text += f"   📍 {provider['distance']} away\n"
                    providers_text += f"   💰 KES {provider['rate']}/hour\n"
                
                # Store providers in session
                await self.update_user_session(phone_number, {
                    "available_providers": providers[:3]
                })
                
                return f"""Perfect! I found these top-rated {service_name.lower()} providers near {location}:

{providers_text}

Which provider would you like to book? Reply with 1, 2, or 3."""
            else:
                return f"""Sorry, I couldn't find any {service_name.lower()} providers in {location} right now. 

Would you like to:
1. Try a different area
2. Get notified when providers become available
3. Browse other services

Reply with 1, 2, or 3."""
        else:
            return """I need your location to find providers near you. Please:

1. Share your live location using WhatsApp
2. Tell me your area (e.g., "Westlands", "Karen", "CBD")
3. Give me nearby landmarks

Where are you located? 📍"""

    async def handle_provider_selection(self, phone_number: str, message: str, user_session: Dict) -> str:
        """Handle provider selection"""
        try:
            selection = int(message)
            if 1 <= selection <= 3:
                providers = user_session.get("available_providers", [])
                if selection <= len(providers):
                    selected_provider = providers[selection - 1]
                    
                    # Update session
                    await self.update_user_session(phone_number, {
                        "selected_provider": selected_provider,
                        "state": self.STATES["BOOKING_DETAILS"]
                    })
                    
                    return f"""Excellent choice! You've selected:

👨‍🔧 *{selected_provider['name']}*
⭐ {selected_provider['rating']}/5 rating
📍 {selected_provider['distance']} away
💰 KES {selected_provider['rate']}/hour

Now I need a few details to complete your booking:

1. What's the specific issue or work needed?
2. When would you like the service? (today, tomorrow, specific date)
3. Preferred time? (morning, afternoon, evening)

Please describe your needs and preferred timing."""
        except ValueError:
            pass
        
        return """Please select a provider by replying with 1, 2, or 3.

If you'd like to see different providers, type 'back' to choose a different location."""

    async def handle_booking_details(self, phone_number: str, message: str, user_session: Dict) -> str:
        """Handle booking details collection"""
        # Store the details
        await self.update_user_session(phone_number, {
            "booking_details": message,
            "state": self.STATES["PAYMENT"]
        })
        
        provider = user_session.get("selected_provider")
        service = user_session.get("selected_service")
        
        # Calculate estimated cost (assuming 2 hours minimum)
        estimated_hours = 2
        estimated_cost = provider["rate"] * estimated_hours
        
        return f"""Perfect! Here's your booking summary:

🔧 *Service:* {service}
👨‍🔧 *Provider:* {provider['name']}
📝 *Details:* {message}
💰 *Estimated Cost:* KES {estimated_cost} (2 hours minimum)

To confirm your booking, please pay KES 500 as a booking fee. The remaining amount will be paid to the provider after service completion.

Reply 'PAY' to proceed with M-Pesa payment, or 'BACK' to modify details."""

    async def handle_payment(self, phone_number: str, message: str, user_session: Dict) -> str:
        """Handle payment initiation"""
        if message.lower() == 'pay':
            try:
                # Initiate M-Pesa STK Push
                booking_fee = 500
                result = await self.payment_service.initiate_stk_push(
                    phone_number=phone_number.replace("+", ""),
                    amount=booking_fee,
                    reference=f"BOOKING_{datetime.now().strftime('%Y%m%d%H%M%S')}"
                )
                
                if result.get("success"):
                    await self.update_user_session(phone_number, {
                        "payment_reference": result.get("checkout_request_id"),
                        "state": self.STATES["COMPLETED"]
                    })
                    
                    return f"""💳 M-Pesa payment request sent!

Please check your phone for the M-Pesa prompt and enter your PIN to pay KES 500.

Once payment is confirmed, I'll connect you with your provider and send you the booking confirmation.

⏰ The payment prompt expires in 2 minutes."""
                else:
                    return f"""Sorry, there was an issue initiating the payment. Please try again or contact support.

Error: {result.get('message', 'Unknown error')}"""
                    
            except Exception as e:
                logger.error(f"Payment initiation error: {str(e)}")
                return "Sorry, there was an issue with the payment system. Please try again later."
        
        elif message.lower() == 'back':
            await self.update_user_session(phone_number, {
                "state": self.STATES["BOOKING_DETAILS"]
            })
            return "Please provide your booking details again:"
        
        else:
            return "Please reply 'PAY' to proceed with payment or 'BACK' to modify your booking details."

    async def handle_payment_callback(self, callback_data: Dict) -> None:
        """Handle M-Pesa payment callback"""
        try:
            # Extract payment details from callback
            checkout_request_id = callback_data.get("CheckoutRequestID")
            result_code = callback_data.get("ResultCode")
            
            if result_code == 0:  # Success
                # Find user session by payment reference
                user_session = await self.db.find_user_by_payment_reference(checkout_request_id)
                
                if user_session:
                    phone_number = user_session["phone_number"]
                    provider = user_session.get("selected_provider")
                    service = user_session.get("selected_service")
                    
                    # Create booking record
                    booking_id = await self.create_booking(user_session)
                    
                    # Send confirmation to client
                    confirmation_message = f"""✅ *Payment Confirmed!*

Your booking has been confirmed:

🆔 Booking ID: {booking_id}
🔧 Service: {service}
👨‍🔧 Provider: {provider['name']}
📞 Provider Contact: {provider['phone']}

Your provider will contact you shortly to confirm the appointment time.

Thank you for using GrooveHire! 🎉"""
                    
                    # Send message to client
                    await self.send_whatsapp_message(phone_number, confirmation_message)
                    
                    # Notify provider
                    provider_message = f"""🔔 *New Booking Alert!*

You have a new booking request:

🆔 Booking ID: {booking_id}
🔧 Service: {service}
👤 Client: {user_session.get('profile_name', 'Client')}
📞 Client Contact: {phone_number}
📝 Details: {user_session.get('booking_details')}

Please contact the client to confirm the appointment time."""
                    
                    await self.send_whatsapp_message(provider['phone'], provider_message)
                    
        except Exception as e:
            logger.error(f"Error handling payment callback: {str(e)}")

    def extract_location(self, message: str) -> Optional[str]:
        """Extract location from message"""
        # Common Nairobi areas
        areas = [
            "westlands", "karen", "kilimani", "cbd", "upperhill", "lavington",
            "kileleshwa", "parklands", "eastleigh", "kasarani", "thika", "ngong",
            "runda", "muthaiga", "gigiri", "spring valley", "riverside"
        ]
        
        message_lower = message.lower()
        for area in areas:
            if area in message_lower:
                return area.title()
        
        # If no specific area found, return the message as location
        if len(message.split()) <= 3:  # Likely a location
            return message.title()
        
        return None

    async def get_user_session(self, phone_number: str, profile_name: str = None) -> Dict:
        """Get or create user session"""
        session = await self.db.get_user_session(phone_number)
        
        if not session:
            session = {
                "phone_number": phone_number,
                "profile_name": profile_name,
                "state": self.STATES["WELCOME"],
                "created_at": datetime.now().isoformat(),
                "last_interaction": datetime.now().isoformat()
            }
            await self.db.create_user_session(session)
        
        return session

    async def update_user_session(self, phone_number: str, updates: Dict) -> None:
        """Update user session"""
        updates["last_interaction"] = datetime.now().isoformat()
        await self.db.update_user_session(phone_number, updates)

    async def create_booking(self, user_session: Dict) -> str:
        """Create booking record"""
        booking_id = f"GH{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        booking = {
            "booking_id": booking_id,
            "client_phone": user_session["phone_number"],
            "client_name": user_session.get("profile_name"),
            "service": user_session.get("selected_service"),
            "provider": user_session.get("selected_provider"),
            "location": user_session.get("location"),
            "details": user_session.get("booking_details"),
            "status": "confirmed",
            "created_at": datetime.now().isoformat(),
            "payment_status": "paid"
        }
        
        await self.db.create_booking(booking)
        return booking_id

    async def send_whatsapp_message(self, phone_number: str, message: str) -> None:
        """Send WhatsApp message"""
        try:
            from twilio.rest import Client
            import os
            
            client = Client(
                os.getenv("TWILIO_ACCOUNT_SID"),
                os.getenv("TWILIO_AUTH_TOKEN")
            )
            
            client.messages.create(
                body=message,
                from_=os.getenv("TWILIO_WHATSAPP_NUMBER"),
                to=f"whatsapp:{phone_number}"
            )
            
        except Exception as e:
            logger.error(f"Error sending WhatsApp message: {str(e)}")