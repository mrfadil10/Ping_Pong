import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect} from 'react';
import api from "../../../api";
import { ToastContainer, toast } from 'react-toastify';
import './searchBar.css';
import MsgCard from '../msgCard/msgCard';

const SearchBar = () => {
  const [friendFound, setfriendFound] = useState("");
  const [friendUsername, setfriendUsername] = useState(null);
  const getFriendUsername = (event) => {
    setfriendUsername(event.target.value);
  };
  const getFriend = () => {
    api.get(`https://${window.location.hostname}/api/friend_profile/${friendUsername}`)
    .then((res) => {
      setfriendFound(res.data);
    })
    .catch((err) => {
      toast.error("No friend with this name");
    });
  }

  return (
    <div className="search-card">
      <div className="search-picture-container">
        <FontAwesomeIcon icon={faSearch} className="search-picture" onClick={getFriend}/>
      </div>
      <div className="search-info">
        <input type="text" placeholder='Search' onChange={getFriendUsername} />
        <div className="found-card">
        {friendFound ? 
          <MsgCard
            userName={friendFound.username}
          />
        : null}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;