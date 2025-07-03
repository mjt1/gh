import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Users, Settings, Home, Phone } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleWhatsAppClick = () => {
    // Use the actual GrooveHire WhatsApp number (replace with your real number)
    const phoneNumber = "14155238886"; // Your actual Twilio WhatsApp sandbox number
    const message = "Hi! I'd like to book a service through GrooveHire. Can you help me find a service provider?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">GrooveHire</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Phone className="h-4 w-4" />
              <span>Book Now</span>
            </button>
            
            <Link
              to="/freelancer"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/freelancer') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Freelancer</span>
            </Link>
            
            <Link
              to="/admin"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;