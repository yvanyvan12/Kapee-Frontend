import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginForm';
import SignupModal from './SignupForm';
import { useState } from 'react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        {showSignup ? (
          <SignupModal 
          />
        ) : (
          <LoginModal 
            onClose={() => {}} // Can't close without logging in
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;