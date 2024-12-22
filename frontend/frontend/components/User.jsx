import React, { useState, useEffect } from "react";
import api from "../api";
import { useData } from '../DatasContext';
import "../style/User.css";

function User({ friendprofile }) {
    const { user, sendJsonMessage } = useData();
    const [showrequest, setShowrequest] = useState(true);
    const [friendreqstate, setFriendReqState] = useState('Default');

    const handlefriendrequest = () => {
        setShowrequest(false);
        sendJsonMessage({
            message: "send a friend request",
            sender: user.username,
            receiver: friendprofile.username,
            typeofmsg: "friend_request",
        });
    };

    useEffect(() => {
        if (friendprofile.username) {
            api.get(`https://${window.location.hostname}/api/friendreq_state/${friendprofile?.username}/`)
                .then((res) => {
                    setFriendReqState(res.data.FriendReqState);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [friendprofile]);

    const online_users = JSON.parse(localStorage.getItem("online_users"));
    online_users?.map((online_user) => {
        if(friendprofile.username === online_user)
            friendprofile.is_online = true;
      });

    return (
        <div className="users_all">
        <div className="profil">
            <div className="block_img">
                <img src={friendprofile.profile_image} alt="Profile" className="image" />
                <div className="on">
                    <div className={friendprofile.is_online ? 'online' : 'offline'}></div>
                    <p>{friendprofile.is_online ? "Online" : "Offline"}</p>
                </div>
            </div>
            <div className="block_user">
                <h1 className="username">{friendprofile.username}</h1>
                {/* Conditional rendering based on friend state and username comparison */}
                {friendprofile.username === user.username ? (
                    <h4 className="mine">Mine</h4>
                ) : (
                    <>
                        {showrequest && friendreqstate === 'Default' && (
                            <button className="add" onClick={handlefriendrequest}>Request</button>
                        )}
                        {showrequest && friendreqstate === 'Pending' && (
                            <h4 className="pending">Pending...</h4>
                        )}
                        {showrequest && friendreqstate === 'Accepted' && (
                            <h4 className="pending">Friends</h4>
                        )}
                    </>
                )}
                <p className="level">Level {friendprofile.level}</p>
                <div className="percent-container">
                    <div className="percent-fill" style={{ width: `${friendprofile.percent}%` }}></div>
                    <p className="percent-text">{friendprofile.percent}%</p>
                </div>
            </div>
        </div>
    </div>
);
}
export default User;