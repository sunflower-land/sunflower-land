import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  BASE_SALT_YIELD,
  getSaltChargeGenerationTime,
  syncSaltNode,
} from "features/game/types/salt";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

export enum CLAIM_SALT_HARVEST_ERRORS {
  SALT_NODE_NOT_FOUND = "Salt node not found",
  NO_SALT_READY = "No salt ready to claim",
  SALT_FARM_NOT_ENABLED = "Salt farm not enabled",
}

export type ClaimSaltHarvestAction = {
  type: "saltHarvest.claimed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimSaltHarvestAction;
  createdAt?: number;
};

export function claimSaltHarvest({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (!hasFeatureAccess(state, "SALT_FARM")) {
    throw new Error(CLAIM_SALT_HARVEST_ERRORS.SALT_FARM_NOT_ENABLED);
  }

  return produce(state, (copy) => {
    const saltNode = copy.saltFarm.nodes[action.id];
    if (!saltNode) {
      throw new Error(CLAIM_SALT_HARVEST_ERRORS.SALT_NODE_NOT_FOUND);
    }

    const interval = getSaltChargeGenerationTime({ gameState: copy });
    const syncedNode = syncSaltNode(saltNode, createdAt, {
      chargeIntervalMs: interval,
    });
    const activeSlots = syncedNode.salt.harvesting?.slots ?? [];
    const readySlots = activeSlots.filter((slot) => slot.readyAt <= createdAt);

    if (readySlots.length === 0) {
      throw new Error(CLAIM_SALT_HARVEST_ERRORS.NO_SALT_READY);
    }

    const pendingSlots = activeSlots.filter((slot) => slot.readyAt > createdAt);
    const saltInInventory = copy.inventory.Salt ?? new Decimal(0);
    const harvestedSalt = readySlots.length * BASE_SALT_YIELD;

    copy.inventory.Salt = saltInInventory.add(harvestedSalt);
    copy.saltFarm.nodes[action.id] = {
      ...syncedNode,
      salt: {
        ...syncedNode.salt,
        claimedAt: createdAt,
        harvesting:
          pendingSlots.length === 0 ? undefined : { slots: pendingSlots },
      },
    };
  });
}
