import Decimal from "decimal.js-light";
import { ProcessedFood } from "features/game/types/processedFood";
import {
  GameState,
  Inventory,
  InventoryItemName,
  ProcessedProduct,
} from "features/game/types/game";
import {
  FISH_PROCESSING_TIME_SECONDS,
  getFishProcessingRequirements,
} from "features/game/types/fishProcessing";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { hasVipAccess } from "features/game/lib/vipAccess";

export type ProcessProcessedFoodAction = {
  type: "processedFood.processed";
  item: ProcessedFood;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ProcessProcessedFoodAction;
  createdAt?: number;
};

export const MAX_FISH_PROCESSING_SLOTS = 4;

export function processProcessedFood({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { item, buildingId } = action;
    const fishMarket = game.buildings["Fish Market"]?.find(
      (building) => building.id === buildingId,
    );

    if (item === "Crab Stick") {
      throw new Error("Crab Stick processing is not available yet");
    }

    if (!fishMarket) {
      throw new Error(translate("error.requiredBuildingNotExist"));
    }

    if (!fishMarket.coordinates) {
      throw new Error("Building is not placed");
    }

    if (!game.bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const processingQueue = fishMarket.processing ?? [];
    const availableSlots = hasVipAccess({ game })
      ? MAX_FISH_PROCESSING_SLOTS
      : 1;

    if (processingQueue.length >= availableSlots) {
      throw new Error(translate("error.noAvailableSlots"));
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

    const readyAt = startAt + FISH_PROCESSING_TIME_SECONDS * 1000;

    fishMarket.processing = [
      ...processingQueue,
      {
        name: item,
        readyAt,
        startedAt: startAt,
        requirements,
      } as ProcessedProduct,
    ];
  });
}
