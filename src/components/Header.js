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
            <div className="logo-icon">🎬</div>
            <span className="logo-text">MovieDB</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/search" className="nav-link">Search</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
          </nav>

          <div className="header-actions">
            {currentUser ? (
              <div className="user-info">
                <img 
                  src={currentUser.photoURL || '/placeholder-person.png'} 
                  alt={currentUser.displayName} 
                  className="user-avatar"
                />
                <span className="user-name">Hi, {currentUser.displayName?.split(' ')[0]}</span>
                <button onClick={handleAuth} className="btn btn-outline">Logout</button>
              </div>
            ) : (
              <button onClick={handleAuth} className="btn btn-primary">
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;