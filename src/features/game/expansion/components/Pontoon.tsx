import React, { useContext, useEffect, useState } from "react";

import { LandExpansion } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { ProgressBar } from "components/ui/ProgressBar";

import pontoon from "assets/land/levels/pontoon.gif";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";

interface Props {
  expansion: LandExpansion;
}

/**
 * Goblins working hard constructing a piece of land
 */
export const Pontoon: React.FC<Props> = ({ expansion }) => {
  const { gameService } = useContext(Context);
  const [showTimeLeftPanel, setShowTimeLeftPanel] = useState(false);

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
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setShowTimeLeftPanel(true)}
      onMouseLeave={() => setShowTimeLeftPanel(false)}
    >
      <div className="w-max h-full relative">
        <img
          src={pontoon}
          width={129 * PIXEL_SCALE}
          style={{
            top: `${PIXEL_SCALE * 21}px`,
            right: `${PIXEL_SCALE * 17}px`,
          }}
          className="relative"
        />
      </div>
      <div
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 83}px`,
          left: `${PIXEL_SCALE * 40}px`,
        }}
      >
        <ProgressBar
          seconds={secondsLeft}
          percentage={secondsLeft / constructionTime}
          type="progress"
        />
      </div>
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: "0px",
        }}
      >
        <TimeLeftPanel
          text="Ready in:"
          timeLeft={secondsLeft}
          showTimeLeft={showTimeLeftPanel}
        />
      </div>
    </div>
  );
};
