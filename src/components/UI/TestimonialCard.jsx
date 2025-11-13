import React from 'react';
import './TestimonialCard.css';

const TestimonialCard = ({ quote, author, rating }) => {
  return (
    <div className="testimonial-card card">
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-author">
        <span>- {author}</span>
        <span className="testimonial-rating">{'⭐'.repeat(rating)}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
