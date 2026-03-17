export type SaltNode = {
  createdAt: number;
  salt: Salt;
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

function clampStoredCharges(value: number): number {
  return Math.max(0, Math.min(value, MAX_STORED_SALT_CHARGES_PER_NODE));
}

export function getStoredSaltCharges(saltNode: SaltNode, now: number): number {
  const storedCharges = clampStoredCharges(saltNode.salt.storedCharges);
  const lastUpdatedAt = saltNode.salt.lastUpdatedAt;
  const pauseUntil = saltNode.salt.harvesting?.regenerationPausedUntil;

  const generationStartAt = pauseUntil
    ? Math.max(lastUpdatedAt, pauseUntil)
    : lastUpdatedAt;

  if (now <= generationStartAt) {
    return storedCharges;
  }

  const generatedCharges = Math.floor(
    (now - generationStartAt) / SALT_CHARGE_GENERATION_TIME,
  );

  return clampStoredCharges(storedCharges + generatedCharges);
}

export function syncSaltNode(saltNode: SaltNode, now: number): SaltNode {
  const storedCharges = clampStoredCharges(saltNode.salt.storedCharges);
  const lastUpdatedAt = saltNode.salt.lastUpdatedAt;
  const pauseUntil = saltNode.salt.harvesting?.regenerationPausedUntil;

  const generationStartAt = pauseUntil
    ? Math.max(lastUpdatedAt, pauseUntil)
    : lastUpdatedAt;

  if (now <= generationStartAt) {
    return {
      ...saltNode,
      salt: {
        ...saltNode.salt,
        storedCharges,
        lastUpdatedAt,
      },
    };
  }

  const generatedCharges = Math.floor(
    (now - generationStartAt) / SALT_CHARGE_GENERATION_TIME,
  );

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
