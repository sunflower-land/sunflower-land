import Decimal from "decimal.js-light";
import {
  FactionBanner,
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

export type PledgeFactionAction = {
  type: "faction.pledged";
  faction: FactionName;
};

type Options = {
  state: Readonly<GameState>;
  action: PledgeFactionAction;
  createdAt?: number;
};

export const FACTION_BANNERS: Record<FactionName, FactionBanner> = {
  bumpkins: "Bumpkin Faction Banner",
  sunflorians: "Sunflorian Faction Banner",
  goblins: "Goblin Faction Banner",
  nightshades: "Nightshade Faction Banner",
};

export function pledgeFaction({
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

  stateCopy.faction = {
    name: action.faction,
    pledgedAt: createdAt,
    points: 0,
    history: {},
  };

  const banner = FACTION_BANNERS[action.faction];

  stateCopy.inventory[banner] = (
    stateCopy.inventory[banner] ?? new Decimal(0)
  ).add(1);

  return stateCopy;
}
