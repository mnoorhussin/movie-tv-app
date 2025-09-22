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
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  });

  // Fetch movies when filters or page changes
  useEffect(() => {
    fetchMovies();
  }, [currentPage, filters]); // Add filters to dependency array

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
    // Update filters state and reset to page 1
    setFilters(newFilters);
    setCurrentPage(1);
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
        
        {/* Pass current filters as initialFilters to maintain state */}
        <MovieFilters 
          onFilterChange={handleFilterChange} 
          initialFilters={filters}
        />
        
        {!loading && movies.length === 0 ? (
          <div className="no-results">
            <h3>No movies found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <>
            <div className="movies-count">
              Showing {movies.length} movies
              {(filters.genre || filters.year || filters.rating) && ' (filtered)'}
              {filters.sortBy !== 'popularity.desc' && ` • Sorted by ${filters.sortBy.includes('vote_average') ? 'Rating' : filters.sortBy.includes('release_date') ? 'Release Date' : 'Title'}`}
            </div>
            
            {loading && currentPage > 1 ? (
              <div className="loading-more">Loading more movies...</div>
            ) : (
              <div className="grid">
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;