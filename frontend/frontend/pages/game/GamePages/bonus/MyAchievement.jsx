import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import win from "./../../../../assets/win.png"
import first from "./../../../../assets/badge1.png"
import second from "./../../../../assets/badge2.png"
import third from "./../../../../assets/badge3.png"
import winner from "./../../../../assets/winner.png"
import gold from "./../../../../assets/gold.png"
import silver from "./../../../../assets/silver.png"
import participation from "./../../../../assets/participation.png"
import bronze from "./../../../../assets/bronze.png"
import "./style/MyAchievement.css"


function Achievement({profile}) {
    const achievements = profile.achievements + 1;
    
    const achievementImages = [
        participation,
        win,
        bronze,
        silver,
        gold,
        third,
        second,
        first,
        winner,
    ];

    return (
        <div className="Myachievement">
            <div className="title">Achievement</div>
            <div className="tropher">
                {achievementImages.slice(0, achievements).map((image, index) => (
                    <div key={index}>
                        <img src={image} alt={`Achievement ${index + 1}`} style={{ width: "120px", height: "120px" }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Achievement;