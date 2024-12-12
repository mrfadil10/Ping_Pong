import React from 'react';
import './MsgBubble.css';

const MsgBubble = ({ profilePicture, messages }) => {
  const timestamp = messages.timestamp;
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const msgtime = `${hours}:${minutes}`;
  return (
    <div className='msg-bubble'>
      {profilePicture && messages ? (
        <img src={profilePicture} alt="Profile picture" className="senderIcon" />) : <></>}
      {messages ? (
        <div className='msg-body'>
            <p>{messages.content}</p>
            {messages.is_blocked ? <span className='blocked-convo'>blocked conversation!</span> : <span>{msgtime}</span>}
        </div>) : <></>}
    </div>
  );
};

export default MsgBubble;