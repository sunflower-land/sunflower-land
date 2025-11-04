import { produce } from "immer";
import Decimal from "decimal.js-light";
import {
  BoostName,
  GameState,
  Inventory,
  TemperateSeasonName,
} from "features/game/types/game";
import { isWearableActive } from "features/game/lib/wearables";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

const LAVA_PIT_REQUIREMENTS_OLD: Record<TemperateSeasonName, Inventory> = {
  autumn: {
    Artichoke: new Decimal(30),
    Broccoli: new Decimal(750),
    Yam: new Decimal(1000),
    Gold: new Decimal(5),
    Crimstone: new Decimal(4),
  },
  winter: {
    "Merino Wool": new Decimal(200),
    Onion: new Decimal(400),
    Turnip: new Decimal(200),
  },
  spring: {
    Celestine: new Decimal(2),
    Lunara: new Decimal(2),
    Duskberry: new Decimal(2),
    Rhubarb: new Decimal(2000),
    Kale: new Decimal(100),
  },
  summer: {
    Oil: new Decimal(100),
    Pepper: new Decimal(750),
    Zucchini: new Decimal(1000),
  },
};

const LAVA_PIT_REQUIREMENTS_NEW: Record<TemperateSeasonName, Inventory> = {
  autumn: {
    Artichoke: new Decimal(30),
    Broccoli: new Decimal(750),
    Yam: new Decimal(1000),
    Gold: new Decimal(5),
    Crimstone: new Decimal(6),
  },
  winter: {
    "Merino Wool": new Decimal(150),
    Onion: new Decimal(400),
    Turnip: new Decimal(200),
    Crimstone: new Decimal(5),
  },
  spring: {
    Celestine: new Decimal(2),
    Lunara: new Decimal(2),
    Duskberry: new Decimal(2),
    Rhubarb: new Decimal(2000),
    Crimstone: new Decimal(10),
  },
  summer: {
    Oil: new Decimal(70),
    Pepper: new Decimal(750),
    Zucchini: new Decimal(1000),
    Crimstone: new Decimal(4),
  },
};

const NEW_REQUIREMENTS_START_DATE = new Date(
  "2025-11-10T00:00:00.000Z",
).getTime();

export const getLavaPitRequirements = (
  game: GameState,
  createdAt: number,
): {
  requirements: Inventory;
  boostUsed: BoostName[];
} => {
  const season = game.season.season;

  const useNewRequirements = createdAt >= NEW_REQUIREMENTS_START_DATE;
  const requirementsMap: Record<TemperateSeasonName, Inventory> =
    useNewRequirements
      ? { ...LAVA_PIT_REQUIREMENTS_NEW }
      : { ...LAVA_PIT_REQUIREMENTS_OLD };

  const baseRequirements: Inventory = requirementsMap[season];

  let requirementsMultiplier = 1;
  const boostUsed: BoostName[] = [];

  if (isWearableActive({ game, name: "Lava Swimwear" })) {
    requirementsMultiplier *= 0.5;
    boostUsed.push("Lava Swimwear");
  }

  const requirements = getObjectEntries(baseRequirements).reduce(
    (acc, [item, req]) => {
      if (!req) {
        return acc;
      }

      acc[item] = req.mul(requirementsMultiplier);

      return acc;
    },
    { ...baseRequirements },
  );

  return { requirements, boostUsed };
};

export const LAVA_PIT_TIME = 72 * 60 * 60 * 1000;

export function getLavaPitTime({ game }: { game: GameState }) {
  let time = LAVA_PIT_TIME;
  const boostsUsed: BoostName[] = [];

  if (isWearableActive({ name: "Obsidian Necklace", game })) {
    time = time * 0.5;
    boostsUsed.push("Obsidian Necklace");
  }

  if (isCollectibleBuilt({ name: "Magma Stone", game })) {
    time = time * 0.85;
    boostsUsed.push("Magma Stone");
  }

  return { time, boostsUsed };
}

export type StartLavaPitAction = {
  type: "lavaPit.started";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: StartLavaPitAction;
  createdAt?: number;
};

export function startLavaPit({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (copy) => {
    const { inventory } = copy;

    const lavaPit = copy.lavaPits[action.id];

    if (!lavaPit) {
      throw new Error("Lava pit not found");
    }

    if (lavaPit.x === undefined && lavaPit.y === undefined) {
      throw new Error("Lava pit is not placed");
    }

    const { requirements, boostUsed: lavaPitBoostsUsed } =
      getLavaPitRequirements(copy, createdAt);

    getObjectEntries(requirements).forEach(([item, requiredAmount]) => {
      const inventoryAmount = inventory[item] ?? new Decimal(0);

      if (inventoryAmount.lt(requiredAmount ?? new Decimal(0))) {
        throw new Error(`Required resource ${item} not found`);
      }

      copy.inventory[item] = inventoryAmount.sub(
        requiredAmount ?? new Decimal(0),
      );
    });

    if (lavaPit.startedAt !== undefined) {
      throw new Error("Lava pit already started");
    }

    const { time, boostsUsed: lavaPitTimeBoostsUsed } = getLavaPitTime({
      game: copy,
    });

    lavaPit.startedAt = createdAt;
    lavaPit.readyAt = createdAt + time;
    lavaPit.collectedAt = undefined;

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: [...lavaPitBoostsUsed, ...lavaPitTimeBoostsUsed],
      createdAt,
    });

    return copy;
  });
}
