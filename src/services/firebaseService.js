import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Add a movie to user's favorites
export const addToFavorites = async (userId, movie) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    await addDoc(favoritesRef, {
      userId,
      movieId: movie.id,
      movieData: movie,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove a movie from user's favorites
export const removeFromFavorites = async (userId, movieId) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(
      favoritesRef, 
      where('userId', '==', userId), 
      where('movieId', '==', movieId)
    );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'favorites', document.id));
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Get user's favorites
export const getFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, 'favorites');
    const q = query(favoritesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });
    
    return favorites;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

// Add a review
export const addReview = async (userId, movieId, reviewText, rating) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    await addDoc(reviewsRef, {
      userId,
      movieId,
      reviewText,
      rating,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Get reviews for a movie
export const getReviews = async (movieId) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('movieId', '==', movieId));
    const querySnapshot = await getDocs(q);
    
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};