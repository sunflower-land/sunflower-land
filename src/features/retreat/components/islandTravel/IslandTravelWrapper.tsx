import { useActor } from "@xstate/react";
import { Context } from "features/game/GoblinProvider";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import React, { useContext } from "react";

export const IslandTravelWrapper = () => {
  const { goblinService } = useContext(Context);
  const [gameState] = useActor(goblinService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  return (
    <IslandTravel
      gameState={gameState.context.state}
      bumpkin={bumpkin}
      x={-2}
      y={-15}
      travelAllowed // GoblinRetreat always allowed because gameState doesn't get altered (and no autosaving needed).
    />
  );
};
