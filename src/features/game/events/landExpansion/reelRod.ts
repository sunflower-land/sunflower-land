import { getObjectEntries } from "lib/object";
import { GameState } from "../../types/game";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { produce } from "immer";
import { getKeys } from "lib/object";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export const SHRIMP_ONESIE_REEL_INTERVAL = 15;

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
    const caughtPerReel = game.fishing.wharf.caughtPerReel;

    const reelsReeled =
      caughtPerReel?.length ?? game.fishing.wharf.multiplier ?? 1;
    const previousReels = game.farmActivity["Rod Reeled"] ?? 0;

    const shrimpOnesieActive = isWearableActive({
      game,
      name: "Shrimp Onesie",
    });

    // Compute the per-fish bonus by walking each reel's catch and crediting
    // +1 of every fish caught on a milestone reel. Fish caught on
    // non-milestone reels in the same bulk are unaffected.
    const shrimpOnesieBonusByFish: Partial<
      Record<keyof typeof caught, number>
    > = {};
    if (shrimpOnesieActive && caughtPerReel) {
      caughtPerReel.forEach((reelCatch, index) => {
        const lifetimeReel = previousReels + index + 1;
        if (lifetimeReel % SHRIMP_ONESIE_REEL_INTERVAL !== 0) {
          return;
        }
        getObjectEntries(reelCatch).forEach(([name, amount]) => {
          if ((amount ?? 0) > 0) {
            shrimpOnesieBonusByFish[name] =
              (shrimpOnesieBonusByFish[name] ?? 0) + 1;
          }
        });
      });
    }

    const adjustedAmount = (
      name: keyof typeof caught,
      amount: number | undefined,
    ) => (amount ?? 0) + (shrimpOnesieBonusByFish[name] ?? 0);

    getObjectEntries(caught).forEach(([name, amount]) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(adjustedAmount(name, amount));
    });

    // Track farm activity
    getObjectEntries(caught).forEach(([itemName, amount]) => {
      game.farmActivity = trackFarmActivity(
        `${itemName} Caught`,
        game.farmActivity,
        new Decimal(adjustedAmount(itemName, amount)),
      );
    });

    game.farmActivity = trackFarmActivity(
      "Rod Reeled",
      game.farmActivity,
      new Decimal(reelsReeled),
    );

    const totalShrimpOnesieBonus = Object.values(
      shrimpOnesieBonusByFish,
    ).reduce<number>((sum, n) => sum + (n ?? 0), 0);
    if (totalShrimpOnesieBonus > 0) {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: [
          {
            name: "Shrimp Onesie",
            value: `+${totalShrimpOnesieBonus} fish`,
          },
        ],
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
    delete game.fishing.wharf.caughtPerReel;
    delete game.fishing.wharf.chum;
    delete game.fishing.wharf.multiplier;
    delete game.fishing.wharf.guaranteedCatch;
    delete game.fishing.wharf.maps;

    return game;
  });
}
