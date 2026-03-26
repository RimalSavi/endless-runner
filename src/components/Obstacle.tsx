import type { Position } from "../types/game";

interface ObstacleProps {
    position: Position;
}

const OBSCTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 60;
const GROUND_HEIGHT = 100;

const Obstacle = ({ position }: ObstacleProps) => {
    return (
        <div 
            style={{
                position: 'absolute',
                left: position.x,
                bottom: GROUND_HEIGHT,
                width: OBSCTACLE_WIDTH,
                height: OBSTACLE_HEIGHT,
                backgroundColor: '#ef4444',
                borderRadius: '4px',
            }}
        />
    );
};

export default Obstacle;