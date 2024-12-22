import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/History.css"

function Chistory({profile, game}) {

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
                { wn_def == "Victory" && <h1 className="victory">Victory</h1>}
                { wn_def == "Defeat" && <h1 className="defeat">Defeat</h1>}
                <div className="user">
                    <h1 className="username">{game.player2}</h1>
                <img src={game.imagePlayer2} alt="Profile" className="image"/>
                </div>
                <div className="score">
                    <h1 className="username">Score</h1>
                    <h1 className={` ${wn_def === "Victory" ? "victory" : "defeat"}`}>
                        {game.player1_score} : {game.player2_score}</h1>
                </div>
                <div>Date: {game.created_at.slice(0, 10)}</div>
            </div>
        </div>     
    );
}

export default Chistory;