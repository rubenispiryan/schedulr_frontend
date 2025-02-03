import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function AuthWrapper({ children }) {
  // Check if token exists (user is authenticated)
  const token = localStorage.getItem('token');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}