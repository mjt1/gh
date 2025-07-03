import React, { useState } from 'react';
import { Wrench, GraduationCap, Zap, Home, Car, Paintbrush, MapPin, Phone, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';

const ClientBooking = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const services = [
    { id: 'plumbing', title: 'Plumbing', description: 'Pipes, taps, water heater repairs', icon: Wrench, price: 'from KES 800', rating: 4.8 },
    { id: 'tutoring', title: 'Tutoring', description: 'Academic support for all subjects', icon: GraduationCap, price: 'from KES 600', rating: 4.9 },
    { id: 'electrical', title: 'Electrical', description: 'Wiring, installations, repairs', icon: Zap, price: 'from KES 1,000', rating: 4.7 },
    { id: 'cleaning', title: 'House Cleaning', description: 'Deep cleaning, regular maintenance', icon: Home, price: 'from KES 500', rating: 4.6 },
    { id: 'automotive', title: 'Car Mechanic', description: 'Vehicle repairs and maintenance', icon: Car, price: 'from KES 1,500', rating: 4.8 },
    { id: 'painting', title: 'Painting', description: 'Interior and exterior painting', icon: Paintbrush, price: 'from KES 700', rating: 4.5 },
  ];

  const topProviders = [
    { id: 1, name: 'Mike Johnson', rating: 4.9, jobs: 245, distance: '2.1 km', price: 'KES 1,200', avatar: 'MJ' },
    { id: 2, name: 'Grace Wanjiku', rating: 4.8, jobs: 189, distance: '3.5 km', price: 'KES 1,000', avatar: 'GW' },
    { id: 3, name: 'Peter Kamau', rating: 4.7, jobs: 156, distance: '4.2 km', price: 'KES 1,500', avatar: 'PK' },
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentStep(2);
  };

  const handleProviderSelect = (providerId: number) => {
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className={`text-sm ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                Choose Service
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className={`text-sm ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                Select Provider
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className={`text-sm ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                Book & Pay
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">What service do you need?</h1>
              <p className="text-lg text-gray-600">Choose from our available services</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  price={service.price}
                  rating={service.rating}
                  onClick={() => handleServiceSelect(service.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Provider Selection */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose your provider</h1>
              <p className="text-lg text-gray-600">Top-rated providers in your area</p>
            </div>
            
            <div className="space-y-4">
              {topProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {provider.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            {provider.rating} ({provider.jobs} jobs)
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {provider.distance} away
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{provider.price}</p>
                      <p className="text-sm text-gray-600">per hour</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to services
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Booking Details */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Details</h1>
              <p className="text-lg text-gray-600">Complete your booking with Mike Johnson</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <p className="text-gray-900 font-medium">Plumbing Repair</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <p className="text-gray-900 font-medium">Mike Johnson</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                  <p className="text-gray-900 font-medium">KES 1,200 /hour</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-gray-900 font-medium">4.9 (245 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+254 700 000 000"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the issue you need help with..."
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferred Time</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Morning (8:00 AM - 12:00 PM)</option>
                    <option>Afternoon (12:00 PM - 4:00 PM)</option>
                    <option>Evening (4:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to providers
              </button>
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Book & Pay with M-Pesa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBooking;