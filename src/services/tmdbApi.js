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