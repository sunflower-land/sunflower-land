import { produce } from "immer";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState } from "features/game/types/game";
import { getObjectEntries } from "lib/object";
import {
  getSaltChargeGenerationTime,
  getSaltNodeCoordinates,
  SALT_FARM_UPGRADES,
} from "features/game/types/salt";
import { hasFeatureAccess } from "lib/flags";

export type UpgradeSaltFarmAction = {
  type: "saltFarm.upgraded";
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeSaltFarmAction;
  createdAt: number;
};

export function upgradeSaltFarm({
  state,
  action: _action,
  createdAt,
}: Options): GameState {
  if (!hasFeatureAccess(state, "SALT_FARM")) {
    throw new Error("Salt farm not enabled");
  }
  return produce(state, (copy) => {
    const { saltFarm } = copy;
    const nextLevel = saltFarm.level + 1;

    if (nextLevel > 4) {
      throw new Error("Salt farm is at max level");
    }

    const upgrade = SALT_FARM_UPGRADES[nextLevel];
    const { nodes: totalExpectedNodes, upgradeCost } = upgrade;

    if (state.coins < upgradeCost.coins) {
      throw new Error("Insufficient coins for upgrade");
    }
    const items = getObjectEntries(upgradeCost.items);

    items.forEach(([item, amount]) => {
      const requiredAmount = amount ?? new Decimal(0);
      const playerAmount = copy.inventory[item] ?? new Decimal(0);
      if (playerAmount.lt(requiredAmount)) {
        throw new Error(`Insufficient ${item} for upgrade`);
      }
      copy.inventory[item] = playerAmount.minus(requiredAmount);
    });

    copy.coins -= upgradeCost.coins;
    copy.farmActivity = trackFarmActivity(
      "Coins Spent",
      copy.farmActivity,
      new Decimal(upgradeCost.coins),
    );

    const currentNodes = Object.keys(saltFarm.nodes).length;
    const nodesToAdd: number = totalExpectedNodes - currentNodes;
    const interval = getSaltChargeGenerationTime({ gameState: copy });

    for (let i = 0; i < nodesToAdd; i++) {
      copy.saltFarm.nodes[`${currentNodes + i}`] = {
        createdAt,
        salt: {
          storedCharges: 1,
          nextChargeAt: createdAt + interval,
        },
        coordinates: {
          ...getSaltNodeCoordinates(
            copy.inventory["Basic Land"]?.toNumber() ?? 3,
            `${currentNodes + i}`,
          ),
        },
      };
    }
    copy.saltFarm.level = nextLevel;

    return copy;
  });
}
