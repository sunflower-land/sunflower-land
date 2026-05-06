import Decimal from "decimal.js-light";
import { ProcessingBuildingName } from "features/game/types/buildings";
import { BuildingProduct, GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  chargeCoinsForSpeedUp,
  getInstantGems,
  makeGemHistory,
  SpeedUpPaymentMethod,
} from "features/game/lib/getInstantGems";
import { recalculateProcessingQueue } from "./cancelProcessedResource";
import { getProcessedResourceAmount } from "./collectProcessedResource";
import { ProcessedResource } from "features/game/types/processedFood";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type SpeedUpProcessingAction = {
  type: "processing.spedUp";
  buildingId: string;
  buildingName: ProcessingBuildingName;
  paymentMethod?: SpeedUpPaymentMethod;
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
  farmId,
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

    const gems = getInstantGems({
      readyAt: currentProcessingItem.readyAt,
      now: createdAt,
      game,
    });

    if (action.paymentMethod === "coins") {
      game = chargeCoinsForSpeedUp({ game, gems, createdAt });
    } else {
      const gemsInventory = game.inventory["Gem"] ?? new Decimal(0);

      if (!gemsInventory.gte(gems)) {
        throw new Error("Insufficient gems");
      }

      game.inventory["Gem"] = gemsInventory.sub(gems);
      game = makeGemHistory({ game, amount: gems, createdAt });
    }

    const { amount, boostsUsed } = getProcessedResourceAmount({
      game,
      resource: currentProcessingItem.name as ProcessedResource,
      farmId,
    });

    game.inventory[currentProcessingItem.name] = (
      game.inventory[currentProcessingItem.name] ?? new Decimal(0)
    ).add(amount);

    game.farmActivity = trackFarmActivity(
      `${currentProcessingItem.name} Processed` as `${ProcessedResource} Processed`,
      game.farmActivity,
    );

    if (boostsUsed.length > 0) {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: boostsUsed,
        createdAt,
      });
    }

    const queue = building.processing ?? [];
    const queueWithoutSpedUpItem = queue.filter(
      (item) => item.readyAt !== currentProcessingItem.readyAt,
    );

    building.processing = recalculateProcessingQueue({
      queue: queueWithoutSpedUpItem,
      isInstantReady: true,
      createdAt,
      game,
    });
  });
};
