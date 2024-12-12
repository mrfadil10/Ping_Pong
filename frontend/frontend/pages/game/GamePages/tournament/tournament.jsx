import React, { useState, useEffect } from 'react';
import GameComponent from './GameComponent';
import { useData } from '../../../../DatasContext';
import WinComp from '../../components/WinComp'
import { useNavigate } from 'react-router-dom';
import './../../GameCss/App.css';

const Tournament = () => {
  const navigate = useNavigate();
  const { currentRound, setCurrentRound } = useData();
  const { winners, setWinners } = useData();
  const { players, setPlayers } = useData();
  const { next, setNext } = useData();
  const { color, setColor } = useData();
  const { round, setRound } = useData();
  const [showWinComp, setShowWinComp] = useState(false);
  const [winnerPlayer, setWinnerPlayer] = useState(false);
  const [player1, player2, player3, player4, player5, player6, player7, player8] = players;

  const handleGameEnd = (winner, roundNumber) => {
    setWinners(prevWinners => {
      const updatedWinners = [...prevWinners];
      updatedWinners[roundNumber - 1] = winner;
      return updatedWinners;
    });
    setCurrentRound(roundNumber);
    setWinnerPlayer(winner);
    setShowWinComp(true);
  };

  useEffect(() => {
    if (showWinComp) {
      const timeout = setTimeout(() => {
        setShowWinComp(false);
        setNext(prev => prev + 1);
        if (currentRound === 7) {
          setPlayers(['', '', '','','','','', '']);
          setWinners(['?', '?', '?','?','?','?','?']);
          navigate('/game'); // Navigate to the home page
        } else {
          navigate('/show'); // Navigate to the show page (optional, depending on your flow)
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [showWinComp, navigate, setNext]);

  const renderGame = () => {
    switch(true) {
      case currentRound === 0:
        return ( 
        <>
          <GameComponent
            x={'1'} 
            player1={player1} 
            player2={player2} 
            round={round} 
            color={color} 
            onGameEnd={(winner) => handleGameEnd(winner, 1)} 
            />
          </>);
      case currentRound === 1 && next === 1:
        return <GameComponent
          x={'2'} 
          player1={player3} 
          player2={player4} 
          round={round} 
          color={color} 
          onGameEnd={(winner) => handleGameEnd(winner, 2)} 
        />;
      case currentRound === 2 && next === 2:
        return <GameComponent
          x={'3'} 
          player1={player5} 
          player2={player6} 
          round={round} 
          color={color} 
          onGameEnd={(winner) => handleGameEnd(winner, 3)} 
        />;
      case currentRound === 3 && next === 3:
        return <GameComponent 
          x={'4'}
          player1={player7} 
          player2={player8} 
          round={round} 
          color={color} 
          onGameEnd={(winner) => handleGameEnd(winner, 4)} 
        />;
      case currentRound === 4 && next === 4:
        return <GameComponent
          x={'5 "Semi-Final-1"'}
          player1={winners[0]} 
          player2={winners[1]} 
          round={round} 
          color={color} 
          onGameEnd={(winner) => handleGameEnd(winner, 5)} 
        />;
      case currentRound === 5 && next === 5:
        return <GameComponent 
          x={'6 "Semi-Final-2"'}
          player1={winners[2]} 
          player2={winners[3]} 
          round={round} 
          color={color} 
          onGameEnd={(winner) => handleGameEnd(winner, 6)} 
        />;
      case currentRound === 6 && next === 6:
        return (
          <>
            <GameComponent
              x={'7 "Final"'} 
              player1={winners[4]} 
              player2={winners[5]} 
              round={round} 
              color={color} 
              onGameEnd={(winner) => handleGameEnd(winner, 7)} 
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pong-game-container">
      {showWinComp && (
        <div className="winlose">
          <WinComp obj={null} text={`The Winner Is: ${winnerPlayer}`} />
        </div>
      )}
      {renderGame()}
    </div>
  );
};

export default Tournament;