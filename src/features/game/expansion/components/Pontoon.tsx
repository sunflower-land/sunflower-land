import React from "react";

import { LandExpansion } from "features/game/types/game";
import pontoon from "assets/land/levels/pontoon.gif";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ProgressBar } from "components/ui/ProgressBar";

interface Props {
  expansion: LandExpansion;
}

/**
 * The next piece of land to expand into
 */
export const Pontoon: React.FC<Props> = ({ expansion }) => {
  console.log({ expansion });
  // Land is still being built
  const constructionTime = Math.floor(
    (expansion.readyAt - expansion.createdAt) / 1000
  );
  const secondsLeft = Math.floor((expansion.readyAt - Date.now()) / 1000);

  console.log({ constructionTime, secondsLeft });
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
