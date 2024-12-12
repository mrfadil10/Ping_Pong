import React, { useState, useEffect } from "react";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Leaderboard.css";
import Rank1 from '../components/Rank1';
import Rank2And3 from '../components/Rank2-3';
import OtherRank from '../components/OtherRank';

function LBoard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getLeaderboard();
    }, []);

    const getLeaderboard = () => {
        api
            .get(`https://${window.location.hostname}/api/user/leaderboard/`)
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching leaderboard");
            });
    };

    return (
        <div className="leaderboard_all">
            <div className="leaderboard">
                {users.length > 0 && (
                    <div className="rank1" key={users[0].username}>
                        <Rank1 user={users[0]} />
                    </div>
                )}
                
                {users.length > 2 && (
                    <div className="rank2-3">
                        <Rank2And3 userRank2={users[1]} userRank3={users[2]} />
                    </div>
                )}
                
                <div className="other-ranks-container">
                    {users.slice(3).map((user, index) => (
                        <div className="other-rank" key={user.username}>
                            <OtherRank index={index + 3} user={user} />
                        </div>
                    ))}
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default LBoard;
