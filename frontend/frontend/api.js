import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: `https://${window.location.hostname}/api`
});

// Interceptor pour ajouter le token au header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor pour gérer l'expiration du token et le rafraîchissement
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config; // Requête originale
        // Si l'erreur est une 401 (token expiré)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marque cette requête comme étant déjà réessayée
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                // Demander un nouveau access token avec le refresh token
                const res = await axios.post(`https://${window.location.hostname}/api/token/refresh/`, {
                    refresh: refreshToken
                });
                
                // Si le rafraîchissement du token est réussi, on met à jour le localStorage
                const newAccessToken = res.data.access;
                localStorage.setItem(ACCESS_TOKEN, newAccessToken);

                // Réessayer la requête originale avec le nouveau token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (err) {
                // Si le refresh token est invalide ou si une autre erreur se produit
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                toast.error("Votre session a expiré. Veuillez vous reconnecter.");
                window.location.href = "/"; // Redirige vers la page de connexion
            }
        }
        return Promise.reject(error);
    }
);

export default api;