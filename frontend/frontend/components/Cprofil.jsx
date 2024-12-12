import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Cprofil.css";
import Friends from "../components/Friends";
import FriendReq from './FriendReq'
import FriendBlock from "./FriendBlock";

import { useData } from '../DatasContext';

function Cprofil({ profile }) {
    const {Notifs} = useData();
    const [allfriends, setAllfriends] = useState([]);

    useEffect(() => {
        api
            .get(`https://${window.location.hostname}/api/friends/`)
            .then((res) => {
                setAllfriends(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching friends list");
            });
    }, []);


    
    if (!profile) {
        return <div>Loading...</div>;
    }

    const [openfriends, setOpenFriends] = useState(true);
    const [openrequests, setOpenReq] = useState(false);
    const [openblock, setOpenBlock] = useState(false);

    const blocked_friends = [];
    profile.blocked_friends?.map((block_id) => {
        allfriends.map((blockedfr) => {
            if(blockedfr.id === block_id)
                blocked_friends.push(blockedfr.username)
        });
    });
    return (
        <div className="profil_alls">
            <div className="profil">
                <div className="block_img">
                    <img src={`https://${window.location.hostname}${profile.profile_image}`} alt="Profile" className="image"/>
                    <div className="on">
                    <div className={profile.is_online ? 'online' : 'offline'}></div>
                    <p>{profile.is_online ? "Online" : "Offline"}</p>
                    </div>
                    
                </div>

                <div className="block_user">
                    <h1 className="username">{profile.username}</h1>
                    <h1 className="level">Level {profile.level}</h1>
                    {/* <p className="percent">{profile.percent}%</p> */}
                    <div className="percent-container">
                        <div className="percent-fill" style={{ width: `${profile.percent}%` } }></div>
                        <p className="percent-text">{profile.percent}%</p>
                    </div>
                </div>
            </div>

            <div className="options">
                <div onClick={() => {setOpenFriends(true); setOpenReq(false); setOpenBlock(false);}}>Friends</div>
                <div onClick={() => {setOpenReq(true); setOpenFriends(false); setOpenBlock(false);}}>Requests</div>
                <div onClick={() => {setOpenBlock(true); setOpenFriends(false); setOpenReq(false);}}>Blocked</div>
            </div>


            {openfriends && (<div className="friendlist">
                {allfriends.map((friend) => (
                    <div key={friend.id}>
                        <div><Friends  friendusername={friend.username}/></div>
                    </div>
                ))}
            </div> )}
            {openrequests && (<div className="friendlist" >
                {Notifs.map((req, index) => (
                    <div key={index}>
                        <div><FriendReq  friendusername={req.username}/></div>
                    </div>
                ))}
            </div> )}
            {openblock && (<div className="friendlist" >
                {blocked_friends.map((blockedfr, index) => (
                    <div key={index}>
                        <div><FriendBlock  friendusername={blockedfr}/></div>
                    </div>
                ))}
            </div> )}
            <ToastContainer />
        </div>
    );
}

export default Cprofil;
