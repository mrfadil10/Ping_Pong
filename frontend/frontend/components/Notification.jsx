import React, { useState, useEffect } from "react";
import api from "../api";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "../style/Notification.css";
import accept from "../assets/accept.png";
import close from "../assets/close.png";

import { useData } from "../DatasContext";

function Notification() {
  const { FriendReq } = useData();

  // État pour contrôler l'affichage de la notification
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Affiche la notification si `FriendReq` est disponible
    if (FriendReq?.senderName) {
      setIsVisible(true);

      // Cache la notification après 5 secondes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // 5000 ms = 5 secondes

      // Nettoie le timer au cas où le composant est démonté
      return () => clearTimeout(timer);
    }
  }, [FriendReq]);

  const handleAddFriend = () => {
    if (FriendReq) {
      api
        .post(
          `https://${window.location.hostname}/api/add_friend/${FriendReq.senderName}/`
        )
        .then((res) => {
          toast.success(res.data.success);
        })
        .catch((err) => {
          toast.error(err.response.data.error || "Error adding friend");
        });
    }
  };

  // Si la notification n'est pas visible, ne pas l'afficher
  if (!isVisible) {
    return null;
  }

  return (
    <div className="notifications-container">
      <div className="notifsss_all">
        <div className="names">{FriendReq.senderName} sent you a friend request!</div>
        <div className="image">
          <img
            src={close}
            alt="flag"
            style={{ width: "25px", height: "25px" }}
            onClick={() => setIsVisible(false)} // Cacher sur clic
          />
          <img
            src={accept}
            alt="flag"
            style={{ width: "25px", height: "25px" }}
            onClick={handleAddFriend}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Notification;
