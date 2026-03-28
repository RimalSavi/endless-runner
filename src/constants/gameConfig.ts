export const PLAYER_CONFIG = {
    width: 50,
    height: 50,
    slidingHeight: 25,
    slidingFontSize: '24px',
    normalFontSize: '40px',
    groundHeight: 100,
    jumpForce: 18,
    gravity: 0.6,
    maxHealth: 3,
    invincibilityDuration: 2000,
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
        bottom: 30,
        emoji: '🦇'
    },
    sword: {
        width: 40,
        height: 60,
        bottom: 0,
        emoji: '⚔️',
        fromCeiling: true,
    }
} as const;

export const GAME_CONFIG = {
    groundHeight: 100,
    spawnInterval: 2500,
    maxSpeed: 15,
    speedIncrement: 0.001,
    initialSpeed: 5,
} as const;