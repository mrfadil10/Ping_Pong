import { useLocation } from "react-router-dom";
import Navbars from "../components/Navbars"; // Assume your Navbar component is here

function Navcon() {
  const location = useLocation(); // Hook pour obtenir le chemin actuel

  // Afficher la Navbar uniquement pour les pages suivantes :
  const showNavbar = [
    "/Profil",
    "/friend_profile",
    "/Settings",
    "/LeaderBoard",
    "/game",
    "/Chat",
    "/PrivacyPolicy",
    "/Dashboard",
    "/RestoreAccount"
  ].some(path => location.pathname.startsWith(path));

  return showNavbar ? <Navbars /> : null;
}

export default Navcon;
