import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, totalReviews, size = 16, interactive = false, onRate }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const isFilled = star <= Math.round(rating);
          return (
            <Star
              key={star}
              size={size}
              fill={isFilled ? '#f59e0b' : 'none'}
              color={isFilled ? '#f59e0b' : '#cbd5e1'}
              style={{ cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.1s' }}
              onClick={() => interactive && onRate && onRate(star)}
            />
          );
        })}
      </div>
      {rating > 0 && (
        <span style={{ fontSize: `${size * 0.85}px`, fontWeight: 700, color: '#1e293b' }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span style={{ fontSize: `${size * 0.78}px`, color: 'var(--text-muted)' }}>
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default StarRating;
