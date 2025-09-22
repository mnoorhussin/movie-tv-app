// File: src/pages/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieReviews, getImageUrl, getSimilarMovies } from '../services/tmdbApi';
import { useAuth } from '../contexts/AuthContext';
import { addReview, getReviews as getFirebaseReviews, addToFavorites, removeFromFavorites, getFavorites } from '../services/firebaseService';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import MovieCard from '../components/MovieCard';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [watchLater, setWatchLater] = useState(false);

  useEffect(() => {
    fetchMovieData();
    checkIfFavorite();
  }, [id, currentUser]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const [detailsResponse, creditsResponse, similarResponse, reviewsResponse] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
        getSimilarMovies(id),
        getMovieReviews(id)
      ]);

      setMovie(detailsResponse.data);
      setCredits(creditsResponse.data);
      setSimilarMovies(similarResponse.data.results.slice(0, 12));
      setTmdbReviews(reviewsResponse.data.results);

      // Get user reviews from Firebase
      if (currentUser) {
        const firebaseReviews = await getFirebaseReviews(id);
        setUserReviews(firebaseReviews);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie data:', error);
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    if (currentUser && id) {
      try {
        const favorites = await getFavorites(currentUser.uid);
        const isFav = favorites.some(fav => fav.movieId === parseInt(id));
        setIsFavorite(isFav);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
  };

  const handleAddReview = async (reviewText, rating) => {
    try {
      await addReview(currentUser.uid, id, reviewText, rating);
      const firebaseReviews = await getFirebaseReviews(id);
      setUserReviews(firebaseReviews);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(currentUser.uid, parseInt(id));
        setIsFavorite(false);
      } else {
        await addToFavorites(currentUser.uid, movie);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  const handleWatchLater = () => {
    setWatchLater(!watchLater);
    // Here you would typically save to Firebase
    alert(watchLater ? 'Removed from Watch Later' : 'Added to Watch Later');
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getAgeRating = (adult) => {
    return adult ? '18+' : 'PG-13';
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container">
        <div className="movie-not-found">
          <h2>Movie not found</h2>
          <p>The movie you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const mainCast = credits?.cast?.slice(0, 6) || [];
  const director = credits?.crew?.find(person => person.job === 'Director');

  return (
    <div className="movie-detail">
      {/* Hero Section with Backdrop */}
      <div 
        className="movie-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${getImageUrl(movie.backdrop_path, 'w1280')})`
        }}
      >
        <div className="container">
          <div className="movie-hero-content">
            <div className="movie-poster-section">
              <img 
                src={getImageUrl(movie.poster_path, 'w500')} 
                alt={movie.title}
                className="movie-poster-large"
                onError={(e) => {
                  e.target.src = '/placeholder-movie.png';
                }}
              />
              
              <div className="movie-badge">
                <span className="age-rating">{getAgeRating(movie.adult)}</span>
                <span className="quality-badge">FHD</span>
              </div>
            </div>

            <div className="movie-info-section">
              <div className="movie-header">
                <h1 className="movie-title">{movie.title}</h1>
                <div className="movie-subtitle">
                  {director && <span className="director">Directed by {director.name}</span>}
                </div>
              </div>

              <div className="movie-meta-details">
                <div className="meta-item">
                  <span className="meta-label">Release Date</span>
                  <span className="meta-value">{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Runtime</span>
                  <span className="meta-value">{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Rating</span>
                  <span className="meta-value">⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
              </div>

              <div className="movie-genres-list">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">#{genre.name}</span>
                ))}
              </div>

              <p className="movie-overview-large">{movie.overview}</p>

              <div className="movie-actions">
                <button className="action-btn primary">
                  <span>▶</span>
                  TRAILER
                </button>
                <button 
                  className={`action-btn secondary ${watchLater ? 'active' : ''}`}
                  onClick={handleWatchLater}
                >
                  <span>+</span>
                  WATCH LATER
                </button>
                <button 
                  className={`action-btn secondary ${isFavorite ? 'active' : ''}`}
                  onClick={handleFavorite}
                >
                  <span>❤</span>
                  FAVOURITES
                </button>
              </div>

              <div className="starring-section">
                <h4>Stars:</h4>
                <div className="stars-list">
                  {mainCast.map(actor => (
                    <span key={actor.id} className="star-name">{actor.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="movie-content-tabs">
        <div className="container">
          <div className="tabs-navigation">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
              onClick={() => setActiveTab('cast')}
            >
              Cast & Crew
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button 
              className={`tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
              onClick={() => setActiveTab('similar')}
            >
              You May Also Like
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="overview-grid">
                  <div className="overview-item">
                    <h4>Status</h4>
                    <p>{movie.status}</p>
                  </div>
                  <div className="overview-item">
                    <h4>Original Language</h4>
                    <p>{movie.original_language?.toUpperCase()}</p>
                  </div>
                  <div className="overview-item">
                    <h4>Budget</h4>
                    <p>{movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
                  </div>
                  <div className="overview-item">
                    <h4>Revenue</h4>
                    <p>{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cast' && credits && (
              <div className="cast-content">
                <div className="cast-grid">
                  {credits.cast.slice(0, 12).map(person => (
                    <div key={person.id} className="cast-member-card">
                      <img 
                        src={getImageUrl(person.profile_path, 'w185')} 
                        alt={person.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-person.png';
                        }}
                      />
                      <div className="cast-info">
                        <h4>{person.name}</h4>
                        <p>{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                {currentUser && (
                  <ReviewForm onSubmit={handleAddReview} />
                )}

                {userReviews.length > 0 && (
                  <div className="reviews-section">
                    <h3>User Reviews</h3>
                    <ReviewList reviews={userReviews} />
                  </div>
                )}

                {tmdbReviews.length > 0 && (
                  <div className="reviews-section">
                    <h3>TMDB Reviews</h3>
                    <ReviewList reviews={tmdbReviews} />
                  </div>
                )}

                {userReviews.length === 0 && tmdbReviews.length === 0 && (
                  <div className="no-reviews">
                    <p>No reviews yet. Be the first to review this movie!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'similar' && (
              <div className="similar-content">
                <h3>Similar Movies</h3>
                <div className="similar-movies-grid">
                  {similarMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;