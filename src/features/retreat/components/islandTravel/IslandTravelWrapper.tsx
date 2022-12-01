import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import React, { useContext } from "react";

export const IslandTravelWrapper = () => {
  const { goblinService } = useContext(Context);
  const [gameState] = useActor(goblinService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  return <IslandTravel bumpkin={bumpkin} x={-2} y={-15} />;
};
