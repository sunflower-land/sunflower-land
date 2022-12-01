import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useContext, useLayoutEffect } from "react";

import background from "assets/land/helios.webp";
import { GrubShop } from "./components/grubShop/GrubShop";
import { Decorations } from "./components/decorations/Decorations";
import { Potions } from "./components/potions/Potions";
import { ExoticShop } from "./components/exoticShop/ExoticShop";
import { HeliosSunflower } from "./components/HeliosSunflower";
import { HeliosBlacksmith } from "./components/blacksmith/HeliosBlacksmith";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { LostSunflorian } from "./components/npcs/LostSunflorian";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";

export const Helios: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.HeliosBackGround, "auto");
  }, []);

  // Load data
  return (
    <>
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
          id={Section.HeliosBackGround}
        />
        <Decorations />
        <GrubShop />
        <HeliosBlacksmith />
        <Potions />
        <ExoticShop />
        <HeliosSunflower />
        <LostSunflorian />

        <IslandTravel
          bumpkin={bumpkin}
          x={5}
          y={-17}
          onTravelDialogOpened={() => gameService.send("SAVE")}
        />
      </div>
    </>
  );
};
