import React from "react";
import "../style/Rank1.css"
import Rank2 from '../components/Rank2';
import Rank3 from '../components/Rank3';

function Rank2And3({ userRank2, profileRank2, userRank3, profileRank3 }) {
    return (
        <div className="rank2-3">
            <div className="rank3">
                <Rank3 
                    user={userRank3} 
                    profile={profileRank3} 
                />
            </div>
            <div className="rank2">
                <Rank2 
                    user={userRank2} 
                    profile={profileRank2} 
                />
            </div>
        </div>
    );
}

export default Rank2And3;