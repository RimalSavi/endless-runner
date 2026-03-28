export interface Position {
    x: number;
    y: number;
}

export interface PlayerState {
    position: Position;
    isJumping: boolean;
    isSliding: boolean;
    velocity: number;
    health: number;
    isInvincible: boolean;
}

export interface GameState {
    isRunning: boolean;
    isGameOver: boolean;
    score: number;
    bestScore: number;
    speed: number;
    level: number;
}

export interface ObstacleType {
    id: number;
    position: Position;
    type: 'skull' | 'bat' | 'sword'
}