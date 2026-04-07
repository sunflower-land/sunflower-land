import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  BASE_SALT_YIELD,
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
  type: "saltHarvest.harvested";
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

    const legacyReadySlots =
      syncedNode.salt.harvesting?.slots.filter(
        (slot) => slot.readyAt <= createdAt,
      ).length ?? 0;
    const shouldConsumeRake = legacyReadySlots === 0;
    const availableRakes = copy.inventory["Salt Rake"] ?? new Decimal(0);
    if (shouldConsumeRake && availableRakes.lt(1)) {
      throw new Error(HARVEST_SALT_ERRORS.NOT_ENOUGH_SALT_RAKES);
    }
    const legacySalt = legacyReadySlots * BASE_SALT_YIELD;

    const saltInInventory = copy.inventory["Salt"] ?? new Decimal(0);
    if (shouldConsumeRake) {
      copy.inventory["Salt Rake"] = availableRakes.sub(1);
    }
    copy.inventory["Salt"] = saltInInventory.add(BASE_SALT_YIELD + legacySalt);

    const syncedNextChargeAt = syncedNode.salt.nextChargeAt;
    const nextChargeAt = Number.isFinite(syncedNextChargeAt)
      ? syncedNextChargeAt
      : createdAt + interval;

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
