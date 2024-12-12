import React from "react";
import "../style/Rank2.css"
import tropher from "../assets/second.png"
import { Link } from "react-router-dom";



function Rank2({ user }) {

    return (
        <div className="second-rank">
            <div className="rank">{user.score}</div>
            <div className="middle">
            <div><Link to={`/friend_profile/${user.username}`} className="username" style={{ textDecoration: 'none' }}>{user.username}</Link></div>
                <div><img src={`https://${window.location.hostname}${user.profile_image}`} alt="flag" className="image"/></div>
            </div>
            <div ><img src={tropher} alt="flag" className="tropher"/></div>
        </div>
    );
}

export default Rank2;
