import Decimal from "decimal.js-light";
import { Coordinates } from "../expansion/components/MapPlacement";
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
   * Wall-clock timestamp (ms) of the next charge boundary.
   * {@link materializeSaltRegen} uses this as the starting point for granting charges;
   * it is always persisted as a future value after materialization.
   * When paused (display full or harvest-gated), the value is pushed forward
   * via {@link nextChargeAtFromHarvestGate} rather than being cleared.
   */
  nextChargeAt: number;
  /**
   * Persisted pile count (charges sitting on the node, not yet consumed by a harvest).
   * Capped by {@link regenStoredCap} which equals `MAX(0, MAX_STORED - active + ready)`,
   * allowing regen to continue while unclaimed ready slots keep the display under max.
   */
  storedCharges: number;
  harvesting?: {
    slots: SaltHarvestSlot[];
  };
};

export type SaltNodes = Record<string, SaltNode>;

export type SaltFarm = {
  updatedAt?: number;
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
 * boosts: 0.75x when "2026 Tiara" is active (checked via {@link isWearableActive}
 * across bumpkin + all farmHands).
 */
export function getSaltChargeGenerationTime({
  // To be used for future boosts
  gameState: _gameState,
}: {
  gameState: GameState;
}): number {
  const chargeGenerationTimeMs = SALT_CHARGE_GENERATION_TIME;

  return chargeGenerationTimeMs;
}

export const SALT_HARVEST_DURATION = 1000 * 60 * 60; // 60 minutes (harvest action only)
export const BASE_SALT_YIELD = 5; // 5 salt per rake
export const MAX_STORED_SALT_CHARGES_PER_NODE = 3; // 3 salt charges per node

/** Clamps `value` to `[0, MAX_STORED_SALT_CHARGES_PER_NODE]`. */
function clampStoredCharges(value: number): number {
  return Math.max(0, Math.min(value, MAX_STORED_SALT_CHARGES_PER_NODE));
}

export type SaltSyncOptions = {
  chargeIntervalMs?: number;
};

/**
 * Counts harvest slots by phase at a given timestamp.
 * `active`: slots where `now < readyAt` (still in progress).
 * `ready`: slots where `now >= readyAt` (finished, awaiting claim).
 */
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
 * Maximum `storedCharges` the pile can hold at `now`.
 * Formula: `MAX(0, MAX_STORED_SALT_CHARGES_PER_NODE + readySlots - activeSlots)`.
 * Active slots reduce the cap (they consumed a charge); ready slots raise it
 * (their charge is reclaimable once salt is collected).
 */
function regenStoredCap(
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  const { active, ready } = harvestSlotPhaseCounts(harvesting, now);
  return Math.max(0, MAX_STORED_SALT_CHARGES_PER_NODE + ready - active);
}

/** Public wrapper around {@link regenStoredCap}. Returns `MAX(0, MAX_STORED + ready - active)` at `now`. */
export function saltRegenStoredCapAt(
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  return regenStoredCap(harvesting, now);
}

/**
 * Display charge count for the UI meter.
 * Returns `clamp(storedCharges + activeSlots)`. Ready (unclaimed) slots are
 * excluded — they don't reduce the displayed count until salt is claimed.
 */
function saltUiDisplayCharges(
  storedCharges: number,
  harvesting: Salt["harvesting"] | undefined,
  now: number,
): number {
  const { active } = harvestSlotPhaseCounts(harvesting, now);
  return clampStoredCharges(storedCharges + active);
}

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
 * Computes the next charge boundary when regen is blocked by a harvest gate.
 * If `gateReadyAt` is defined, returns `gateReadyAt + intervalMs` (rolled forward
 * via {@link rollNextChargeBoundary} if that value is still in the past).
 * If no gate exists, rolls `fallbackNextChargeAt` forward instead.
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
 * Pure function that derives the current `storedCharges` and `nextChargeAt`
 * from persisted salt state at wall-clock time `now`.
 *
 * Algorithm:
 * 1. Compute the pile cap via {@link regenStoredCap} (`MAX_STORED + ready - active`).
 *    Clamp persisted `storedCharges` to this cap.
 * 2. Seed `nextChargeAt` from the persisted value (or `now + intervalMs` if missing).
 * 3. **Display-blocked early exit**: if `storedCharges + activeSlots >= MAX_STORED`,
 *    push `nextChargeAt` forward via {@link nextChargeAtFromHarvestGate} (gated by
 *    the earliest in-flight harvest) and return immediately.
 * 4. **Charge-granting loop**: while `now >= nextChargeAt` and `storedCharges < cap`:
 *    a. *Pre-grant check*: if granting would push `stored + active > MAX_STORED`,
 *       gate on earliest in-flight harvest and break.
 *    b. Grant one charge (`storedCharges += 1`).
 *    c. *Post-grant check*: evaluate harvest phases at the boundary time (not wall-clock)
 *       to detect pauses that started mid-cycle. If `stored + activeAtBoundary >= MAX_STORED`,
 *       gate on earliest in-flight harvest at the boundary and break.
 *    d. Advance `nextChargeAt += intervalMs`.
 * 5. If `nextChargeAt` is still in the past after the loop, roll it forward
 *    via {@link rollNextChargeBoundary}.
 *
 * Returns a new `Salt` object; does not mutate the input.
 */
export function materializeSaltRegen(
  salt: Salt,
  now: number,
  options?: SaltSyncOptions,
): Salt {
  const intervalMs = options?.chargeIntervalMs ?? SALT_CHARGE_GENERATION_TIME;
  const harvesting = salt.harvesting;
  const slots = harvesting?.slots ?? [];

  const cap = regenStoredCap(harvesting, now);
  let storedCharges = Math.max(0, Math.min(salt.storedCharges, cap));

  let nextChargeAt = Number.isFinite(salt.nextChargeAt)
    ? salt.nextChargeAt
    : now + intervalMs;

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

  while (now >= nextChargeAt && storedCharges < cap) {
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

    storedCharges += 1;

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
 * Returns the earliest in-flight harvest `readyAt` that is blocking regeneration,
 * or `undefined` if regen is not paused. Materializes salt state first via
 * {@link materializeSaltRegen}, then checks whether the display is full
 * (`storedCharges + active >= MAX_STORED`). Used by the modal to show
 * "Regeneration restarts in …".
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

/**
 * Returns `clamp(materializedStored + activeSlots)` for a node at `now`.
 * Materializes via {@link materializeSaltRegen} then passes the result
 * through {@link saltUiDisplayCharges}. Ready (unclaimed) slots are excluded.
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
}): GameState {
  const state = { ...game };

  const chargeIntervalMs = getSaltChargeGenerationTime({ gameState: state });
  const syncOpts = { chargeIntervalMs };

  for (const nodeId of Object.keys(state.saltFarm.nodes)) {
    state.saltFarm.nodes[nodeId] = syncSaltNode(
      state.saltFarm.nodes[nodeId],
      now,
      syncOpts,
    );
  }

  state.saltFarm.updatedAt = now;

  return state;
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
