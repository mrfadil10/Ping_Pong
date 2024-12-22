import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { Navigate, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Profil.css"
import Search from "../components/Search";
import Cprofil from "../components/Cprofil";
import User from "../components/User";
import Chistory from "../components/Chistory";
import Achievement from "../components/Achievement";

import { useData } from '../DatasContext';


function Profil() {
    const {user, setUser, setIsAuthenticated} = useData();
    const [gameHistory, setGameHistory] = useState([]);
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);


    const getUserProfile = async () => {
        try {
          const res = await api.get( `https://${window.location.hostname}/api/user/profile/`);
          res.data.is_online = true;
          setUser(res.data);
          setUsername(res.data.username);
          localStorage.setItem('user', JSON.stringify(res.data));
          fetchGameHistory();
        } catch (err) { toast.error(err);}
      };
    // useEffect(() => {
        // }, [user]);

    const fetchGameHistory = async () => {
        if (!username) {
            setError("Username is required to fetch game history.");
            return;
          }
        try {
            const response = await api.get(`https://${window.location.hostname}/api/gameresults/`, {
            params: { username },
            });
            setGameHistory(response.data); // Set the game history data
        } catch (err) {
            setError('Error fetching game results');
            // console.error('Error fetching game history:', err);
        }
        };

    useEffect(() => {
        setIsAuthenticated(true);
        // console.log("user ->:", username);
        // if (username)
            getUserProfile();      
    }, [username]);

    // if (!username)
    //     return <div></div>;
    if (!user)
        return <div></div>;

    return (
        <div className="profil_extra">
        <div className="profil_full">
            <div className="first">
                <div className="userss"><Cprofil profile={user}/></div>
                <div className="AS">
                    <div className="Search"><Search/></div>        
                    <div className="Achievement"><Achievement profile={user}/></div>
                </div>
            </div>
            <div className="histo_down">

            <div className="histo">
                <div className="title">History</div>
            </div>
                <div className="histo_all">
            {gameHistory.length > 0 ? (
                gameHistory.map((game) => (
                    <div key={game.id}>
                <div className="History"><Chistory profile={user} game={game}/></div>
                </div>
          ))
        ) : (
          <p>No game history found.</p>
        )}
                </div>     
            </div>
            <ToastContainer />
        </div>    
        </div>
    );
}

export default Profil;