import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import { userService } from '../utils/userService';

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is registered using service
    const isRegistered = userService.isUserRegistered();
    console.log('AuthGuard: Checking if user is registered:', isRegistered);
    console.log('AuthGuard: User data:', userService.getUserData());
    setIsAuthenticated(isRegistered);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa status registrasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <RegistrationForm />;
  }

  return children;
} 