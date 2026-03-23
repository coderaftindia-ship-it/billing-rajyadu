import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import POS from './pages/POS/POS';
import BillingHistory from './pages/BillingHistory/BillingHistory';
import Products from './pages/Products/Products';
import Categories from './pages/Categories/Categories';
import Inventory from './pages/Inventory/Inventory';
import Customers from './pages/Customers/Customers';
import Suppliers from './pages/Suppliers/Suppliers';
import Purchases from './pages/Purchases/Purchases';
import Reports from './pages/Reports/Reports';
import Expenses from './pages/Expenses/Expenses';
import Users from './pages/Users/Users';
import Settings from './pages/Settings/Settings';
import Login from './pages/Login/Login';
import { BillingProvider, useBilling } from './context/BillingContext';

const SessionTimeoutManager = ({ children }) => {
  const { currentUser, logout, settings } = useBilling();
  const timerRef = useRef(null);

  const timeoutMinutes = settings ? parseInt(settings.find(s => s.key === 'sessionTimeout')?.value || '30') : 30;

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentUser) {
      timerRef.current = setTimeout(() => {
        logout();
        alert('Session expired due to inactivity.');
      }, timeoutMinutes * 60 * 1000);
    }
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimer();

    if (currentUser) {
      resetTimer();
      events.forEach(event => document.addEventListener(event, handleActivity));
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => document.removeEventListener(event, handleActivity));
    };
  }, [currentUser, timeoutMinutes]);

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useBilling();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm animate-pulse uppercase tracking-widest">Loading SmartBill...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BillingProvider>
      <SessionTimeoutManager>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/billing-history" element={<BillingHistory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchases" element={<Purchases />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SessionTimeoutManager>
    </BillingProvider>
  );
}

export default App;
