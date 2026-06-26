import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

// 1. Ensures user is logged in
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// 2. Ensures user has a specific role
export function RoleRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const role = useAuthStore(state => state.role);

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />; // or redirect to their specific dashboard
  }

  return <Outlet />;
}

// 3. Ensures user has completed onboarding
export function OnboardingRoute() {
  const isOnboarded = useAuthStore(state => state.isOnboarded);
  const role = useAuthStore(state => state.role);

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  // If they somehow hit /onboarding but are already onboarded
  return <Outlet />;
}
