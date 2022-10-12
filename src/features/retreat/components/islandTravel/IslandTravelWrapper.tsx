import { useActor } from "@xstate/react";
import { IslandTravel } from "features/game/expansion/components/IslandTravel";
import { Context } from "features/game/GoblinProvider";
import React, { useContext } from "react";

export const IslandTravelWrapper = () => {
  const { goblinService } = useContext(Context);
  const [gameState] = useActor(goblinService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  return <IslandTravel bumpkin={bumpkin} x={-3} y={-15} />;
};
