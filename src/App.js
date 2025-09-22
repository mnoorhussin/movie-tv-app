// File: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import MovieDetail from './pages/MovieDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;