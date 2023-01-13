import React from "react";

import goldEgg from "assets/sfts/gold_egg.png";
import questionMark from "assets/icons/expression_confused.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";

export const GoldEgg: React.FC<CollectibleProps> = ({ readyAt }) => {
  const isReady = readyAt <= Date.now();

  return (
    <>
      {!isReady && (
        <img
          src={goldEgg}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 3}px`,
          }}
          className="absolute"
          alt="Gold Egg"
        />
      )}
      {isReady && (
        <img
          src={questionMark}
          style={{
            width: `${PIXEL_SCALE * 7}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `50%`,
            transform: "translatex(-50%)",
          }}
          className="absolute"
          alt="Gold Egg"
        />
      )}
    </>
  );
};
