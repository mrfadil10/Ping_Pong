import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/UserProfil.css"
import User from "../components/User";
import History from "../components/History";
import Achievement from "../components/Achievement";
import Search from "../components/Search";
import Chistory from "../components/Chistory";
import BarChart from "./game/GamePages/bonus/BarChart";


function UserProfil() {
    const { username } = useParams();
    const [friendprofile, setFriendprofile] = useState([]);
    const [gameHistory, setGameHistory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        api
            .get(`https://${window.location.hostname}/api/friend_profile/${username}/`)
            .then((res) => {
                setFriendprofile(res.data);
                if (res.data.profile_image !== null)
                    fetchGameHistory();

            })
            .catch((err) => {
                // console.error(err);
                toast.error("Error fetching friend profile");
            });
    } ,[username]);

    const fetchGameHistory = async () => {
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

    if (!friendprofile) {
        return <div>Loading...</div>;
    }


    return (
        <div className="userprofil_full">
            <div className="first">
                <div className="hereee">
                <div className="user"><User friendprofile={friendprofile} /></div>
                <div className="BarChart"><BarChart profile={friendprofile}/></div>
                </div>
                <div className="AS">
                    <div className="Search"><Search/></div>        
                    <div className="Achievement"><Achievement profile={friendprofile}/></div>
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
                        <div className="History"><Chistory profile={friendprofile} game={game}/></div>
                    </div>))
                ) : (
                    <p>No game history found.</p>
                )}
            </div>     
            </div>
            <ToastContainer />
        </div>    
    );
}

export default UserProfil;