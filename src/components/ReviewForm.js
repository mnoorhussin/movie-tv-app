// File: src/components/ReviewForm.js
import React, { useState } from 'react';
import './ReviewForm.css';

function ReviewForm({ onSubmit }) {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      onSubmit(reviewText, rating);
      setReviewText('');
      setRating(5);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Add Your Review</h4>
      <div className="rating-input">
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review here..."
        rows="4"
      />
      <button type="submit" className="btn">Submit Review</button>
    </form>
  );
}

export default ReviewForm;