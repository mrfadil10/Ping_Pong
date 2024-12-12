import React from 'react';
import api from "../../../api";
import {toast } from 'react-toastify';
import { useEffect, useState} from 'react';
import MsgCards from '../msgCard/mgsCards';
import "./allfriends.css"

const AllFriends = ({selectUser}) => {
    const [friends, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
            const response = await api.get(`https://${window.location.hostname}/api/allfriendz/`)
            setUsers(response.data);
            } catch (error) {toast.error("Error fetching friends list");}
        };
        fetchUsers();
    }, []);
  return (
    <div className="friends_container">
    <ul>
      {friends ? (friends.map((friend, index) => (
        <li key={index} onClick={() => selectUser(friend)}>
          <MsgCards friend={friend} status={false}/>
        </li>
      )) ) : null}
    </ul>
  </div>
  );
};

export default AllFriends;