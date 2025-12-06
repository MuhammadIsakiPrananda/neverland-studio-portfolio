import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '@/features/auth';

/**
 * Loading component for authentication checks
 */
const AuthLoading = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex h-screen items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
      <p className="mt-4 text-white">{message}</p>
    </div>
  </div>
);

/**
 * Protected Route - Requires authentication
 */
export const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

/**
 * Admin Route - Requires admin role
 */
export const AdminRoute = () => {
  const { userProfile, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoading message="Verifying permissions..." />;
  }

  return userProfile?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/access-denied" replace />
  );
};

/**
 * Guest Route - Redirects authenticated users
 */
export const GuestRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoading />;
  }

  return !isLoggedIn ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
