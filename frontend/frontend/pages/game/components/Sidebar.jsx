import React from 'react';
import Logo from '/src/assets/pong_logo.png';
import { Link } from "react-router-dom";


function Sidebar() {
  return (
	<div className="sidebar">
		<div className="logoContainer">
			<img className="logo" src={Logo} alt="Ping Pong Logo" />
		</div>
		<nav className='navbar'>
			<div>
				<ul>
				<li className='profile'>
					<img src="/src/assets/profile-logo.svg" alt="logo" />
					<Link to={`/Profil`} className="text">Profil</Link><br></br>
				</li>
				<li className='profile'>
					<img src="/src/assets/Dashboard.svg" alt="logo" />
					<button className='profile'>Dashboard</button>
				</li>
				<li className="active profile">
					<img src="/src/assets/game_logo.svg" alt="logo" />
					<Link to={`/game`} className="text">Game</Link><br></br>
				</li>
				<li className="profile">
					<img src="/src/assets/Chat.svg" alt="logo" />
					<Link to={`/chat`} className="text">Chat</Link><br></br>
				</li>
				<li className='profile'>
					<img src="/src/assets/Leaderboard.svg" alt="logo"/>
					<Link to={`/LeaderBoard`} className="text">LeaderBoard</Link><br></br>
				</li>
				<li className='profile'>
					<img src="/src/assets/Settings.svg" alt="logo"/>
					<Link to={`/Settings`} className="text">Settings</Link><br></br>
				</li>
				</ul>
			</div>
			<div className='logout'>
				<ul>
					<li className='profile log-out'>
						<button className='profile'>Logout</button>
						<img src="/src/assets/logout.svg" alt="logo"/>
					</li>
				</ul>
			</div>
		</nav>
	</div>
  );
}

export default Sidebar;
