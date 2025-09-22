// File: src/components/MovieFilters.js
import React, { useState, useEffect } from 'react';
import { getGenres } from '../services/tmdbApi';
import './MovieFilters.css';

function MovieFilters({ onFilterChange, initialFilters = {} }) {
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: initialFilters.genre || '',
    year: initialFilters.year || '',
    rating: initialFilters.rating || '',
    sortBy: initialFilters.sortBy || 'popularity.desc',
    ...initialFilters
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await getGenres();
      setGenres(response.data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      genre: '',
      year: '',
      rating: '',
      sortBy: 'popularity.desc'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  // Generate years from 2024 down to 1950
  const years = Array.from({ length: 75 }, (_, i) => 2024 - i);
  
  // Rating options
  const ratings = [
    { value: '', label: 'Any Rating' },
    { value: '9', label: '9+ Excellent' },
    { value: '8', label: '8+ Very Good' },
    { value: '7', label: '7+ Good' },
    { value: '6', label: '6+ Okay' },
    { value: '5', label: '5+ Average' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'vote_average.asc', label: 'Lowest Rated' },
    { value: 'title.asc', label: 'Title A-Z' },
    { value: 'title.desc', label: 'Title Z-A' }
  ];

  const hasActiveFilters = filters.genre || filters.year || filters.rating || filters.sortBy !== 'popularity.desc';

  return (
    <div className="movie-filters">
      <div className="filters-header">
        <h3>MOVIES FILTER</h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>
      
      <div className="filters-grid">
        {/* Genre Filter */}
        <div className="filter-group">
          <label>Select Genres</label>
          <select 
            value={filters.genre} 
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="filter-group">
          <label>Select Year</label>
          <select 
            value={filters.year} 
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="filter-select"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="filter-group">
          <label>Select Rating</label>
          <select 
            value={filters.rating} 
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="filter-select"
          >
            {ratings.map(rating => (
              <option key={rating.value} value={rating.value}>
                {rating.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="filter-group">
          <label>Sort By</label>
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="active-filters">
          {filters.genre && (
            <span className="filter-tag">
              Genre: {genres.find(g => g.id == filters.genre)?.name}
              <button onClick={() => handleFilterChange('genre', '')}>×</button>
            </span>
          )}
          {filters.year && (
            <span className="filter-tag">
              Year: {filters.year}
              <button onClick={() => handleFilterChange('year', '')}>×</button>
            </span>
          )}
          {filters.rating && (
            <span className="filter-tag">
              Rating: {filters.rating}+
              <button onClick={() => handleFilterChange('rating', '')}>×</button>
            </span>
          )}
          {filters.sortBy !== 'popularity.desc' && (
            <span className="filter-tag">
              Sort: {sortOptions.find(s => s.value === filters.sortBy)?.label}
              <button onClick={() => handleFilterChange('sortBy', 'popularity.desc')}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieFilters;