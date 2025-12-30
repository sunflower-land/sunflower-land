import Decimal from "decimal.js-light";
import { ProcessedFood } from "features/game/types/processedFood";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type CollectProcessedFoodAction = {
  type: "processedFood.collected";
  buildingId: string;
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
    const fishMarket = game.buildings["Fish Market"]?.find(
      (building) => building.id === action.buildingId,
    );

    if (!fishMarket) {
      throw new Error("Fish Market does not exist");
    }

    if (!game.bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const processing = fishMarket.processing ?? [];

    if (!processing.length) {
      throw new Error("Fish Market is not processing");
    }

    const ready = processing.filter(
      (processed) => processed.readyAt <= createdAt,
    );

    if (!ready.length) {
      throw new Error("No processed fish ready");
    }

    fishMarket.processing = processing.filter(
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
