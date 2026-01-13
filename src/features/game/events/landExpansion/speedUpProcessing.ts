import Decimal from "decimal.js-light";
import { ProcessingBuildingName } from "features/game/types/buildings";
import { BuildingProduct, GameState } from "features/game/types/game";
import { produce } from "immer";
import { getInstantGems } from "./speedUpRecipe";
import { recalculateProcessingQueue } from "./cancelProcessedResource";

export type SpeedUpProcessingAction = {
  type: "processing.spedUp";
  buildingId: string;
  buildingName: ProcessingBuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpProcessingAction;
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
      throw new Error("Insufficient gems");
    }

    const gems = getInstantGems({
      readyAt: currentProcessingItem.readyAt,
      now: createdAt,
      game,
    });

    game.inventory["Gem"] = gemsInventory.sub(gems);
    game.inventory[currentProcessingItem.name] = (
      game.inventory[currentProcessingItem.name] ?? new Decimal(0)
    ).add(1);

    const queue = building.processing ?? [];
    const queueWithoutSpedUpItem = queue.filter(
      (item) => item.readyAt !== currentProcessingItem.readyAt,
    );

    building.processing = recalculateProcessingQueue({
      queue: queueWithoutSpedUpItem,
      isInstantReady: true,
      createdAt,
    });
  });
};
