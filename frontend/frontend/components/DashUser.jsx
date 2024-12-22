import React, { useState, useEffect } from "react";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/DashUser.css";
import Friends from "../components/Friends";


import { useData } from '../DatasContext';
function DashUser() {
    const {user} = useData();
    
    const [friends, setFriends] = useState([]);
    const [images, setImages] = useState([]);

    const imageUrl = user?.profile_image
        ? `https://${window.location.hostname}${user.profile_image}`
        : null;

    useEffect(() => {
        api
            .get(`https://${window.location.hostname}/api/friends/`)
            .then((res) => {
                setFriends(res.data);
            })
            .catch((err) => {
                toast.error("Error fetching friends list");
            });
    }, []);


    
    if (!user) {
        return <div>Loading...</div>;
    }

    
    return (    
        <div className="user_all">  
            <div className="profil">
                <div className="block_img">
                    <img src={imageUrl} alt="Profile" className="image"/>
                    <div className="on">
                        <div className={user.is_online ? 'online' : 'offline'}></div>
                        <p>{user.is_online ? "Online" : "Offline"}</p>
                    </div>
                </div>
                <div className="block_user">
                    <h1 className="username">{user.username}</h1>
                    <p className="level">Level {user.level}</p>
                    <p className="percent">{user.percent}%</p>
                </div>
            </div> 
        </div>      
    );
}

export default DashUser;
