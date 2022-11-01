import React, { useContext, useEffect, useRef } from "react";
import { useActor } from "@xstate/react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";
import { Context, GoblinProvider } from "features/game/GoblinProvider";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { IslandTravel } from "features/game/expansion/components/IslandTravel";
import { RetreatBank } from "./components/bank/RetreatBank";
import { RetreatStorageHouse } from "./components/storageHouse/RetreatStorageHouse";
import { RetreatHotAirBalloon } from "./components/hotAirBalloon/RetreatHotAirBalloon";
import { RetreatTailor } from "./components/tailor/RetreatTailor";
import { RetreatBlacksmith } from "./components/blacksmith/RetreatBlacksmith";
import { Auctioneer } from "./components/auctioneer/Auctioneer";
import { Resale } from "./components/resale/Resale";
import { RetreatWishingWell } from "./components/wishingWell/RetreatWishingWell";

import background from "assets/land/retreat.png";
import ocean from "assets/decorations/ocean.png";
import pirateGoblin from "assets/npcs/pirate_goblin.gif";

export const Retreat: React.FC = () => {
  return (
    <GoblinProvider>
      <ToastProvider>
        <RetreatView />
      </ToastProvider>
    </GoblinProvider>
  );
};

const RetreatView: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [gameState] = useActor(goblinService);
  const { bumpkin } = gameState.context.state;
  const container = useRef(null);

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with island centered
    scrollIntoView(Section.RetreatBackground, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <ScrollContainer
      className="bg-blue-300 overflow-scroll relative w-full h-full"
      innerRef={container}
    >
      <div className="relative h-retreatGameboard w-retreatGameboard">
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
            id={Section.RetreatBackground}
          />
          <RetreatBank />
          <RetreatStorageHouse />
          <RetreatHotAirBalloon />
          <RetreatTailor />
          <RetreatBlacksmith />
          <Auctioneer />
          <Resale />
          <RetreatWishingWell />
          <MapPlacement x={-1.4} y={-12}>
            <img
              src={pirateGoblin}
              style={{
                width: `${25 * PIXEL_SCALE}px`,
              }}
            />
          </MapPlacement>
          <IslandTravel bumpkin={bumpkin} x={-2} y={-15} />
        </div>
      </div>
    </ScrollContainer>
  );
};
