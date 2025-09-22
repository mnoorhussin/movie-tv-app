// File: src/pages/Favorites.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites } from '../services/firebaseService';
import MovieCard from '../components/MovieCard';
import './Favorites.css';

function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const fetchFavorites = async () => {
    try {
      const userFavorites = await getFavorites(currentUser.uid);
      const favoriteMovies = userFavorites.map(fav => ({
        ...fav.movieData,
        isFavorite: true
      }));
      setFavorites(favoriteMovies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container">
        <h1>My Favorites</h1>
        <p>Please log in to view your favorites.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Favorites</h1>
      
      {favorites.length > 0 ? (
        <div className="grid">
          {favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p>You haven't added any favorites yet.</p>
      )}
    </div>
  );
}

export default Favorites;