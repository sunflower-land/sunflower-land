import Decimal from "decimal.js-light";
import {
  FactionBanner,
  FactionEmblem,
  FactionName,
  GameState,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export const FACTIONS: FactionName[] = [
  "bumpkins",
  "sunflorians",
  "goblins",
  "nightshades",
];

export type JoinFactionAction = {
  type: "faction.joined";
  faction: FactionName;
};

type Options = {
  state: Readonly<GameState>;
  action: JoinFactionAction;
  createdAt?: number;
};

export const FACTION_BANNERS: Record<FactionName, FactionBanner> = {
  bumpkins: "Bumpkin Faction Banner",
  sunflorians: "Sunflorian Faction Banner",
  goblins: "Goblin Faction Banner",
  nightshades: "Nightshade Faction Banner",
};

export const FACTION_EMBLEMS: Record<FactionName, FactionEmblem> = {
  bumpkins: "Bumpkin Emblem",
  sunflorians: "Sunflorian Emblem",
  goblins: "Goblin Emblem",
  nightshades: "Nightshade Emblem",
};

export const SFL_COST = 10;
export const EMBLEM_QTY = 1;

export function joinFaction({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy: GameState = cloneDeep(state);

  if (!FACTIONS.includes(action.faction)) {
    throw new Error("Invalid faction");
  }

  if (stateCopy.faction && stateCopy.faction.pledgedAt) {
    throw new Error("You already pledged a faction");
  }

  // not enough SFL
  if (stateCopy.balance.lt(SFL_COST)) {
    throw new Error("Not enough SFL");
  }

  stateCopy.faction = {
    name: action.faction,
    pledgedAt: createdAt,
    points: 0,
    history: {},

    donated: {
      daily: {
        resources: {},
        sfl: {},
      },
      totalItems: {},
    },
  };

  stateCopy.balance = state.balance.sub(SFL_COST);

  const banner = FACTION_BANNERS[action.faction];
  const emblem = FACTION_EMBLEMS[action.faction];

  const emblemsInInventory = stateCopy.inventory[emblem] ?? new Decimal(0);

  stateCopy.inventory[banner] = (
    stateCopy.inventory[banner] ?? new Decimal(0)
  ).add(1);

  stateCopy.inventory[emblem] = emblemsInInventory.add(EMBLEM_QTY);

  return stateCopy;
}
