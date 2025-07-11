import Decimal from "decimal.js-light";
import {
  FactionBanner,
  FactionEmblem,
  FactionName,
  GameState,
} from "features/game/types/game";
import { produce } from "immer";

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
export const FACTION_BOOST_COOLDOWN = 42 * 24 * 60 * 60 * 1000; // 6 weeks

export function joinFaction({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
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

    const isSwitchingDifferentFaction =
      stateCopy.previousFaction?.name !== action.faction &&
      stateCopy.previousFaction?.leftAt;

    stateCopy.faction = {
      name: action.faction,
      pledgedAt: createdAt,
      points: 0,
      history: {},
      boostCooldownUntil: isSwitchingDifferentFaction
        ? (stateCopy.previousFaction?.leftAt ?? createdAt) +
          FACTION_BOOST_COOLDOWN
        : undefined, // Only add cooldown if switching to a different faction
    };

    if (stateCopy.previousFaction) {
      delete stateCopy.previousFaction;
    }

    stateCopy.balance = state.balance.sub(action.sfl);

    const banner = FACTION_BANNERS[action.faction];

    stateCopy.inventory[banner] = (
      stateCopy.inventory[banner] ?? new Decimal(0)
    ).add(1);

    return stateCopy;
  });
}
