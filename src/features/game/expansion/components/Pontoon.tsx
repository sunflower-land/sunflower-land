import React, { useContext, useEffect, useState } from "react";

import { LandExpansion } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { ProgressBar } from "components/ui/ProgressBar";

import pontoon from "assets/land/levels/pontoon.gif";

interface Props {
  expansion: LandExpansion;
}

/**
 * Goblins working hard constructing a piece of land
 */
export const Pontoon: React.FC<Props> = ({ expansion }) => {
  const { gameService } = useContext(Context);

  const [secondsLeft, setSecondsLeft] = useState(
    (expansion.readyAt - Date.now()) / 1000
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = (expansion.readyAt - Date.now()) / 1000;
      setSecondsLeft(seconds);

      if (seconds <= 0) {
        gameService.send("expansion.revealed");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Land is still being built
  const constructionTime = Math.floor(
    (expansion.readyAt - expansion.createdAt) / 1000
  );

  return (
    <div className="w-max h-full flex items-center justify-center max-w-none">
      <img
        src={pontoon}
        width={129 * PIXEL_SCALE}
        style={{
          right: "12%",
        }}
        className="relative"
      />
      <div className="absolute left-0 right-0 bottom-2">
        <ProgressBar
          seconds={secondsLeft}
          percentage={secondsLeft / constructionTime}
        />
      </div>
    </div>
  );
};
