import React from 'react';
import './LoseComp.css';
import '../GamePages/game';
import './popup.css';

const LoseComp = ({obj, text}) => {
  if (obj == null) {
    return (
      <div className="win_extra">
        <div className="win-screen">
          <div className="win-screen__container">
            <div className="win-screen__circle">
              <img src="/media/profile_images/avatar2_tICSu6O.png" alt="osarsar" className="win-screen__image" />
              <h1 className="win-screen_name">Player</h1>
            </div>
            <h1 className="win-screen__text">{text}</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
	<div className="lose_extra">
    <div className="lose-screen">
      <div className="lose-screen__container">
        <div className="lose-screen__circle">
          <img src={`https://${window.location.hostname}${obj.profile_image}`} alt="osarsar" className="lose-screen__image" />
		      <h1 className="lose-screen_name">{obj.username}</h1>
        </div>
        <h1 className="lose-screen__text">{text}</h1>
      </div>
    </div>
    </div>
  );
};

export default LoseComp;
