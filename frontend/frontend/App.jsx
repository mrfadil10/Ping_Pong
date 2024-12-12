import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profil from "./pages/Profil";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import UserProfil from "./pages/UserProfil";
import Settings from "./pages/Settings";
import LBoard from "./pages/LeaderBoard";
import RestoreAccount from "./pages/RestoreAccount";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatComp from './pages/idryab/chat/chat';
import Navcon from "./components/Navcon";
import Notification from "./components/Notification";
// Game
import Game_Pages from './pages/game/GamePages/firstPage';
import Locale_Game from './pages/game/GamePages/localeGame';
import Solo_Game from './pages/game/GamePages/soloGame';
import Randomly_Game from './pages/game/GamePages/copyRa';
import Show from './pages/game/GamePages/tournament/show';
import TournamentSetup from './pages/game/GamePages/tournament/TournamentSetup';
import Tournament from './pages/game/GamePages/tournament/tournament';
import Statistics from './pages/game/GamePages/bonus/statistics';
import GameInvite from "./pages/idryab/GameInvite/gameInvite";
// Game

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

//import DatasContext
import { DatasProvider } from './DatasContext'


function App() {
  const isSpecialRoute = ["/Profil", "/Settings", "/LeaderBoard"].includes(location.pathname);
  
  return (
    <div className="app_special">
      <DatasProvider>

        <BrowserRouter>
        <div>

        <ProtectedRoute>

          <Navcon/>
          <div className="nofis">
            <Notification/>
          </div>
          <div className="nofis">
            <GameInvite/>
          </div>
        </ProtectedRoute>
        </div>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Profil" element={<ProtectedRoute><Profil/></ProtectedRoute>} />
            <Route path="/friend_profile/:username" element={<ProtectedRoute><UserProfil/></ProtectedRoute>} />
            <Route path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/LeaderBoard" element={<ProtectedRoute><LBoard /></ProtectedRoute>} />
            <Route path="/RestoreAccount" element={<ProtectedRoute><RestoreAccount /></ProtectedRoute>} />
            <Route path="/PrivacyPolicy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
            <Route path="/Chat" element={<ProtectedRoute><ChatComp /></ProtectedRoute>} />
            <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
            {/* Game */}
            <Route path="/localeGame" element={<ProtectedRoute><Locale_Game /></ProtectedRoute>} />
            <Route path="/soloGame" element={<ProtectedRoute><Solo_Game /></ProtectedRoute>} />
            <Route path="/randomlyGame" element={<ProtectedRoute><Randomly_Game /></ProtectedRoute>} />
            <Route path="/game" element={<ProtectedRoute><Game_Pages /></ProtectedRoute>} />
            {/* Game Tournament */}
            <Route path="/tournamentSetup" element={<ProtectedRoute><TournamentSetup /></ProtectedRoute>} />
            <Route path="/show" element={<ProtectedRoute><Show/></ProtectedRoute>} />
            <Route path="/tournament" element={<ProtectedRoute><Tournament /></ProtectedRoute>} />
            {/* Game Bonus */}
            <Route path="/Dashboard" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
          </Routes>
        </div>
        </BrowserRouter>

      </DatasProvider>
    </div>
  );
}

export default App;
