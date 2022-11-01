import React, { useContext, useEffect, useRef } from "react";
import { useActor } from "@xstate/react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context, GameProvider } from "features/game/GameProvider";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { IslandTravel } from "features/game/expansion/components/IslandTravel";

import ocean from "assets/decorations/ocean.png";
import background from "assets/land/snow_kingdom.png";
import pirateGoblin from "assets/npcs/pirate_goblin.gif";

export const SnowKingdom: React.FC = () => {
  return (
    <GameProvider>
      <ToastProvider>
        <SnowKingdomView />
      </ToastProvider>
    </GameProvider>
  );
};

const SnowKingdomView: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { bumpkin } = gameState.context.state;

  const container = useRef(null);

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with island centered
    scrollIntoView(Section.SnowKingdomBackground, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <ScrollContainer
      className="bg-blue-300 overflow-scroll relative w-full h-full"
      innerRef={container}
    >
      <div className="relative h-snowKingdomGameboard w-snowKingdomGameboard">
        <div
          className="absolute inset-0 bg-repeat w-full h-full"
          style={{
            backgroundImage: `url(${ocean})`,
            backgroundSize: "100px",
            imageRendering: "pixelated",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${40 * GRID_WIDTH_PX}px`,
            height: `${40 * GRID_WIDTH_PX}px`,
          }}
        >
          <img
            src={background}
            className="absolute inset-0 w-full h-full"
            id={Section.SnowKingdomBackground}
          />
          <MapPlacement x={-1.3} y={-12}>
            <img
              src={pirateGoblin}
              style={{
                width: `${25 * PIXEL_SCALE}px`,
              }}
            />
          </MapPlacement>
          <IslandTravel bumpkin={bumpkin} x={-2} y={-14} />
        </div>
      </div>
    </ScrollContainer>
  );
};
