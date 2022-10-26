import { useActor } from "@xstate/react";
import pirateGoblin from "assets/npcs/pirate_goblin.gif";
import { IslandTravel } from "features/game/expansion/components/IslandTravel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Context } from "features/game/GoblinProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useContext } from "react";

export const IslandTravelWrapper = () => {
  const { goblinService } = useContext(Context);
  const [gameState] = useActor(goblinService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  return (
    <>
      <MapPlacement x={-1.4} y={-12}>
        <img
          src={pirateGoblin}
          style={{
            width: `${25 * PIXEL_SCALE}px`,
          }}
        />
      </MapPlacement>
      <IslandTravel bumpkin={bumpkin} x={-2} y={-15} />
    </>
  );
};
