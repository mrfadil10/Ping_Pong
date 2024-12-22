import { useState, useEffect } from "react"
import axios from "axios";
import api from "../api"
import { Navigate, useNavigate } from "react-router-dom"
import "../style/Login.css"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import LoadingIndicator from "../components/LoadingIndicator"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "../pages/Register"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


function Login() {
  
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const STATE = import.meta.env.VITE_STATE;
  const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_VITE_GOOGLE_CLIENT_ID;


  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);


  const handleSignOutClick = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSubmit = async (e) => {
    setUsernameError(false);
    setPasswordError(false);
    
    if (!username) {
      toast.error("Username is required");
      setUsernameError(true);
      e.preventDefault();
      return;
    }
    if (!password) {
      toast.error("Password is required");
      setPasswordError(true);
      e.preventDefault();
      return;
    }
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(`https://${window.location.hostname}/api/token/`, {username, password});
      sendVerificationCode();
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      // navigate("/Profil");
    } catch (error) {
      toast.error("Username or Password incorrect. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
       // Appel de handleSubmit
    }
  };

  const handleKeyPress2 = (e) => {
    if (e.key === 'Enter') {
      verifyCode(e);
       // Appel de handleSubmit
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const result = await api.post(`https://localhost/api/auth/google/`, {
        id_token: response.credential,
      });
      localStorage.setItem(ACCESS_TOKEN, result.data.access);
      localStorage.setItem(REFRESH_TOKEN, result.data.refresh);
      navigate('/Profil'); // Rediriger après une connexion réussie
    } catch (error) {
      toast.error('Login failed:', error);
    }
  };

    const sendVerificationCode = () => {
    api.post(`https://${window.location.hostname}/api/send_code/`, { username })
        .then(response => {
            setStep(2);
        })
        .catch(error => {
          toast.error("Error sending verification code");
        });
    };

    const verifyCode = () => {
      api.post(`https://${window.location.hostname}/api/verify_code/`, { username, code })
          .then(response => {
              toast.success("Login success!");
              navigate("/Profil")     
          })
          .catch(error => {
              alert("Invalid verification code");
          });
  };

  const handleIntraLoginClick = () => {
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${STATE}`;
    window.location.href = authUrl;
  };

  return (
    // <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
    <div>
      <div>
        {showLogin && (
          <div className="blockl_all">
            <div className="block">
              <h1 className="create">Login to your account</h1>
              <div className="container">
                <div className="high">
                  <div className="pair">
                    <h4 className="username">Username</h4>
                    <input
                      className={`username ${usernameError ? 'input-error' : ''}`}
                      type="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your username"
                    ></input>
                  </div>
                  <div className="pair">
                    <h4>Password</h4>
                    <input
                      className={`password ${passwordError ? 'input-error' : ''}`}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your password"
                    ></input>
                    {/* <h4 className="forgot"><a href="#">forgot password?</a></h4> */}
                  </div>
                </div>
                <div className="low">
                  <h4>
                    <button className="login" onClick={handleSubmit}>
                      <h4>Login</h4>
                    </button>
                  </h4>
                  {error && <p className="error-message">{error}</p>}
                  {loading && <div className="spinner"></div>}

                  <div className="too_low">
                    <div className="sign">
                      <h4>Don't have an account?</h4>
                      <h4>
                        <button onClick={handleSignOutClick}>Sign up</button>
                      </h4>
                    </div>
                    <div>
                    <h4><button className="intra" onClick={handleIntraLoginClick}><h3>42 login intra</h3></button></h4> <br />
                      {/* <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => toast.error("Google login failed. Please try again.")}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        )}
        {showRegister && (
          <div className="overlay">
            <Register />
          </div>
        )}
      </div>
      {step === 2 && (
        <div className="verifyFA">
          <div className="content">

            <div ><h1>Verification Code</h1></div>
                    <div className="codess">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyPress={handleKeyPress2}
                        placeholder="Verification Code"
                        />
                      <button onClick={verifyCode}>Verify</button>
                    </div>
                </div>
          </div>
            )}
    </div>
    // </GoogleOAuthProvider>
  );
}

export default Login;
