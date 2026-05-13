import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { isPendingOrganizer } from '../utils/accountStatus';

export default function PendingAccountGate({ children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated && isPendingOrganizer(user) && location.pathname !== '/account-pending') {
    return <Navigate to="/account-pending" replace />;
  }

  return children;
}