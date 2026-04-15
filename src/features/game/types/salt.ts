import Decimal from "decimal.js-light";
import { Coordinates } from "../expansion/components/MapPlacement";
import type { GameState, InventoryItemName } from "./game";
import { getObjectEntries } from "lib/object";
import { getMaxStoredSaltCharges as getMaxStoredSaltChargesFromLevel } from "./saltSculpture";

export type SaltNode = {
  createdAt: number;
  salt: Salt;
  coordinates: Coordinates;
};

export type Salt = {
  claimedAt?: number;
  nextChargeAt: number;
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
      coins: 4_000,
      items: {
        Wood: new Decimal(500),
        Gold: new Decimal(40),
        Salt: new Decimal(200),
      },
    },
  },
  4: {
    nodes: 6,
    upgradeCost: {
      coins: 12_000,
      items: {
        Gold: new Decimal(100),
        Salt: new Decimal(1_000),
      },
    },
  },
};

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

export function getSaltChargeGenerationTime({
  gameState,
}: {
  gameState: GameState;
}): number {
  let chargeGenerationTimeMs = SALT_CHARGE_GENERATION_TIME;

  if (gameState.bumpkin?.skills["Salty Seas"]) {
    chargeGenerationTimeMs *= 0.9;
  }

  if ((gameState.sculptures?.["Salt Sculpture"]?.level ?? 0) >= 1) {
    chargeGenerationTimeMs *= 0.95;
  }

  return chargeGenerationTimeMs;
}

export const BASE_SALT_YIELD = 10; // 10 salt per rake
export const MAX_STORED_SALT_CHARGES_PER_NODE = 3; // 3 salt charges per node

export const SEA_BLESSED_CHANCE = 5;
export const SEA_BLESSED_NODE_COUNT = 4;

export function rechargeAllSaltNodes(
  game: GameState,
  createdAt: number,
): GameState {
  const interval = getSaltChargeGenerationTime({ gameState: game });
  for (const nodeId of Object.keys(game.saltFarm.nodes)) {
    game.saltFarm.nodes[nodeId].salt.storedCharges =
      MAX_STORED_SALT_CHARGES_PER_NODE;
    game.saltFarm.nodes[nodeId].salt.nextChargeAt = createdAt + interval;
  }
  return game;
}

export function getSaltYieldPerRake(gameState: GameState): number {
  let saltYield = BASE_SALT_YIELD;

  if (gameState.bumpkin?.skills["Wide Rakes"]) {
    saltYield += 2;
  }

  return saltYield;
}

function clampStoredCharges(
  value: number,
  max = MAX_STORED_SALT_CHARGES_PER_NODE,
): number {
  return Math.max(0, Math.min(value, max));
}

export type SaltSyncOptions = {
  chargeIntervalMs?: number;
  maxCharges?: number;
};

export type SaltHarvestSlot = { startedAt: number; readyAt: number };

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

export function materializeSaltRegen(
  salt: Salt,
  now: number,
  options?: SaltSyncOptions,
): Salt {
  const intervalMs = options?.chargeIntervalMs ?? SALT_CHARGE_GENERATION_TIME;
  const maxCharges = options?.maxCharges ?? MAX_STORED_SALT_CHARGES_PER_NODE;
  let storedCharges = clampStoredCharges(salt.storedCharges, maxCharges);

  let nextChargeAt = Number.isFinite(salt.nextChargeAt)
    ? salt.nextChargeAt
    : now + intervalMs;

  while (now >= nextChargeAt && storedCharges < maxCharges) {
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

export function populateSaltFarm({
  game,
  now,
}: {
  game: GameState;
  now: number;
}) {
  const chargeIntervalMs = getSaltChargeGenerationTime({ gameState: game });
  const maxCharges = getMaxStoredSaltChargesFromLevel(
    game.sculptures?.["Salt Sculpture"]?.level ?? 0,
  );
  const syncOpts: SaltSyncOptions = { chargeIntervalMs, maxCharges };

  for (const nodeId of Object.keys(game.saltFarm.nodes)) {
    game.saltFarm.nodes[nodeId] = syncSaltNode(
      game.saltFarm.nodes[nodeId],
      now,
      syncOpts,
    );
  }
}

export const SALT_NODE_COORDINATES: Record<string, Coordinates> = {
  "0": { x: -5, y: -18 },
  "1": { x: -5, y: -17 },
  "2": { x: -6, y: -18 },
  "3": { x: -6, y: -17 },
  "4": { x: -5, y: -19 },
  "5": { x: -6, y: -19 },
};

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

export function getSaltNodePosition(
  saltNode: SaltNode,
  highestY: number,
  lowestY: number,
  leftestX: number,
  rightestX: number,
): "top" | "bottom" | "left" | "right" | undefined {
  if (saltNode.coordinates.y === highestY) {
    return "top";
  }
  if (saltNode.coordinates.y === lowestY) {
    return "bottom";
  }
  if (saltNode.coordinates.x === leftestX) {
    return "left";
  }
  if (saltNode.coordinates.x === rightestX) {
    return "right";
  }
  return undefined;
}

export function getSaltNodesWithPositions(
  saltNodes: SaltNodes,
): Record<
  string,
  SaltNode & { position: "top" | "bottom" | "left" | "right" | undefined }
> {
  const highestY = Math.max(
    ...Object.values(saltNodes).map((node) => node.coordinates.y),
  );
  const lowestY = Math.min(
    ...Object.values(saltNodes).map((node) => node.coordinates.y),
  );
  const leftestX = Math.min(
    ...Object.values(saltNodes).map((node) => node.coordinates.x),
  );
  const rightestX = Math.max(
    ...Object.values(saltNodes).map((node) => node.coordinates.x),
  );

  const saltNodesWithPosition = getObjectEntries(saltNodes).map<
    [
      string,
      SaltNode & { position: "top" | "bottom" | "left" | "right" | undefined },
    ]
  >(([id, node]) => {
    const position = getSaltNodePosition(
      node,
      highestY,
      lowestY,
      leftestX,
      rightestX,
    );
    return [id, { ...node, position }];
  });

  return saltNodesWithPosition.reduce<
    Record<
      string,
      SaltNode & { position: "top" | "bottom" | "left" | "right" | undefined }
    >
  >((acc, [id, node]) => {
    acc[id] = node;

    return acc;
  }, {});
}
