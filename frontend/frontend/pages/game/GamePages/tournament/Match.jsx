import React from 'react';

const Match = ({ match, isHighlighted, onParticipantClick, isRightSide }) => {
  return (
    <div className="tournament-match">
      {match.map((participant, index) => (
        <div
          key={index}
          className={`tournament-participant ${isHighlighted(participant) ? 'highlighted' : ''}`}
          onClick={() => onParticipantClick(participant)}
        >
          {participant}
        </div>
      ))}
      <div className={`match-line ${isRightSide ? 'left' : ''}`} />
      <div className={`vertical-line ${isRightSide ? 'left' : ''}`} />
    </div>
  );
};

export default Match;
