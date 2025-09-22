// File: src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { getPopularMovies } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import './Home.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getPopularMovies(currentPage);
      setMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, 500)); // TMDB limits to 500 pages
      setLoading(false);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading Popular Movies</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>🎉 Popular Movies</h1>
          <p>Discover the most popular movies right now</p>
        </div>
        
        <div className="grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Home;