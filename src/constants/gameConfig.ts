export const PLAYER_CONFIG = {
    width: 50,
    height: 50,
    slidingHeight: 25,
    slidingFontSize: '24px',
    normalFontSize: '40px',
    groundHeight: 100,
    jumpForce: 18,
    gravity: 0.6
} as const;

export const OBSTACLE_CONFIG = {
    skull: {
        width: 40,
        height: 40,
        bottom: 0,
        emoji: '💀'
    },
    bat: {
        width: 40,
        height: 40,
        bottom: 90,
        emoji: '🦇'
    },
} as const;

export const GAME_CONFIG = {
    groundHeight: 100,
    spawnInterval: 2500,
    maxSpeed: 15,
    speedIncrement: 0.001,
    initialSpeed: 5,
} as const;