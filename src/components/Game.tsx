import { useCallback, useRef, useState } from "react";
import type { GameState, ObstacleType, PlayerState } from "../types/game";
import useGameLoop from "../hooks/useGameLoop";
import Player from "./Player";
import Obsctacle from "./Obstacle";

const GROUND_HEIGHT = 100;
const JUMP_FORCE = 15;
const GRAVITY = 0.8;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const OBSCTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 60;
const SPAWN_INTERVAL = 2000;

const initialPlayerState: PlayerState = {
    position: { x: 100, y: 0},
    isJumping: false,
    velocity: 0,
};

const initialGameState: GameState = {
    isRunning: false,
    isGameOver: false,
    score: 0,
    speed: 5,
};

const Game = () => {
    const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const scoreRef = useRef(0);
    const lastSpawnRef = useRef(0);
    const obstaclesRef = useRef<ObstacleType[]>([]);
    const playerRef = useRef<PlayerState>(initialPlayerState);

    const startGame = () => {
        scoreRef.current = 0;
        lastSpawnRef.current = 0;
        obstaclesRef.current = [];
        playerRef.current = initialPlayerState;
        setObstacles([]);
        setPlayer(initialPlayerState);
        setGameState({...initialGameState, isRunning: true});
    };

    const handleClick = useCallback(() => {
        if (!gameState.isRunning) {
            startGame();
            return;
        }
        if (!playerRef.current.isJumping) {
            setPlayer(prev => {
                const updated = { ...prev, isJumping: true, velocity: JUMP_FORCE };
                playerRef.current = updated;
                return updated;
            });
        }
    }, [gameState.isRunning]);

    const checkCollision = (player: PlayerState, obstacle: ObstacleType): boolean => {
        const playerLeft = player.position.x;
        const playerRight = player.position.x + PLAYER_WIDTH;
        const playerBottom = player.position.y;
        const playerTop = player.position.y + PLAYER_HEIGHT;

        const obstacleLeft = obstacle.position.x;
        const obstacleRight = obstacle.position.x + OBSCTACLE_WIDTH;
        const obstacleBottom = 0;
        const obstacleTop = OBSTACLE_HEIGHT;

        return (
            playerRight > obstacleLeft &&
            playerLeft < obstacleRight &&
            playerTop > obstacleBottom &&
            playerBottom < obstacleTop
        );
    }

    const update = useCallback((deltaTime: number) => {
        scoreRef.current += deltaTime * 0.01;
        lastSpawnRef.current += deltaTime;

        setPlayer(prev => {
            if (!prev.isJumping) return prev;
            const newVelocity = prev.velocity - GRAVITY;
            const newY = Math.max(0, prev.position.y + newVelocity);
            const isJumping = newY > 0;
            const updated = {
                ...prev,
                position: { ...prev.position, y: newY },
                velocity: isJumping ? newVelocity : 0,
                isJumping,
            };
            playerRef.current = updated;
            return updated;
        });

        if (lastSpawnRef.current > SPAWN_INTERVAL) {
            lastSpawnRef.current = 0;
            const newObstacle: ObstacleType = {
                id: Date.now(),
                position: { x: window.innerWidth, y: 0 },
            };
            obstaclesRef.current = [...obstaclesRef.current, newObstacle];
        }

        const currentPlayer = playerRef.current;
        const updatedObstacles = obstaclesRef.current
            .map(obs => ({
                ...obs,
                position: { ...obs.position, x: obs.position.x - 5 },
            }))
            .filter(obs => obs.position.x > -OBSCTACLE_WIDTH);
        
        const hasCollision = updatedObstacles.some(obs => checkCollision(currentPlayer, obs));

        obstaclesRef.current = updatedObstacles;
        setObstacles([...updatedObstacles]);

        if (hasCollision) {
            setGameState(prev => ({ ...prev, isRunning: false, isGameOver: true }));
            return;
        }

        setGameState(prev => ({
            ...prev,
            score: Math.floor(scoreRef.current),
        }));
    }, []);

    useGameLoop(update, gameState.isRunning);

    return (
        <div 
            style={{
                width: '100vw', 
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                userSelect: 'none',
            }}
            onClick={handleClick}
        >
            <div 
                style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: GROUND_HEIGHT,
                    backgroundColor: '#374151',
                }}
            />

            <Player player={player} />

            {obstacles.map(obs => (
                <Obsctacle key={obs.id} position={obs.position} />
            ))}

            <div style={{ position: 'absolute', top: 20, right: 20, color: 'white', fontSize: 24 }}>
                Score: {gameState.score}
            </div>

            {!gameState.isRunning && (
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    color: 'white', 
                    fontSize: 32, 
                    textAlign: 'center' 
                }}>
                    {gameState.isGameOver ? 'Game Over! Click to restart' : 'Click to Start'}
                </div>
            )}
        </div>
    );
};

export default Game;