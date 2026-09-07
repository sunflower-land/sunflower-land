import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import type {
  CraftingQueueItem,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import type { BumpkinItem } from "features/game/types/bumpkin";
import { produce } from "immer";
import { getCraftingBoostWindows } from "features/game/lib/boostWindows";
import { resolveCraftingQueueTimings } from "features/game/lib/craftingReadiness";

export type CollectCraftingAction = {
  type: "crafting.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectCraftingAction;
  createdAt?: number;
};

export function grantCraftedItem(
  item: Pick<CraftingQueueItem, "type" | "name">,
  game: GameState,
): void {
  if (item.type === "collectible") {
    const name = item.name as InventoryItemName;
    game.inventory[name] = (game.inventory[name] || new Decimal(0)).plus(1);
  } else {
    const name = item.name as BumpkinItem;
    game.wardrobe[name] = (game.wardrobe[name] || 0) + 1;
  }
  game.farmActivity = trackFarmActivity(
    `${item.name} Crafted`,
    game.farmActivity,
  );
}

export function collectCrafting({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { craftingBox } = copy;
    const queue = craftingBox.queue ?? [];

    if (queue.length === 0) {
      throw new Error("No item to collect");
    }

    // A lifted box keeps crafting while it sits in the inventory - the pause is
    // only applied when it is placed back down, so collecting from an unplaced
    // one would side-step it entirely. The queue lives on `game.craftingBox`, not
    // on the building, so lifting it does not put it out of reach on its own.
    if (
      !(copy.buildings["Crafting Box"] ?? []).some(
        (b) => b.coordinates !== undefined,
      )
    ) {
      throw new Error("Crafting Box is not placed");
    }

    // Readiness comes from the DERIVED chain, not each craft's stored `readyAt` -
    // that value is a cache, and a boost placed since the queue was last rewritten
    // will have pulled the real ready time forward.
    const timings = resolveCraftingQueueTimings({
      queue,
      windows: getCraftingBoostWindows(copy),
    });

    const nothingReady = timings.every((timing) => timing.readyAt > createdAt);
    if (nothingReady) {
      throw new Error("No items are ready");
    }

    const remainingQueue = queue.reduce<CraftingQueueItem[]>(
      (acc, item, index) => {
        if (timings[index].readyAt <= createdAt) {
          grantCraftedItem(item, copy);
          return acc;
        }

        // An empty accumulator means every craft ahead of this one was just
        // collected, so a CHAINED craft (no `startedAt`, because its start WAS the
        // derived time the box freed up) has nothing left to chain to. Stamp on the
        // start the resolver already derived for it: it is in the past, so no
        // progress is invented or lost, and the resolver never has to guess a start
        // it cannot recover (see `resolveCraftingQueueTimings`).
        //
        // Note this uses the craft's OWN derived start, not the previous entry's
        // ready time as cooking does - the entry immediately ahead may have been a
        // Fox Shrine proc, which never occupied the box.
        const derivedStart = timings[index].startedAt;
        if (
          acc.length === 0 &&
          index > 0 &&
          item.startedAt === undefined &&
          item.baseDurationMs !== undefined &&
          derivedStart !== undefined
        ) {
          return [
            ...acc,
            {
              ...item,
              startedAt: derivedStart,
              // Keep the cache in step with what the chain now derives.
              readyAt: timings[index].readyAt,
            },
          ];
        }

        return [...acc, item];
      },
      [],
    );

    copy.craftingBox.queue = remainingQueue;

    if (remainingQueue.length === 0) {
      copy.craftingBox.status = "idle";
    }
  });
}
