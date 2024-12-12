import React from 'react';
import './style/values.css';

const Values = () => {
  const Value = 25; // Replace with your actual value

  return (
    <div className="total-games-played-container">
      <h2 className="total-games-played-title">Total Games Played</h2>
      <p className="total-games-played-value">{Value}</p>
    </div>
  );
};

export default Values;