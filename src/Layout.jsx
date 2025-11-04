import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { TrendingUp, Wallet, Target, Eye, User, Brain, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from './api/apiClient';

function Layout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await auth.me();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/trading', icon: TrendingUp, label: 'Trading' },
    { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/watchlist', icon: Eye, label: 'Watchlist' },
    { path: '/predictions', icon: Brain, label: 'Predictions' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">StockSense AI</h1>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-800">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
