import React from 'react';
import './../GameCss/App.css';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from "../../../api";
import WinComp from '../components/WinComp'
import LoseComp from '../components/LoseComp'
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useData } from '../../../DatasContext';
import { useNavigate } from 'react-router-dom';

const SoloPage = () => {
    const location = useLocation();
    const { sender = null, receiver = null } = location.state || {};
    // const { color, round } = location.state || {};
	const {color} = useData();
	const {round} = useData();
    const [score_max, setScoreMax] = useState(round || 5);
    const navigate = useNavigate();
    const [winner, setWinner] = useState();
    const table_color = color || "#000";
    let white = "#fff";
    if (table_color == "white")
        white = "#000";
    const canvasRef = useRef(null);
    // const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState({
        canvas: { width: 800, height: 500 },
        ball: { x: 400, y: 250, radius: 10 },
        paddles: {
            user1: { y: 200, height: 100 },
            user2: { y: 200, height: 100 }
        },
        scores: { user1: 0, user2: 0 },
        status: 'waiting', // waiting, running, finished
        winner: 'none'
    });
    const [readyToPlay, setReadyToPlay] = useState(false);

    const [username, setUsername] = useState(null);
    const [image, setImage] = useState("");
    const [user, setUser] = useState(null);
    //======================== Check user if authed, then fetch the profile ========================
    const [data, setData] = useState(null);
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const getUserProfile = async () => {
        try {
        const res = await api.get( `https://${window.location.hostname}/api/user/profile/`);
        setUsername(res.data.username);
        setUser(res.data);
        setImage(res.data.profile_image);
        } catch (err) { toast.error(err);}
    };
  
    useEffect(() => {
      // Check for access token
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        setIsAuthenticated(true);
        getUserProfile();
      }
    }, []);
    //===============================================================================================
        let all_names = username+"_"+sender+"_"+receiver;
        let wsUrl;
        if (sender || receiver)
            wsUrl = username ? `wss://${window.location.hostname}/api/ws/pong/${all_names}/` : null;
        else
            wsUrl = username ? `wss://${window.location.hostname}/api/ws/pong/${username}/` : null;
        const { readyState, sendJsonMessage } = useWebSocket(wsUrl, {
        onOpen: () => {
                setReadyToPlay(true);
                sendJsonMessage( {
                    type: 'score_max',
                    score_max: score_max,
                });
            },
            onClose: () => {
            // console.log("WebSocket connection closed!");
            console.log("");
        },
        
        onMessage: (e) => {
            const data = JSON.parse(e.data);
            // console.log('data', data);
            setGameState(prevState => ({
                ...prevState,
                ...data,
            }));
            setData(data);
            // If the server has determined the final score_max, update the score_max state
            if (data.score_max) {
                setScoreMax(data.score_max);
            }
        }
        }
    );
    // setSocket(readyState);

    useEffect(() => {
        renderGame();
    }, [gameState]);


    const infos = {
        net_x: 0,
        net_y: 0,
        net_width: 2,
        net_height: 10,
        net_color: white,
        paddles_color: "#bc79dc",
        ball_color: "#bc79dc",
        ball_shasow_color: "#beaeb1",
    };

    const drawRoundedRect = (ctx, x, y, width, height, color, radius, left_right, shadowColor) => {
        ctx.save();
        if (shadowColor) {
            ctx.shadowColor = shadowColor; // Set shadow color
            ctx.shadowBlur = 10; // Adjust blur for the shadow
            if (left_right == "right")
                ctx.shadowOffsetX = -5; // Horizontal offset of shadow
            else
                ctx.shadowOffsetX = 5; // Horizontal offset of shadow
            ctx.shadowOffsetY = 5; // Vertical offset of shadow
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore(); // Restore the context to remove shadow for subsequent elements
    };


    const drawNet = (ctx) => {
        if (table_color === 'white') {
            infos.net_color = 'black';
        }
        // Draw the net
        const netX = gameState.canvas.width / 2 - infos.net_width / 2;
        const netY = 20; 
        const netWidth = infos.net_width; 
        const netHeight = gameState.canvas.height - 2 * 20;
        drawRoundedRect(ctx, netX, netY, netWidth, netHeight, infos.net_color, 2);
        // Draw the circle in the middle of the table
        const circleX = gameState.canvas.width / 2; 
        const circleY = gameState.canvas.height / 2; 
        const circleRadius = 70; 
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2); 
        ctx.strokeStyle = infos.net_color; 
        ctx.lineWidth = infos.net_width; 
        ctx.stroke();
    };

    const drawText = (ctx, text, x, y, color, size) => {
        ctx.fillStyle = color;
        ctx.font = `bold ${size}px Arial, sans-serif`;
        ctx.fillText(text, x, y);
    };
    const drawArc = (ctx, x, y, r, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    const drawRect = (ctx, x, y, w, h, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    };
    const renderGame = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas || !ctx) return;
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRect(ctx, 0, 0, canvas.width, canvas.height, table_color);

        // Draw net
        drawNet(ctx);
        // Draw scores
        drawText(ctx, gameState.scores.user1, canvas.width / 4, canvas.height / 8, '#bc79dc', 48);
        drawText(ctx, gameState.scores.user2, canvas.width * (3 / 4), canvas.height / 8, '#bc79dc', 48);
        drawArc(ctx, gameState.ball.x, gameState.ball.y,gameState.ball.radius,infos.ball_color);
        // Draw paddles
    
        drawRoundedRect(ctx, 5, gameState.paddles.user1.y, 10, gameState.paddles.user1.height, infos.paddles_color, 5, "left", "#cca6d3");
        drawRoundedRect(ctx, canvas.width - 15, gameState.paddles.user2.y, 10, gameState.paddles.user2.height, infos.paddles_color, 5, "right", "#cca6d3");
        //pause 2 seconds
        if (gameState.scores.user1 == score_max){
            drawText(ctx, "Winner Is User 1", canvas.width / 4, canvas.height / 2, white, 48);
            setWinner(gameState.paddles.user1.name);
            setTimeout(() => {
                navigate('/game'); // Redirection vers la page de jeu
            }, 3000);
        }
        if (gameState.scores.user2 == score_max){
            drawText(ctx, "Winner Is User 2", canvas.width / 4, canvas.height / 2, white, 48);
            setWinner(gameState.paddles.user2.name);
            setTimeout(() => {
                navigate('/game'); // Redirection vers la page de jeu
            }, 3000);
        }
    };

    //--------------------------------- Keyboard Controls ---------------------------------
    const [keysPressed, setKeysPressed] = useState(new Set());

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                setKeysPressed(prev => {
                    const newKeys = new Set(prev);
                    newKeys.add(e.key);
                    return newKeys;
                });
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                setKeysPressed(prev => {
                    const newKeys = new Set(prev);
                    newKeys.delete(e.key);
                    return newKeys;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        // Debounce the paddle movement to reduce unnecessary WebSocket messages
        const handlePaddleMovement = () => {
            if (keysPressed.has('ArrowUp')) {
                sendJsonMessage({
                    type: 'paddle_move',
                    direction: 'up'
                });
            }
            if (keysPressed.has('ArrowDown')) {
                sendJsonMessage({
                    type: 'paddle_move',
                    direction: 'down'
                });
            }
        };

        // Use requestAnimationFrame for smoother, more efficient updates
        let animationFrameId;
        const updatePaddle = () => {
            handlePaddleMovement();
            animationFrameId = requestAnimationFrame(updatePaddle);
        };

        if (keysPressed.size > 0) {
            animationFrameId = requestAnimationFrame(updatePaddle);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [keysPressed, sendJsonMessage]);
    //--------------------------------- Keyboard Controls ---------------------------------
   
    // const handleKeyDown = (e) => {
    //     let direction;
    //     if (e.key === 'ArrowUp') {
    //         direction = 'up';
    //     } else if (e.key === 'ArrowDown') {
    //         direction = 'down';
    //     } else {
    //         return;
    //     }
    //     sendJsonMessage( {
    //         type: 'paddle_move',
    //         direction: direction
    //     });
    // };
    // useEffect(() => {
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [data, readyState]);


    const [dots, setDots] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev + 1) % 4);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    if (gameState.status === 'waiting') {
        return (
            <>
                <div className="waiting-container">
                    <canvas ref={canvasRef} width="0" height="0"></canvas>
                    <div className="ping-pong-animation">
                        <div className="paddleleft"></div>
                        <div className="ball"></div>
                        <div className="paddleright"></div>
                    </div>
                    <h1 className="waiting-text">
                        Waiting for Player 2 {'.'.repeat(dots)}
                    </h1>
                    <p className="text">Get ready for the match!</p>
                </div>  
            </>);
    } else if (gameState.status === 'quit') {
        return (
            <>
                <div className="pong-game-container">
                    <canvas ref={canvasRef} width="0" height="0"></canvas>
                    <div className='winlose'>
                        {winner && (winner === username ? <WinComp obj={user} text={"YOU WIN"}/> : <LoseComp obj={user} text={"YOU LOSE"}/>)}
                    </div>
                </div>
            </>
        );
    } else {
        const baseImagePath = "/media/";
        const imagePath1 = gameState.paddles.user1.photo; 
        const imagePath2 = gameState.paddles.user2.photo; 
        const im_us1 = `${baseImagePath}${imagePath1}`;
        const im_us2 = `${baseImagePath}${imagePath2}`;
        return (
            <>
                <div className='winlose'>
                    {winner && (winner === username ? <WinComp obj={user} text={"YOU WIN"}/> : <LoseComp obj={user} text={"YOU LOSE"}/>)}
                </div>
                <div className="pong-game-container">
                    <div className="users-info">
                        <div className="user-info">
                            {imagePath1 && <img src={`https://${window.location.hostname}${im_us1}`} className="user-avatar" alt="user 1"  style={{ width: "100px", height: "100px" }} />}
                            <div className="user-details">
                                <p className="user-name">{gameState.paddles.user1.name}</p>
                                {/* <p className="user-score">Score: {gameState.scores.user1}</p> */}
                            </div>
                        </div>
                        <p id='vs'>
                            <img src="src/assets/VS.svg" alt="vs" style={{ width: "100px", height: "100px" }}/>
                        </p>
                        <div className="user-info">
                            <div className="user-details">
                                <p className="user-name">{gameState.paddles.user2.name}</p>
                                {/* <p className="user-score">Score: {gameState.scores.user2}</p> */}
                            </div>
                            {imagePath2 && <img src={`https://${window.location.hostname}${im_us2}`} className="user-avatar" alt="user 1"  style={{ width: "100px", height: "100px" }} />}
                        </div>
                    </div>
                    <div className="game-container">
                        <canvas ref={canvasRef} width="800" height="500" id="pong"></canvas>
                    </div>
                </div>
            </>
        );
    }
};

export default SoloPage;