import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './popup.css';
import '../GamePages/game';
import api from "../../../api";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



import { useData } from '../../../DatasContext';

const FriendsList = ({ isOpen, onClose }) => {
	const {user, sendJsonMessage} = useData();
	const [searchTerm, setSearchTerm] = useState('');
	const [friends, setFriends] = useState([]);

	useEffect(() => {
        api
            .get(`https://${window.location.hostname}/api/friends/`)
            .then((res) => {
                setFriends(res.data);
            })
            .catch((err) => {
                // console.error(err);
                toast.error("Error fetching friends list");
            });
    }, []);


	

	const [searchResults] = useState([
	  { id: 5, name: 'rakarid', status: 'Invite' },
	  { id: 6, name: 'arachda', status: 'Invite' },
	  { id: 7, name: 'Laymane', status: 'Invite' },
	  { id: 8, name: 'stemsama', status: 'Invite' },
	]);



	if (!isOpen) return null;
    //Game
    const navigate = useNavigate();
    const iviteToGame = (friendusername) => {
      navigate('/randomlyGame', {state: {sender: user.username, receiver: friendusername}});
    };
    //Game
	return (

	  <div className="modal-overlay">
		<div className="friends-list-popup">
		  <div className="search-container">
			<input
			  type="text"
			  placeholder="search for friends"
			  value={searchTerm}
			  onChange={(e) => setSearchTerm(e.target.value)}
			  className="search-input"
			/>
			<Search className="search-icon" size={15} />
			{searchTerm && (<button onClick={() => setSearchTerm('')} className="clear-search-button"> <X size={20} /></button>)}
		  </div>

		  <h2 className="friends-title">Friends</h2>

		  <div className="friends-list">
			{friends.map((friend) => (
				<div key={friend.id} className="friend-item">
				<div className="friend-info">
					<div className="friend-avatar"></div>
					<span>{friend.username}</span>
				</div>
				<button className={`friend-status ${friend.is_online === 'Sending ...' ? 'sending' : ''}`} onClick={() => {
						sendJsonMessage(
						{
							message: "let's play, homie!",
							sender: user.username,
							receiver: friend.username,
							typeofmsg: "invite_to_game",
						}
						);iviteToGame(friend.username);}} > invite
				</button>
			  </div>
			))}
		  </div>

		  {searchTerm && (
			<div className="search-results">
			  {searchResults.map((result) => (
				<div key={result.id} className="search-result-item">
				  <div className="friend-info">
					<div className="friend-avatar small"></div>
					<span>{result.name}</span>
				  </div>
				  <button className="friend-status">{result.status}</button>
				</div>
			  ))}
			</div>
		  )}

		  <div className="button-container">
			<button onClick={onClose} className="action-button cancel">Cancel</button>
			<button className="action-button continue">Continue</button>
		  </div>
		</div>
		<ToastContainer />
	  </div>
	);
  };

  export default FriendsList;
