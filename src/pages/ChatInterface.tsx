import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatMessage from '../components/ChatMessage';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, message: "Hi! Welcome to GrooveHire 👋 I'm here to help you find the perfect service provider. What service do you need today?", isBot: true, timestamp: "10:30 AM" },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    "Plumbing",
    "Electrical work",
    "House cleaning",
    "Tutoring",
    "Car repair",
    "Painting"
  ];

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let botResponse = "";
      
      if (userMessage.toLowerCase().includes('plumbing')) {
        botResponse = "Great! I found some excellent plumbers in your area. Can you share your location so I can show you the closest ones? 📍";
      } else if (userMessage.toLowerCase().includes('electrical')) {
        botResponse = "Perfect! I have certified electricians available. What type of electrical work do you need - installation, repair, or maintenance? ⚡";
      } else if (userMessage.toLowerCase().includes('cleaning')) {
        botResponse = "Wonderful! I can connect you with trusted house cleaners. Do you need regular cleaning service or a one-time deep clean? 🏠";
      } else if (userMessage.toLowerCase().includes('tutoring')) {
        botResponse = "Excellent! I have qualified tutors for various subjects. What subject and level do you need help with? 📚";
      } else if (userMessage.toLowerCase().includes('location') || userMessage.toLowerCase().includes('westlands')) {
        botResponse = "Thanks! I found 3 top-rated plumbers near Westlands:\n\n🔧 Mike Johnson - 4.9⭐ (2.1km away)\n🔧 Grace Wanjiku - 4.8⭐ (3.5km away)\n🔧 Peter Kamau - 4.7⭐ (4.2km away)\n\nWould you like to book any of them?";
      } else if (userMessage.toLowerCase().includes('mike') || userMessage.toLowerCase().includes('book')) {
        botResponse = "Great choice! Mike Johnson is available today. Here are the details:\n\n👨‍🔧 Mike Johnson\n⭐ Rating: 4.9/5 (245 reviews)\n💰 Rate: KES 1,200/hour\n📍 2.1km from you\n\nShall I proceed with the booking?";
      } else if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('proceed')) {
        botResponse = "Perfect! I'll need a few details:\n\n1. What's the plumbing issue?\n2. Your preferred time?\n3. Your contact number?\n\nAfter this, you can pay securely via M-Pesa! 💳";
      } else {
        botResponse = "I understand! Let me help you find the right service provider. Could you please tell me more about what you need help with?";
      }
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        message: botResponse,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const newMessage = {
      id: messages.length + 1,
      message: inputMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    simulateBotResponse(inputMessage);
    setInputMessage('');
  };

  const handleQuickReply = (reply: string) => {
    const newMessage = {
      id: messages.length + 1,
      message: reply,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    simulateBotResponse(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Chat Header */}
        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              GH
            </div>
            <div>
              <h2 className="font-semibold">GrooveHire Bot</h2>
              <p className="text-sm text-green-100">Online • Usually replies instantly</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-green-500 rounded-full">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-green-500 rounded-full">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-green-500 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100vh - 280px)' }}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              isBot={msg.isBot}
              timestamp={msg.timestamp}
            />
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              disabled={inputMessage.trim() === ''}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;