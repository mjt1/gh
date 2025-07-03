import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  price: string;
  rating: number;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon: Icon, price, rating, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{price}</p>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default ServiceCard;