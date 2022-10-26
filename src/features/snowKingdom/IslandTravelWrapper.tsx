import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import pirateGoblin from "assets/npcs/pirate_goblin.gif";
import { IslandTravel } from "features/game/expansion/components/IslandTravel";
import { Context } from "features/game/GameProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const IslandTravelWrapper = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  return (
    <>
      <MapPlacement x={-1.3} y={-12}>
        <img
          src={pirateGoblin}
          style={{
            width: `${25 * PIXEL_SCALE}px`,
          }}
        />
      </MapPlacement>
      <IslandTravel bumpkin={bumpkin} x={-2} y={-14} />
    </>
  );
};
