import React,  { useEffect, useState } from 'react';
import './conversation.css';
import { Link } from 'react-router-dom';

const Conversation = ({ friend, status }) => {
  const online_users = JSON.parse(localStorage.getItem("online_users"));
  online_users?.map((online_user, index) => {
    if(friend.username === online_user)
      status = true;
  });

  return (
    <div className="conv-card">
      <div className="profile-picture-container">
      <img src={friend.profile_image} alt="Profile" className="profile-picture" />
      </div>
      <div className="conv-info">
        {/* <h3 className="conv-name">{friend.username}</h3> */}
        <Link to={`/friend_profile/${friend.username}`} className="username" style={{ textDecoration: 'none' }}>{friend.username}</Link>
        {/* <span>{status ? 'Online' : 'Offline'}</span> */}
        {friend.is_blocked ? <span>blocked</span> : <span>{status ? 'Online' : 'Offline'}</span>}
      </div>
    </div>
  );
};

export default Conversation;