import React from 'react';
import './../../GameCss/App.css';
import user1Image from '/vite.svg';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';


const GameComponent = ({ x, player1, player2, round, color, onGameEnd }) => {
    const score_max = round || 1;
    const table_color = color || "#000";
    const [countdown, setCountdown] = useState(3);
    const [gameState, setGameState] = useState('countdown'); // 'countdown', 'playing', 'paused'
    const lastCollisionUser = useRef(null);
    const [gameOver, setGameOver] = useState(false);
    const [winnerName, setWinnerName] = useState(false);
    const velocity_X = 5;
    const velocity_Y = 5;
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (player1 == '' || player2 == '') {
          navigate('/game'); // Redirection vers la page de jeu
        }
      }, [player1, player2, navigate]);
    const user1Ref = useRef({
        x: 0,
        y: 0,
        width: 10,
        height: 100,
        score: 0,
        color: "#bc79dc",
        name: "Player 1",
        status: "u1",
    });
    const user2Ref = useRef({
        x: 0,
        y: 0,
        width: 10,
        height: 100,
        score: 0,
        color: "#bc79dc",
        name: "Player2",
        status: "u2",
    });
    const ballRef = useRef({
        x: 0,
        y: 0,
        radius: 10,
        velocityX: velocity_X,
        velocityY: velocity_Y,
        fit: 0,
        speed: 0,
        color: "#bc79dc",
        color_shadow: "#beaeb1",
    });
    const keysRef = useRef({});
    const [ctx, setCtx] = useState(null);
    let gamePaused = false;

    // const [gamePaused, setGamePaused] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setCtx(ctx);

        // Initialiser les positions des balles et des joueurs
        const marge_pa = 5;
        ballRef.current.x = canvas.width / 2;
        ballRef.current.y = canvas.height / 2;
        user1Ref.current.y = canvas.height / 2 - user1Ref.current.height / 2;
        user1Ref.current.x = marge_pa;
        user2Ref.current.y = canvas.height / 2 - user2Ref.current.height / 2;
        user2Ref.current.x = canvas.width - user2Ref.current.width - marge_pa;

        // Start Drawing Game
        const net = {
            x: 0,
            y: 0,
            width: 2,
            height: 10,
            color: "#fff",
        };
        const drawRect = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        };
        const drawRoundedRect = (x, y, width, height, color, radius) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        };
        const drawNet = () => {
            for (let i = 15; i <= canvas.height - 15; i += 15) {
                if (table_color == 'white')
                    net.color = 'black';
                drawRoundedRect(canvas.width / 2, net.y + i, net.width, net.height, net.color, 2.01);
            }
        };
        const drawText = (text, x, y, color, size) => {
            ctx.fillStyle = color;
            ctx.font = `bold ${size}px Arial, sans-serif`;
            ctx.fillText(text, x, y);
        };
        const drawArc = (x, y, r, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        };
        let x = ballRef.current.x;
        let y = ballRef.current.y;
        function drawShadow()
        {
            let var0 = 6;
            if (ballRef.current.x ==  canvas.width/2 && ballRef.current.y == canvas.height/2)
                {}
            else if (ballRef.current.x < x && ballRef.current.y < y)
                drawArc(ballRef.current.x + var0, ballRef.current.y + var0, ballRef.current.radius, ballRef.current.color_shadow);
            else if (ballRef.current.x < x && ballRef.current.y > y)
                drawArc(ballRef.current.x + var0, ballRef.current.y - var0, ballRef.current.radius, ballRef.current.color_shadow);
            else if (ballRef.current.x > x && ballRef.current.y < y)
                drawArc(ballRef.current.x - var0, ballRef.current.y + var0, ballRef.current.radius, ballRef.current.color_shadow);
            else if (ballRef.current.x > x && ballRef.current.y > y)
                drawArc(ballRef.current.x - var0, ballRef.current.y - var0, ballRef.current.radius, ballRef.current.color_shadow);
            x = ballRef.current.x
            y = ballRef.current.y
        }
        const render = () => {
            drawRect(0, 0, canvas.width, canvas.height, table_color);
            drawNet();
            drawText(user1Ref.current.score, canvas.width / 4, canvas.height / 8, '#bc79dc', 48);
            drawText(user2Ref.current.score, canvas.width * (3 / 4), canvas.height / 8, '#bc79dc', 48);
            drawShadow();
            drawArc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, ballRef.current.color);
            drawRoundedRect(user1Ref.current.x, user1Ref.current.y, user1Ref.current.width, user1Ref.current.height, user1Ref.current.color, 5);
            drawRoundedRect(user2Ref.current.x, user2Ref.current.y, user2Ref.current.width, user2Ref.current.height, user2Ref.current.color, 5);
        };
        // End Drawing Game

        const resetBall = () => {
            ballRef.current.x = canvas.width / 2;
            ballRef.current.y = canvas.height / 2;
            ballRef.current.velocityX = -ballRef.current.velocityX;
            ballRef.current.speed = 0;
            if (Math.random() > 0.75)
            {
                ballRef.current.velocityX = velocity_X;
                ballRef.current.velocityY = velocity_Y;
            }
            else if (Math.random() > 0.5)
            {
                ballRef.current.velocityX = -velocity_X;
                ballRef.current.velocityY = velocity_Y;
            }
            else if (Math.random() > 0.25)
            {
                ballRef.current.velocityX = velocity_X;
                ballRef.current.velocityY = -velocity_Y;
            }
            else
            {
                ballRef.current.velocityX = -velocity_X;
                ballRef.current.velocityY = -velocity_Y;
            }
            ballRef.current.fit = 0; 
        };
        const collision = (b, p) => {
            b.top = b.y - b.radius;
            b.bottom = b.y + b.radius;
            b.left = b.x - b.radius;
            b.right = b.x + b.radius;

            p.top = p.y;
            p.bottom = p.y + p.height;
            p.left = p.x;
            p.right = p.x + p.width;

            return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
        };
        // Fonction pour mettre en pause le jeu
        const pauseGame = (duration) => {
            gamePaused = true; // Mettre le jeu en pause
            setTimeout(() => {
                gamePaused = false; // Reprendre le jeu après la durée spécifiée
            }, duration);
        };

        const update = () => {
            movePaddle();
            if (ballRef.current.y + ballRef.current.radius > canvas.height || ballRef.current.y - ballRef.current.radius < 0) {
                ballRef.current.velocityY = -ballRef.current.velocityY;
            }
            ballRef.current.x += ballRef.current.velocityX;
            ballRef.current.y += ballRef.current.velocityY;
        
            let user = (ballRef.current.x + ballRef.current.radius < canvas.width / 2) ? user1Ref.current : user2Ref.current;
            if (ballRef.current.x + ballRef.current.radius > canvas.width - user1Ref.current.width || ballRef.current.x - ballRef.current.radius < user1Ref.current.width) {
                if (user.name != lastCollisionUser.current && collision(ballRef.current, user)) {
                    ballRef.current.velocityX = -ballRef.current.velocityX;
                    lastCollisionUser.current = user.name;
                } else {
                    if (ballRef.current.x - ballRef.current.radius < 0) {
                        user2Ref.current.score++;
                        resetBall();
                        user1Ref.current.y = canvas.height / 2 - user1Ref.current.height / 2;
                        user2Ref.current.y = canvas.height / 2 - user2Ref.current.height / 2;
                        pauseGame(1000);
                        lastCollisionUser.current = null;
                    } else if (ballRef.current.x + ballRef.current.radius > canvas.width) {
                        user1Ref.current.score++;
                        resetBall();
                        user1Ref.current.y = canvas.height / 2 - user1Ref.current.height / 2;
                        user2Ref.current.y = canvas.height / 2 - user2Ref.current.height / 2;
                        pauseGame(1000);
                        lastCollisionUser.current = null;
                    }
                }
            }
        };

        const check = () => {
            if (user1Ref.current.score === score_max || user2Ref.current.score === score_max) {
                setGameOver(true);
                const winner = user1Ref.current.score === score_max ? player1 : player2;
                const winnerText = `WINNER IS ${winner}`;
                setWinnerName(winnerText);
                // Call the onGameEnd prop function
                if (onGameEnd) {
                    onGameEnd(winner);
                }
                // Réinitialiser les positions des joueurs
                user1Ref.current.y = canvas.height / 2 - user1Ref.current.height / 2;
                user2Ref.current.y = canvas.height / 2 - user2Ref.current.height / 2;
                gamePaused = true;  
            }
        };
         
        const gameLoop = () => {
            if (!gameOver && !gamePaused) {
                update();
                render();
                check();
            }
        };

        // Gestion du compte à rebours
        if (gameState === 'countdown') {
            const countdownInterval = setInterval(() => {
                setCountdown(prevCount => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height); 
                    drawText(prevCount, canvas.width / 2, canvas.height / 2, 'white', 50); 
                    if (prevCount > 1) {
                        return prevCount - 1;  // Continue à décrémenter le compte à rebours
                    }
                    clearInterval(countdownInterval);  // Arrêter le compte à rebours
                    setTimeout(() => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height); 
                        drawText('Start ! ...', canvas.width * (13/32), canvas.height / 2, 'white', 50); 
                        setTimeout(() => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height); 
                            setGameState('playing');
                        }, 2000);  // Garder "Start!" affiché pendant 2 secondes
                    }, 1000);  // Attendre 1 seconde après le dernier chiffre pour afficher "Start!"
                    return 0;  // Fixer le compte à rebours à 0 après le dernier affichage
                });
            }, 1000);
            
            return () => clearInterval(countdownInterval);
        }

        const framePerSecond = 50;
        const intervalId = setInterval(gameLoop, 1000 / framePerSecond);
        
        canvas.addEventListener('click', function () {
                gamePaused = !gamePaused; // Toggle pause state
        });

        // Start Move User
        const movePaddle = () => {
            if (keysRef.current['w'] && user1Ref.current.y > 0) {
                user1Ref.current.y -= 5;
            }
            if (keysRef.current['s'] && user1Ref.current.y < canvas.height - user1Ref.current.height) {
                user1Ref.current.y += 5;
            }
            if (keysRef.current['ArrowUp'] && user2Ref.current.y > 0) {
                user2Ref.current.y -= 5;
            }
            if (keysRef.current['ArrowDown'] && user2Ref.current.y < canvas.height - user2Ref.current.height) {
                user2Ref.current.y += 5;
            }
        };
        // Ajouter les écouteurs d'événements pour les touches
        const handleKeyDown = (event) => {
            keysRef.current[event.key] = true;
        };
        const handleKeyUp = (event) => {
            keysRef.current[event.key] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        // END Move User

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState]);

    return (
        <div className="tround_all">
            <div className="tround"><h2>Round {x}: {player1} vs {player2}</h2></div>
            <div className="pong-game-container">
                <div className="users-info">
                    <div className="user-info">
                        <img src="/media/profile_images/avatar2_tICSu6O.png" alt="user 1" className="user-avatar" style={{ width: "100px", height: "100px" }}/>
                        <div className="user-details">
                            <p className="user-name">{player1}</p>
                        </div>
                    </div>
                    <p id='vs'>
                        <img src="src/assets/VS.svg" alt="vs" style={{ width: "100px", height: "100px" }}/>
                    </p>
                    <div className="user-info">
                        <div className="user-details">
                            <p className="user-name">{player2}</p>
                        </div>
                        <img src="/media/profile_images/avatar2_tICSu6O.png" alt="user 2" className="user-avatar" style={{ width: "100px", height: "100px" }}/>
                    </div>
                </div>
                <div className="game-container">
                    <canvas ref={canvasRef} width="800" height="500" id="pong"></canvas>
                </div>
            </div>
        </div>
    );
};

export default GameComponent;
