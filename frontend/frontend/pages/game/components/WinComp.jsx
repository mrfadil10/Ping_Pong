import React from 'react';
import './WinComp.css';
import '../GamePages/game';
import './popup.css';

const WinComp = ({obj, text}) => {

  if (obj == null) {
    return (
      <div className="win_extra">
        <div className="win-screen">
          <div className="win-screen__container">
            <div className="win-screen__circle">
              <img src="/media/profile_images/avatar2_tICSu6O.png" alt="osarsar" className="win-screen__image" />
              <h1 className="win-screen_name">Winner</h1>
            </div>
            <h1 className="win-screen__text">{text}</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
	  <div className="win_extra">
      <div className="win-screen">
        <div className="win-screen__container">
          <div className="win-screen__circle">
            <img src={`https://${window.location.hostname}${obj.profile_image}`} alt="osarsar" className="win-screen__image" />
            <h1 className="win-screen_name">{obj.username}</h1>
          </div>
          <h1 className="win-screen__text">{text}</h1>
        </div>
      </div>
    </div>
  );
};

export default WinComp;
