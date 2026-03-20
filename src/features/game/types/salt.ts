import Decimal from "decimal.js-light";
import { Coordinates } from "../expansion/components/MapPlacement";
import { hasFeatureAccess } from "lib/flags";
import type { GameState, InventoryItemName } from "./game";

export type SaltNode = {
  createdAt: number;
  salt: Salt;
  coordinates: Coordinates;
};

export type SaltHarvestSlot = {
  startedAt: number;
  readyAt: number;
};

export type Salt = {
  claimedAt?: number;
  /**
   * Wall time (ms) when the next stored charge completes while display count is below max.
   * Undefined when regen is paused (display maxed, harvest pause, etc.).
   */
  nextChargeAt?: number;
  /**
   * Persisted pile count. Cap is raised when unclaimed ready slots keep display below max
   * so regeneration can continue (see {@link saltRegenStoredCapAt}).
   */
  storedCharges: number;
  harvesting?: {
    slots: SaltHarvestSlot[];
    regenerationPausedUntil?: number;
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
 * Node ids for salt slots that the next upgrade will create (map placeholders).
 * Empty when at max level or when node count already matches the post-upgrade target.
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

export const SALT_CHARGE_GENERATION_TIME = 1000 * 60 * 7; // 7 hours per charge

export function getSaltChargeGenerationTime({
  gameState,
}: {
  gameState: GameState;
}): number {
  let chargeGenerationTimeMs = SALT_CHARGE_GENERATION_TIME;

  if (hasFeatureAccess(gameState, "SALT_FARM")) {
    chargeGenerationTimeMs *= 0.5;
  }

  return chargeGenerationTimeMs;
}

export const SALT_HARVEST_DURATION = 1000 * 60; // 60 minutes (harvest action only)
export const BASE_SALT_YIELD = 5; // 5 salt per rake
export const MAX_STORED_SALT_CHARGES_PER_NODE = 3; // 3 salt charges per node

/**
 * Constrains a stored-charge value to the valid node range.
 *
 * @param value Candidate stored-charge count.
 * @returns A number clamped between 0 and MAX_STORED_SALT_CHARGES_PER_NODE.
 */
function clampStoredCharges(value: number): number {
  return Math.max(0, Math.min(value, MAX_STORED_SALT_CHARGES_PER_NODE));
}

export type SaltSyncOptions = {
  chargeIntervalMs?: number;
};

/**
 * Applies {@link regenerationPausedUntil} the same way as the legacy anchor model:
 * when the current interval started before the pause boundary, the next charge is
 * scheduled from `pauseUntil + interval` instead of completing during the pause window.
 */
function applyRegenerationPauseFloorToNextCharge({
  nextChargeAt,
  pauseUntil,
  intervalMs,
}: {
  nextChargeAt: number;
  pauseUntil: number;
  intervalMs: number;
}): number {
  const intervalStart = nextChargeAt - intervalMs;
  if (intervalStart < pauseUntil) {
    return pauseUntil + intervalMs;
  }
  return nextChargeAt;
}

function harvestingWithExpiredPauseCleared(
  harvesting: Salt["harvesting"],
  now: number,
): Salt["harvesting"] {
  if (!harvesting?.regenerationPausedUntil) {
    return harvesting;
  }
  if (now < harvesting.regenerationPausedUntil) {
    return harvesting;
  }
  return { slots: harvesting.slots };
}

function harvestSlotPhaseCounts(
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): { active: number; ready: number } {
  const slots = harvesting?.slots ?? [];
  let active = 0;
  let ready = 0;
  for (const s of slots) {
    if (now < s.readyAt) {
      active += 1;
    } else {
      ready += 1;
    }
  }
  return { active, ready };
}

/**
 * Max persisted pile so that {@link getDisplaySaltCharges}-style display stays at or below max.
 * Unclaimed-ready slots raise the ceiling; in-progress slots lower it (can be 0).
 */
function regenStoredCap(
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  const { active, ready } = harvestSlotPhaseCounts(harvesting, now);
  return Math.max(0, MAX_STORED_SALT_CHARGES_PER_NODE + ready - active);
}

/**
 * Max persisted pile at `now` given harvesting slots (same rule as regen materialization).
 */
export function saltRegenStoredCapAt(
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  return regenStoredCap(
    harvestingWithExpiredPauseCleared(harvesting, now),
    now,
  );
}

/**
 * UI/regen-agreement charge count: pile + in-flight harvests − finished unclaimed slots.
 * When unclaimed ready slots exceed linear headroom ({@code raw < 0}), show pile + active
 * so regeneration visibly fills while the queue is full of finished harvests.
 */
function saltUiDisplayCharges(
  storedCharges: number,
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  const h = harvestingWithExpiredPauseCleared(harvesting, now);
  const { active, ready } = harvestSlotPhaseCounts(h, now);
  const raw = storedCharges + active - ready;
  if (raw < 0) {
    return clampStoredCharges(storedCharges + active);
  }
  return clampStoredCharges(Math.max(0, raw));
}

function displayChargesFromPile(
  storedCharges: number,
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  return saltUiDisplayCharges(storedCharges, harvesting, now);
}

/**
 * Materializes elapsed regeneration into `storedCharges` / `nextChargeAt`.
 * Regen pauses when UI display count is maxed, not only when the raw pile hits 3.
 */
export function materializeSaltRegen(
  salt: Salt,
  now: number,
  options?: SaltSyncOptions,
): Salt {
  const intervalMs = options?.chargeIntervalMs ?? SALT_CHARGE_GENERATION_TIME;
  const rawPauseUntil = salt.harvesting?.regenerationPausedUntil;
  const harvesting = harvestingWithExpiredPauseCleared(salt.harvesting, now);
  const cap = regenStoredCap(harvesting, now);
  let storedCharges = Math.max(0, Math.min(salt.storedCharges, cap));
  let nextChargeAt = salt.nextChargeAt;

  if (
    displayChargesFromPile(storedCharges, harvesting, now) >=
    MAX_STORED_SALT_CHARGES_PER_NODE
  ) {
    return {
      ...salt,
      storedCharges,
      nextChargeAt: undefined,
      harvesting,
    };
  }

  if (nextChargeAt === undefined) {
    nextChargeAt = now + intervalMs;
  }

  if (rawPauseUntil) {
    nextChargeAt = applyRegenerationPauseFloorToNextCharge({
      nextChargeAt,
      pauseUntil: rawPauseUntil,
      intervalMs,
    });
  }

  const regenAllowed = !rawPauseUntil || now >= rawPauseUntil;

  while (regenAllowed && now >= nextChargeAt && storedCharges < cap) {
    storedCharges += 1;
    if (storedCharges >= cap) {
      nextChargeAt = undefined;
      break;
    }
    nextChargeAt = nextChargeAt + intervalMs;
    if (rawPauseUntil) {
      nextChargeAt = applyRegenerationPauseFloorToNextCharge({
        nextChargeAt,
        pauseUntil: rawPauseUntil,
        intervalMs,
      });
    }
  }

  return {
    ...salt,
    storedCharges,
    nextChargeAt,
    harvesting,
  };
}

/**
 * Derives how many unassigned (stored) charges a node has at `now`.
 */
export function getStoredSaltCharges(
  saltNode: SaltNode,
  now: number,
  options?: SaltSyncOptions,
): number {
  return materializeSaltRegen(saltNode.salt, now, options).storedCharges;
}

/**
 * Charges shown in UI: pile + in-progress harvests − finished unclaimed slots.
 * Matches {@link getStoredSaltCharges} regen materialization so timers and slots align.
 */
export function getDisplaySaltCharges(
  saltNode: SaltNode,
  now: number,
  options?: SaltSyncOptions,
): number {
  const synced = materializeSaltRegen(saltNode.salt, now, options);
  return saltUiDisplayCharges(synced.storedCharges, synced.harvesting, now);
}

/**
 * Produces a time-synced copy of a salt node at `now`.
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

/**
 * Whole seconds until `nextChargeAt`, suitable for countdown UI.
 */
export function getNextSaltChargeInSeconds({
  nextChargeAt,
  now,
}: {
  nextChargeAt: number;
  now: number;
}): number {
  return Math.max(0, Math.ceil((nextChargeAt - now) / 1000));
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
 * Get the coordinates for a specific salt node
 * @param expansions - The number of expansions
 * @param nodeIndex - The index of the node
 * @returns The coordinates of the salt node
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
