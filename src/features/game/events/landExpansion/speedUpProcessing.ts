import Decimal from "decimal.js-light";
import { FoodProcessingBuildingName } from "features/game/types/buildings";
import { BuildingProduct, GameState } from "features/game/types/game";
import { produce } from "immer";
import { getInstantGems } from "./speedUpRecipe";

export type SpeedUpProcessing = {
  type: "processing.spedUp";
  buildingId: string;
  buildingName: FoodProcessingBuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpProcessing;
  createdAt?: number;
  farmId: number;
};

const getCurrentProcessingItem = ({
  building,
  createdAt,
}: {
  building: { processing?: BuildingProduct[] };
  createdAt: number;
}): BuildingProduct | undefined => {
  return building.processing?.find((item) => item.readyAt > createdAt);
};

export const speedUpProcessing = ({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState => {
  return produce(state, (game) => {
    const building = game.buildings[action.buildingName]?.find(
      (building) => building.id === action.buildingId,
    );

    if (!building) {
      throw new Error("Building does not exist");
    }

    const processing = building.processing ?? [];

    const currentProcessingItem = getCurrentProcessingItem({
      building,
      createdAt,
    });

    if (!currentProcessingItem) {
      throw new Error("Nothing is processing");
    }

    const gemsRequired = getInstantGems({
      readyAt: currentProcessingItem.readyAt,
      now: createdAt,
      game,
    });

    const gemsInventory = game.inventory["Gem"] ?? new Decimal(0);

    if (!gemsInventory.gte(gemsRequired)) {
      throw new Error("Insufficient Gems");
    }

    // const gems = getInstantGems({
    //   readyAt: currentProcessingItem.readyAt,
    //   now: createdAt,
    //   game,
    // });
  });
};
