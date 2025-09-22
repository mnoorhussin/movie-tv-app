// File: src/services/tmdbApi.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getGenres = () => {
  return api.get('/genre/movie/list');
};

export const discoverMovies = (filters = {}) => {
  const params = {
    page: filters.page || 1,
    sort_by: filters.sortBy || 'popularity.desc',
    ...filters
  };

  // Remove our custom filter keys and handle TMDB-specific parameters
  if (filters.genre) {
    params.with_genres = filters.genre;
  }
  if (filters.year) {
    params.primary_release_year = filters.year;
  }
  if (filters.rating) {
    params['vote_average.gte'] = filters.rating;
  }

  // Remove our custom keys
  delete params.genre;
  delete params.year;
  delete params.rating;
  delete params.sortBy;
  delete params.page;

  return api.get('/discover/movie', { params });
};

export const getPopularMovies = (page = 1) => {
  return api.get('/movie/popular', {
    params: { page }
  });
};

export const searchMovies = (query, page = 1) => {
  return api.get('/search/movie', {
    params: { query, page }
  });
};

export const getMovieDetails = (id) => {
  return api.get(`/movie/${id}`);
};

export const getMovieCredits = (id) => {
  return api.get(`/movie/${id}/credits`);
};

export const getMovieReviews = (id) => {
  return api.get(`/movie/${id}/reviews`);
};

export const getImageUrl = (path, size = 'w500') => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder-movie.png';
};

export default api;