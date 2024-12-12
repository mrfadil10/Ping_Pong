import React from 'react';
import './header.css';

const Header = ({profilePicture}) => {
  return (
    <div className="header-card">
        <img src={profilePicture} alt="Profile" className="profile-picture" />
      <div className="header-info">
        <h3 className="header-name">Chats</h3>
      </div>
    </div>
  );
};

export default Header;