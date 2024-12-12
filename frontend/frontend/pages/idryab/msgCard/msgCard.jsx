import React from 'react';
import { ToastContainer } from 'react-toastify';
import './msgCard.css';


const MsgCard = ({friend, status, selectuser}) => {
  const online_users = JSON.parse(localStorage.getItem("online_users"));
  online_users?.map((online_user, index) => {
    if(friend.username === online_user)
      status = true;
  });
  if(friend.username === selectuser?.username)
    friend.mes_count = null;

  return (
    <div className="user-card">
      <div className="ppc">
        <img src={friend.profile_image} alt="Profile" className="prfpicture" />
        <div className={`status-indicator ${status ? 'online' : 'offline'}`}></div>
      </div>

      <div className="user-info">
        <h5 className="user-name">{friend.username}</h5>
        {/* {friend.is_blocked ? <span className='new-msg'>(blocked)</span> : null} */}
        {/* {friend.mes_count ? <span className='new-msg'>{friend.mes_count}</span> : null} */}
      </div>

      <ToastContainer />
    </div>
  );
};

export default MsgCard;