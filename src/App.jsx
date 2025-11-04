import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import Portfolio from './pages/Portfolio';
import Goals from './pages/Goals';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Predictions from './pages/Predictions';
import { auth } from './api/apiClient';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await auth.me();
          setIsAuthenticated(true);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="trading" element={<Trading />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="goals" element={<Goals />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="profile" element={<Profile />} />
        <Route path="predictions" element={<Predictions />} />
      </Route>
    </Routes>
  );
}

export default App;
