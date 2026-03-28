import { PLAYER_CONFIG } from "../constants/gameConfig";
import type { PlayerState } from "../types/game";

interface PlayerProps {
    player: PlayerState;
}

const Player = ({ player }: PlayerProps) => {
    return (
        <div
            style= {{
                position: 'absolute',
                left: player.position.x,
                bottom: player.position.y + PLAYER_CONFIG.groundHeight,
                width: PLAYER_CONFIG.width,
                height: player.isSliding ? PLAYER_CONFIG.slidingHeight: PLAYER_CONFIG.height,
                fontSize: player.isSliding ? PLAYER_CONFIG.slidingFontSize : PLAYER_CONFIG.normalFontSize,
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