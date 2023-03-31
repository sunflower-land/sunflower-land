import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";
import { Context } from "features/game/GameProvider";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { ANIMAL_DIMENSIONS } from "features/game/types/craftables";

export const PlaceableController: React.FC = () => {
  const { gameService } = useContext(Context);
  const child = gameService.state.children.editing as MachineInterpreter;

  const [
    {
      context: { collisionDetected, placeable, requirements, coordinates },
    },
    send,
  ] = useActor(child);

  const [gameState] = useActor(gameService);

  const { width, height } = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...ANIMAL_DIMENSIONS,
  }[placeable];

  const items = getChestItems(gameState.context.state);

  const available = items[placeable] ?? new Decimal(0);

  const handleConfirmPlacement = () => {
    // prevents multiple toasts while spam clicking place button
    if (!child.state.matches("idle")) {
      return;
    }

    const hasMore = available.gt(1);
    if (hasMore) {
      const dimensions = COLLECTIBLES_DIMENSIONS;
      const nextPosition = { x: coordinates.x, y: coordinates.y - height };
      const collisionDetected = detectCollision(
        gameService.state.context.state,
        {
          ...nextPosition,
          width,
          height,
        }
      );

      send({
        type: "PLACE",
        nextOrigin: nextPosition,
        nextWillCollide: collisionDetected,
      });
    } else {
      send({
        type: "PLACE",
      });
    }
  };

  const handleCancelPlacement = () => {
    send("CANCEL");
  };

  const isCrafting = !!requirements;

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2">
      <OuterPanel>
        {!requirements && (
          <div className="flex justify-center items-center mb-1">
            <img
              src={ITEM_DETAILS[placeable].image}
              className="h-6 mr-2 img-highlight"
            />
            <p className="text-sm">{`${available.toNumber()} available`}</p>
          </div>
        )}

        <div
          className="flex items-stretch space-x-2 sm:h-12 w-80 sm:w-[400px]"
          style={{
            height: `${PIXEL_SCALE * 17}px`,
          }}
        >
          <Button onClick={handleCancelPlacement}>
            <img
              src={SUNNYSIDE.icons.cancel}
              alt="cancel"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </Button>
          <Button disabled={collisionDetected} onClick={handleConfirmPlacement}>
            <img
              src={SUNNYSIDE.icons.confirm}
              alt="confirm"
              style={{
                width: `${PIXEL_SCALE * 12}px`,
              }}
            />
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
