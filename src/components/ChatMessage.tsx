import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, timestamp }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isBot 
          ? 'bg-gray-100 text-gray-800' 
          : 'bg-blue-500 text-white'
      }`}>
        <div className="flex items-center mb-1">
          {isBot ? (
            <Bot className="h-4 w-4 mr-2" />
          ) : (
            <User className="h-4 w-4 mr-2" />
          )}
          <span className="text-xs opacity-75">{timestamp}</span>
        </div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;