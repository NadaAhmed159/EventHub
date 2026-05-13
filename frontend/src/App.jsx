import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import SignUp from './pages/public/SignUp';
import AccountPending from './pages/public/AccountPending';
import EventsList from './pages/public/EventsList';
import EventDetail from './pages/public/EventDetail';
import ContactSupport from './pages/public/ContactSupport';
import ResetPassword from './pages/public/ResetPassword';
import TicketVerify from './pages/public/TicketVerify';

import Favorites from './pages/participant/Favorites';
import MyTickets from './pages/participant/MyTickets';
import Dashboard from './pages/participant/Dashboard';
import Profile from './pages/participant/Profile';
import EditProfile from './pages/participant/EditProfile';
import MyReviews from './pages/participant/MyReviews';

import CreateEvent from './pages/organizer/CreateEvent';
import MyEvents from './pages/organizer/MyEvents';
import EditEvent from './pages/organizer/EditEvent';
import OrganizerDashboard from './pages/organizer/Dashboard';
import OrganizerAnalytics from './pages/organizer/Analytics';
import OrganizerProfile from './pages/organizer/Profile';
import EditOrganizerProfile from './pages/organizer/EditProfile';
import OrganizerReviews from './pages/organizer/OrganizerReviews';

import AdminDashboard from './pages/admin/Dashboard';
import PendingAccounts from './pages/admin/PendingAccounts';
import PendingEvents from './pages/admin/PendingEvents';
import AdminReviews from './pages/admin/AdminReviews';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import PendingAccountGate from './components/PendingAccountGate';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <PendingAccountGate>
                <ScrollToTop />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/account-pending" element={<AccountPending />} />
                  <Route path="/events" element={<EventsList />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/contact" element={<ContactSupport />} />
                  <Route path="/reset-password" element={<ProtectedRoute element={<ResetPassword />} />} />
                  <Route path="/verify-ticket/:qrCode" element={<TicketVerify />} />

                  {/* Participant Routes */}
                  <Route path="/favorites" element={<ProtectedRoute element={<Favorites />} requiredRole="Participant" />} />
                  <Route path="/my-tickets" element={<ProtectedRoute element={<MyTickets />} requiredRole="Participant" />} />
                  <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRole="Participant" />} />
                  <Route path="/profile" element={<ProtectedRoute element={<Profile />} requiredRole="Participant" />} />
                  <Route path="/edit-profile" element={<ProtectedRoute element={<EditProfile />} requiredRole="Participant" />} />
                  <Route path="/my-reviews" element={<ProtectedRoute element={<MyReviews />} requiredRole="Participant" />} />

                  {/* Organizer Routes */}
                  <Route path="/organizer-dashboard" element={<ProtectedRoute element={<OrganizerDashboard />} requiredRole="EventOrganizer" />} />
                  <Route path="/organizer-analytics" element={<ProtectedRoute element={<OrganizerAnalytics />} requiredRole="EventOrganizer" />} />
                  <Route path="/create-event" element={<ProtectedRoute element={<CreateEvent />} requiredRole="EventOrganizer" />} />
                  <Route path="/my-events" element={<ProtectedRoute element={<MyEvents />} requiredRole="EventOrganizer" />} />
                  <Route path="/edit-event/:id" element={<ProtectedRoute element={<EditEvent />} requiredRole="EventOrganizer" />} />
                  <Route path="/organizer-profile" element={<ProtectedRoute element={<OrganizerProfile />} requiredRole="EventOrganizer" />} />
                  <Route path="/edit-organizer-profile" element={<ProtectedRoute element={<EditOrganizerProfile />} requiredRole="EventOrganizer" />} />
                  <Route path="/organizer-reviews" element={<ProtectedRoute element={<OrganizerReviews />} requiredRole="EventOrganizer" />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="Admin" />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="Admin" />} />
                  <Route path="/admin/pending-accounts" element={<ProtectedRoute element={<PendingAccounts />} requiredRole="Admin" />} />
                  <Route path="/admin/pending-events" element={<ProtectedRoute element={<PendingEvents />} requiredRole="Admin" />} />
                  <Route path="/admin/reviews" element={<ProtectedRoute element={<AdminReviews />} requiredRole="Admin" />} />
                </Routes>
                </PendingAccountGate>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
