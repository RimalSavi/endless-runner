import type { PlayerState } from "../types/game";

interface PlayerProps {
    player: PlayerState;
}

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const GROUND_HEIGHT = 100;

const Player = ({ player }: PlayerProps) => {
    return (
        <div
            style= {{
                position: 'absolute',
                left: player.position.x,
                bottom: player.position.y + GROUND_HEIGHT,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
                backgroundColor: '#4ade80',
                borderRadius: '8px',
            }}
        />
    );
};

export default Player;