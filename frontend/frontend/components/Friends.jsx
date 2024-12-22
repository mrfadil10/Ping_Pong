import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/Friends.css"
import { Link } from "react-router-dom";
import { useData } from '../DatasContext';


function Friends({friendusername}) {
    
    const [friends, setFriends] = useState([]);
    const [Dfriends, setDFriends] = useState([]);
    const [friendprofile, setFriendprofile] = useState([]);
    const {user, sendJsonMessage} = useData();
    const navigate = useNavigate();



    useEffect(() => {
        api
            .get(`https://${window.location.hostname}/api/friend_profile/${friendusername}/`)
            .then((res) => {
                setFriendprofile(res.data);
            })
            .catch((err) => {
                // console.error(err);
                toast.error("Error fetching friend profile");
            });
    }, [friendusername]);

    const handleRemoveFriend = (friendusername) => {
        api
            .post(`https://${window.location.hostname}/api/remove_friend/${friendusername}/`)
            .then((res) => {
                toast.success(res.data.success);
            })
            .catch((err) => {
                toast.error(err.response.data.error || "Error removing friend");
            });
    };

    const iviteToGame = () => {
        navigate('/randomlyGame', {state: {sender: user.username, receiver: friendprofile.username}});
      };

    //================ idryab added this section below ====================
    const online_users = JSON.parse(localStorage.getItem("online_users"));
    online_users?.map((online_user) => {
        if(friendusername === online_user)
            friendprofile.is_online = true;
      });
    //================ idryab added this section above ====================
    return (
        <div className="friends">
            <div className="users">
                <div className="on">
                    <img src={friendprofile.profile_image} alt="Profile" className="image" style={{ width: "50px", height: "50px" }}/>
                    <div className={friendprofile.is_online ? 'online' : 'offline'}></div>
                </div>
                <h1><Link to={`/friend_profile/${friendusername}`} className="fname" style={{ textDecoration: 'none' }}>{friendprofile.username}</Link></h1>
            </div>
            <div className="option">
                <h1 onClick={() => {
             sendJsonMessage(
                {
                    message: "let's play, homie!",
                    sender: user.username,
                    receiver: friendprofile.username,
                    typeofmsg: "invite_to_game",
                });
            iviteToGame(); }} className="request">Request</h1>
                
                <div onClick={() => handleRemoveFriend(friendprofile.username)}><h1 className="remove">Remove</h1></div>
            </div>
        </div>
    );
}

export default Friends;