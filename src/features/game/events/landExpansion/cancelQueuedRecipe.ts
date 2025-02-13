import { BuildingName } from "features/game/types/buildings";
import {
  BuildingProduct,
  Cancelled,
  GameState,
  PlacedItem,
} from "features/game/types/game";
import { produce } from "immer";

export type CancelQueuedRecipeAction = {
  type: "recipe.cancelled";
  buildingName: BuildingName;
  buildingId: string;
  queueItem: BuildingProduct;
};

type Options = {
  state: Readonly<GameState>;
  action: CancelQueuedRecipeAction;
  createdAt?: number;
};

export function getCurrentCookingItem({
  building,
  createdAt,
}: {
  building: PlacedItem;
  createdAt: number;
}) {
  const queue = building.crafting;
  const sortedByReadyAt = queue?.sort(
    (a: BuildingProduct, b: BuildingProduct) => a.readyAt - b.readyAt,
  );

  if (!queue) return;

  const cooking = sortedByReadyAt?.find((recipe) => recipe.readyAt > createdAt);

  return cooking;
}

export function cancelQueuedRecipe({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const { queueItem, buildingName, buildingId } = action;
    const buildings = game.buildings[buildingName];
    const building = buildings?.find((b) => b.id === buildingId);

    if (!building) {
      throw new Error("Building does not exist");
    }

    const queue = building.crafting;

    if (!queue) {
      throw new Error("No queue exists");
    }

    const recipe = queue.find(
      (r) => JSON.stringify(r) === JSON.stringify(queueItem),
    );

    if (!recipe) {
      throw new Error("Recipe does not exist");
    }

    const currentCookingItem = getCurrentCookingItem({
      building,
      createdAt,
    });

    if (currentCookingItem?.readyAt === recipe.readyAt) {
      throw new Error(
        `Recipe ${queueItem.name} with readyAt ${recipe.readyAt} is currently being cooked`,
      );
    }

    const newQueue = queue.filter((r) => r.readyAt !== recipe.readyAt);

    if (recipe.boost?.Oil) {
      building.oil = (building.oil ?? 0) + recipe.boost.Oil;
    }

    building.crafting = newQueue;

    const cancelled = building.cancelled || ({} as Cancelled);

    cancelled[recipe.name] = {
      count: (cancelled[recipe.name]?.count || 0) + 1,
      cancelledAt: createdAt,
    };

    building.cancelled = cancelled;

    return game;
  });
}
