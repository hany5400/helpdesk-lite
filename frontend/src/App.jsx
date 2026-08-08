import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CreateTicket from './pages/CreateTicket';
import MyTickets from './pages/MyTickets';
import TicketDetails from './pages/TicketDetails';
import SupportDashboard from './pages/SupportDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerTickets from './pages/ManagerTickets';
import NotFound from './pages/NotFound';

const RootRedirect = () => {
  const { user, token } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === 'support') return <Navigate to="/support" replace />;
  if (user.role === 'manager') return <Navigate to="/manager" replace />;
  return <Navigate to="/tickets" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Root Route Redirect */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/dashboard" element={<Navigate to="/tickets" replace />} />

            {/* Authenticated Protected Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>

                {/* Employee / Personal Ticket Routes */}
                <Route element={<ProtectedRoute allowedRoles={['employee', 'support', 'manager']} />}>
                  <Route path="/tickets/new" element={<CreateTicket />} />
                  <Route path="/tickets" element={<MyTickets />} />
                </Route>

                {/* Ticket Details (Employee / Support / Manager) */}
                <Route path="/tickets/:id" element={<TicketDetails />} />

                {/* Support Staff Routes */}
                <Route element={<ProtectedRoute allowedRoles={['support', 'manager']} />}>
                  <Route path="/support" element={<SupportDashboard />} />
                </Route>

                {/* Manager Routes */}
                <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
                  <Route path="/manager" element={<ManagerDashboard />} />
                  <Route path="/manager/tickets" element={<ManagerTickets />} />
                </Route>

                {/* 404 Not Found Page */}
                <Route path="*" element={<NotFound />} />

              </Route>
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
