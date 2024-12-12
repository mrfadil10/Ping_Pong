import React, { useState } from 'react';
import '../../GameCss/TournamentSetup.css';
import '../game';
import '../../components/popup.css';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../../../DatasContext';

const My_tournament = ({isOpen, onClose}) => {
  const {players, setPlayers} = useData();
	const navigate = useNavigate();

  const handleTournament = () => {
    const players = getPlayers();
    setPlayers(players);
    if (players.every(player => player.trim() !== '')) {
      const uniquePlayers = new Set(players);
      if (uniquePlayers.size === players.length) {
        navigate('/show');
      } else {
        alert('Players must have unique names');
      }
    } else {
      alert('Please enter names for all players');
    }
  };
  

  const handleInputChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };
  const getPlayers = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    return shuffledPlayers;
  }

  return (
    <div className="card_extra">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Participants</h2>
        </div>

        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="search for players"
          />
          <svg className="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          </svg>
        </div>

        <div className="participants-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="participant-input">
              <img src="/src/assets/username-icon.svg" alt="icon"/>
              <input
                type="text"
                className="username-input"
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="button-container">
          <button onClick={onClose} className="button button-cancel">Cancel</button>
          <button onClick={handleTournament} className="button button-start">Start</button>
        </div>
      </div>
    </div>
  );
};

export default My_tournament;
