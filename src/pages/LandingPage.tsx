import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Users, CreditCard, Shield, Clock, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const handleWhatsAppClick = () => {
    // Use the actual GrooveHire WhatsApp number (replace with your real number)
    const phoneNumber = "14155238886"; // Your actual Twilio WhatsApp sandbox number
    const message = "Hi! I'd like to book a service through GrooveHire. Can you help me find a service provider?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find & Book Local
            <span className="text-blue-600"> Service Providers</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with trusted freelancers in your area via WhatsApp. From plumbers to tutors, 
            get quality services with secure payments and instant booking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center shadow-lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Book via WhatsApp
            </button>
            <Link
              to="/freelancer"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600 inline-flex items-center justify-center"
            >
              <Users className="mr-2 h-5 w-5" />
              Join as Provider
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose GrooveHire?</h2>
            <p className="text-lg text-gray-600">Simple, secure, and reliable service booking</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp Integration</h3>
              <p className="text-gray-600">Book services directly through WhatsApp - no app downloads required</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">M-Pesa Payments</h3>
              <p className="text-gray-600">Secure payments with M-Pesa STK Push - no cash handling needed</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>
              <p className="text-gray-600">All service providers are verified and rated by the community</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Message on WhatsApp</h3>
              <p className="text-gray-600">Start a conversation with our GrooveHire bot on WhatsApp</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
              <p className="text-gray-600">Tell us what you need and we'll show you the best providers nearby</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay</h3>
              <p className="text-gray-600">Confirm your booking and pay securely via M-Pesa</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-green-100 text-lg mb-8">Join thousands of satisfied customers and service providers</p>
          <button
            onClick={handleWhatsAppClick}
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 inline-flex items-center shadow-lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Start Booking Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-6 w-6" />
              <span className="font-bold">GrooveHire</span>
            </div>
            <p className="text-gray-400">© 2025 GrooveHire. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;