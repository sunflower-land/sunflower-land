import Decimal from "decimal.js-light";
import { isWearableActive } from "features/game/lib/wearables";
import { BumpkinItem } from "features/game/types/bumpkin";
import { FactionName, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum DELIVER_FACTION_KITCHEN_ERRORS {
  NO_FACTION = "Player has not joined a faction",
  FACTION_KITCHEN_NOT_STARTED = "Faction kitchen has not started yet",
  NO_KITCHEN_DATA = "No kitchen data available",
  NO_RESOURCE_FOUND = "No requested resource found at index",
  INSUFFICIENT_RESOURCES = "Insufficient resources",
}

export const FACTION_KITCHEN_START_TIME = new Date(
  "2024-07-01T00:00:00Z"
).getTime();
export const BASE_POINTS = 20;

export type DeliverFactionKitchenAction = {
  type: "factionKitchen.delivered";
  resourceIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: DeliverFactionKitchenAction;
  createdAt?: number;
};

type OutfitPart = "hat" | "shirt" | "pants" | "shoes" | "tool";

const FACTION_OUTFITS: Record<FactionName, Record<OutfitPart, BumpkinItem>> = {
  bumpkins: {
    hat: "Bumpkin Helmet",
    shirt: "Bumpkin Armor",
    pants: "Bumpkin Pants",
    shoes: "Bumpkin Sabatons",
    tool: "Bumpkin Sword",
  },
  goblins: {
    hat: "Goblin Helmet",
    shirt: "Goblin Armor",
    pants: "Goblin Pants",
    shoes: "Goblin Sabatons",
    tool: "Goblin Axe",
  },
  sunflorians: {
    hat: "Sunflorian Helmet",
    shirt: "Sunflorian Armor",
    pants: "Sunflorian Pants",
    shoes: "Sunflorian Sabatons",
    tool: "Sunflorian Sword",
  },
  nightshades: {
    hat: "Nightshade Helmet",
    shirt: "Nightshade Armor",
    pants: "Nightshade Pants",
    shoes: "Nightshade Sabatons",
    tool: "Nightshade Sword",
  },
};

function getFactionWearableBoostAmount(game: GameState, basePoints: number) {
  const factionName = game.faction?.name as FactionName;

  let points = 0;

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].pants,
    })
  ) {
    points += basePoints * 0.05;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shoes,
    })
  ) {
    points += basePoints * 0.05;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].tool,
    })
  ) {
    points += basePoints * 0.1;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].hat,
    })
  ) {
    points += basePoints * 0.1;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shirt,
    })
  ) {
    points += basePoints * 0.2;
  }

  return points;
}

export function deliverFactionKitchen({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { faction, inventory } = stateCopy;

  if (!faction) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.NO_FACTION);
  }

  if (createdAt < FACTION_KITCHEN_START_TIME) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.FACTION_KITCHEN_NOT_STARTED);
  }

  const { kitchen } = faction;

  if (!kitchen) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.NO_KITCHEN_DATA);
  }

  const { requests: resources } = kitchen;

  if (!resources[action.resourceIndex]) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.NO_RESOURCE_FOUND);
  }

  const request = resources[action.resourceIndex];

  const resourceBalance = inventory[request.item] ?? new Decimal(0);

  if (resourceBalance.lt(request.amount)) {
    throw new Error(DELIVER_FACTION_KITCHEN_ERRORS.INSUFFICIENT_RESOURCES);
  }

  inventory[request.item] = resourceBalance.minus(request.amount);

  const marksBalance = inventory["Mark"] ?? new Decimal(0);
  const points = BASE_POINTS - request.deliveryCount * 2;
  const boostPoints = getFactionWearableBoostAmount(stateCopy, points);
  const totalPoints = points + boostPoints;

  if (totalPoints < 2) {
    kitchen.points += 1;
    inventory["Mark"] = marksBalance.plus(1);
  } else {
    kitchen.points += totalPoints;
    inventory["Mark"] = marksBalance.plus(totalPoints);
  }

  request.deliveryCount += 1;

  return stateCopy;
}
