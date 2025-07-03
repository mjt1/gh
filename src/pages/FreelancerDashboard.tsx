import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Star, MapPin, Settings, Bell, User, LogOut, Briefcase, Camera } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import AuthModal from '../components/AuthModal';
import PortfolioModal from '../components/PortfolioModal';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  completedDate: string;
  clientName?: string;
}

interface FreelancerUser {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  category: string;
  location: string;
  rating: number;
  completedJobs: number;
  earnings: number;
  portfolio: PortfolioItem[];
}

const FreelancerDashboard = () => {
  const [user, setUser] = useState<FreelancerUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('freelancerUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: FreelancerUser) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('freelancerUser');
    setUser(null);
  };

  const handleUpdatePortfolio = (portfolio: PortfolioItem[]) => {
    if (user) {
      const updatedUser = { ...user, portfolio };
      setUser(updatedUser);
      localStorage.setItem('freelancerUser', JSON.stringify(updatedUser));
    }
  };

  const stats = [
    { title: 'Total Earnings', value: `KES ${user?.earnings?.toLocaleString() || '0'}`, change: '+18%', changeType: 'increase', icon: DollarSign, color: 'green' },
    { title: 'Jobs Completed', value: user?.completedJobs?.toString() || '0', change: '+12%', changeType: 'increase', icon: Calendar, color: 'blue' },
    { title: 'Rating', value: user?.rating?.toString() || '0', change: '+0.2', changeType: 'increase', icon: Star, color: 'yellow' },
    { title: 'Response Time', value: '15 min', change: '-5 min', changeType: 'increase', icon: Clock, color: 'blue' },
  ];

  const pendingJobs = [
    { id: 1, client: 'Sarah Johnson', service: 'Plumbing Repair', location: 'Westlands', amount: 'KES 2,500', time: '2 hours ago' },
    { id: 2, client: 'Michael Smith', service: 'Kitchen Tap Fix', location: 'Karen', amount: 'KES 1,800', time: '4 hours ago' },
    { id: 3, client: 'Grace Wanjiku', service: 'Bathroom Renovation', location: 'Kilimani', amount: 'KES 8,500', time: '6 hours ago' },
  ];

  const completedJobs = [
    { id: 1, client: 'John Doe', service: 'Pipe Installation', date: '2025-01-14', amount: 'KES 3,200', rating: 5 },
    { id: 2, client: 'Mary Wilson', service: 'Sink Repair', date: '2025-01-13', amount: 'KES 1,500', rating: 4 },
    { id: 3, client: 'David Brown', service: 'Water Heater Fix', date: '2025-01-12', amount: 'KES 2,800', rating: 5 },
  ];

  // If user is not logged in, show auth modal
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Join GrooveHire as a Freelancer</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start earning by offering your services to clients in your area. Build your reputation, 
              manage your bookings, and grow your business with our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Sign Up as Freelancer
              </button>
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Features for freelancers */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn More</h3>
              <p className="text-gray-600">Set your own rates and keep 90% of what you earn</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">Work when you want, where you want</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Reputation</h3>
              <p className="text-gray-600">Get reviews and build a strong professional profile</p>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
            <p className="text-gray-600 mt-2">{user.category} • {user.location}</p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {isAvailable ? 'Available' : 'Unavailable'}
              </button>
            </div>
            <button
              onClick={() => setIsPortfolioModalOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="Manage Portfolio"
            >
              <Briefcase className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:text-red-800"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Job Requests */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending Job Requests</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingJobs.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{job.service}</h3>
                      <p className="text-sm text-gray-600 mt-1">Client: {job.client}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{job.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{job.amount}</p>
                      <div className="flex space-x-2 mt-2">
                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                          Accept
                        </button>
                        <button className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Completed Jobs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Completed Jobs</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {completedJobs.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{job.service}</h3>
                      <p className="text-sm text-gray-600 mt-1">Client: {job.client}</p>
                      <p className="text-xs text-gray-400 mt-2">{job.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{job.amount}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(job.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
            <button
              onClick={() => setIsPortfolioModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Camera className="h-4 w-4 mr-2" />
              Manage Portfolio
            </button>
          </div>
          <div className="p-6">
            {user.portfolio && user.portfolio.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.portfolio.slice(0, 6).map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{item.category}</span>
                        <span className="text-xs text-gray-500">{new Date(item.completedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
                <p className="text-gray-600 mb-4">Showcase your work to attract more clients</p>
                <button
                  onClick={() => setIsPortfolioModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Your First Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                  <p className="text-sm text-gray-600">Location: {user.location}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Category</label>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{user.category}</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                <p className="text-lg font-semibold text-gray-900">KES 800 - 1,200 /hour</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <p className="text-sm text-gray-600">Monday - Saturday: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        portfolio={user.portfolio || []}
        onUpdatePortfolio={handleUpdatePortfolio}
      />
    </div>
  );
};

export default FreelancerDashboard;