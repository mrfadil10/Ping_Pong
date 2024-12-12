import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "../assets/logo.svg";
import "../style/Navbar.css";
import Logout from '../pages/Logout';

function Navbars() {
    const location = useLocation(); // Récupère l'URL actuelle

    useEffect(() => {
        const items = document.querySelectorAll('.navbars .vcontent div');

        items.forEach(item => {
            item.classList.remove('active'); // Retire 'active' à chaque rendu
            // Ajoute 'active' si le chemin correspond
            if (item.dataset.path === location.pathname) {
                item.classList.add('active');
            }
        });

        // Nettoyage pour éviter les fuites de mémoire
        return () => {
            items.forEach(item => {
                item.removeEventListener('click', function() {});
            });
        };
    }, [location]); // Dépendance à location pour mettre à jour lorsque l'URL change

    return (
        <div className="navbars">
            <div className='top'>
                <div className='image'>
                    <img className="logo" src={Logo} alt="Ping Pong Logo" />
                    <div className="ligne"></div>
                </div>

                <div className='vcontent'>
                    <Link to="/Profil" style={{ textDecoration: 'none' }}>
                        <div data-path="/Profil">
                            <img src="/src/assets/profile-logo.svg" alt="logo" />
                            <h1>Profil</h1>
                        </div>
                    </Link>
                    <Link to="/Dashboard" style={{ textDecoration: 'none' }}>
                        <div data-path="/Dashboard">
                            <img src="/src/assets/Dashboard.svg" alt="logo" />
                            <h1>Dashboard</h1>
                        </div>
                    </Link>
                    <Link to="/game" style={{ textDecoration: 'none' }}>
                        <div data-path="/game">
                            <img src="/src/assets/game_logo.svg" alt="logo" />
                            <h1>Game</h1>
                        </div>
                    </Link>
                    <Link to="/Chat" style={{ textDecoration: 'none' }}>
                        <div data-path="/Chat">
                            <img src="/src/assets/Chat.svg" alt="logo" />
                            <h1>Chat</h1>
                        </div>
                    </Link>
                    <Link to="/LeaderBoard" style={{ textDecoration: 'none' }}>
                        <div data-path="/LeaderBoard">
                            <img src="/src/assets/Leaderboard.svg" alt="logo" />
                            <h1>Leaderboard</h1>
                        </div>
                    </Link>
                    <Link to="/Settings" style={{ textDecoration: 'none' }}>
                        <div data-path="/Settings">
                            <img src="/src/assets/Settings.svg" alt="logo" />
                            <h1>Settings</h1>
                        </div>
                    </Link>
                </div>
            </div>

            <div className='nlogout'>
                <div className="ligne"></div>
                <div className='log'>
                    <Logout/>
                    <img src="/src/assets/logout.svg" alt="logo" />
                </div>
            </div>
        </div>
    );
}

export default Navbars;
