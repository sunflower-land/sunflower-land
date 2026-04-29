import Decimal from "decimal.js-light";
import { ProcessedResource } from "features/game/types/processedFood";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  BoostName,
  BuildingProduct,
  GameState,
} from "features/game/types/game";
import { produce } from "immer";
import {
  ProcessingBuildingName,
  isProcessingBuilding,
} from "features/game/types/buildings";
import { isWearableActive } from "features/game/lib/wearables";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";

export type CollectProcessedResourceAction = {
  type: "processedResource.collected";
  buildingId: string;
  buildingName: ProcessingBuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectProcessedResourceAction;
  createdAt?: number;
  farmId?: number;
};

export function getProcessedResourceAmount({
  game,
  resource,
  farmId,
}: {
  game: GameState;
  resource: ProcessedResource;
  farmId?: number;
}): { amount: Decimal; boostsUsed: BoostName[] } {
  let amount = new Decimal(1);
  const boostsUsed: BoostName[] = [];

  if (
    farmId !== undefined &&
    isWearableActive({ game, name: "Deep Sea Salt Cave Background" }) &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[resource],
      counter: game.farmActivity[`${resource} Processed`] ?? 0,
      chance: 20,
      criticalHitName: "Deep Sea Salt Cave Background",
    })
  ) {
    amount = amount.add(1);
    boostsUsed.push("Deep Sea Salt Cave Background");
  }

  return { amount, boostsUsed };
}

export function collectProcessedResource({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  return produce(state, (game) => {
    if (!isProcessingBuilding(action.buildingName)) {
      throw new Error("Invalid resource processing building");
    }

    const building = game.buildings[action.buildingName]?.find(
      (building) => building.id === action.buildingId,
    );

    if (!building) {
      throw new Error("Fish Market does not exist");
    }

    const processing: BuildingProduct[] = building.processing ?? [];

    if (!processing.length) {
      throw new Error("Fish Market is not processing");
    }

    const ready = processing.filter(
      (processed) => processed.readyAt <= createdAt,
    );

    if (!ready.length) {
      throw new Error("No processed food ready");
    }

    building.processing = processing.filter(
      (processed) => processed.readyAt > createdAt,
    );

    ready.forEach((processed) => {
      const { amount } = getProcessedResourceAmount({
        game,
        resource: processed.name as ProcessedResource,
        farmId,
      });

      const previous = game.inventory[processed.name] ?? new Decimal(0);
      game.inventory[processed.name] = previous.add(amount);

      game.farmActivity = trackFarmActivity(
        `${processed.name} Processed` as `${ProcessedResource} Processed`,
        game.farmActivity,
      );
    });
  });
}
