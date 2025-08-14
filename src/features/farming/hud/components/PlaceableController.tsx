import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useActor, useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import {
  LandscapingPlaceable,
  MachineInterpreter,
} from "features/game/expansion/placeable/landscapingMachine";
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
import {
  BuildingName,
  BUILDINGS_DIMENSIONS,
  Dimensions,
} from "features/game/types/buildings";
import { ANIMAL_DIMENSIONS } from "features/game/types/craftables";
import { isBudName } from "features/game/types/buds";
import { PlaceableLocation } from "features/game/types/collectibles";
import { Label } from "components/ui/Label";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { LANDSCAPING_DECORATIONS } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_ICONS } from "features/island/hud/components/inventory/Chest";
import { GameState, TemperateSeasonName } from "features/game/types/game";
import {
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
  UpgradableBuildingType,
} from "features/game/events/landExpansion/upgradeBuilding";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

interface Props {
  location: PlaceableLocation;
}
const calculateNextPlacement = ({
  previousPosition,
  currentPosition,
  dimensions,
}: {
  previousPosition?: Coordinates;
  currentPosition: Coordinates;
  dimensions: Dimensions;
}): Coordinates => {
  if (!previousPosition) {
    return {
      x: currentPosition.x,
      y: currentPosition.y - dimensions.height,
    };
  }

  const xDiff = currentPosition.x - previousPosition.x;
  const yDiff = currentPosition.y - previousPosition.y;

  return {
    x: currentPosition.x + xDiff,
    y: currentPosition.y + yDiff,
  };
};

export const PlaceableController: React.FC<Props> = ({ location }) => {
  const { gameService } = useContext(Context);
  const child = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;
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

  const state = useSelector(gameService, (state) => state.context.state);
  const [previousPosition, setPreviousPosition] = useState<
    Coordinates | undefined
  >();

  const dimensions = useMemo(() => {
    if (isBudName(placeable)) {
      return { width: 1, height: 1 };
    } else if (placeable) {
      return {
        ...BUILDINGS_DIMENSIONS,
        ...COLLECTIBLES_DIMENSIONS,
        ...ANIMAL_DIMENSIONS,
        ...RESOURCE_DIMENSIONS,
      }[placeable];
    }
    return { width: 0, height: 0 };
  }, [placeable]);

  const handleConfirmPlacement = useCallback(() => {
    // prevents multiple toasts while spam clicking place button
    if (!child.state.matches({ editing: "placing" })) {
      return;
    }

    if (!placeable) return;

    const items = getChestItems(state);

    const available = isBudName(placeable)
      ? new Decimal(1)
      : items[placeable] ?? new Decimal(0);

    let hasRequirements = false;
    if (requirements) {
      const hasCoins = state.coins > requirements.coins * 2;
      const hasIngredients = getKeys(requirements.ingredients).every((name) =>
        state.inventory[name]?.gte(requirements.ingredients[name]?.mul(2) ?? 0),
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

    // Prevents accidental multiple placements
    if (placeable && placeable in EXPIRY_COOLDOWNS) {
      placeMore = false;
    }

    if (isBudName(placeable)) {
      placeMore = false;
    } else {
      const previous = state.inventory[placeable] ?? new Decimal(0);

      if (maximum && previous.gte(maximum - 1)) {
        placeMore = false;
      }
    }

    if (placeMore) {
      const nextPosition = calculateNextPlacement({
        previousPosition,
        currentPosition: coordinates,
        dimensions,
      });
      const collisionDetected = detectCollision({
        name: placeable as CollectibleName,
        state,
        position: {
          ...nextPosition,
          width: dimensions.width,
          height: dimensions.height,
        },
        location,
      });

      send({
        type: "PLACE",
        nextOrigin: nextPosition,
        nextWillCollide: collisionDetected,
        location,
      });
      setPreviousPosition(coordinates);
    } else {
      send({ type: "PLACE", location });
      setPreviousPosition(coordinates);
    }
  }, [
    child.state,
    placeable,
    state,
    requirements,
    maximum,
    previousPosition,
    coordinates,
    dimensions,
    location,
    send,
  ]);

  const handleCancelPlacement = useCallback(() => {
    send("BACK");
  }, [send]);

  // Confirm placement on Enter/NumpadEnter; cancel on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!child.state.matches({ editing: "placing" })) return;

      if (e.key === "Escape") {
        e.preventDefault();
        handleCancelPlacement();
        return;
      }

      if (
        (e.key === "Enter" || e.key === "NumpadEnter") &&
        !collisionDetected
      ) {
        // Prevent default submit behavior
        e.preventDefault();
        handleConfirmPlacement();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [child, collisionDetected, handleCancelPlacement, handleConfirmPlacement]);

  const island = useSelector(
    gameService,
    (state) => state.context.state.island,
  );
  const season = useSelector(
    gameService,
    (state) => state.context.state.season.season,
  );

  const buildingLevel = useSelector(gameService, (state) =>
    isBuildingUpgradable(placeable as BuildingName)
      ? state.context.state[
          makeUpgradableBuildingKey(placeable as UpgradableBuildingType)
        ].level
      : undefined,
  );

  const getPlaceableImage = (
    placeable: LandscapingPlaceable,
    island: GameState["island"],
    season: TemperateSeasonName,
    level?: number,
  ) => {
    if (placeable && isBudName(placeable)) {
      return "";
    }
    if (!placeable) return "";
    return (
      ITEM_ICONS(season, getCurrentBiome(island), level)[placeable] ??
      ITEM_DETAILS[placeable].image
    );
  };

  if (!placeable) return null;

  const items = getChestItems(state);
  const available = isBudName(placeable)
    ? new Decimal(1)
    : items[placeable] ?? new Decimal(0);

  const image = getPlaceableImage(placeable, island, season, buildingLevel);

  const Hint = () => {
    if (!requirements) {
      return (
        <div className="flex justify-center items-center mb-1">
          <img src={image} className="h-6 mr-2 img-highlight" />
          <p className="text-sm">{`${available} ${t("available")}`}</p>
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
      placeable in LANDSCAPING_DECORATIONS ||
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
          style={{ height: `${PIXEL_SCALE * 17}px` }}
        >
          <Button onClick={handleCancelPlacement}>
            <img
              src={SUNNYSIDE.icons.cancel}
              alt="cancel"
              style={{ width: `${PIXEL_SCALE * 11}px` }}
            />
          </Button>

          <Button
            disabled={collisionDetected || isWrongLocation}
            onClick={handleConfirmPlacement}
          >
            <img
              src={SUNNYSIDE.icons.confirm}
              alt="confirm"
              style={{ width: `${PIXEL_SCALE * 12}px` }}
            />
          </Button>
        </div>
      </OuterPanel>
    </div>
  );
};
