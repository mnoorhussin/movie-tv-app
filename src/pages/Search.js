// File: src/pages/Search.js
import React, { useState } from 'react';
import { searchMovies } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchMovies(query, 1);
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(1);
      setLoading(false);
    } catch (error) {
      console.error('Error searching movies:', error);
      setLoading(false);
    }
  };

  const handlePageChange = async (page) => {
    setLoading(true);
    try {
      const response = await searchMovies(query, page);
      setMovies(response.data.results);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching page:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Search Movies</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
        />
        <button type="submit" className="btn">Search</button>
      </form>

      {loading && <div className="loading">Loading...</div>}

      {movies.length > 0 && !loading && (
        <>
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

      {movies.length === 0 && !loading && query && (
        <p>No results found for "{query}"</p>
      )}
    </div>
  );
}

export default Search;