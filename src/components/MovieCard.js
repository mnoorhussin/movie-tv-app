// File: src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/tmdbApi';
import { useAuth } from '../contexts/AuthContext';
import { addToFavorites, removeFromFavorites } from '../services/firebaseService';
import './MovieCard.css';

function MovieCard({ movie }) {
  const { currentUser } = useAuth();

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (movie.isFavorite) {
        await removeFromFavorites(currentUser.uid, movie.id);
        movie.isFavorite = false;
      } else {
        await addToFavorites(currentUser.uid, movie);
        movie.isFavorite = true;
      }
      // Force re-render by toggling a state if needed in parent component
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img 
          src={getImageUrl(movie.poster_path)} 
          alt={movie.title}
          onError={(e) => {
            e.target.src = '/placeholder-movie.png';
          }}
        />
        <div className="movie-card-content">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</p>
          <div className="movie-rating">
            <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
          </div>
          {currentUser && (
            <button 
              className={`favorite-btn ${movie.isFavorite ? 'favorited' : ''}`}
              onClick={handleFavorite}
            >
              {movie.isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;