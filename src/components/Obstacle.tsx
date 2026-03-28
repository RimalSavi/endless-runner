import { GAME_CONFIG, OBSTACLE_CONFIG } from "../constants/gameConfig";
import type { ObstacleType } from "../types/game";

interface ObstacleProps {
    obstacle: ObstacleType
}

const Obstacle = ({ obstacle }: ObstacleProps) => {
    const config = OBSTACLE_CONFIG[obstacle.type];
    const isCeiling = 'fromCeiling' in config && config.fromCeiling;

    return (
        <div 
            style={{
                position: 'absolute',
                left: obstacle.position.x,
                bottom: GAME_CONFIG.groundHeight + config.bottom,
                width: config.bottom,
                height: config.height,
                fontSize: '36px',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                transform: isCeiling ? 'rotate(180deg)' : undefined,
            }}
        >
            {config.emoji}
        </div>
    );
};

export default Obstacle;