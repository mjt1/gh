import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import ClientBooking from './pages/ClientBooking';
import ChatInterface from './pages/ChatInterface';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/freelancer" element={<FreelancerDashboard />} />
        <Route path="/client" element={<ClientBooking />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
}

export default App;