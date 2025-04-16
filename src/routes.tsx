// src/routes.tsx

import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';
import OrderForm from '@/pages/OrderForm';
import Settings from '@/pages/Settings';
import Stations from '@/pages/Stations';
import NotFound from '@/pages/NotFound';
import { useAuthUser } from '@/hooks/useAuth';

interface AppRoutesProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

// Optional: Normalize roles for safer comparison
const normalizeRole = (role: string) => {
  const map: Record<string, string> = {
    Administrator: 'admin',
    Admin: 'admin',
    admin: 'admin',
    Operator: 'operator',
    operator: 'operator',
    Salesperson: 'sales',
    salesperson: 'sales',
    User: 'user',
    user: 'user',
  };
  return map[role] || 'user';
};

export default function AppRoutes({ isAuthenticated, onLogin, onLogout }: AppRoutesProps) {
  const { user } = useAuthUser();
  const userRole = normalizeRole(user?.role || '');

  console.log("ROUTES - user role:", userRole);

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="*" element={<Auth onLogin={onLogin} />} />
      ) : (
        <Route path="/" element={<AppLayout onLogout={onLogout} />}>
          {/* Default route */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Common routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<OrderForm />} />
          <Route path="orders/:id" element={<OrderForm />} />

          {/* Role-based routes */}
          {(userRole === 'admin' || userRole === 'operator') && (
            <Route path="stations" element={<Stations />} />
          )}

          {userRole === 'admin' && (
            <Route path="settings" element={<Settings />} />
          )}

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      )}
    </Routes>
  );
}
