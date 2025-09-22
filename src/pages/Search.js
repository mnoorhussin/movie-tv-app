import React, { useState } from 'react';
import { discoverMovies, searchMovies } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import MovieFilters from '../components/MovieFilters';
import Pagination from '../components/Pagination';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchMode, setSearchMode] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchMode(false);
      return fetchMovies();
    }
    
    setSearchMode(true);
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

  const fetchMovies = async () => {
    setLoading(true);
    try {
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
    setCurrentPage(1);
    setSearchMode(false);
    setQuery('');
  };

  const handlePageChange = async (page) => {
    setLoading(true);
    try {
      let response;
      if (searchMode && query) {
        response = await searchMovies(query, page);
      } else {
        response = await discoverMovies({ ...filters, page });
      }
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
      <h1>Search & Discover Movies</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies by title..."
        />
        <button type="submit" className="btn">Search</button>
      </form>

      <MovieFilters onFilterChange={handleFilterChange} />

      {/* ... rest of search component ... */}
    </div>
  );
}

export default Search;