import React, { useState, useEffect } from "react";
import api from "../../../../api";
import { Link } from "react-router-dom";
import Logout from "../../../Logout";
import { Navigate, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../../../style/Dashboard.css"
import Search from "../../../../components/Search";
import User from "../../../../components/User";
import Chistory from "../../../../components/Chistory";
import Achievement from "../../../../components/Achievement";

import DonutChart from './DonutChart';
import BarChart from './BarChart';
import Values from './values';
import ProgressChart from './ProgressChart';
import MyAchievement from './MyAchievement';
import Level from "./Level";


function Dashboard() {
    const [username, setUsername] = useState("");
    const [level, setLevel] = useState(1);
    const [percent, setPercent] = useState(1);
    const [isOnline, setIsOnline] = useState(false);
    const [image, setImage] = useState("");
    const [friendUsername, setFriendUsername] = useState("");
    const [friends, setFriends] = useState([]);
    const [Dfriends, setDFriends] = useState([]);
    const [searchUsername, setSearchUsername] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null); 
    const [wins, setWins] = useState(0);

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = () => {
        api
            .get(`https://${window.location.hostname}/api/user/profile/`)
            .then((res) => {
                setProfile(res.data);
                setWins(res.data.wins);
            })
            .catch((err) => toast.error(err));
    };

    if (!profile) {
        return <div></div>;
    }

    return (
		<div className="dash_all">
            <div className="dright">
                <div className="Level"><Level profile={profile}/></div>
                
                <div className="ProgressChart"><ProgressChart profile={profile}/></div>

                <div className="ach_full">
                    <div className="Myachievements"><MyAchievement profile={profile}/></div>                       
                    <div className="nb_all">
                        <div className="nbra">
                            <div className="dtitle">Score</div>
                            <div className="nbr">{profile.score}</div>
                        </div>
                    
                        <div className="nbra">
                            <div className="dtitle">Number of achievements</div>
                            <div className="nbr">{profile.achievements + 1}</div>
                        </div>
                    
                    </div>
                </div>

            </div>
        
            <div className="dleft">
                <div className="DonutChart"><DonutChart profile={profile}/></div>
                <div className="BarChart"><BarChart profile={profile}/></div>
                <div className="nbra_total">
                    <div className="dtitle">Total Games Played</div>
                    <div className="nbr">{profile.total_game}</div>
                </div>
                <div className="wl">
                    <div className="nbra">
                        <div className="dtitle">Win Counts</div>
                        <div className="nbr">{profile.wins}</div>
                    </div>
                    <div className="nbra">
                        <div className="dtitle">Loss Counts</div>
                        <div className="nbr">{profile.loss}</div>
                    </div>
                </div>
                
            </div> 
            <ToastContainer />
        </div>    
    );
}

export default Dashboard;
