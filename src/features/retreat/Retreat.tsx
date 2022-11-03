import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import ocean from "assets/decorations/ocean.png";
import background from "assets/land/retreat.png";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";
import { GoblinProvider } from "features/game/GoblinProvider";
import { RetreatBank } from "./components/bank/RetreatBank";
import { RetreatStorageHouse } from "./components/storageHouse/RetreatStorageHouse";
import { RetreatHotAirBalloon } from "./components/hotAirBalloon/RetreatHotAirBalloon";
import { RetreatTailor } from "./components/tailor/RetreatTailor";
import { RetreatBlacksmith } from "./components/blacksmith/RetreatBlacksmith";
import { Auctioneer } from "./components/auctioneer/Auctioneer";
import { Resale } from "./components/resale/Resale";
import { RetreatWishingWell } from "./components/wishingWell/RetreatWishingWell";
import { IslandTravelWrapper } from "./components/islandTravel/IslandTravelWrapper";

export const Retreat: React.FC = () => {
  const container = useRef(null);

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with island centered
    scrollIntoView(Section.RetreatBackground, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <GoblinProvider>
      <ToastProvider>
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
              <IslandTravelWrapper />
            </div>
          </div>
        </ScrollContainer>
      </ToastProvider>
    </GoblinProvider>
  );
};
