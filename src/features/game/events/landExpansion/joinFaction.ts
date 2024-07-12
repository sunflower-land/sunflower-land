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
  sfl: number;
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

export const SFL_COST = [5, 10, 30, 50];

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

  if (!SFL_COST.includes(action.sfl)) {
    throw new Error("Not a valid fee");
  }

  // not enough SFL
  if (stateCopy.balance.lt(action.sfl)) {
    throw new Error("Not enough SFL");
  }

  stateCopy.faction = {
    name: action.faction,
    pledgedAt: createdAt,
    points: 0,
    history: {},
  };

  stateCopy.balance = state.balance.sub(action.sfl);

  const banner = FACTION_BANNERS[action.faction];

  stateCopy.inventory[banner] = (
    stateCopy.inventory[banner] ?? new Decimal(0)
  ).add(1);

  return stateCopy;
}
