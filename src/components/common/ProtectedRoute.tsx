import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { dashboardAuth } from '../../services/dashboardAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = dashboardAuth.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to dashboard (will show login page)
    // Save intended destination to redirect after login
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
