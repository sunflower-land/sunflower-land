import { getObjectEntries } from "lib/object";
import { GameState } from "../../types/game";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import { getKeys } from "lib/object";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

const SHRIMP_ONESIE_REEL_INTERVAL = 15;

export type ReelRodAction = {
  type: "rod.reeled";
  location?: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ReelRodAction;
  createdAt?: number;
};

export function reelRod({ state, createdAt = Date.now() }: Options): GameState {
  return produce(state, (game) => {
    if (!game.fishing.wharf.castedAt) {
      throw new Error("Nothing has been casted");
    }

    const caught = game.fishing.wharf.caught ?? {};

    const totalReels = (game.farmActivity["Rod Reeled"] ?? 0) + 1;
    const isMilestoneReel =
      totalReels > 0 && totalReels % SHRIMP_ONESIE_REEL_INTERVAL === 0;
    const shrimpOnesieActive = isWearableActive({
      game,
      name: "Shrimp Onesie",
    });
    const shrimpOnesieTriggered = isMilestoneReel && shrimpOnesieActive;

    getObjectEntries(caught).forEach(([name, amount]) => {
      const baseAmount = amount ?? 0;
      const totalAmount = shrimpOnesieTriggered ? baseAmount + 1 : baseAmount;
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(totalAmount);
    });

    // Track farm activity
    getObjectEntries(caught).forEach(([itemName, amount]) => {
      const baseAmount = amount ?? 0;
      const totalAmount = shrimpOnesieTriggered ? baseAmount + 1 : baseAmount;
      game.farmActivity = trackFarmActivity(
        `${itemName} Caught`,
        game.farmActivity,
        new Decimal(totalAmount),
      );
    });

    game.farmActivity = trackFarmActivity(
      "Rod Reeled",
      game.farmActivity,
      new Decimal(1),
    );

    if (shrimpOnesieTriggered) {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: [{ name: "Shrimp Onesie", value: "+1 of each fish" }],
        createdAt,
      });
    }

    const maps = game.fishing.wharf.maps;

    if (maps) {
      getKeys(maps).forEach((map) => {
        game.farmActivity = trackFarmActivity(
          `${map} Map Piece Found`,
          game.farmActivity,
          new Decimal(maps[map] ?? 0),
        );
      });

      if (isCollectibleBuilt({ game, name: "Anemone Flower" })) {
        game.boostsUsedAt = updateBoostUsed({
          game,
          boostNames: [{ name: "Anemone Flower", value: "+1 Attempt" }],
          createdAt,
        });
      }
    }

    delete game.fishing.wharf.castedAt;
    delete game.fishing.wharf.caught;
    delete game.fishing.wharf.chum;
    delete game.fishing.wharf.multiplier;
    delete game.fishing.wharf.guaranteedCatch;
    delete game.fishing.wharf.maps;

    return game;
  });
}
