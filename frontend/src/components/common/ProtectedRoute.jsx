import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  // Pull authenticated state implicitly from Zustand global store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If not authenticated, redirect backward to the secure login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Otherwise, render the exact component requested
  return children;
};

export default ProtectedRoute;
