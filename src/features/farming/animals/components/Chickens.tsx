import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import coop from "assets/nfts/chicken_coop.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { CONFIG } from "lib/config";

import { Chicken } from "./Chicken";

export type Position = {
  top: number;
  right: number;
};

const positions: Position[] = [
  { top: GRID_WIDTH_PX * 0.3, right: GRID_WIDTH_PX * 2.6 },
  { top: GRID_WIDTH_PX * 0.7, right: GRID_WIDTH_PX * 1.45 },
  { top: GRID_WIDTH_PX * 1.7, right: GRID_WIDTH_PX },
  { top: GRID_WIDTH_PX * 2.47, right: GRID_WIDTH_PX * 3 },
  { top: GRID_WIDTH_PX * 2.66, right: GRID_WIDTH_PX * 1.7 },
  { top: GRID_WIDTH_PX * 1.33, right: GRID_WIDTH_PX * 3.15 },
  { top: GRID_WIDTH_PX * 1.6, right: GRID_WIDTH_PX * 4.6 },
  { top: GRID_WIDTH_PX * 1.72, right: GRID_WIDTH_PX * 5.7 },
  { top: GRID_WIDTH_PX * 1.28, right: GRID_WIDTH_PX * 6.7 },
  { top: GRID_WIDTH_PX * 1.8, right: GRID_WIDTH_PX * 7.7 },
];

export const Chickens: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  let chickenCount = state.inventory.Chicken?.toNumber() || 0;
  // Only available on testnet
  if (CONFIG.NETWORK === "mainnet") {
    chickenCount = 0;
  }

  const chickens = new Array(chickenCount).fill(null);

  return (
    <>
      {state.inventory["Chicken Coop"] && (
        <img
          src={coop}
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
            right: `${GRID_WIDTH_PX * 1.1}px`,
            top: `${GRID_WIDTH_PX * 0}px`,
          }}
          id={Section["Chicken Coop"]}
          className="absolute"
        />
      )}

      <div
        className="flex flex-wrap absolute"
        style={{
          width: `${GRID_WIDTH_PX * 12.8}px`,
          height: `${GRID_WIDTH_PX * 4.2}px`,
          left: `${GRID_WIDTH_PX * 8.3}px`,
          bottom: `${GRID_WIDTH_PX * 2.1}px`,
        }}
      >
        {chickens.map((_, index) => (
          <Chicken index={index} key={index} position={positions[index]} />
        ))}
      </div>
    </>
  );
};
