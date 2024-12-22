import FriendsList from '../components/FriendsList';
import { useNavigate } from 'react-router-dom';
import Tour from './tournament/TournamentSetup';
import React, { useState } from 'react';
import '../GameCss/game.css';
import '/src/App.css';
import { useData } from '../../../DatasContext';

function Game() {
	const [mode, setMode] = useState('solo');
	const {color, setColor} = useData();
	const {round, setRound} = useData();

	const navigate = useNavigate();
	const [isFriendsListOpen, setIsFriendsListOpen] = useState(false);

	const [isOpenSearch, setIsOpenSearch] = useState(false);
	const [isVisibleSearch, setIsVisibleSearch] = useState(false);


    const handleFriendsClick = () => {
        setMode('friends');
        setIsFriendsListOpen(true);
    };
	const handleToggleSearch = () => {
		setIsVisibleSearch(!isVisibleSearch);
		setIsOpenSearch(true);
	};
	

	const getImageSrc1 = () => {
		return mode === 'solo' ? "/src/assets/Solo.svg" : "/src/assets/BlackSolo.svg";
	};

	const getImageSrc2 = () => {
		return mode === 'friends' ? "/src/assets/Friends.svg" : "/src/assets/BlackFriends.svg";
	};

	const getImageSrc4 = () => {
		return mode === 'local' ? "/src/assets/Random.svg" : "/src/assets/BlackRandom.svg";
	};

	const getImageSrc3 = () => {
		return mode === 'random' ? "/src/assets/Random.svg" : "/src/assets/BlackRandom.svg";
	};

	const handleStartGame = () => {
        switch(mode) {
            case 'solo':
                navigate('/soloGame', {state: {color: color, round: round}});
                break;
			case 'local':
                navigate('/localeGame', {state: {color: color, round: round}});
                break;
            case 'friends':
                navigate('/soloGame'), {state: {color: color, round: round}};
                break;
            case 'random':
                navigate('/randomlyGame', {state: {color: color, round: round}});
                break;
            case 'tournaments':
                navigate('/tournamentSetup', {state: {color: color, round: round}});
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
					<img src={getImageSrc4()} alt="logo" /> Local</button>
				<button className={mode === 'friends' ? 'active match' : 'match'} onClick={handleFriendsClick}>
					<img src={getImageSrc2()} alt="logo" /> Friends</button>
				<button className={mode === 'random' ? 'active match' : 'match'} onClick={() => setMode('random')}>
					<img src={getImageSrc3()} alt="logo" /> Random</button>
			</div>
			<div>
				<div className='color-table'>
					<span className='color-table'>Black</span>
					<span className='color-table'>white</span>
					<span className='color-table'>purple</span>
				</div>
			</div>
			<div className="color-select">
				<button className={color === 'black' ? 'active match' : 'match'} onClick={() => setColor('black')}>
					<img src="/src/assets/BlackBoard.svg" alt="icon"/>
				</button>
				<button className={color === 'white' ? 'active match' : 'match'} onClick={() => setColor('white')}>
					<img src="/src/assets/WhiteBoard.svg" alt="icon"/>
				</button>
				<button className={color === '#300863' ? 'active match' : 'match'} onClick={() => setColor('#300863')}>
				<img src="/src/assets/PurpleBoard.svg" alt="icon"/>
				</button>
			</div>
			<div className="round-select horizontal">
				<div className='container'>
				<span className='profile'>Goals :</span>
					<button className={round === 5 ? 'active rounds' : 'rounds'} onClick={() => setRound(5)}>5</button>
					<button className={round === 7 ? 'active rounds' : 'rounds'} onClick={() => setRound(7)}>7</button>
					<button className={round === 9 ? 'active rounds' : 'rounds'} onClick={() => setRound(9)}>9</button>
				</div>
				<div className='separator'></div>
				<div className="tournament">
					<button className='start-game horizontal' onClick={handleToggleSearch}>
					{/* <button className='start-game horizontal' onClick={() => setMode('tournaments')}> */}
						<span>tournament</span>
					</button>
				</div>
			</div>
			<button className='start-game' onClick={handleStartGame}>Start</button>
		</div>

		{isVisibleSearch && (
            <Tour
			isOpen={isOpenSearch}
			onClose={() => {
				setIsOpenSearch(false);
				setIsVisibleSearch(false);
			}}
		/>)}

		{isFriendsListOpen && (
            <FriendsList isOpen={isFriendsListOpen} onClose={() => setIsFriendsListOpen(false)} />
		)}
	</div>
  );
}

export default Game;
