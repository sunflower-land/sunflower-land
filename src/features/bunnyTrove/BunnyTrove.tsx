import { useActor } from "@xstate/react";
import background from "assets/events/easter/2023/land/bunny_trove.png";
import boat from "assets/events/easter/2023/boat/easter_eggshell_boat.png";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Hud } from "features/island/hud/Hud";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useContext, useLayoutEffect } from "react";
import { CustomIslandTravel } from "features/game/expansion/components/travel/CustomIslandTravel";
import { Water } from "features/bunnyTrove/components/Water";
import { BunnyMan } from "features/bunnyTrove/components/BunnyMan";
import { HomelessMan } from "features/bunnyTrove/components/HomelessMan";

export const BunnyTrove: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;
  const { bumpkin } = state;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.BunnyTrove, "auto");
  }, []);

  // Load data
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${31 * GRID_WIDTH_PX}px`,
          height: `${23 * GRID_WIDTH_PX}px`,
        }}
      >
        <img
          src={background}
          className="absolute inset-0 w-full h-full"
          id={Section.BunnyTrove}
        />

        <Water />
        <HomelessMan />
        <BunnyMan />

        <CustomIslandTravel
          bumpkin={bumpkin}
          inventory={gameState.context.state.inventory}
          x={-7}
          y={-9}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          isTravelAllowed={!gameState.matches("autosaving")}
          customBoat={boat}
          customWidth={60}
        />
      </div>
      <Hud isFarming={false} />
    </>
  );
};
