from typing import List, Dict, Optional
import logging
from database import Database
import os
import requests
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class ServiceMatcher:
    """Service for matching clients with providers"""
    
    def __init__(self, database: Database):
        self.db = database
    
    async def find_providers(self, service: str, location: str) -> List[Dict]:
        """Find providers for a service in a location"""
        try:
            # Get providers for the service
            providers = await self.db.get_providers_by_service(service)
            
            # Filter by location
            filtered_providers = await self.db.filter_providers_by_location(providers, location)
            
            # Sort by rating and distance
            sorted_providers = sorted(
                filtered_providers,
                key=lambda x: (-x["rating"], float(x["distance"].split()[0]))
            )
            
            return sorted_providers[:3]  # Return top 3
            
        except Exception as e:
            logger.error(f"Error finding providers: {str(e)}")
            return []

class PaymentService:
    """Service for handling M-Pesa payments"""
    
    def __init__(self):
        self.consumer_key = os.getenv("MPESA_CONSUMER_KEY")
        self.consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
        self.shortcode = os.getenv("MPESA_SHORTCODE")
        self.passkey = os.getenv("MPESA_PASSKEY")
        
        # M-Pesa URLs (Sandbox)
        self.auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        self.stk_push_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    
    async def get_access_token(self) -> Optional[str]:
        """Get M-Pesa access token"""
        try:
            import base64
            
            # Create credentials
            credentials = base64.b64encode(
                f"{self.consumer_key}:{self.consumer_secret}".encode()
            ).decode()
            
            headers = {
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(self.auth_url, headers=headers)
            
            if response.status_code == 200:
                return response.json().get("access_token")
            else:
                logger.error(f"Failed to get access token: {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting access token: {str(e)}")
            return None
    
    async def initiate_stk_push(self, phone_number: str, amount: int, reference: str) -> Dict:
        """Initiate M-Pesa STK Push"""
        try:
            # For demo purposes, simulate successful payment initiation
            # In production, you would make actual M-Pesa API calls
            
            if not all([self.consumer_key, self.consumer_secret, self.shortcode, self.passkey]):
                logger.warning("M-Pesa credentials not configured, simulating payment")
                return {
                    "success": True,
                    "checkout_request_id": f"ws_CO_{datetime.now().strftime('%Y%m%d%H%M%S')}",
                    "message": "Payment request sent (simulated)"
                }
            
            # Get access token
            access_token = await self.get_access_token()
            
            if not access_token:
                return {
                    "success": False,
                    "message": "Failed to authenticate with M-Pesa"
                }
            
            # Prepare STK Push request
            import base64
            from datetime import datetime
            
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            password = base64.b64encode(
                f"{self.shortcode}{self.passkey}{timestamp}".encode()
            ).decode()
            
            # Ensure phone number is in correct format
            if phone_number.startswith("254"):
                phone_number = phone_number
            elif phone_number.startswith("0"):
                phone_number = "254" + phone_number[1:]
            elif phone_number.startswith("+254"):
                phone_number = phone_number[1:]
            
            payload = {
                "BusinessShortCode": self.shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": self.shortcode,
                "PhoneNumber": phone_number,
                "CallBackURL": "https://your-domain.com/webhook/mpesa",  # Replace with your callback URL
                "AccountReference": reference,
                "TransactionDesc": "GrooveHire Booking Fee"
            }
            
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(self.stk_push_url, json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "checkout_request_id": result.get("CheckoutRequestID"),
                    "message": "Payment request sent successfully"
                }
            else:
                logger.error(f"STK Push failed: {response.text}")
                return {
                    "success": False,
                    "message": f"Payment request failed: {response.text}"
                }
                
        except Exception as e:
            logger.error(f"Error initiating STK Push: {str(e)}")
            return {
                "success": False,
                "message": f"Payment error: {str(e)}"
            }