import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";
import {
  MAX_VIP_ACTIVE_HARVEST_SLOTS,
  SALT_HARVEST_DURATION,
  SaltHarvestSlot,
  getSaltChargeGenerationTime,
  getStoredSaltCharges,
  materializeSaltRegen,
  saltRegenStoredCapAt,
  syncSaltNode,
} from "features/game/types/salt";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

export enum START_SALT_HARVEST_ERRORS {
  SALT_NODE_NOT_FOUND = "Salt node not found",
  INVALID_RAKE_COUNT = "Invalid salt rake amount",
  NON_VIP_SINGLE_RAKE_ONLY = "Only VIP can place multiple rakes",
  NON_VIP_ACTIVE_HARVEST_EXISTS = "Non-VIP can only have one active salt rake",
  VIP_MAX_RAKES_EXCEEDED = "VIP can have up to 4 active salt rakes",
  NOT_ENOUGH_CHARGES = "Not enough salt charges",
  NOT_ENOUGH_SALT_RAKES = "Not enough Salt Rakes",
  SALT_FARM_NOT_ENABLED = "Salt farm not enabled",
}

export type StartSaltHarvestAction = {
  type: "saltHarvest.started";
  id: string;
  rakes: number;
};

type Options = {
  state: Readonly<GameState>;
  action: StartSaltHarvestAction;
  createdAt?: number;
};

function createQueuedSlots({
  existingSlots,
  rakes,
  createdAt,
}: {
  existingSlots: SaltHarvestSlot[];
  rakes: number;
  createdAt: number;
}) {
  let nextStartedAt = Math.max(
    createdAt,
    existingSlots[existingSlots.length - 1]?.readyAt ?? createdAt,
  );

  return Array.from({ length: rakes }, () => {
    const slot = {
      startedAt: nextStartedAt,
      readyAt: nextStartedAt + SALT_HARVEST_DURATION,
    };

    nextStartedAt = slot.readyAt;

    return slot;
  });
}

export function startSaltHarvest({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  if (!hasFeatureAccess(state, "SALT_FARM")) {
    throw new Error(START_SALT_HARVEST_ERRORS.SALT_FARM_NOT_ENABLED);
  }

  return produce(state, (copy) => {
    const saltNode = copy.saltFarm.nodes[action.id];
    if (!saltNode) {
      throw new Error(START_SALT_HARVEST_ERRORS.SALT_NODE_NOT_FOUND);
    }

    if (!Number.isInteger(action.rakes) || action.rakes <= 0) {
      throw new Error(START_SALT_HARVEST_ERRORS.INVALID_RAKE_COUNT);
    }

    const interval = getSaltChargeGenerationTime({ gameState: copy });
    const syncOpts = { chargeIntervalMs: interval };
    const syncedNode = syncSaltNode(saltNode, createdAt, syncOpts);
    const storedCharges = getStoredSaltCharges(syncedNode, createdAt, syncOpts);
    const existingSlots = syncedNode.salt.harvesting?.slots ?? [];
    const isVip = hasVipAccess({ game: copy, now: createdAt });

    if (!isVip) {
      if (action.rakes > 1) {
        throw new Error(START_SALT_HARVEST_ERRORS.NON_VIP_SINGLE_RAKE_ONLY);
      }

      if (existingSlots.length > 0) {
        throw new Error(
          START_SALT_HARVEST_ERRORS.NON_VIP_ACTIVE_HARVEST_EXISTS,
        );
      }
    } else if (
      existingSlots.length + action.rakes >
      MAX_VIP_ACTIVE_HARVEST_SLOTS
    ) {
      throw new Error(START_SALT_HARVEST_ERRORS.VIP_MAX_RAKES_EXCEEDED);
    }

    if (storedCharges < action.rakes) {
      throw new Error(START_SALT_HARVEST_ERRORS.NOT_ENOUGH_CHARGES);
    }

    const availableRakes = copy.inventory["Salt Rake"] ?? new Decimal(0);
    if (availableRakes.lt(action.rakes)) {
      throw new Error(START_SALT_HARVEST_ERRORS.NOT_ENOUGH_SALT_RAKES);
    }

    copy.inventory["Salt Rake"] = availableRakes.sub(action.rakes);

    const addedSlots = createQueuedSlots({
      existingSlots,
      rakes: action.rakes,
      createdAt,
    });
    const newHarvesting = {
      slots: [...existingSlots, ...addedSlots],
    };
    const pileCapAfterStart = saltRegenStoredCapAt(newHarvesting, createdAt);

    const newStoredCharges = storedCharges - action.rakes;
    const syncedNextChargeAt = syncedNode.salt.nextChargeAt;
    const nextChargeAt = Number.isFinite(syncedNextChargeAt)
      ? syncedNextChargeAt
      : createdAt + interval;

    const draftSalt = {
      ...syncedNode.salt,
      nextChargeAt,
      storedCharges: Math.min(newStoredCharges, pileCapAfterStart),
      harvesting: newHarvesting,
    };
    const finalizedSalt = materializeSaltRegen(draftSalt, createdAt, syncOpts);

    copy.saltFarm.nodes[action.id] = {
      ...syncedNode,
      salt: finalizedSalt,
    };
  });
}
