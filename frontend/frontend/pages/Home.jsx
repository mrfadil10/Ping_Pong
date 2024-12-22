import { useEffect, useState, useRef } from "react";
import "../style/Home.css";
import logo from "../assets/logo.svg";
import home from "../assets/ho.jpeg";
import home1 from "../assets/homo1_1.svg";
import home3 from "../assets/homo2.svg";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Navigate, useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";



function Home() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    
    const modalRef = useRef();

    const handleSignInClick = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const handleCloseLogin = () => {
        setShowLogin(false);
    };

    const handleSignOutClick = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const handleCloseRegister = () => {
        setShowRegister(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowLogin(false);
                setShowRegister(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const [code, setCode] = useState("");
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setCode(params.get("code"));
        if (code) {
          handleIntraOAuthCallback(code);
        }
      }, [code]);
      
      const handleIntraOAuthCallback = async (code) => {
        try {
          const res = await axios.post(`https://${window.location.hostname}/api/auth/intra/`, {code});
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
          navigate("/Profil");
        } catch (error) {
          toast.error("42 login failed.");
        }
      };
    
    return (
        <div className="home_all">
            <div className="nav">
                <img src={logo} alt="Profile"></img>
                <div className="sign">
                    <h4><button onClick={handleSignOutClick}>Sign up</button></h4>
                    <h4><button onClick={handleSignInClick}>Sign in</button></h4>
                </div>
            </div>
            <div className="font_all">

            <div className="font">
                <div className="left">
                    <div>
                        <div className="title">
                            <div>Welcome To</div>
                            <div className="gamess">PingPong Game</div>
                        </div>
                        <div className="text">
                            <div>The must-play experience that guarantees hours of fun.</div>
                            <div>Try it, and you'll be hooked!</div>
                        </div>
                    </div>
                    <div className="button">
                        <button onClick={handleSignInClick}>Play now</button>
                    </div>
                    <div className="waiting-container2">
                        <div className="ping-pong-animation2">
                            <div className="paddleleft2"></div>
                            <div className="ball2"></div>
                            <div className="paddleright2"></div>
                        </div>
                </div>  
                </div>
                <div className="right">
                    <img className="home1" src={home3} alt="Profile"></img>
                    <img className="home3" src={home1} alt="Profile"></img>
                </div>
            </div>
            </div>
            <div className="animation" ref={modalRef}>
                {(showLogin || showRegister) && (
                    <div className="overlays" onClick={() => { setShowLogin(false); setShowRegister(false); }}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {showLogin && <Login onClose={handleCloseLogin} />}
                            {showRegister && <Register onClose={handleCloseRegister} />}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Home;
