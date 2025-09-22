// File: src/pages/MovieDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieCredits, getMovieReviews, getImageUrl } from '../services/tmdbApi';
import { useAuth } from '../contexts/AuthContext';
import { addReview, getReviews as getFirebaseReviews } from '../services/firebaseService';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMovieData();
  }, [id]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const [detailsResponse, creditsResponse, reviewsResponse] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
        getMovieReviews(id)
      ]);

      setMovie(detailsResponse.data);
      setCredits(creditsResponse.data);
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

  const handleAddReview = async (reviewText, rating) => {
    try {
      await addReview(currentUser.uid, id, reviewText, rating);
      
      // Refresh reviews
      const firebaseReviews = await getFirebaseReviews(id);
      setUserReviews(firebaseReviews);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="container">Movie not found</div>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-backdrop" style={{
        backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`
      }}>
        <div className="backdrop-overlay"></div>
      </div>

      <div className="container">
        <div className="movie-content">
          <div className="movie-poster">
            <img 
              src={getImageUrl(movie.poster_path)} 
              alt={movie.title}
              onError={(e) => {
                e.target.src = '/placeholder-movie.png';
              }}
            />
          </div>

          <div className="movie-info">
            <h1>{movie.title}</h1>
            <div className="movie-meta">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            </div>

            <div className="tabs">
              <button 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={activeTab === 'cast' ? 'active' : ''}
                onClick={() => setActiveTab('cast')}
              >
                Cast
              </button>
              <button 
                className={activeTab === 'reviews' ? 'active' : ''}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview">
                  <h3>Overview</h3>
                  <p>{movie.overview}</p>
                  <div className="genres">
                    {movie.genres.map(genre => (
                      <span key={genre.id} className="genre-tag">{genre.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'cast' && credits && (
                <div className="cast">
                  <h3>Cast</h3>
                  <div className="cast-grid">
                    {credits.cast.slice(0, 12).map(actor => (
                      <div key={actor.id} className="cast-member">
                        <img 
                          src={getImageUrl(actor.profile_path, 'w185')} 
                          alt={actor.name}
                          onError={(e) => {
                            e.target.src = '/placeholder-person.png';
                          }}
                        />
                        <div className="cast-info">
                          <h4>{actor.name}</h4>
                          <p>{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews">
                  <h3>Reviews</h3>
                  
                  {currentUser && (
                    <ReviewForm onSubmit={handleAddReview} />
                  )}

                  {userReviews.length > 0 && (
                    <>
                      <h4>User Reviews</h4>
                      <ReviewList reviews={userReviews} />
                    </>
                  )}

                  {tmdbReviews.length > 0 && (
                    <>
                      <h4>TMDB Reviews</h4>
                      <ReviewList reviews={tmdbReviews} />
                    </>
                  )}

                  {userReviews.length === 0 && tmdbReviews.length === 0 && (
                    <p>No reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;