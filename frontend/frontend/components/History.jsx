import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/History.css"

function History({profile, game}) {

    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");

    let wn_def;
    if (game.winner == profile.username)
        wn_def = "Victory";
    else
        wn_def = "Defeat";

    return (
        <div className="history">
            <div className="content">
                <div className="user">
                    <img src={game.imagePlayer1} alt="Profile" className="image"/>
                    <h1 className="username">{game.player1}</h1>
                </div>
                <h1 className="defeat">{wn_def}</h1>
                <div className="user">
                    <h1 className="username">{game.player2}</h1>
                    <img src={game.imagePlayer2} alt="Profile" className="image"/>
                </div>
                <div className="score">
                    <h1 className="username">Score</h1>
                    <h1 className="username">{game.player1_score} : {game.player2_score}</h1>
                </div>
            </div>
        </div>     
    );
}

export default History;