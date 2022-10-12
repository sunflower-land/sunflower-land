import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "assets/land/retreat.png";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";
import waterMovement from "assets/decorations/water_movement.png";
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
    // Start with crops centered
    scrollIntoView(Section.Merchant, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <GoblinProvider>
      <ToastProvider>
        <ScrollContainer
          className="relative w-full h-full bg-[#0099db] overflow-scroll"
          innerRef={container}
        >
          <div
            className="relative flex"
            style={{
              width: `${40 * GRID_WIDTH_PX}px`,
              height: `${40 * GRID_WIDTH_PX}px`,
            }}
          >
            <img
              src={background}
              className="absolute inset-0 w-full h-full z-10"
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
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              width: `${80 * GRID_WIDTH_PX}px`,
              height: `${80 * GRID_WIDTH_PX}px`,
              backgroundImage: `url(${waterMovement})`,
              backgroundSize: "400px",
              imageRendering: "pixelated",
            }}
          />
        </ScrollContainer>
      </ToastProvider>
    </GoblinProvider>
  );
};
