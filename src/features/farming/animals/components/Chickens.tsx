import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import coop from "assets/nfts/chicken_coop.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { CONFIG } from "lib/config";

import { Chicken } from "./Chicken";

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
          width: `${GRID_WIDTH_PX * 8}px`,
          height: `${GRID_WIDTH_PX * 2}px`,
          right: `${GRID_WIDTH_PX * 4}px`,
          top: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        {chickens.map((_, index) => (
          <Chicken index={index} key={index} />
        ))}
      </div>
    </>
  );
};
