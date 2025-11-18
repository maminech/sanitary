import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PlansPage from './pages/plans/PlansPage';
import PlanDetailPage from './pages/plans/PlanDetailPage';
import PlanViewerPage from './pages/plans/PlanViewerPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import QuotesPage from './pages/quotes/QuotesPage';
import QuoteDetailPage from './pages/quotes/QuoteDetailPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import HelpPage from './pages/HelpPage';

function App() {
  const authState = useAuthStore();
  const { isAuthenticated, user } = authState;
  
  React.useEffect(() => {
    console.log('App Auth State:', { 
      isAuthenticated, 
      userId: user?.id,
      userEmail: user?.email
    });
  }, [isAuthenticated, user]);

  return (
    <Routes>
      {/* Public Home Page */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/plans" element={isAuthenticated ? <PlansPage /> : <Navigate to="/login" />} />
        <Route path="/plans/:id" element={isAuthenticated ? <PlanDetailPage /> : <Navigate to="/login" />} />
        <Route path="/plans/:id/viewer" element={isAuthenticated ? <PlanViewerPage /> : <Navigate to="/login" />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/quotes" element={isAuthenticated ? <QuotesPage /> : <Navigate to="/login" />} />
        <Route path="/quotes/:id" element={isAuthenticated ? <QuoteDetailPage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;
