import { useActor } from "@xstate/react";
import background from "assets/events/valentine/land/valentine_island.png";
import boat from "assets/events/valentine/npcs/love_boat.webp";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Hud } from "features/island/hud/Hud";
import { ChickenCouple } from "features/valentineIsland/components/ChickenCouple";
import { LonelyGuy } from "features/valentineIsland/components/LonelyGuy";
import { LoveCafe } from "features/valentineIsland/components/LoveCafe";
import { Moles } from "features/valentineIsland/components/Moles";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useContext, useLayoutEffect } from "react";
import { ValentinGoblin } from "features/valentineIsland/components/ValentinGoblin";
import { Cupid } from "features/valentineIsland/components/Cupid";
import { ValentinFarmer } from "features/valentineIsland/components/ValentinFarmer";
import { ValentinesIslandTravel } from "features/game/expansion/components/travel/ValentinesIslandTravel";
import { BlossomTree } from "features/valentineIsland/components/BlossomTree";

export const ValentineIsland: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.ValentineIsland, "auto");
  }, []);

  // Load data
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${320 * PIXEL_SCALE}px`,
          height: `${274 * PIXEL_SCALE}px`,
        }}
      >
        <img
          src={background}
          className="absolute inset-0 w-full h-full"
          id={Section.ValentineIsland}
        />

        <LoveCafe />
        <LonelyGuy />
        <Cupid />
        <ValentinGoblin />
        <Moles />
        <ValentinFarmer />
        <ChickenCouple />
        <BlossomTree />

        <ValentinesIslandTravel
          bumpkin={bumpkin}
          inventory={gameState.context.state.inventory}
          x={-8}
          y={-4.5}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          travelAllowed={!gameState.matches("autosaving")}
          customBoat={boat}
          customWidth={54}
        />
      </div>
      <Hud isFarming={false} />
    </>
  );
};
