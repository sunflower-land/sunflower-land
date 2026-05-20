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
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type CollectProcessedResourceAction = {
  type: "processedResource.collected";
  buildingId: string;
  buildingName: ProcessingBuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectProcessedResourceAction;
  createdAt?: number;
  farmId: number;
};

export function getProcessedResourceAmount({
  game,
  resource,
  farmId,
  counter,
}: {
  game: GameState;
  resource: ProcessedResource;
  farmId: number;
  // Processed count for this resource *before* this item is collected.
  // In-game callers pass `farmActivity[`${resource} Processed`] ?? 0`.
  // Batch predictors must increment this per same-resource slot so
  // successive jobs roll independent Bubble Aura dice.
  counter: number;
}): { amount: Decimal; boostsUsed: { name: BoostName; value: string }[] } {
  let amount = new Decimal(1);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (
    isWearableActive({ game, name: "Bubble Aura" }) &&
    prngChance({
      farmId,
      itemId: KNOWN_IDS[resource],
      counter,
      chance: 20,
      criticalHitName: "Bubble Aura",
    })
  ) {
    amount = amount.add(1);
    boostsUsed.push({ name: "Bubble Aura", value: "+1" });
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

    const boostsUsed: { name: BoostName; value: string }[] = [];

    ready.forEach((processed) => {
      const resource = processed.name as ProcessedResource;
      const { amount, boostsUsed: itemBoosts } = getProcessedResourceAmount({
        game,
        resource,
        farmId,
        counter: game.farmActivity[`${resource} Processed`] ?? 0,
      });
      boostsUsed.push(...itemBoosts);

      const previous = game.inventory[processed.name] ?? new Decimal(0);
      game.inventory[processed.name] = previous.add(amount);

      game.farmActivity = trackFarmActivity(
        `${processed.name} Processed` as `${ProcessedResource} Processed`,
        game.farmActivity,
      );
    });

    if (boostsUsed.length > 0) {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: boostsUsed,
        createdAt,
      });
    }
  });
}
