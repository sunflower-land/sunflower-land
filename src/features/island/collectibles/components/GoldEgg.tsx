import React from "react";

import goldEgg from "assets/sfts/gold_egg.png";
import goldenCockerel from "assets/animals/chickens/golden_cockerel.gif";

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
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: 0,
            left: `50%`,
            transform: "translatex(-50%)",
          }}
        >
          <img
            src={goldenCockerel}
            style={{
              width: `${PIXEL_SCALE * 24}px`,
            }}
            alt="Gold Egg"
          />
        </div>
      )}
    </>
  );
};
