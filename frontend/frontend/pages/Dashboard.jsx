import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { Navigate, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Dashboard.css"
import Search from "../components/Search";
import DashUser from "../components/DashUser";
import User from "../components/User";
import Chistory from "../components/Chistory";
import Achievement from "../components/Achievement";



function Dashboard() {
    // const [username, setUsername] = useState("");
    // const [level, setLevel] = useState(1);
    // const [percent, setPercent] = useState(1);
    // const [isOnline, setIsOnline] = useState(false);
    // const [image, setImage] = useState("");
    // const [friendUsername, setFriendUsername] = useState("");
    // const [friends, setFriends] = useState([]);
    // const [Dfriends, setDFriends] = useState([]);
    // const [searchUsername, setSearchUsername] = useState("");
    // const [searchResult, setSearchResult] = useState(null);
    // const navigate = useNavigate();

    // const [profile, setProfile] = useState(null); 

    // useEffect(() => {
    //     getUserProfile();
    // }, []);

    // const getUserProfile = () => {
    //     api
    //         .get(`http://${window.location.hostname}:8000/api/user/profile/`)
    //         .then((res) => {
    //             setProfile(res.data);
    //         })
    //         .catch((err) => toast.error(err));
    // };

    // if (!profile) {
    //     return <div></div>;
    // }

    return (
        <div className="dash_all">

            <div className="dright">
                <div className="dashuser"><DashUser/></div>
                <div className="nbra">
                    <div className="dtitle">Number of achievements</div>
                    <div className="nbr">6</div>
                </div>
                <div className="achievements"><Achievement/></div>
            </div>
            
            <ToastContainer />
        </div>    
    );
}

export default Dashboard;