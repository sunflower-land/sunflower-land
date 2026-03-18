import { Coordinates } from "../expansion/components/MapPlacement";

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
  lastUpdatedAt: number;
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

export const SALT_CHARGE_GENERATION_TIME = 1000 * 60 * 60 * 7; // 7 hours per charge
export const SALT_HARVEST_DURATION = 1000 * 60 * 60; // 60 minutes (harvest action only)
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

/**
 * Computes when charge generation is allowed to start.
 *
 * Generation normally starts from `lastUpdatedAt`. When regeneration is paused,
 * generation starts from the later of `lastUpdatedAt` and `regenerationPausedUntil`.
 *
 * @param lastUpdatedAt Last timestamp used as the regeneration anchor.
 * @param regenerationPausedUntil Optional pause boundary for regeneration.
 * @returns The effective timestamp from which generation can progress.
 */
export function getSaltGenerationStartAt({
  lastUpdatedAt,
  regenerationPausedUntil,
}: {
  lastUpdatedAt: number;
  regenerationPausedUntil?: number;
}): number {
  return regenerationPausedUntil
    ? Math.max(lastUpdatedAt, regenerationPausedUntil)
    : lastUpdatedAt;
}

/**
 * Calculates the number of fully generated charges between `generationStartAt` and `now`.
 *
 * Partial intervals do not count toward generated charges.
 *
 * @param generationStartAt Effective generation anchor timestamp.
 * @param now Current timestamp in milliseconds.
 * @returns Number of full 7-hour charge intervals elapsed.
 */
export function getGeneratedSaltCharges({
  generationStartAt,
  now,
}: {
  generationStartAt: number;
  now: number;
}): number {
  if (now <= generationStartAt) {
    return 0;
  }

  return Math.floor((now - generationStartAt) / SALT_CHARGE_GENERATION_TIME);
}

/**
 * Calculates seconds remaining until the next charge boundary.
 *
 * This helper assumes regeneration is currently active (not paused/maxed) and
 * returns a ceiling-rounded value suitable for countdown UI display.
 *
 * @param generationStartAt Effective generation anchor timestamp.
 * @param now Current timestamp in milliseconds.
 * @returns Whole seconds until the next charge is generated.
 */
export function getNextSaltChargeInSeconds({
  generationStartAt,
  now,
}: {
  generationStartAt: number;
  now: number;
}): number {
  const elapsed = Math.max(0, now - generationStartAt);
  const remainingMs =
    SALT_CHARGE_GENERATION_TIME - (elapsed % SALT_CHARGE_GENERATION_TIME);

  return Math.ceil(remainingMs / 1000);
}

/**
 * Builds a normalized regeneration snapshot for a node at `now`.
 *
 * It centralizes common math used by charge derivation and node synchronization:
 * clamped stored charges, effective generation anchor, and full generated intervals.
 */
function getSaltGenerationState(saltNode: SaltNode, now: number) {
  const storedCharges = clampStoredCharges(saltNode.salt.storedCharges);
  const lastUpdatedAt = saltNode.salt.lastUpdatedAt;
  const pauseUntil = saltNode.salt.harvesting?.regenerationPausedUntil;

  const generationStartAt = getSaltGenerationStartAt({
    lastUpdatedAt,
    regenerationPausedUntil: pauseUntil,
  });
  const generatedCharges = getGeneratedSaltCharges({ generationStartAt, now });

  return {
    storedCharges,
    lastUpdatedAt,
    pauseUntil,
    generationStartAt,
    generatedCharges,
  };
}

/**
 * Derives how many unassigned (stored) charges a node has at `now`.
 *
 * Uses the normalized regeneration snapshot to apply full generated intervals
 * on top of clamped stored charges, then constrains the result to node max.
 *
 * @param saltNode Salt node to evaluate.
 * @param now Current timestamp in milliseconds.
 * @returns Stored charge count at `now`, clamped to the valid range.
 */
export function getStoredSaltCharges(saltNode: SaltNode, now: number): number {
  const { storedCharges, generatedCharges } = getSaltGenerationState(
    saltNode,
    now,
  );

  return clampStoredCharges(storedCharges + generatedCharges);
}

/**
 * Produces a time-synced copy of a salt node by materializing elapsed
 * regeneration into `storedCharges` and `lastUpdatedAt`.
 *
 * It reuses the same normalized regeneration math as `getStoredSaltCharges`,
 * advances only full 7-hour intervals, updates `lastUpdatedAt` to the last
 * fully materialized charge boundary (or `now` when max is reached), and clears
 * expired `regenerationPausedUntil` while preserving active harvest slots.
 *
 * @param saltNode Salt node to synchronize.
 * @param now Current timestamp in milliseconds.
 * @returns A new SaltNode representing consistent state at `now`.
 */
export function syncSaltNode(saltNode: SaltNode, now: number): SaltNode {
  const {
    storedCharges,
    lastUpdatedAt,
    pauseUntil,
    generationStartAt,
    generatedCharges,
  } = getSaltGenerationState(saltNode, now);

  if (generatedCharges <= 0) {
    return {
      ...saltNode,
      salt: {
        ...saltNode.salt,
        storedCharges,
        lastUpdatedAt,
      },
    };
  }

  const nextStoredCharges = clampStoredCharges(
    storedCharges + generatedCharges,
  );
  const nextLastUpdatedAt =
    nextStoredCharges === MAX_STORED_SALT_CHARGES_PER_NODE
      ? now
      : generationStartAt + generatedCharges * SALT_CHARGE_GENERATION_TIME;

  let pauseClearedHarvesting = saltNode.salt.harvesting;
  if (pauseClearedHarvesting && pauseUntil && now >= pauseUntil) {
    pauseClearedHarvesting = {
      slots: pauseClearedHarvesting.slots,
      regenerationPausedUntil: undefined,
    };
  }

  return {
    ...saltNode,
    salt: {
      ...saltNode.salt,
      storedCharges: nextStoredCharges,
      lastUpdatedAt: nextLastUpdatedAt,
      harvesting: pauseClearedHarvesting,
    },
  };
}
