import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN} from "../constants";

function ProtectedRoute({ children }) {
  const [isDeleted, setIsDeleted] = useState(null); // État pour savoir si l'utilisateur est supprimé
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Vérifie si l'utilisateur est authentifié
  const navigate = useNavigate();
  const location = useLocation(); // Pour récupérer l'URL actuelle

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (token) {
        setIsAuthenticated(true); // L'utilisateur est authentifié s'il a un token
        try {
          const userStatus = await axios.get(`https://${window.location.hostname}/api/user/is_deleted/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          // Si le compte est supprimé, redirige vers la page de réactivation
          if (userStatus.data.is_deleted) {
            setIsDeleted(true);
            if (location.pathname !== "/RestoreAccount") {
              navigate("/RestoreAccount"); // Redirection vers la page de réactivation
            }
          } else {
            setIsDeleted(false); // Si le compte n'est pas supprimé
            // Si l'utilisateur essaie d'aller sur la page de réactivation, rediriger ailleurs
            if (location.pathname === "/RestoreAccount") {
              navigate("/"); // Par exemple, redirige vers la page d'accueil
            }
          }
        } catch (error) {
          // console.error("Error fetching user status:", error);
          setIsDeleted(false); // En cas d'erreur, on suppose que l'utilisateur n'est pas supprimé
        }
      } else {
        setIsAuthenticated(false); // Si aucun token, l'utilisateur n'est pas authentifié
      }
    };

    checkUserStatus();
  }, [navigate, location]); // Re-exécuter lorsque navigate ou location change

  // Si l'utilisateur est authentifié et son compte n'est pas supprimé, autoriser l'accès à la route protégée
  if (isAuthenticated && isDeleted === false) {
    return children; // Afficher la route protégée
  }

  // Si l'utilisateur est authentifié et son compte est supprimé, on affiche la page protégée aussi
  if (isAuthenticated && isDeleted === true) {
    return children; // Afficher la route protégée
  }

  // Si l'utilisateur n'est pas authentifié ou si son compte est supprimé, rediriger
  return null; // Affiche rien tant que l'état de l'utilisateur n'est pas encore déterminé
}

export default ProtectedRoute;
