// File: src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header() {
  const { currentUser, loginWithGoogle, logout } = useAuth();

  const handleAuth = () => {
    if (currentUser) {
      logout();
    } else {
      loginWithGoogle();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            MovieDB
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/favorites">Favorites</Link>
          </nav>
          <button onClick={handleAuth} className="btn">
            {currentUser ? 'Logout' : 'Login with Google'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;