import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { Context } from "features/game/GameProvider";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import coins from "assets/icons/coins.webp";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import {
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
  getKeys,
} from "features/game/types/craftables";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { ANIMAL_DIMENSIONS } from "features/game/types/craftables";
import { isBudName } from "features/game/types/buds";
import { CollectibleLocation } from "features/game/types/collectibles";
import { Label } from "components/ui/Label";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { LANDSCAPING_DECORATIONS } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  location: CollectibleLocation;
}

export const PlaceableController: React.FC<Props> = ({ location }) => {
  const { gameService } = useContext(Context);
  const child = gameService.state.children.landscaping as MachineInterpreter;
  const { t } = useAppTranslation();
  const [
    {
      context: {
        collisionDetected,
        placeable,
        requirements,
        coordinates,
        maximum,
      },
    },
    send,
  ] = useActor(child);

  const [gameState] = useActor(gameService);

  if (!placeable) return null;

  let dimensions = { width: 0, height: 0 };
  if (isBudName(placeable)) {
    dimensions = { width: 1, height: 1 };
  } else if (placeable) {
    dimensions = {
      ...BUILDINGS_DIMENSIONS,
      ...COLLECTIBLES_DIMENSIONS,
      ...ANIMAL_DIMENSIONS,
      ...RESOURCE_DIMENSIONS,
    }[placeable];
  }
  const { width, height } = dimensions;

  const items = getChestItems(gameState.context.state);

  const available = isBudName(placeable)
    ? new Decimal(1)
    : items[placeable] ?? new Decimal(0);

  const handleConfirmPlacement = () => {
    // prevents multiple toasts while spam clicking place button
    if (!child.state.matches({ editing: "placing" })) {
      return;
    }

    let hasRequirements = false;
    if (requirements) {
      const hasCoins = gameState.context.state.coins > requirements.coins * 2;
      const hasIngredients = getKeys(requirements.ingredients).every((name) =>
        gameState.context.state.inventory[name]?.gte(
          requirements.ingredients[name]?.mul(2) ?? 0,
        ),
      );

      hasRequirements = hasCoins && hasIngredients;
    }

    let placeMore = false;

    // Placing from chest
    if (!requirements) {
      placeMore = available.gt(1);
    } else {
      placeMore = hasRequirements;
    }

    if (isBudName(placeable)) {
      placeMore = false;
    } else {
      const previous =
        gameState.context.state.inventory[placeable] ?? new Decimal(0);

      if (maximum && previous.gte(maximum - 1)) {
        placeMore = false;
      }
    }

    if (placeMore) {
      const nextPosition = { x: coordinates.x, y: coordinates.y - height };
      const collisionDetected = detectCollision({
        name: placeable as CollectibleName,
        state: gameService.state.context.state,
        position: {
          ...nextPosition,
          width,
          height,
        },
        location,
      });

      send({
        type: "PLACE",
        nextOrigin: nextPosition,
        nextWillCollide: collisionDetected,
        location,
      });
    } else {
      send({
        type: "PLACE",
        location,
      });
    }
  };

  const handleCancelPlacement = () => {
    send("BACK");
  };

  const image = isBudName(placeable) ? "" : ITEM_DETAILS[placeable].image;
  const Hint = () => {
    if (!requirements) {
      return (
        <div className="flex justify-center items-center mb-1">
          <img src={image} className="h-6 mr-2 img-highlight" />
          <p className="text-sm">{`${available.toNumber()} ${t(
            "available",
          )}`}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center items-center my-1">
        {requirements.coins > 0 && (
          <div className="flex mr-2">
            <img src={coins} className="h-6 mr-1" />
            <p className="text-sm">{requirements.coins}</p>
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

  const isWrongLocation =
    location === "home" &&
    ((!COLLECTIBLES_DIMENSIONS[placeable as CollectibleName] &&
      !isBudName(placeable)) ||
      placeable in LANDSCAPING_DECORATIONS() ||
      placeable === "Magic Bean");

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
      <OuterPanel>
        {isWrongLocation && (
          <Label
            icon={SUNNYSIDE.icons.cancel}
            className="mx-auto my-1"
            type="danger"
          >
            {t("error.cannotPlaceInside")}
          </Label>
        )}
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

          <Button
            disabled={collisionDetected || isWrongLocation}
            onClick={handleConfirmPlacement}
          >
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
