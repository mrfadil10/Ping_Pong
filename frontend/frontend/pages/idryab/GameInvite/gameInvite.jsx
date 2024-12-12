import React, { useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import "./gameinvite.css";
import accept from "../../../assets/accept.png";
import close from "../../../assets/close.png";
import { useData } from '../../../DatasContext';
import { useNavigate } from 'react-router-dom';

function GameInvite() {
    const { InviteGame, setInviteGame } = useData();
    const navigate = useNavigate();
    const [showInvite, setShowInvite] = useState(true);

    if(!InviteGame || !InviteGame.senderName)
        return null;

    const handleAccept = () => {
        setShowInvite(false);
        navigate('/randomlyGame', {state: {sender: InviteGame.senderName, receiver: InviteGame.receiverName}});
    };

    const handleClose = () => {
        setShowInvite(false);
    };


    if (!showInvite)
        return;
    return (
        <div className="invites-container">
          <div className="notifsss_all">
            <div className="names">{InviteGame.senderName} Invite for a Game!</div>
            <div className="image">
              <img
                src={close} 
                alt="close" 
                style={{width: "30px", height: "30px"}}
                onClick={handleClose}
              />
              <img
                src={accept} 
                alt="accept" 
                style={{width: "30px", height: "30px"}}
                onClick={handleAccept}
              />
            </div>
          </div>
          <ToastContainer />
        </div>
      );
}

export default GameInvite;