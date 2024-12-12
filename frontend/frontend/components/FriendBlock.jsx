import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/Friends.css"
import { Link } from "react-router-dom";


import { useData } from '../DatasContext';

function FriendBlock({friendusername}) {
    const {user} = useData();
    
    const [friends, setFriends] = useState([]);
    const [Dfriends, setDFriends] = useState([]);
    const [friendprofile, setFriendprofile] = useState([]);

    useEffect(() => {
        api
            .get(`https://${window.location.hostname}/api/friend_profile/${friendusername}/`)
            .then((res) => {
                setFriendprofile(res.data);
            })
            .catch((err) => {
                toast.error("Error fetching friend profile");
            });
    }, [friendusername]);

    const handleUnblock = () => {
        if(friendusername)
            {
                api
                    .post(`https://${window.location.hostname}/api/unblock_friend/${friendusername}/`)
                    .then((res) => {
                        toast.success(res.data.success);
                    })
                    .catch((err) => {
                        toast.error("Error unblocking friend");
                    });

            }
    };
    const online_users = JSON.parse(localStorage.getItem("online_users"));
    online_users?.map((online_user) => {
        if(friendusername === online_user)
            friendprofile.is_online = true;
      });
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
                <div onClick={handleUnblock}><h1 className="remove">Unblock</h1></div>
            </div>
        </div>
    );
}

export default FriendBlock;