import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "./api";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DatasContext = createContext();

export const DatasProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [Notifs, setNotifications] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [players, setPlayers] = useState(['','','','','','','','']);
  const [winners, setWinners] = useState(['?', '?', '?','?','?','?','?']);
  const [next, setNext] = useState(0);
  const [color, setColor] = useState("black");
  const [round, setRound] = useState(5);
  const [i, setI] = useState(0);


  const getUserProfile = async () => {
    try {
      const res = await api.get( `https://${window.location.hostname}/api/user/profile/`);
      res.data.is_online = true;
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) { toast.error(err);}
  };
  
  const loadNotifications = async () => {
    try {
      const res = await api.get( `https://${window.location.hostname}/api/loadnotifications/`);//loadnotifications/
      setNotifications(res.data);
    } catch (err) { toast.error(err);}
  };
  
  //======================== Check user if authed, then fetch the profile and laod notificationzzz from DB========================
  useEffect(() => {
    if (isAuthenticated && !user)
      getUserProfile();
    if (isAuthenticated && Notifs.length === 0)
      loadNotifications();
  }, [isAuthenticated]); 
  
  //===============================================================================================

  
  const userObj = localStorage.getItem("user");
  useEffect(() => {
    if (userObj)
      setUser(JSON.parse(userObj));
  }, []);
  
  const [datas, setDatas] = useState([]);
  const [FriendReq, setFriendReq] = useState([]);
  const [InviteGame, setInviteGame] = useState([]);
  const wsUrl = user?.username ? `wss://${window.location.hostname}/api/ws/prvchat/${user?.username}/` : null;

  const { sendJsonMessage, getWebSocket } = useWebSocket(wsUrl, {
    onOpen: () => {
      // console.log("WS Connected!"); 
      console.log("");
    },
    onClose: () => {
      // console.log("WS Disconnected!");
      console.log("");
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      if(data.typeofmsg === "friend_request")
        setFriendReq(data);
      else if(data.typeofmsg === "invite_to_game")
        {
          setInviteGame(data);
        }
      else if(data.typeofmsg === "status_update")
        localStorage.setItem('online_users', JSON.stringify(data?.online_users || []));
      else
        setDatas((prevMessages) => [...prevMessages, data]);
    }
  });
    useEffect(() => {
      return () => {
        const socket = getWebSocket();
        if (socket) socket.close();
      };
    }, [sendJsonMessage, getWebSocket]);

  return (
    <DatasContext.Provider value={{ datas, setDatas, FriendReq, InviteGame, Notifs, user, setUser, isAuthenticated, setIsAuthenticated, sendJsonMessage, currentRound, setCurrentRound
      , players, setPlayers, winners, setWinners, color, setColor, round, setRound, next, setNext, i, setI
      }}>
        {children}
      </DatasContext.Provider>
  );
};

export const useData = () => useContext(DatasContext);
