import React, { useState, useEffect } from 'react';
import Match from './Match';
import { useNavigate } from 'react-router-dom';
import '../../GameCss/show.css';
import { useData } from '../../../../DatasContext';

const Tournament = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedPath, setHighlightedPath] = useState(null);
  const {players, setPlayers} = useData();
  const {winners, setWinners} = useData();
  const {i, setI} = useData();
  const [winner, setWinner] = useState(' ');
  const navigate = useNavigate();

  const participants = {
    round1: [
      [players[0], players[1]],
      [players[2], players[3]],
      [players[4], players[5]],
      [players[6], players[7]]
    ],
    round2: [
      [winners[0], winners[1]],
      [winners[2], winners[3]]
    ],
    round3: [
      [winners[4], winners[5]]
    ]
  };
  useEffect(() => {
    const isPlayersEmpty = players.every(player => player === ''); // Vérifie si tous les joueurs sont vides

    if (isPlayersEmpty) {
      navigate('/game'); // Redirection vers la page de jeu
    }
  }, [players, winners, navigate]);

  const handleTournament = () => {
    navigate('/tournament');
  };

  const handleParticipantClick = (participant) => {
    setHighlightedPath(participant);
		// setWinner(participant);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const isHighlighted = (participant) => {
    return highlightedPath === participant;
  };

  const Trophy = ({ fill }) => (
    <img src="/src/assets/winner.png" style={{ width: "120px", height: "120px" }} alt="icon"/>
  );

  const WinnerDisplay = ({ participant }) => (
    <div>
      <div
        className={`tournament-participant ${isHighlighted(participant) ? 'highlighted' : ''}`}
        onClick={() => handleParticipantClick(participant)}>
        {participant}
      </div>
    </div>
  );

  return (
    <div className="tournament-container_extra">
      {i <= 6 && <div className="tournament_round"><h2>Next Round: {players[i]} vs {players[i + 1]}</h2></div>}
      {i > 6 && i <= 16 && <div className="tournament_round"><h2>Next Round: {winners[i - 8]} vs {winners[i + 1 - 8]}</h2></div>}
      <div className="tournament-container">
        {/* Round 1 - Left Side */}
        <div className="tournament-column">
          {participants.round1.slice(0, 2).map((match, idx) => (
            <Match
              key={`r1l-${idx}`}
              match={match}
              isHighlighted={isHighlighted}
              onParticipantClick={handleParticipantClick}
            />
          ))}
        </div>

        {/* Round 2 - Left */}
        <div className="tournament-column2">
          {participants.round2[0].map((participant, index) => (
            <div
              key={`round2-left-${index}`}
              className={`tournament-participant2 ${isHighlighted(participant) ? 'highlighted' : ''}`}
              onClick={() => handleParticipantClick(participant)}
            >
              {participant}
              <div className="match-line" />
            </div>
          ))}
          <div className="vertical-line" />
        </div>

        {/* Winner Section */}
        <div className='winner_extra'>
          <div><h1>Tournament</h1></div>
          <div className="winner-section">
            <WinnerDisplay participant={winners[4]} />
            <div className="trophy-section">
              <div className={`tournament-trophy ${isAnimating ? 'animating' : ''}`}>
                <Trophy fill={isHighlighted(winner) ? '#553C9A' : '#6B46C1'} />
                <div className={`tournament-winner ${isAnimating ? 'animating' : ''}`}>
                  WINNER
                </div>
              </div>
            </div>
            <WinnerDisplay participant={winners[5]} />
          </div>
          <button
            className="tournament-start-button"
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => setIsAnimating(false), 1000);
              handleTournament();
              setI(i + 2);
            }}
          >
            START
          </button>
        </div>

        {/* Round 2 - Right */}
        <div className="tournament-column2">
          {participants.round2[1].map((participant, index) => (
            <div
              key={`round2-right-${index}`}
              className={`tournament-participant2 ${isHighlighted(participant) ? 'highlighted' : ''}`}
              onClick={() => handleParticipantClick(participant)}
            >
              {participant}
              <div className="match-line2" />
            </div>
          ))}
          <div className="vertical-line2" />
        </div>

        {/* Round 1 - Right Side */}
        <div className="tournament-column">
          {participants.round1.slice(2).map((match, idx) => (
            <Match
              key={`r1r-${idx}`}
              match={match}
              isHighlighted={isHighlighted}
              onParticipantClick={handleParticipantClick}
              isRightSide={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tournament;