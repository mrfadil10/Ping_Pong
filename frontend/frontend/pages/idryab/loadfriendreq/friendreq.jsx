import React, { useState, useEffect } from "react";
import api from "../../../api";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import "./friendreq.css"
import accept from "../../../assets/accept.png"
import close from "../../../assets/close.png"

function Friendreq({requester}) {


    if(!requester.username)
        return ;
    const handleAddFriend = () => {
        if(requester)
        {
            api.post(`https://${window.location.hostname}/api/add_friend/${requester.username}/`)
            .then((res) => {toast.success(res.data.success);})
            .catch((err) => {toast.error(err.response.data.error || "Error adding friend");});
        }
    };
    return (
        <div className="notif-card">
                <div><i>@{requester.username}</i> sent you a friend request!</div>
                <div className="image">
                    <img src={close} alt="flag" style={{width: "30px"}, {height: "30px"}} />
                    <img src={accept} alt="flag" style={{width: "30px"}, {height: "30px"}}  onClick={handleAddFriend}/>
                </div>
            <ToastContainer />
        </div>

    );
}

export default Friendreq;