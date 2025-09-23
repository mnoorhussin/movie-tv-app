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
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const getYear = (releaseDate) => {
    return releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  };

  const getRating = (voteAverage) => {
    return voteAverage ? voteAverage.toFixed(1) : 'N/A';
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        {/* Rating in top left corner */}
        <div className="movie-rating-badge">
          ⭐ {getRating(movie.vote_average)}
        </div>
        
        {/* Favorite button in top right corner */}
        {currentUser && (
          <button 
            className={`favorite-btn ${movie.isFavorite ? 'favorited' : ''}`}
            onClick={handleFavorite}
          >
            {movie.isFavorite ? '❤️' : '🤍'}
          </button>
        )}
        
        <img 
          src={getImageUrl(movie.poster_path)} 
          alt={movie.title}
          onError={(e) => {
            e.target.src = '/placeholder-movie.png';
          }}
        />
        
        <div className="movie-card-content">
          {/* Title */}
          <h3 className="movie-title">{movie.title}</h3>
          
          {/* Year as a badge like rating */}
          <div className="movie-year-badge">{getYear(movie.release_date)}</div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;