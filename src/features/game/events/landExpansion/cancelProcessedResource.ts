import Decimal from "decimal.js-light";
import { produce } from "immer";

import {
  FISH_PROCESSING_TIME_SECONDS,
  getFishProcessingRequirements,
} from "features/game/types/fishProcessing";
import {
  BuildingProduct,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import {
  ProcessingBuildingName,
  isProcessingBuilding,
} from "features/game/types/buildings";
import {
  PROCESSED_FOODS,
  ProcessedFood,
} from "features/game/types/processedFood";

export type CancelProcessedResourceAction = {
  type: "processedResource.cancelled";
  buildingName: ProcessingBuildingName;
  buildingId: string;
  queueItem: BuildingProduct;
};

type Options = {
  state: Readonly<GameState>;
  action: CancelProcessedResourceAction;
  createdAt?: number;
};

function getCurrentProcessingItem({
  building,
  createdAt,
}: {
  building: { processing?: BuildingProduct[] };
  createdAt: number;
}) {
  const queue = building.processing;
  const sortedByReadyAt = queue?.sort(
    (a: BuildingProduct, b: BuildingProduct) => a.readyAt - b.readyAt,
  );

  if (!queue) return;

  return sortedByReadyAt?.find((item) => item.readyAt > createdAt);
}

export function assertProcessedFood(name: string): ProcessedFood {
  if (!(name in PROCESSED_FOODS)) {
    throw new Error(`Invalid processed food: ${name}`);
  }

  return name as ProcessedFood;
}

export function recalculateProcessingQueue({
  queue,
  isInstantReady,
  createdAt,
}: {
  queue: BuildingProduct[];
  isInstantReady: boolean;
  createdAt: number;
}): BuildingProduct[] {
  const ready = queue.filter((item) => item.readyAt <= createdAt);
  const upcoming = queue.filter((item) => item.readyAt > createdAt);

  if (isInstantReady) {
    const updatedProcessing = upcoming.reduce((items, item, index) => {
      const startAt = index === 0 ? createdAt : items[index - 1].readyAt;
      const readyAt =
        startAt +
        FISH_PROCESSING_TIME_SECONDS[item.name as ProcessedFood] * 1000;

      return [...items, { ...item, readyAt }];
    }, [] as BuildingProduct[]);

    return [...ready, ...updatedProcessing];
  }

  // Keep the currently processing item as-is
  const current = upcoming[0];
  const remaining = upcoming.slice(1);

  const updatedRemaining = remaining.reduce((items, item, index) => {
    const startAt = index === 0 ? current.readyAt : items[index - 1].readyAt;
    const readyAt =
      startAt + FISH_PROCESSING_TIME_SECONDS[item.name as ProcessedFood] * 1000;

    return [
      ...items,
      {
        ...item,
        startedAt: startAt,
        readyAt,
      },
    ];
  }, [] as BuildingProduct[]);

  return [...ready, current, ...updatedRemaining];
}

export function cancelProcessedResource({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { buildingId, buildingName, queueItem } = action;

    if (!isProcessingBuilding(buildingName)) {
      throw new Error("Invalid resource processing building");
    }

    const building = game.buildings[buildingName]?.find(
      (b) => b.id === buildingId,
    );

    if (!building) {
      throw new Error("Required building does not exist");
    }

    const queue = building.processing ?? [];

    if (!queue.length) {
      throw new Error("No queue exists");
    }

    const productIndex = queue.findIndex(
      (p) => p.name === queueItem.name && p.readyAt === queueItem.readyAt,
    );

    if (productIndex === -1) {
      throw new Error("Product does not exist");
    }

    const currentProcessingItem = getCurrentProcessingItem({
      building,
      createdAt,
    });

    const product = queue[productIndex];

    if (currentProcessingItem?.readyAt === product.readyAt) {
      throw new Error(
        `Processed item ${queueItem.name} with readyAt ${product.readyAt} is currently being processed`,
      );
    }

    const requirements =
      product.requirements ??
      getFishProcessingRequirements({
        item: assertProcessedFood(product.name),
        season: game.season.season,
      });

    // Refund requirements
    game.inventory = Object.entries(requirements).reduce(
      (inventory, [ingredient, amount]) => {
        const count =
          inventory[ingredient as InventoryItemName] ?? new Decimal(0);

        return {
          ...inventory,
          [ingredient]: count.add(amount ?? 0),
        };
      },
      game.inventory,
    );

    const remainingQueue = queue.filter((_, index) => index !== productIndex);

    building.processing = recalculateProcessingQueue({
      queue: remainingQueue,
      isInstantReady: false,
      createdAt,
    });

    return game;
  });
}
