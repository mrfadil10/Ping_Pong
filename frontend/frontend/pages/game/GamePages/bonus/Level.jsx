import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import "./style/Level.css";

function DashUser({ profile }) {
    const imageUrl = profile.profile_image
        ? `https://${window.location.hostname}${profile.profile_image}`
        : null;
    if (!profile) {
        return <div>Loading...</div>;
    }
    
    return (    
        <div className="user_all"> 
            <div className="profil">
                <div className="block_img">
                    <img src={imageUrl} alt="Profile" className="image"/>
                    <div className="on">
                        <div className="online"></div>
                        <p>Online</p>
                    </div>
                </div>
                <div className="block_user">
                    <h1 className="username">{profile.username}</h1>
                    <p className="level">Level {profile.level}</p>
                    <div className="percent-container">
                        <div className="percent-fill" style={{ width: `${profile.percent}%` }}></div>
                        <p className="percent-text">{profile.percent}%</p>
                    </div>
                </div>
            </div> 
        </div>      
    );
}

export default DashUser;
