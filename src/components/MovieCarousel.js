import React, { useState, useEffect } from 'react';
import { getLatestMovies, getImageUrl } from '../services/tmdbApi';
import { Link } from 'react-router-dom';
import './MovieCarousel.css';

function MovieCarousel() {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestMovies();
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (movies.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(movies.length, 5));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [movies.length]);

  const fetchLatestMovies = async () => {
    try {
      setLoading(true);
      const response = await getLatestMovies(1);
      // Get the first 10 latest movies
      const latestMovies = response.data.results.slice(0, 10);
      setMovies(latestMovies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching latest movies:', error);
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.min(movies.length, 5));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.min(movies.length, 5)) % Math.min(movies.length, 5));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
        <p>Loading latest movies...</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  // Show only 5 slides at a time for better UX
  const visibleMovies = movies.slice(0, 5);

  return (
    <div className="movie-carousel">
      <div className="carousel-header">
        <h2>🎬 New Releases</h2>
        <p>Discover the latest movies in theaters</p>
      </div>

      <div className="carousel-container">
        <button className="carousel-btn carousel-btn-prev" onClick={prevSlide}>
          ‹
        </button>

        <div className="carousel-track">
          {visibleMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              <div className="slide-background">
                <img 
                  src={getImageUrl(movie.backdrop_path, 'w1280')} 
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = '/placeholder-movie.png';
                  }}
                />
                <div className="backdrop-overlay"></div>
              </div>

              <div className="slide-content">
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="movie-year">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                    <span className="movie-rating">
                      ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </span>
                    <span className="movie-quality">FHD</span>
                    <span className="movie-runtime">
                      {movie.vote_count} votes
                    </span>
                  </div>

                  <div className="movie-genres">
                    {movie.genre_ids.slice(0, 2).map(genreId => (
                      <span key={genreId} className="genre-tag">
                        #{getGenreName(genreId)}
                      </span>
                    ))}
                  </div>

                  <p className="movie-overview">
                    {movie.overview?.length > 150 
                      ? movie.overview.substring(0, 150) + '...' 
                      : movie.overview}
                  </p>

                  <div className="movie-actions">
                    <Link to={`/movie/${movie.id}`} className="watch-now-btn">
                      Watch Now
                    </Link>
                    <button className="trailer-btn">
                      Trailer
                    </button>
                  </div>
                </div>

                <div className="movie-poster">
                  <img 
                    src={getImageUrl(movie.poster_path, 'w500')} 
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = '/placeholder-movie.png';
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-btn carousel-btn-next" onClick={nextSlide}>
          ›
        </button>
      </div>

      <div className="carousel-indicators">
        {visibleMovies.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

// Helper function to get genre names from genre IDs
const getGenreName = (genreId) => {
  const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV',
    53: 'Thriller', 10752: 'War', 37: 'Western'
  };
  return genreMap[genreId] || 'Unknown';
};

export default MovieCarousel;