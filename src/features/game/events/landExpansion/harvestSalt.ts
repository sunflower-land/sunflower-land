import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  SEA_BLESSED_CHANCE,
  SEA_BLESSED_NODE_COUNT,
  getSaltChargeGenerationTime,
  getSaltYieldPerRake,
  getStoredSaltCharges,
  materializeSaltRegen,
  syncSaltNode,
  getMaxStoredSaltCharges,
  SaltSyncOptions,
} from "features/game/types/salt";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getObjectEntries } from "lib/object";

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

    const { chargeGenerationTimeMs: chargeIntervalMs, boostsUsed } =
      getSaltChargeGenerationTime({ gameState: copy });
    const maxCharges = getMaxStoredSaltCharges(
      copy.sculptures?.["Salt Sculpture"]?.level ?? 0,
    );
    const syncOpts: SaltSyncOptions = { chargeIntervalMs, maxCharges };
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
    const { saltYield: saltPerRake, boostsUsed: saltYieldBoostsUsed } =
      getSaltYieldPerRake(copy);
    const legacySalt = legacyReadySlots * saltPerRake;

    const saltInInventory = copy.inventory["Salt"] ?? new Decimal(0);
    copy.inventory["Salt Rake"] = availableRakes.sub(1);
    copy.inventory["Salt"] = saltInInventory.add(saltPerRake + legacySalt);

    const wasFullBeforeHarvest = storedCharges === maxCharges;
    const syncedNextChargeAt = syncedNode.salt.nextChargeAt;
    const baselineNextChargeAt = Number.isFinite(syncedNextChargeAt)
      ? syncedNextChargeAt
      : createdAt + chargeIntervalMs;
    const nextChargeAt = wasFullBeforeHarvest
      ? createdAt + chargeIntervalMs
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
        const eligible = getObjectEntries(copy.saltFarm.nodes)
          .filter(([, node]) => {
            const syncedNode = syncSaltNode(node, createdAt, syncOpts);
            const storedCharges = getStoredSaltCharges(
              syncedNode,
              createdAt,
              syncOpts,
            );
            return storedCharges < maxCharges;
          })
          .map(([nodeId]) => nodeId);
        const toRestore = eligible.slice(0, SEA_BLESSED_NODE_COUNT);
        for (const nodeId of toRestore) {
          const node = copy.saltFarm.nodes[nodeId];
          const syncedNode = syncSaltNode(node, createdAt, syncOpts);
          const storedCharges = getStoredSaltCharges(
            syncedNode,
            createdAt,
            syncOpts,
          );
          syncedNode.salt.storedCharges = Math.min(
            storedCharges + 1,
            maxCharges,
          );
          if (syncedNode.salt.storedCharges === maxCharges) {
            syncedNode.salt.nextChargeAt = createdAt + chargeIntervalMs;
          }
          copy.saltFarm.nodes[nodeId] = syncedNode;
        }
      }
    }

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: [...boostsUsed, ...saltYieldBoostsUsed],
      createdAt,
    });
  });
}
