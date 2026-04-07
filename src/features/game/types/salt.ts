import Decimal from "decimal.js-light";
import { Coordinates } from "../expansion/components/MapPlacement";
import type { GameState, InventoryItemName } from "./game";

export type SaltNode = {
  createdAt: number;
  salt: Salt;
  coordinates: Coordinates;
};

export type Salt = {
  claimedAt?: number;
  /**
   * Wall-clock timestamp (ms) of the next charge boundary.
   * {@link materializeSaltRegen} uses this as the starting point for granting charges.
   * It is always persisted as a future value after materialization.
   */
  nextChargeAt: number;
  /**
   * Persisted pile count (charges sitting on the node, not yet consumed by an instant harvest).
   * Capped to `MAX_STORED_SALT_CHARGES_PER_NODE`.
   */
  storedCharges: number;
  /** @deprecated Legacy queued harvest state. Kept only for transition cleanup. */
  harvesting?: {
    slots: Array<{ startedAt: number; readyAt: number }>;
  };
};

export type SaltNodes = Record<string, SaltNode>;

export type SaltFarm = {
  level: number;
  nodes: SaltNodes;
};

export const SALT_FARM_MAX_LEVEL = 4;

export const SALT_FARM_UPGRADES: Record<
  number,
  {
    nodes: number;
    upgradeCost: {
      coins: number;
      items: Partial<Record<InventoryItemName, Decimal>>;
    };
  }
> = {
  0: {
    nodes: 0,
    upgradeCost: {
      coins: 0,
      items: {},
    },
  },
  1: {
    nodes: 1,
    upgradeCost: {
      coins: 200,
      items: {
        Wood: new Decimal(30),
        Stone: new Decimal(20),
      },
    },
  },
  2: {
    nodes: 2,
    upgradeCost: {
      coins: 1_000,
      items: {
        Stone: new Decimal(15),
        Iron: new Decimal(5),
        Salt: new Decimal(100),
      },
    },
  },
  3: {
    nodes: 4,
    upgradeCost: {
      coins: 40_000,
      items: {
        Wood: new Decimal(500),
        Gold: new Decimal(40),
        Salt: new Decimal(2_000),
      },
    },
  },
  4: {
    nodes: 6,
    upgradeCost: {
      coins: 120_000,
      items: {
        Gold: new Decimal(100),
        Salt: new Decimal(10_000),
      },
    },
  },
};

/**
 * Returns string ids for salt nodes that the next upgrade will create.
 * Computes `SALT_FARM_UPGRADES[level + 1].nodes - currentNodeCount` and
 * returns sequential ids starting from `currentNodeCount`.
 * Returns `[]` when at max level or when nodes already match the target.
 */
export function getPendingSaltNodeIdsForUpgrade(saltFarm: SaltFarm): string[] {
  const { level, nodes } = saltFarm;
  if (level >= SALT_FARM_MAX_LEVEL) {
    return [];
  }
  const nextLevel = level + 1;
  const targetCount = SALT_FARM_UPGRADES[nextLevel].nodes;
  const currentCount = Object.keys(nodes).length;
  const pending = targetCount - currentCount;
  if (pending <= 0) {
    return [];
  }
  return Array.from({ length: pending }, (_, i) => String(currentCount + i));
}

export const SALT_CHARGE_GENERATION_TIME = 1000 * 60 * 60 * 7; // 7 hours per charge

/**
 * Returns the charge interval in ms for a single regen tick.
 * Starts from `SALT_CHARGE_GENERATION_TIME` and applies multiplicative
 */
export function getSaltChargeGenerationTime({
  gameState,
}: {
  gameState: GameState;
}): number {
  let chargeGenerationTimeMs = SALT_CHARGE_GENERATION_TIME;

  if (gameState.bumpkin?.skills["Salty Seas"]) {
    chargeGenerationTimeMs *= 0.9;
  }

  return chargeGenerationTimeMs;
}

export const BASE_SALT_YIELD = 10; // 10 salt per rake
export const MAX_STORED_SALT_CHARGES_PER_NODE = 3; // 3 salt charges per node

/** Clamps `value` to `[0, MAX_STORED_SALT_CHARGES_PER_NODE]`. */
function clampStoredCharges(value: number): number {
  return Math.max(0, Math.min(value, MAX_STORED_SALT_CHARGES_PER_NODE));
}

export type SaltSyncOptions = {
  chargeIntervalMs?: number;
};

/**
 * Advances `nextChargeAt` forward in `intervalMs` steps until it is >= `now`.
 * Returns the first future boundary. No-op if already in the future.
 */
function rollNextChargeBoundary(
  nextChargeAt: number,
  now: number,
  intervalMs: number,
): number {
  let t = nextChargeAt;
  while (t < now) {
    t += intervalMs;
  }
  return t;
}

/**
 * Pure function that derives the current `storedCharges` and `nextChargeAt`
 * from persisted salt state at wall-clock time `now`.
 */
export function materializeSaltRegen(
  salt: Salt,
  now: number,
  options?: SaltSyncOptions,
): Salt {
  const intervalMs = options?.chargeIntervalMs ?? SALT_CHARGE_GENERATION_TIME;
  let storedCharges = clampStoredCharges(salt.storedCharges);

  let nextChargeAt = Number.isFinite(salt.nextChargeAt)
    ? salt.nextChargeAt
    : now + intervalMs;

  while (
    now >= nextChargeAt &&
    storedCharges < MAX_STORED_SALT_CHARGES_PER_NODE
  ) {
    storedCharges += 1;
    nextChargeAt += intervalMs;
  }

  if (nextChargeAt < now) {
    nextChargeAt = rollNextChargeBoundary(nextChargeAt, now, intervalMs);
  }

  return {
    ...salt,
    storedCharges,
    nextChargeAt,
  };
}

/**
 * Returns the materialized `storedCharges` for a node at `now`.
 * Delegates to {@link materializeSaltRegen} and returns `.storedCharges`.
 */
export function getStoredSaltCharges(
  saltNode: SaltNode,
  now: number,
  options?: SaltSyncOptions,
): number {
  return materializeSaltRegen(saltNode.salt, now, options).storedCharges;
}

export function getDisplaySaltCharges(
  saltNode: SaltNode,
  now: number,
  options?: SaltSyncOptions,
): number {
  return materializeSaltRegen(saltNode.salt, now, options).storedCharges;
}

/**
 * Returns a shallow copy of `saltNode` with `.salt` replaced by the output
 * of {@link materializeSaltRegen} at `now`.
 */
export function syncSaltNode(
  saltNode: SaltNode,
  now: number,
  options?: SaltSyncOptions,
): SaltNode {
  return {
    ...saltNode,
    salt: materializeSaltRegen(saltNode.salt, now, options),
  };
}

/** Returns `MAX(0, ceil((nextChargeAt - now) / 1000))` — whole seconds until the next charge. */
export function getNextSaltChargeInSeconds({
  nextChargeAt,
  now,
}: {
  nextChargeAt: number;
  now: number;
}): number {
  return Math.max(0, Math.ceil((nextChargeAt - now) / 1000));
}

export const SALT_FARM_UPDATE_INTERVAL = 1000 * 60 * 10; // 10 minutes

/**
 * Iterates every salt node and calls {@link syncSaltNode} with the current
 * charge interval from {@link getSaltChargeGenerationTime}.
 * Creates a shallow copy of `game`, mutates `.saltFarm.nodes` on the copy,
 * sets `.saltFarm.updatedAt = now`, and returns the copy.
 *
 * Called in event handlers BEFORE boost-changing mutations (equip, skill,
 * collectible place/remove) to lock in `nextChargeAt` using the pre-boost
 * interval, so the current cooldown is not affected by the interval change.
 */
export function populateSaltFarm({
  game,
  now,
}: {
  game: GameState;
  now: number;
}) {
  const chargeIntervalMs = getSaltChargeGenerationTime({ gameState: game });
  const syncOpts = { chargeIntervalMs };

  for (const nodeId of Object.keys(game.saltFarm.nodes)) {
    game.saltFarm.nodes[nodeId] = syncSaltNode(
      game.saltFarm.nodes[nodeId],
      now,
      syncOpts,
    );
  }
}

export const SALT_NODE_COORDINATES: Record<string, Coordinates> = {
  "0": { x: -16, y: -18 },
  "1": { x: -16, y: -16 },
  "2": { x: -18, y: -18 },
  "3": { x: -18, y: -16 },
  "4": { x: -16, y: -20 },
  "5": { x: -18, y: -20 },
};

/**
 * Returns world coordinates for a salt node, offsetting the base
 * {@link SALT_NODE_COORDINATES} by `(+13, +12)` when `expansions < 7`
 * or `(+6, +6)` when `7 <= expansions < 21`, else no offset.
 */
export function getSaltNodeCoordinates(
  expansions: number,
  nodeIndex: string,
): Coordinates {
  let offsetX = 0;
  let offsetY = 0;
  if (expansions < 7) {
    offsetX = 13;
    offsetY = 12;
  }
  if (expansions >= 7 && expansions < 21) {
    offsetX = 6;
    offsetY = 6;
  }

  return {
    x: SALT_NODE_COORDINATES[nodeIndex].x + offsetX,
    y: SALT_NODE_COORDINATES[nodeIndex].y + offsetY,
  };
}
