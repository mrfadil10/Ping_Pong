import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';


const MyDropdown = () => {
  const [ShowDropDown, setShowDropDown] = useState(false);

  const handleClick = (event) => {
    setShowDropDown(true);
  };

  return (
    <div>
        <div onClick={handleClick}><FontAwesomeIcon icon={faEllipsis} className="file-icon" /></div>
        {ShowDropDown ? <div>
            <p>Block</p>
            <p>Invite</p>
        </div> : null}
    </div>
  );
};

export default MyDropdown;