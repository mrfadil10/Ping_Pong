import React, { useState } from 'react';
import FriendsList from '../components/FriendsList';
import '../GameCss/game.css';
import { useNavigate } from 'react-router-dom';
import '/src/App.css';

function Game() {
	const [mode, setMode] = useState('solo');
	const [color, setColor] = useState('white');
	const [round, setRound] = useState(1);
	const [isVisible, setIsVisible] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const handleToggle = () => {
		setIsVisible(!isVisible);
		setIsOpen(true);
	};

	const getImageSrc0 = () => {
		return mode === 'local' ? "/src/assets/Local.svg" : "/src/assets/BlackLocal.svg";
	};

	const getImageSrc1 = () => {
		return mode === 'solo' ? "/src/assets/Solo.svg" : "/src/assets/BlackSolo.svg";
	};

	const getImageSrc2 = () => {
		return mode === 'friends' ? "/src/assets/Friends.svg" : "/src/assets/BlackFriends.svg";
	};

	const getImageSrc3 = () => {
		return mode === 'random' ? "/src/assets/Random.svg" : "/src/assets/BlackRandom.svg";
	};

	const handleStart = () => {
        switch(mode) {
            case 'solo':
                navigate('/soloGame');
                break;
			case 'local':
                navigate('/localeGame');
                break;
            case 'friends':
                navigate('/soloGame');
                break;
            case 'random':
                navigate('/randomlyGame');
                break;
            case 'tournaments':
                navigate('/tournament');
                break;

        }
    };

	return (
	<div className="game">
		<div className='mini-background'>
			<div className="mode-select">
				<button className={mode === 'solo' ? 'active match' : 'match'} onClick={() => setMode('solo')}>
					<img src={getImageSrc1()} alt="logo" /> Solo</button>
				<button className={mode === 'local' ? 'active match' : 'match'} onClick={() => setMode('local')}>
					<img src={getImageSrc0()} alt="logo" /> Local</button>
				<button className={mode === 'friends' ? 'active match' : 'match'} onClick={() => {setMode('friends');  handleToggle();}}>
					<img src={getImageSrc2()} alt="logo" /> Friends</button>
				<button className={mode === 'random' ? 'active match' : 'match'} onClick={() => setMode('random')}>
					<img src={getImageSrc3()} alt="logo" /> Random</button>
			</div>
			<div>
				<div className='color-table'>
					<span className='color-table'>white</span>
					<span className='color-table'>Black</span>
					<span className='color-table'>purple</span>
				</div>
			</div>
			<div className="color-select">
				<button className={color === 'white' ? 'active match' : 'match'} onClick={() => setColor('white')}>
					<img src="/src/assets/WhiteBoard.svg" alt="icon"/>
				</button>
				<button className={color === 'black' ? 'active match' : 'match'} onClick={() => setColor('black')}>
					<img src="/src/assets/BlackBoard.svg" alt="icon"/>
				</button>
				<button className={color === 'purple' ? 'active match' : 'match'} onClick={() => setColor('purple')}>
				<img src="/src/assets/PurpleBoard.svg" alt="icon"/>
				</button>
			</div>
			<div className="round-select horizontal">
				<div className='container'>
				<span className='profile'>Rounds</span>
					<button className={round === 1 ? 'active rounds' : 'rounds'} onClick={() => setRound(1)}>1</button>
					<button className={round === 2 ? 'active rounds' : 'rounds'} onClick={() => setRound(2)}>2</button>
					<button className={round === 3 ? 'active rounds' : 'rounds'} onClick={() => setRound(3)}>3</button>
				</div>
				<div className='separator'></div>
				<div className="tournament">
					<button className='start-game horizontal' onClick={() => setMode('tournaments')}>
						<span>tournament</span>
					</button>
				</div>
			</div>
			<button className='start-game' onClick={handleStart}>Start</button>
		</div>

		<div className={`overlay ${isVisible ? 'visible' : ''}`}>
			<div className={`popup ${isVisible ? 'visible' :  ''}`}>
				<FriendsList isOpen={isOpen} onClose={() => {setIsOpen(false); handleToggle();}}/>
			</div>
		</div>
	</div>
  );
}

export default Game;
