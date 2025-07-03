from typing import Dict, List, Optional, Any
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Database:
    """Database interface for GrooveHire bot"""
    
    def __init__(self):
        # In production, you would connect to MongoDB
        # For now, we'll use in-memory storage for demo
        self.user_sessions = {}
        self.bookings = {}
        self.providers = self._initialize_sample_providers()
    
    def _initialize_sample_providers(self) -> Dict:
        """Initialize sample providers for demo"""
        return {
            "plumbing": [
                {
                    "id": "p1",
                    "name": "Mike Johnson",
                    "phone": "+254700123456",
                    "rating": 4.9,
                    "reviews": 245,
                    "rate": 1200,
                    "distance": "2.1 km",
                    "areas": ["westlands", "kilimani", "parklands"]
                },
                {
                    "id": "p2", 
                    "name": "Grace Wanjiku",
                    "phone": "+254700123457",
                    "rating": 4.8,
                    "reviews": 189,
                    "rate": 1000,
                    "distance": "3.5 km",
                    "areas": ["westlands", "karen", "lavington"]
                },
                {
                    "id": "p3",
                    "name": "Peter Kamau", 
                    "phone": "+254700123458",
                    "rating": 4.7,
                    "reviews": 156,
                    "rate": 1500,
                    "distance": "4.2 km",
                    "areas": ["westlands", "upperhill", "cbd"]
                }
            ],
            "electrical": [
                {
                    "id": "e1",
                    "name": "John Mwangi",
                    "phone": "+254700123459",
                    "rating": 4.8,
                    "reviews": 198,
                    "rate": 1300,
                    "distance": "1.8 km",
                    "areas": ["westlands", "kilimani", "parklands"]
                },
                {
                    "id": "e2",
                    "name": "Sarah Njeri",
                    "phone": "+254700123460",
                    "rating": 4.9,
                    "reviews": 234,
                    "rate": 1400,
                    "distance": "2.9 km",
                    "areas": ["karen", "lavington", "runda"]
                }
            ],
            "cleaning": [
                {
                    "id": "c1",
                    "name": "Anne Muthoni",
                    "phone": "+254700123461",
                    "rating": 4.6,
                    "reviews": 167,
                    "rate": 800,
                    "distance": "1.5 km",
                    "areas": ["westlands", "kilimani", "parklands"]
                },
                {
                    "id": "c2",
                    "name": "Mary Wanjiru",
                    "phone": "+254700123462",
                    "rating": 4.7,
                    "reviews": 203,
                    "rate": 900,
                    "distance": "3.1 km",
                    "areas": ["karen", "lavington", "upperhill"]
                }
            ],
            "tutoring": [
                {
                    "id": "t1",
                    "name": "David Kiprotich",
                    "phone": "+254700123463",
                    "rating": 4.9,
                    "reviews": 312,
                    "rate": 600,
                    "distance": "2.3 km",
                    "areas": ["westlands", "kilimani", "lavington"]
                },
                {
                    "id": "t2",
                    "name": "Lucy Akinyi",
                    "phone": "+254700123464",
                    "rating": 4.8,
                    "reviews": 278,
                    "rate": 700,
                    "distance": "3.7 km",
                    "areas": ["karen", "runda", "muthaiga"]
                }
            ],
            "car repair": [
                {
                    "id": "cr1",
                    "name": "James Ochieng",
                    "phone": "+254700123465",
                    "rating": 4.7,
                    "reviews": 189,
                    "rate": 1500,
                    "distance": "4.1 km",
                    "areas": ["westlands", "parklands", "kasarani"]
                }
            ],
            "painting": [
                {
                    "id": "pt1",
                    "name": "Robert Mutua",
                    "phone": "+254700123466",
                    "rating": 4.5,
                    "reviews": 145,
                    "rate": 700,
                    "distance": "2.8 km",
                    "areas": ["westlands", "kilimani", "upperhill"]
                }
            ]
        }
    
    async def get_user_session(self, phone_number: str) -> Optional[Dict]:
        """Get user session by phone number"""
        return self.user_sessions.get(phone_number)
    
    async def create_user_session(self, session: Dict) -> None:
        """Create new user session"""
        phone_number = session["phone_number"]
        self.user_sessions[phone_number] = session
        logger.info(f"Created session for {phone_number}")
    
    async def update_user_session(self, phone_number: str, updates: Dict) -> None:
        """Update user session"""
        if phone_number in self.user_sessions:
            self.user_sessions[phone_number].update(updates)
            logger.info(f"Updated session for {phone_number}")
    
    async def find_user_by_payment_reference(self, payment_ref: str) -> Optional[Dict]:
        """Find user session by payment reference"""
        for session in self.user_sessions.values():
            if session.get("payment_reference") == payment_ref:
                return session
        return None
    
    async def create_booking(self, booking: Dict) -> None:
        """Create new booking"""
        booking_id = booking["booking_id"]
        self.bookings[booking_id] = booking
        logger.info(f"Created booking {booking_id}")
    
    async def get_providers_by_service(self, service: str) -> List[Dict]:
        """Get providers by service type"""
        service_key = service.lower()
        return self.providers.get(service_key, [])
    
    async def filter_providers_by_location(self, providers: List[Dict], location: str) -> List[Dict]:
        """Filter providers by location"""
        location_lower = location.lower()
        filtered = []
        
        for provider in providers:
            if any(area.lower() == location_lower for area in provider.get("areas", [])):
                filtered.append(provider)
        
        # If no exact match, return all providers (they can travel)
        return filtered if filtered else providers