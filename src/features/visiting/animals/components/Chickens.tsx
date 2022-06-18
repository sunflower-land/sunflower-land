import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import coop from "assets/nfts/chicken_coop.png";
import speedChicken from "assets/animals/chickens/speed_chicken.gif";
import richChicken from "assets/animals/chickens/rich_chicken.gif";
import fatChicken from "assets/animals/chickens/fat_chicken.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/VisitingProvider";
import { Section } from "lib/utils/hooks/useScrollIntoView";

export const Chickens: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

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
      {state.inventory["Speed Chicken"] && (
        <img
          src={speedChicken}
          style={{
            width: `${GRID_WIDTH_PX * 0.8}px`,
            right: `${GRID_WIDTH_PX * -0.15}px`,
            top: `${GRID_WIDTH_PX * -0.57}px`,
          }}
          id={Section["Speed Chicken"]}
          className="absolute"
        />
      )}
      {state.inventory["Rich Chicken"] && (
        <img
          src={richChicken}
          style={{
            width: `${GRID_WIDTH_PX * 1.07}px`,
            right: `${GRID_WIDTH_PX * 3.4}px`,
            top: `${GRID_WIDTH_PX * -0.3}px`,
          }}
          id={Section["Rich Chicken"]}
          className="absolute"
        />
      )}
      {state.inventory["Fat Chicken"] && (
        <img
          src={fatChicken}
          style={{
            width: `${GRID_WIDTH_PX * 0.8}px`,
            right: `${GRID_WIDTH_PX * 2.9}px`,
            top: `${GRID_WIDTH_PX * -2.3}px`,
          }}
          id={Section["Fat Chicken"]}
          className="absolute"
        />
      )}
    </>
  );
};
