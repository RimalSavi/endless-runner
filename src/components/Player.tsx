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
                width: player.isSliding ? PLAYER_WIDTH/2  : PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
                fontSize: player.isSliding ? '24px' : '40px',
                lineHeight: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
                transition: 'height 0.1s, font-size 0.1s',
            }}
        >
            🧙
        </div>
    );
};

export default Player;