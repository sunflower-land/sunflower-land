import React, { useContext } from "react";

import { HomeIslandRenderer } from "features/island/homeIsland/HomeIslandRenderer";
import { getPlotPositions } from "features/island/homeIsland/HomeIslandGenerator";
import { getKeys } from "features/game/types/craftables";
import { IslandTravel } from "./IslandTravel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const LandBase: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const { expansions, bumpkin } = state;

  let expandedCount = expansions.length;

  const latestLand = expansions[expansions.length - 1];

  // Land is still being built show previous layout
  if (latestLand.readyAt > Date.now()) {
    expandedCount -= 1;
  }

  const plotPositions = getPlotPositions(expandedCount);
  const xPositions = getKeys(plotPositions).map(Number);
  const plotPositionsArray = xPositions.flatMap((x) => {
    const yPositions = getKeys(plotPositions[x]).map(Number);
    return yPositions.map((y) => {
      return { x: x, y: y, type: plotPositions[x][y] };
    });
  });
  const boatCoordinates = plotPositionsArray.find((x) => x.type === "dock") ?? {
    x: 0,
    y: 0,
  };

  return (
    <>
      <HomeIslandRenderer plotPositions={plotPositions} />
      <IslandTravel
        key="island-travel"
        bumpkin={bumpkin}
        isVisiting={gameState.matches("visiting")}
        isTravelAllowed={!gameState.matches("autosaving")}
        onTravelDialogOpened={() => gameService.send("SAVE")}
        x={boatCoordinates.x * 6 - 3}
        y={boatCoordinates.y * 6 + 1.5}
      />
    </>
  );
};
