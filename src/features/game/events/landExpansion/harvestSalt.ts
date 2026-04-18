import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SEA_BLESSED_CHANCE,
  SEA_BLESSED_NODE_COUNT,
  getSaltChargeGenerationTime,
  getSaltYieldPerRake,
  getStoredSaltCharges,
  materializeSaltRegen,
  syncSaltNode,
  getMaxStoredSaltCharges,
} from "features/game/types/salt";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getKeys } from "lib/object";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export enum HARVEST_SALT_ERRORS {
  SALT_NODE_NOT_FOUND = "Salt node not found",
  NOT_ENOUGH_CHARGES = "Not enough salt charges",
  NOT_ENOUGH_SALT_RAKES = "Not enough Salt Rakes",
  SALT_FARM_NOT_ENABLED = "Salt farm not enabled",
}

export type HarvestSaltAction = {
  type: "salt.harvested";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestSaltAction;
  createdAt?: number;
  farmId: number;
};

export function harvestSalt({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options): GameState {
  if (!hasFeatureAccess(state, "SALT_FARM")) {
    throw new Error(HARVEST_SALT_ERRORS.SALT_FARM_NOT_ENABLED);
  }

  return produce(state, (copy) => {
    const saltNode = copy.saltFarm.nodes[action.id];
    if (!saltNode) {
      throw new Error(HARVEST_SALT_ERRORS.SALT_NODE_NOT_FOUND);
    }

    const { chargeGenerationTimeMs: interval, boostsUsed } =
      getSaltChargeGenerationTime({
        gameState: copy,
      });
    const maxCharges = getMaxStoredSaltCharges(
      copy.sculptures?.["Salt Sculpture"]?.level ?? 0,
    );
    const syncOpts = { chargeIntervalMs: interval, maxCharges };
    const syncedNode = syncSaltNode(saltNode, createdAt, syncOpts);
    const storedCharges = getStoredSaltCharges(syncedNode, createdAt, syncOpts);

    if (storedCharges < 1) {
      throw new Error(HARVEST_SALT_ERRORS.NOT_ENOUGH_CHARGES);
    }

    const legacyReadySlots = syncedNode.salt.harvesting?.slots.length ?? 0;
    const availableRakes = copy.inventory["Salt Rake"] ?? new Decimal(0);
    if (availableRakes.lt(1)) {
      throw new Error(HARVEST_SALT_ERRORS.NOT_ENOUGH_SALT_RAKES);
    }
    const saltPerRake = getSaltYieldPerRake(copy);
    const legacySalt = legacyReadySlots * saltPerRake;

    const saltInInventory = copy.inventory["Salt"] ?? new Decimal(0);
    copy.inventory["Salt Rake"] = availableRakes.sub(1);
    copy.inventory["Salt"] = saltInInventory.add(saltPerRake + legacySalt);

    const wasFullBeforeHarvest = storedCharges === maxCharges;
    const syncedNextChargeAt = syncedNode.salt.nextChargeAt;
    const baselineNextChargeAt = Number.isFinite(syncedNextChargeAt)
      ? syncedNextChargeAt
      : createdAt + interval;
    const nextChargeAt = wasFullBeforeHarvest
      ? createdAt + interval
      : baselineNextChargeAt;

    const draftSalt = {
      ...syncedNode.salt,
      claimedAt: createdAt,
      nextChargeAt,
      storedCharges: Math.max(0, storedCharges - 1),
      harvesting: undefined,
    };
    const finalizedSalt = materializeSaltRegen(draftSalt, createdAt, syncOpts);

    copy.saltFarm.nodes[action.id] = {
      ...syncedNode,
      salt: finalizedSalt,
    };

    const saltHarvestCount = copy.farmActivity["Salt Harvested"] ?? 0;
    copy.farmActivity = trackFarmActivity("Salt Harvested", copy.farmActivity);

    if (copy.bumpkin?.skills["Sea Blessed"]) {
      const seaBlessedHit = prngChance({
        farmId,
        itemId: KNOWN_IDS["Salt"],
        counter: saltHarvestCount,
        chance: SEA_BLESSED_CHANCE,
        criticalHitName: "Sea Blessed",
      });

      if (seaBlessedHit) {
        const { chargeGenerationTimeMs: interval } =
          getSaltChargeGenerationTime({
            gameState: copy,
          });
        const nodeIds = getKeys(copy.saltFarm.nodes);
        const eligible = nodeIds.filter(
          (id) =>
            copy.saltFarm.nodes[id].salt.storedCharges <
            MAX_STORED_SALT_CHARGES_PER_NODE,
        );
        const toRestore = eligible.slice(0, SEA_BLESSED_NODE_COUNT);
        for (const nodeId of toRestore) {
          const node = copy.saltFarm.nodes[nodeId];
          node.salt.storedCharges = Math.min(
            node.salt.storedCharges + 1,
            MAX_STORED_SALT_CHARGES_PER_NODE,
          );
          if (node.salt.storedCharges === MAX_STORED_SALT_CHARGES_PER_NODE) {
            node.salt.nextChargeAt = createdAt + interval;
          }
        }
      }
    }

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });
  });
}
