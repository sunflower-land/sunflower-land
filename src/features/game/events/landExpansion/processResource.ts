import Decimal from "decimal.js-light";
import { ProcessedResource } from "features/game/types/processedFood";
import {
  BuildingProduct,
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import {
  FISH_PROCESSING_TIME_SECONDS,
  getFishProcessingRequirements,
} from "features/game/types/fishProcessing";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { ProcessingBuildingName } from "features/game/types/buildings";

export type ProcessProcessedResourceAction = {
  type: "processedResource.processed";
  item: ProcessedResource;
  buildingId: string;
  buildingName: ProcessingBuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: ProcessProcessedResourceAction;
  createdAt?: number;
};

export const MAX_FISH_PROCESSING_SLOTS = 4;

export function processProcessedResource({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { item, buildingId } = action;
    const building = game.buildings[action.buildingName]?.find(
      (building) => building.id === buildingId,
    );

    if (!building) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    if (!building.coordinates) {
      throw new Error("Building is not placed");
    }

    const processingQueue = building.processing ?? [];
    const availableSlots = hasVipAccess({ game })
      ? MAX_FISH_PROCESSING_SLOTS
      : 1;

    if (processingQueue.length >= availableSlots) {
      throw new Error("No available slots");
    }

    const season = game.season.season;
    const requirements: Inventory = getFishProcessingRequirements({
      item,
      season,
    });

    game.inventory = Object.entries(requirements).reduce(
      (inventory, [name, amount]) => {
        const count = inventory[name as InventoryItemName] ?? new Decimal(0);

        if (count.lt(amount ?? 0)) {
          throw new Error(`Insufficient ingredient: ${name}`);
        }

        return {
          ...inventory,
          [name]: count.sub(amount),
        };
      },
      game.inventory,
    );

    let startAt = createdAt;
    const lastReadyAt =
      processingQueue[processingQueue.length - 1]?.readyAt ?? createdAt;

    if (lastReadyAt > createdAt) {
      startAt = lastReadyAt;
    }

    const readyAt = startAt + FISH_PROCESSING_TIME_SECONDS[item] * 1000;

    building.processing = [
      ...processingQueue,
      {
        name: item,
        readyAt,
        startedAt: startAt,
        requirements,
      } as BuildingProduct,
    ];
  });
}
