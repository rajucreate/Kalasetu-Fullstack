import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { cartService } from '../services/cartService';
import '../styles/header.css';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refreshCartCount = () => {
      if (user?.role === 'BUYER') {
        setCartCount(cartService.getCartCount(user?.id));
      } else {
        setCartCount(0);
      }
    };

    refreshCartCount();
    window.addEventListener(cartService.eventName, refreshCartCount);
    return () => window.removeEventListener(cartService.eventName, refreshCartCount);
  }, [user?.id, user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Kalasetu</span>
        </Link>

        <nav className="nav-menu">
          {user?.role === 'BUYER' && (
            <>
              <Link to="/buyer/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/marketplace" className="nav-link">
                Marketplace
              </Link>
              <Link to="/buyer/dashboard" className="nav-link cart-link">
                Cart
                {cartCount > 0 ? <span className="cart-count">{cartCount}</span> : null}
              </Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-greeting">
                Hello, {user?.first_name || 'User'}
              </div>
              <button onClick={handleLogout} className="logout-button">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="button secondary">
                Sign In
              </Link>
              <Link to="/register" className="button primary">
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
