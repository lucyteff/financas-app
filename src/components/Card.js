import React from 'react';
import './Card.css';

const Card = ({ title, children, className = '', onClick }) => {
  return (
    <div 
      className={`card ${className}`}
      onClick={onClick}
      role="region"
      aria-labelledby={title ? `card-title-${title.replace(/\s+/g, '-')}` : undefined}
    >
      {title && <h2 id={`card-title-${title.replace(/\s+/g, '-')}`}>{title}</h2>}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;