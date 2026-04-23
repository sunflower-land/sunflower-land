import { produce } from "immer";
import Decimal from "decimal.js-light";
import { BoostName, GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getKeys } from "lib/object";
import {
  caughtCrustacean,
  CrustaceanName,
} from "features/game/types/crustaceans";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { isWearableActive } from "features/game/lib/wearables";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";

export type CollectWaterTrapAction = {
  type: "waterTrap.collected";
  trapId: string;
};

type Options = {
  farmId: number;
  state: Readonly<GameState>;
  action: CollectWaterTrapAction;
  createdAt?: number;
};

const getCrustaceanAmount = (
  game: GameState,
  amount: number,
  crustaceanName: CrustaceanName,
  prngArgs?: { farmId: number; counter: number },
): { boostedAmount: Decimal; boostsUsed: BoostName[] } => {
  let boostedAmount = new Decimal(amount);
  const boostsUsed: BoostName[] = [];

  if (prngArgs) {
    const { farmId, counter } = prngArgs;
    if (
      isWearableActive({ game, name: "Pistol Shrimp" }) &&
      prngChance({
        farmId,
        itemId: KNOWN_IDS[crustaceanName],
        counter,
        chance: 20,
        criticalHitName: "Pistol Shrimp",
      })
    ) {
      boostedAmount = boostedAmount.add(1);
      boostsUsed.push("Pistol Shrimp");
    }
  }

  if (isCollectibleBuilt({ name: "Crab House", game })) {
    boostedAmount = boostedAmount.add(2);
    boostsUsed.push("Crab House");
  }

  return { boostedAmount, boostsUsed };
};

export function collectWaterTrap({
  farmId,
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
    const boostsUsed: BoostName[] = [];
    getKeys(caught).forEach((name) => {
      const prngArgs = {
        farmId,
        counter: game.farmActivity[`${name} Caught`] ?? 0,
      };
      const { boostedAmount, boostsUsed: caughtBoostsUsed } =
        getCrustaceanAmount(game, caught[name] ?? 1, name, prngArgs);
      const previous = game.inventory[name] ?? new Decimal(0);
      game.inventory[name] = previous.add(boostedAmount);
      boostsUsed.push(...caughtBoostsUsed);
    });

    getKeys(caught).forEach((itemName) => {
      game.farmActivity = trackFarmActivity(
        `${itemName} Caught`,
        game.farmActivity,
      );
      if (waterTrap.chum) {
        game.farmActivity = trackFarmActivity(
          `${itemName} Caught with ${waterTrap.chum}`,
          game.farmActivity,
        );
      }
    });

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: boostsUsed.map((name) => ({
        name,
        value:
          name === "Crab House" ? "+2" : name === "Pistol Shrimp" ? "+1" : "",
      })),
      createdAt,
    });

    delete trapSpots[action.trapId].waterTrap;
  });
}
