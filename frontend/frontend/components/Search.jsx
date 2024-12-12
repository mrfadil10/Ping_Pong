import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Search.css";
import notif from "../assets/notif.png"


import LoadFriendreq from "../pages/idryab/loadfriendreq/laodfriendreq";
function Search() {
    const [searchUsername, setSearchUsername] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchUsername.trim() !== "") {
            navigate(`/friend_profile/${searchUsername}`);
            setSearchUsername("");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="search">
            {open === true && <LoadFriendreq/>}
            <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Search"
                onKeyDown={handleKeyDown}
            />
            <div className="notif_full">
                <img src={notif} alt="flag" style={{ width: "40px", height: "40px" }} className="notif"/>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Search;
