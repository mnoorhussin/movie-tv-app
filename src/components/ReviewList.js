// File: src/components/ReviewList.js
import React from 'react';
import './ReviewList.css';

function ReviewList({ reviews }) {
  const formatDate = (timestamp) => {
    if (timestamp?.toDate) {
      // Firebase timestamp
      return timestamp.toDate().toLocaleDateString();
    } else if (timestamp) {
      // String date from TMDB
      return new Date(timestamp).toLocaleDateString();
    }
    return 'Unknown date';
  };

  return (
    <div className="review-list">
      {reviews.map(review => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div className="review-author">
              {review.author || (review.userId ? `User ${review.userId.substring(0, 8)}` : 'Anonymous')}
            </div>
            <div className="review-rating">⭐ {review.rating || review.author_details?.rating || 'N/A'}</div>
            <div className="review-date">{formatDate(review.created_at || review.createdAt)}</div>
          </div>
          <div className="review-content">
            {review.content || review.reviewText}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;