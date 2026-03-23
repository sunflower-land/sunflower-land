import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PortalMachineState } from "../../lib/Machine";
import { GAME_LIVES } from "../../Constants";

import playerHealthBar from "public/world/portal/images/player_health_bar.png";
import lowHealth from "public/world/portal/images/low_health.png";
import mediumHealth from "public/world/portal/images/medium_health.png";
import highHealth from "public/world/portal/images/high_health.png";

const _lives = (state: PortalMachineState) => state.context.lives;

export const Lives: React.FC = () => {
  const { portalService } = useContext(PortalContext);

  const lives = useSelector(portalService, _lives);
  const arrLives = Array.from({ length: lives }, (_, index) => index);

  const getHealthImage = () => {
    if (lives > (2 / 3) * GAME_LIVES) return highHealth;
    if (lives > (1 / 3) * GAME_LIVES) return mediumHealth;
    return lowHealth;
  };

  const currentHealthImage = getHealthImage();

  return (
    <div className="flex justify-center items-center gap-2 relative w-fit">
      <img src={playerHealthBar} className="w-[130px]" />
      <div className="flex absolute gap-[3px]">
        {arrLives.map((_, index) => (
          <img src={currentHealthImage} key={index} className="w-[13px]" />
        ))}
        {Array.from({ length: GAME_LIVES - lives }).map((_, index) => (
          <img src={currentHealthImage} key={index} className="w-[13px] opacity-0" />
        ))}
      </div>
    </div>
  );
};
