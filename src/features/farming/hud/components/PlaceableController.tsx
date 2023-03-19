import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";
import { Context } from "features/game/GameProvider";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import token from "assets/icons/token_2.png";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";

export const PlaceableController: React.FC = () => {
  const { gameService } = useContext(Context);
  const child = gameService.state.children.editing as MachineInterpreter;

  const [
    {
      context: { collisionDetected, placeable, coordinates, requirements },
    },
    send,
  ] = useActor(child);

  const [gameState] = useActor(gameService);

  const items = getChestItems(gameState.context.state);

  const available = items[placeable] ?? new Decimal(0);

  const handleConfirmPlacement = () => {
    // prevents multiple toasts while spam clicking place button
    if (!child.state.matches("idle")) {
      return;
    }
    console.log({ hasMore: available.gt(1) });

    let placeMore = false;

    // Placing an existing item
    if (!requirements && available.gt(1)) {
      placeMore = true;
    }

    const state = gameState.context.state;
    if (
      requirements &&
      requirements.sfl.lte(state.balance) &&
      getKeys(requirements.ingredients).every((name) =>
        state.inventory[name]?.gte(requirements.ingredients[name] ?? 0)
      )
    ) {
      placeMore = true;
    }

    if (!placeMore) {
      send({
        type: "PLACE",
      });
    }

    const { width, height } = {
      ...BUILDINGS_DIMENSIONS,
      ...COLLECTIBLES_DIMENSIONS,
      ...ANIMAL_DIMENSIONS,
    }[placeable];

    const nextPosition = {
      x: coordinates.x,
      y: coordinates.y - height,
    };

    send({
      type: "PLACE",
      nextPosition,
      willCollide: detectCollision(gameState.context.state, {
        ...nextPosition,
        width,
        height,
      }),
    });
  };

  const handleCancelPlacement = () => {
    send("CANCEL");
  };

  const Info = () => {
    if (child.state.context?.requirements) {
      return (
        <>
          <div className="flex justify-center pb-1">
            {child.state.context?.requirements.sfl && (
              <div className="flex">
                <img src={token} className="h-6 mr-1" />
                <span className="text-sm">
                  {child.state.context?.requirements.sfl.toNumber()}
                </span>
              </div>
            )}
            {child.state.context?.requirements.ingredients &&
              getKeys(child.state.context?.requirements.ingredients).map(
                (name) => (
                  <div className="flex ml-3">
                    <img src={ITEM_DETAILS[name].image} className="h-6 mr-1" />
                    <span className="text-sm">
                      {child.state.context?.requirements.ingredients[
                        name
                      ]?.toNumber()}
                    </span>
                  </div>
                )
              )}
          </div>
        </>
      );
    }

    return (
      <div className="flex justify-center items-center mb-1">
        <img
          src={ITEM_DETAILS[placeable].image}
          className="h-6 mr-2 img-highlight"
        />
        <p className="text-sm">{`${available.toNumber()} available`}</p>
      </div>
    );
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2">
      <OuterPanel>
        <Info />
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
