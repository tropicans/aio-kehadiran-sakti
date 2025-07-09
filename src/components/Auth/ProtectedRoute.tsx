import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // Redirect mereka ke halaman login jika tidak diautentikasi
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;