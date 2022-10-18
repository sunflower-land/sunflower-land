import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useContext, useEffect } from "react";

import background from "assets/land/helios.png";
import waterMovement from "assets/decorations/water_movement.png";
import { GrubShop } from "./components/grubShop/GrubShop";
import { Decorations } from "./components/decorations/Decorations";
import { Fertilisers } from "./components/fertilisers/Fertilisers";
import { ExoticShop } from "./components/exoticShop/ExoticShop";
import { HeliosSunflower } from "./components/HeliosSunflower";
import { HeliosBlacksmith } from "./components/blacksmith/HeliosBlacksmith";
import { IslandTravel } from "features/game/expansion/components/IslandTravel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const Helios: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with crops centered
    scrollIntoView(Section.Merchant, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <>
      <div
        className="relative flex"
        style={{
          width: `${40 * GRID_WIDTH_PX}px`,
          height: `${40 * GRID_WIDTH_PX}px`,
        }}
      >
        <img src={background} className="absolute inset-0 w-full h-full z-10" />
        <Decorations />
        <GrubShop />
        <HeliosBlacksmith />
        <Fertilisers />
        <ExoticShop />
        <HeliosSunflower />
        <IslandTravel bumpkin={bumpkin} x={5} y={-18} />
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
    </>
  );
};
