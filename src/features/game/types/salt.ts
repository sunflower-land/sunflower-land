import Decimal from "decimal.js-light";
import { Coordinates } from "../expansion/components/MapPlacement";
import type { GameState, InventoryItemName } from "./game";
import { isWearableActive } from "../lib/wearables";

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
   * Wall time (ms) when the next regen tick completes. Always set; pause/cap is never
   * represented by clearing this field (see {@link materializeSaltRegen}).
   */
  nextChargeAt: number;
  /**
   * Persisted pile count. Cap is raised when unclaimed ready slots keep display below max
   * so regeneration can continue (see {@link saltRegenStoredCapAt}).
   */
  storedCharges: number;
  harvesting?: {
    slots: SaltHarvestSlot[];
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

// export const SALT_CHARGE_GENERATION_TIME = 1000 * 60 * 60 * 7; // 7 hours per charge
export const SALT_CHARGE_GENERATION_TIME = 1000 * 60; // 2 minutes per charge (testing purposes)

export function getSaltChargeGenerationTime({
  gameState,
}: {
  gameState: GameState;
}): number {
  let chargeGenerationTimeMs = SALT_CHARGE_GENERATION_TIME;

  if (isWearableActive({ game: gameState, name: "2026 Tiara" })) {
    chargeGenerationTimeMs *= 0.75;
  }

  return chargeGenerationTimeMs;
}

// export const SALT_HARVEST_DURATION = 1000 * 60 * 60; // 60 minutes (harvest action only)
export const SALT_HARVEST_DURATION = 1000 * 30; // 1 minute (harvest action only) (testing purposes)
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
  return regenStoredCap(harvesting, now);
}

/**
 * Charges shown in the Salt Farm UI: pile plus in-flight harvests only (unclaimed ready
 * slots do not reduce the number until salt is claimed).
 */
function saltUiDisplayCharges(
  storedCharges: number,
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  const { active } = harvestSlotPhaseCounts(harvesting, now);
  return clampStoredCharges(storedCharges + active);
}

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

/** Earliest `readyAt` among in-flight harvest slots (`now < readyAt`). */
function minInFlightHarvestReadyAt(
  slots: SaltHarvestSlot[],
  now: number,
): number | undefined {
  let m: number | undefined;
  for (const s of slots) {
    if (now < s.readyAt) {
      m = m === undefined ? s.readyAt : Math.min(m, s.readyAt);
    }
  }
  return m;
}

/**
 * When regen grants are paused by harvest timing, the next charge boundary is the first
 * full interval after the gating harvest completes: `gateReadyAt + intervalMs`.
 * If there is no harvest gate, roll the previous scheduling time forward.
 */
function nextChargeAtFromHarvestGate(
  gateReadyAt: number | undefined,
  fallbackNextChargeAt: number,
  now: number,
  intervalMs: number,
): number {
  if (gateReadyAt !== undefined) {
    let t = gateReadyAt + intervalMs;
    if (t < now) {
      t = rollNextChargeBoundary(t, now, intervalMs);
    }
    return t;
  }
  return rollNextChargeBoundary(fallbackNextChargeAt, now, intervalMs);
}

/**
 * Materializes elapsed regeneration into `storedCharges` / `nextChargeAt`.
 * `nextChargeAt` is always a future scheduling boundary (never cleared).
 * Pauses grants when {@link saltUiDisplayCharges} is full or unclaimed-ready + slot-after-anchor blocks.
 * While paused by harvests, `nextChargeAt` is derived from the gating slot's {@link SaltHarvestSlot.readyAt}.
 */
export function materializeSaltRegen(
  salt: Salt,
  now: number,
  options?: SaltSyncOptions,
): Salt {
  const intervalMs = options?.chargeIntervalMs ?? SALT_CHARGE_GENERATION_TIME;
  const harvesting = salt.harvesting;
  const slots = harvesting?.slots ?? [];

  // Max charges the pile can hold right now (MAX - active + ready harvests)
  const cap = regenStoredCap(harvesting, now);

  // Clamp persisted stored to current cap (cap shrinks when harvests start)
  let storedCharges = Math.max(0, Math.min(salt.storedCharges, cap));

  // Use persisted boundary, or seed one interval into the future
  let nextChargeAt = Number.isFinite(salt.nextChargeAt)
    ? salt.nextChargeAt
    : now + intervalMs;

  // --- Pre-loop: if display is full right now, gate on earliest in-flight harvest ---
  const { active: activeNow } = harvestSlotPhaseCounts(harvesting, now);
  const displayBlocked =
    saltUiDisplayCharges(storedCharges, harvesting, now) >=
    MAX_STORED_SALT_CHARGES_PER_NODE;

  if (displayBlocked) {
    const gate = minInFlightHarvestReadyAt(slots, now);
    nextChargeAt = nextChargeAtFromHarvestGate(
      gate,
      nextChargeAt,
      now,
      intervalMs,
    );
    return { ...salt, storedCharges, nextChargeAt, harvesting };
  }

  // --- Charge-granting loop: advance one interval per iteration ---
  while (now >= nextChargeAt && storedCharges < cap) {
    // Pre-grant: would this charge push stored + active above MAX?
    if (storedCharges + 1 + activeNow > MAX_STORED_SALT_CHARGES_PER_NODE) {
      const gate = minInFlightHarvestReadyAt(slots, now);
      nextChargeAt = nextChargeAtFromHarvestGate(
        gate,
        nextChargeAt + intervalMs,
        now,
        intervalMs,
      );
      break;
    }

    // Grant the charge
    storedCharges += 1;

    // Post-grant: was display full at the boundary time?
    // Evaluates harvest phases at the boundary (not wall-clock) to detect
    // pauses that started mid-cycle even if the harvest has since finished.
    const { active: activeAtBoundary } = harvestSlotPhaseCounts(
      harvesting,
      nextChargeAt,
    );
    if (storedCharges + activeAtBoundary >= MAX_STORED_SALT_CHARGES_PER_NODE) {
      const gate = minInFlightHarvestReadyAt(slots, nextChargeAt);
      nextChargeAt = nextChargeAtFromHarvestGate(
        gate,
        nextChargeAt + intervalMs,
        now,
        intervalMs,
      );
      break;
    }

    nextChargeAt += intervalMs;
  }

  // If loop ended but nextChargeAt is still in the past (no harvests blocking),
  // roll forward in intervalMs steps until it's in the future
  if (nextChargeAt < now) {
    nextChargeAt = rollNextChargeBoundary(nextChargeAt, now, intervalMs);
  }

  return {
    ...salt,
    storedCharges,
    nextChargeAt,
    harvesting,
  };
}

/**
 * Earliest harvest `readyAt` that gates "Regeneration restarts in …" for the modal.
 * Returns a value only when the display is full (stored + active >= MAX).
 */
export function getSaltRegenerationHarvestPauseUntil(
  salt: Salt,
  now: number,
  options?: SaltSyncOptions,
): number | undefined {
  const synced = materializeSaltRegen(salt, now, options);
  const displayFull =
    saltUiDisplayCharges(synced.storedCharges, synced.harvesting, now) >=
    MAX_STORED_SALT_CHARGES_PER_NODE;
  if (!displayFull) return undefined;
  return minInFlightHarvestReadyAt(synced.harvesting?.slots ?? [], now);
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
 * Charges shown in UI: pile + in-progress harvests (ready slots do not reduce the count until claimed).
 * Uses the same {@link materializeSaltRegen} sync as {@link getStoredSaltCharges} so timers align.
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
 * @param nodeIndex - The index of the salt node
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
