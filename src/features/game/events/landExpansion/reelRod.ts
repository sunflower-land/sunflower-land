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

    const reelsReeled = game.fishing.wharf.multiplier ?? 1;
    const previousReels = game.farmActivity["Rod Reeled"] ?? 0;
    const milestoneReels =
      Math.floor((previousReels + reelsReeled) / SHRIMP_ONESIE_REEL_INTERVAL) -
      Math.floor(previousReels / SHRIMP_ONESIE_REEL_INTERVAL);

    const shrimpOnesieActive = isWearableActive({
      game,
      name: "Shrimp Onesie",
    });
    const shrimpOnesieBonus =
      milestoneReels > 0 && shrimpOnesieActive ? milestoneReels : 0;

    // Bonus only applies to fish actually caught — never mints from
    // zero-valued / undefined catch entries.
    const adjustedAmount = (amount: number | undefined) => {
      const baseAmount = amount ?? 0;
      return baseAmount > 0 ? baseAmount + shrimpOnesieBonus : baseAmount;
    };

    getObjectEntries(caught).forEach(([name, amount]) => {
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(adjustedAmount(amount));
    });

    // Track farm activity
    getObjectEntries(caught).forEach(([itemName, amount]) => {
      game.farmActivity = trackFarmActivity(
        `${itemName} Caught`,
        game.farmActivity,
        new Decimal(adjustedAmount(amount)),
      );
    });

    game.farmActivity = trackFarmActivity(
      "Rod Reeled",
      game.farmActivity,
      new Decimal(reelsReeled),
    );

    const fishWasCaught = Object.values(caught).some((a) => (a ?? 0) > 0);
    if (shrimpOnesieBonus > 0 && fishWasCaught) {
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: [
          {
            name: "Shrimp Onesie",
            value: `+${shrimpOnesieBonus} of each fish`,
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
    delete game.fishing.wharf.chum;
    delete game.fishing.wharf.multiplier;
    delete game.fishing.wharf.guaranteedCatch;
    delete game.fishing.wharf.maps;

    return game;
  });
}
