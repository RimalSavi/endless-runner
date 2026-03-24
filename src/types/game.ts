export interface Position {
    x: number;
    y: number;
}

export interface PlayerState {
    position: Position;
    isJumping: boolean;
    velocity: number;
}

export interface GameState {
    isRunning: boolean;
    isGameOver: boolean;
    score: number;
    bestScore: number;
    speed: number;
}

export interface ObstacleType {
    id: number;
    position: Position;
}