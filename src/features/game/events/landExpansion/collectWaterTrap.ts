import { produce } from "immer";
import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { caughtCrustacean } from "features/game/types/crustaceans";
import { BoostName } from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getKeys } from "lib/object";

export type CollectWaterTrapAction = {
  type: "waterTrap.collected";
  trapId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectWaterTrapAction;
  createdAt?: number;
};

const getCrustaceanAmount = (
  game: GameState,
  amount: number,
): {
  boostedAmount: Decimal;
  boostsUsed: { name: BoostName; value: string }[];
} => {
  let boostedAmount = new Decimal(amount);
  const boostsUsed: { name: BoostName; value: string }[] = [];
  if (isCollectibleBuilt({ name: "Crab House", game })) {
    boostedAmount = boostedAmount.add(2);
    boostsUsed.push({ name: "Crab House", value: "+2" });
  }

  return { boostedAmount, boostsUsed };
};

export function collectWaterTrap({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const trapSpots = game.crabTraps.trapSpots || {};
    const waterTrap = trapSpots[action.trapId]?.waterTrap;

    if (!waterTrap) {
      throw new Error("No water trap placed at this spot");
    }

    if (waterTrap.readyAt > createdAt) {
      throw new Error("Trap is not ready to collect yet");
    }

    const caught =
      waterTrap.caught ?? caughtCrustacean(waterTrap.type, waterTrap.chum);
    const boostsUsed: { name: BoostName; value: string }[] = [];
    getKeys(caught).forEach((name) => {
      const { boostedAmount, boostsUsed: caughtBoostsUsed } =
        getCrustaceanAmount(game, caught[name] ?? 1);
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(boostedAmount);
      boostsUsed.push(...caughtBoostsUsed);
    });

    getKeys(caught).forEach((itemName) => {
      game.farmActivity = trackFarmActivity(
        `${itemName} Caught`,
        game.farmActivity,
        new Decimal(caught[itemName] ?? 0),
      );
      if (waterTrap.chum) {
        game.farmActivity = trackFarmActivity(
          `${itemName} Caught with ${waterTrap.chum}`,
          game.farmActivity,
          new Decimal(caught[itemName] ?? 0),
        );
      }
    });

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: boostsUsed,
      createdAt,
    });

    delete trapSpots[action.trapId].waterTrap;
  });
}
