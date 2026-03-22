import { useCallback, useRef, useState } from "react";
import type { GameState, PlayerState } from "../types/game";
import useGameLoop from "../hooks/useGameLoop";
import Player from "./Player";

const GROUND_HEIGHT = 100;
const JUMP_FORCE = 15;
const GRAVITY = 0.8;

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

    const startGame = () => {
        scoreRef.current = 0;
        setPlayer(initialPlayerState);
        setGameState({...initialGameState, isRunning: true});
    };

    const handleClick = useCallback(() => {
        if (!gameState.isRunning) {
            startGame();
            return;
        }
        if (!player.isJumping) {
            setPlayer(prev => ({
                ...prev,
                isJumping: true,
                velocity: JUMP_FORCE,
            }));
        }
    }, [gameState.isRunning, player.isJumping]);

    const scoreRef = useRef(0);

    const update = useCallback((deltaTime: number) => {
        scoreRef.current += deltaTime * 0.01;

        setPlayer(prev => {
            if (!prev.isJumping) return prev;
            const newVelocity = prev.velocity - GRAVITY;
            const newY = Math.max(0, prev.position.y + newVelocity);
            const isJumping = newY > 0;

            return {
                ...prev,
                position: { ...prev.position, y: newY },
                velocity: isJumping ? newVelocity : 0,
                isJumping,
            };
        });

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

            <div style={{position: 'absolute', top: 20, right: 20, color: 'white', fontSize: 24}}>
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
                    {gameState.isGameOver ? 'Game Over! Click to restart' : 'Click to start'}
                </div>
            )}
        </div>
    );
};

export default Game;