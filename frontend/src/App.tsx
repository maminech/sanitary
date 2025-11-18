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
  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = React.useState(false);
  
  // Wait for Zustand to rehydrate from localStorage
  React.useEffect(() => {
    // Check if store has been rehydrated
    const checkHydration = () => {
      const authStorage = localStorage.getItem('auth-storage');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      console.log('App hydration check:', { 
        isAuthenticated, 
        user: user?.email, 
        hasAuthStorage: !!authStorage,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });
      
      setIsHydrated(true);
    };
    
    // Longer delay to ensure persist middleware completes
    const timer = setTimeout(checkHydration, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);
  
  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
