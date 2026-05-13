import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { isPendingOrganizer, isRejectedOrganizer } from '../utils/accountStatus';

/**
 * ProtectedRoute Component - Handles role-based access control
 * @param {Object} props - Component props
 * @param {React.Component} props.element - Component to render if authorized
 * @param {string|string[]} props.requiredRole - Role(s) required to access (e.g., 'Participant', ['EventOrganizer', 'Admin'])
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 */
export default function ProtectedRoute({ 
  element, 
  requiredRole = null, 
  requireAuth = true 
}) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  // Check if authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    isAuthenticated &&
    (isPendingOrganizer(user) || isRejectedOrganizer(user)) &&
    location.pathname !== '/account-pending'
  ) {
    return <Navigate to="/account-pending" replace />;
  }

  // If no specific role is required, just check authentication
  if (!requiredRole) {
    return element;
  }

  // Check if user has required role
  const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasRequiredRole = user?.applyAs && rolesArray.includes(user.applyAs);

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
}
