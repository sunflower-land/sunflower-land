import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  BASE_SALT_YIELD,
  MAX_STORED_SALT_CHARGES_PER_NODE,
  getSaltChargeGenerationTime,
  getStoredSaltCharges,
  materializeSaltRegen,
  syncSaltNode,
} from "features/game/types/salt";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

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
};

export function harvestSalt({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (!hasFeatureAccess(state, "SALT_FARM")) {
    throw new Error(HARVEST_SALT_ERRORS.SALT_FARM_NOT_ENABLED);
  }

  return produce(state, (copy) => {
    const saltNode = copy.saltFarm.nodes[action.id];
    if (!saltNode) {
      throw new Error(HARVEST_SALT_ERRORS.SALT_NODE_NOT_FOUND);
    }

    const interval = getSaltChargeGenerationTime({ gameState: copy });
    const syncOpts = { chargeIntervalMs: interval };
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
    const legacySalt = legacyReadySlots * BASE_SALT_YIELD;

    const saltInInventory = copy.inventory["Salt"] ?? new Decimal(0);
    copy.inventory["Salt Rake"] = availableRakes.sub(1);
    copy.inventory["Salt"] = saltInInventory.add(BASE_SALT_YIELD + legacySalt);

    const wasFullBeforeHarvest =
      storedCharges === MAX_STORED_SALT_CHARGES_PER_NODE;
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
  });
}
