import React from 'react';
import Logo from "../../../assets/pong_logo.png"
import { Link } from 'react-router-dom';
import "../../../style/sidebar.css"

function Sidebars() {
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
					<button className='profile'>Profil</button>
				</li>
				<li className='profile'>
					<img src="/src/assets/Dashboard.svg" alt="logo" />
					<button className='profile'>Dashboard</button>
				</li>
				<li className="active profile">
					<img src="/src/assets/game_logo.svg" alt="logo" />
					<button className='profile'>Game</button>
				</li>
				<li className="profile">
					<img src="/src/assets/Chat.svg" alt="logo" />
					<button className='profile'>Chat</button>
				</li>
				<li className='profile'>
					<img src="/src/assets/Leaderboard.svg" alt="logo"/>
					<button className='profile'>Leaderboard</button>
				</li>
				<li className='profile'>
					<img src="/src/assets/Settings.svg" alt="logo"/>
					<button className='profile'>Settings</button>
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

export default Sidebars;