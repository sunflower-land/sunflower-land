import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useContext, useLayoutEffect } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Decorations } from "./components/decorations/Decorations";
import { ExoticShop } from "./components/exoticShop/ExoticShop";
import { HeliosSunflower } from "./components/HeliosSunflower";
import { HeliosBlacksmith } from "./components/blacksmith/HeliosBlacksmith";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { LostSunflorian } from "./components/npcs/LostSunflorian";

// random seal spawn spots
import { randomInt } from "lib/utils/random";
import { Hud } from "features/island/hud/Hud";
import { GarbageCollector } from "./components/garbageCollector/GarbageCollector";
import { HeliosAuction } from "./components/heliosAuction/HeliosAuction";

const spawn = [
  [30, 15],
  [10, 15],
  [10, 25],
  [35, 25],
];

const getRandomSpawn = () => {
  const randomSpawn = randomInt(0, 4);
  return spawn[randomSpawn];
};

export const Helios: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island
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

          backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
          backgroundSize: `${64 * PIXEL_SCALE}px`,
          imageRendering: "pixelated",
        }}
      >
        <img
          src={SUNNYSIDE.land.helios}
          className="absolute inset-0 w-full h-full"
          id={Section.HeliosBackGround}
        />

        <Decorations />
        <HeliosBlacksmith />
        <GarbageCollector />
        <ExoticShop />
        <HeliosSunflower />
        <LostSunflorian />
        <HeliosAuction />
      </div>
      <Hud isFarming={false} location="farm" />
    </>
  );
};
