import React, { useContext, useEffect, useState } from "react";
import { NPCPlaceable } from "./NPC";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import type { PlaceableLocation } from "features/game/types/collectibles";
import { PlayerNPC } from "./PlayerNPC";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");

export const PlacedBumpkin: React.FC<{
  location?: PlaceableLocation;
}> = ({ location = "farm" }) => {
  const { gameService, showAnimations } = useContext(Context);
  const bumpkin = useSelector(gameService, _bumpkin);
  const isLandscaping = useSelector(gameService, _isLandscaping);
  const [showHeart, setShowHeart] = useState(false);

  // Collecting food shows a heart over the Bumpkin. By the house it's drawn
  // by the house itself; once the Bumpkin is placed it follows it here.
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    const listener = (event: { type: string }) => {
      if (event.type !== "recipes.collected") return;

      setShowHeart(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowHeart(false), 3000);
    };

    gameService.onEvent(listener);

    return () => {
      gameService.off(listener);
      clearTimeout(timeout);
    };
  }, [gameService]);

  if (!bumpkin) return null;

  if (!bumpkin.coordinates) {
    return (
      <NPCPlaceable
        parts={bumpkin.equipped}
        isManuallyPlaced={true}
        flipped={bumpkin.flipped}
      />
    );
  }

  if (!isLandscaping) {
    return (
      <>
        <div style={{ position: "relative", top: "-24px" }}>
          <PlayerNPC
            parts={bumpkin.equipped}
            isManuallyPlaced={true}
            flipped={bumpkin.flipped}
          />
          <img
            src={SUNNYSIDE.icons.heart}
            className={
              "absolute transition-opacity pointer-events-none" +
              (showAnimations ? " animate-float" : "")
            }
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              top: `${PIXEL_SCALE * -8}px`,
              left: `${PIXEL_SCALE * 3}px`,
              opacity: showHeart ? 1 : 0,
            }}
          />
        </div>
      </>
    );
  }

  return (
    <MoveableComponent
      name="Bumpkin"
      id="main"
      index={0}
      x={bumpkin.coordinates.x}
      y={bumpkin.coordinates.y}
      location={location}
    >
      <NPCPlaceable
        parts={bumpkin.equipped}
        isManuallyPlaced={true}
        flipped={bumpkin.flipped}
      />
    </MoveableComponent>
  );
};
