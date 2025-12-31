import Decimal from "decimal.js-light";
import { ProcessedFood } from "features/game/types/processedFood";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { BuildingProduct, GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  FoodProcessingBuildingName,
  isFoodProcessingBuilding,
} from "features/game/types/buildings";

export type CollectProcessedFoodAction = {
  type: "processedFood.collected";
  buildingId: string;
  buildingName: FoodProcessingBuildingName;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectProcessedFoodAction;
  createdAt?: number;
};

export function collectProcessedFood({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!isFoodProcessingBuilding(action.buildingName)) {
      throw new Error("Invalid food processing building");
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
      const previous = game.inventory[processed.name] ?? new Decimal(0);
      game.inventory[processed.name] = previous.add(1);

      game.farmActivity = trackFarmActivity(
        `${processed.name} Processed` as `${ProcessedFood} Processed`,
        game.farmActivity,
      );
    });
  });
}
