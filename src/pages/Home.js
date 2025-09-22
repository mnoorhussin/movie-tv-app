// File: src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { discoverMovies } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import MovieFilters from '../components/MovieFilters';
import Pagination from '../components/Pagination';
import './Home.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchMovies();
  }, [currentPage, filters]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await discoverMovies({
        ...filters,
        page: currentPage
      });
      setMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, 500));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && currentPage === 1) {
    return (
      <div className="container">
        <div className="loading">Loading Movies</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="page-header">
          <h1>🎬 Discover Movies</h1>
          <p>Filter and find your perfect movie match</p>
        </div>
        
        <MovieFilters onFilterChange={handleFilterChange} />
        
        {!loading && movies.length === 0 ? (
          <div className="no-results">
            <h3>No movies found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <>
            <div className="movies-count">
              Showing {movies.length} movies
              {filters.genre || filters.year || filters.rating ? ' (filtered)' : ''}
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
          </>
        )}
      </div>
    </div>
  );
}

export default Home;