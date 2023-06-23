import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { Context } from "features/game/GameProvider";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import token from "assets/icons/token_2.png";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { ANIMAL_DIMENSIONS } from "features/game/types/craftables";

export const PlaceableController: React.FC = () => {
  const { gameService } = useContext(Context);
  const child = gameService.state.children.landscaping as MachineInterpreter;

  const [
    {
      value,
      context: {
        collisionDetected,
        placeable,
        requirements,
        coordinates,
        maximum,
        action,
      },
    },
    send,
  ] = useActor(child);

  const [gameState] = useActor(gameService);

  if (!placeable) {
    return null;
  }

  const { width, height } = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...ANIMAL_DIMENSIONS,
  }[placeable];

  const items = getChestItems(gameState.context.state);

  const available = items[placeable] ?? new Decimal(0);

  const handleConfirmPlacement = () => {
    // prevents multiple toasts while spam clicking place button
    if (!child.state.matches({ editing: "placing" })) {
      return;
    }

    let hasRequirements = false;
    if (requirements) {
      const hasSFL = gameState.context.state.balance.gte(
        requirements.sfl.mul(2)
      );
      const hasIngredients = getKeys(requirements.ingredients).every((name) =>
        gameState.context.state.inventory[name]?.gte(
          requirements.ingredients[name]?.mul(2) ?? 0
        )
      );

      hasRequirements = hasSFL && hasIngredients;
    }

    let placeMore = false;

    // Placing from chest
    if (!requirements) {
      placeMore = available.gt(1);
    } else {
      placeMore = hasRequirements;
    }

    const previous =
      gameState.context.state.inventory[placeable] ?? new Decimal(0);

    if (maximum && previous.gte(maximum - 1)) {
      placeMore = false;
    }

    if (placeMore) {
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
    send("BACK");
  };

  const Hint = () => {
    if (!requirements) {
      return (
        <div className="flex justify-center items-center mb-1">
          <img
            src={ITEM_DETAILS[placeable].image}
            className="h-6 mr-2 img-highlight"
          />
          <p className="text-sm">{`${available.toNumber()} available`}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center items-center my-1">
        {requirements.sfl.gt(0) && (
          <div className="flex mr-2">
            <img src={token} className="h-6 mr-1" />
            <p className="text-sm">{requirements.sfl.toNumber()}</p>
          </div>
        )}
        {getKeys(requirements.ingredients).map((name) => (
          <div className="flex mr-2" key={name}>
            <img src={ITEM_DETAILS[name].image} className="h-6 mr-1" />
            <p className="text-sm">
              {requirements.ingredients[name]?.toNumber()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2">
      <OuterPanel>
        <Hint />

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
