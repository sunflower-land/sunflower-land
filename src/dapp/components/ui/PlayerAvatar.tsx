import React from "react";

import player1 from "../../images/characters/player_1.png";
import player2 from "../../images/characters/player_2.png";
import player3 from "../../images/characters/player_3.png";
import player4 from "../../images/characters/player_4.png";
import player5 from "../../images/characters/player_5.png";
import player6 from "../../images/characters/player_6.png";

const playerAvatars = [
  player1,
  player2,
  player3,
  player4,
  player5,
  player6,
];

export function getPlayerAvatar(address: string): number {
  return (parseInt(address, 16) % playerAvatars.length) + 1;
}

interface Props {
  address: string;
}

/**
 * Displays the player's avatar based on their address. Chooses one of the available avatars.
 */
export const PlayerAvatar: React.FC<Props> = ({ address }) => {
  const avatarIndex = getPlayerAvatar(address) - 1;

  return <img src={playerAvatars[avatarIndex]} />;
};
