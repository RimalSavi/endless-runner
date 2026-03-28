import { useCallback, useEffect, useRef, useState } from "react";
import type { GameState, ObstacleType, PlayerState } from "../types/game";
import useGameLoop from "../hooks/useGameLoop";
import Player from "./Player";
import Obstacle from "./Obstacle";
import { GAME_CONFIG, OBSTACLE_CONFIG, PLAYER_CONFIG } from "../constants/gameConfig";

const initialPlayerState: PlayerState = {
    position: { x: 100, y: 0},
    isJumping: false,
    isSliding: false,
    velocity: 0,
    health: PLAYER_CONFIG.maxHealth,
    isInvincible: false,
};

const getBestScore = (): number => {
    return parseInt(localStorage.getItem('bestScore') || '0', 10);
};

const saveBestScore = (score: number): void => {
    localStorage.setItem('bestScore', score.toString());
}

const initialGameState: GameState = {
    isRunning: false,
    isGameOver: false,
    score: 0,
    bestScore: getBestScore(),
    speed: GAME_CONFIG.initialSpeed,
    level: 1,
};

const Game = () => {
    const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const scoreRef = useRef(0);
    const lastSpawnRef = useRef(0);
    const obstaclesRef = useRef<ObstacleType[]>([]);
    const playerRef = useRef<PlayerState>(initialPlayerState);
    const speedRef = useRef(initialGameState.speed);
    const isRunningRef = useRef(false);

    const startGame = () => {
        isRunningRef.current = true;
        scoreRef.current = 0;
        lastSpawnRef.current = 0;
        obstaclesRef.current = [];
        playerRef.current = initialPlayerState;
        speedRef.current = GAME_CONFIG.initialSpeed;
        setObstacles([]);
        setPlayer(initialPlayerState);
        setGameState(prev => ({
            ...initialGameState, 
            isRunning: true,
            bestScore: prev.bestScore,
        }));
    };

    const handleClick = useCallback(() => {
        if (!gameState.isRunning) {
            startGame();
            return;
        }
        if (!playerRef.current.isJumping) {
            setPlayer(prev => {
                const updated = { ...prev, isJumping: true, velocity: PLAYER_CONFIG.jumpForce };
                playerRef.current = updated;
                return updated;
            });
        }
    }, [gameState.isRunning]);

    const checkCollision = (player: PlayerState, obstacle: ObstacleType): boolean => {
        const config = OBSTACLE_CONFIG[obstacle.type];

        const playerLeft = obstacle.type === 'sword' ? player.position.x : player.position.x + 8;
        const playerRight = obstacle.type === 'sword' ? player.position.x + PLAYER_CONFIG.width : player.position.x + PLAYER_CONFIG.width - 8;
        const playerBottom = player.position.y;
        const playerTop = player.position.y + (player.isSliding ? PLAYER_CONFIG.slidingHeight : PLAYER_CONFIG.height);

        const obstacleLeft = obstacle.position.x + 4;
        const obstacleRight = obstacle.position.x + config.width - 4;
        const obstacleBottom = config.bottom;
        const obstacleTop = config.bottom + config.height;

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
            const newVelocity = prev.velocity - PLAYER_CONFIG.gravity;
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

        if (lastSpawnRef.current > GAME_CONFIG.spawnInterval) {
            lastSpawnRef.current = 0;
            const types = Object.keys(OBSTACLE_CONFIG) as Array<keyof typeof OBSTACLE_CONFIG>
            const type = types[Math.floor(Math.random() * types.length)];
            const newObstacle: ObstacleType = {
                id: Date.now(),
                position: { x: window.innerWidth, y: 0 },
                type,
            };
            obstaclesRef.current = [...obstaclesRef.current, newObstacle];
        }

        const currentPlayer = playerRef.current;
        const updatedObstacles = obstaclesRef.current
            .map(obs => ({
                ...obs,
                position: { ...obs.position, x: obs.position.x - speedRef.current },
            }))
            .filter(obs => obs.position.x > -Math.max(...Object.values(OBSTACLE_CONFIG).map(c => c.width)));
        
        const hasCollision = updatedObstacles.some(obs => checkCollision(currentPlayer, obs));

        obstaclesRef.current = updatedObstacles;
        setObstacles([...updatedObstacles]);

        if (hasCollision && !playerRef.current.isInvincible) {
            const newHealth = playerRef.current.health - 1;

            if (newHealth <= 0) {
                isRunningRef.current = false;
                const finalScore = Math.floor(scoreRef.current);
                setGameState(prev => {
                    const newBestScore = Math.max(finalScore, prev.bestScore);
                    saveBestScore(newBestScore);
                    return {
                        ...prev, 
                        isRunning: false, 
                        isGameOver: true,
                        score: finalScore,
                        bestScore: newBestScore,
                    };
                });
                return;
            }

            setPlayer(prev => {
                const updated = {
                    ...prev,
                    health: newHealth,
                    isInvincible: true,
                };
                playerRef.current = updated;
                return updated;
            });

            setTimeout(() => {
                setPlayer(prev => {
                    const updated = {...prev, isInvincible: false};
                    playerRef.current = updated;
                    return updated;
                });
            }, PLAYER_CONFIG.invincibilityDuration);
        }

        setGameState(prev => {
            const newSpeed = Math.min(prev.speed + GAME_CONFIG.speedIncrement, GAME_CONFIG.maxSpeed);
            speedRef.current = newSpeed;
            return {
                ...prev,
                score: Math.floor(scoreRef.current),
                speed: newSpeed,
            };
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!isRunningRef.current) {
                    startGame();
                    return;
                }
                if (!playerRef.current.isJumping) {
                    setPlayer(prev => {
                        const updated = { ...prev, isJumping: true, velocity: PLAYER_CONFIG.jumpForce };
                        playerRef.current = updated;
                        return updated;
                    });
                }
            }
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                e.preventDefault();

                if (!playerRef.current.isJumping && isRunningRef.current) {
                    setPlayer(prev => {
                    const updated = { ...prev, isSliding: true };
                    playerRef.current = updated;
                    return updated;
                });

                    setTimeout(() => {
                        setPlayer(prev => {
                            const updated = { ...prev, isSliding: false };
                            playerRef.current = updated;
                            return updated;
                        });
                    }, 600);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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
                    height: GAME_CONFIG.groundHeight,
                    backgroundColor: '#1a0a2e',
                    borderTop: '3px solid #6d28d9'
                }}
            />

            <Player player={player} />

            {obstacles.map(obs => (
                <Obstacle key={obs.id} obstacle={obs} />
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
                    {gameState.isGameOver ? (
                        <div>
                            <div>Game Over!</div>
                            <div style={{ fontSize: 24, margin: '10px 0', color: '#fbbf24' }}>
                                Score: {gameState.score}
                            </div>
                            <div style={{fontSize: 20, color: '#9ca3af'}}>
                                Best: {gameState.bestScore}
                            </div>
                            <div style={{ fontSize: 18, marginTop: 20 }}>Click to restart</div>
                        </div>
                    ) : (
                        <div>
                            <div>Endless Runner</div>
                            <div style={{ fontSize: 18, marginTop: 10, color: '#9ca3af' }}>Click to Start</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Game;