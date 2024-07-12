import cloneDeep from "lodash.clonedeep";
import { FACTION_BANNERS, FACTION_EMBLEMS } from "./joinFaction";
import { GameState } from "features/game/types/game";

export type LeaveFactionAction = {
  type: "faction.left";
};

type Options = {
  state: Readonly<GameState>;
  action: LeaveFactionAction;
  createdAt?: number;
};

export function leaveFaction({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const game: GameState = cloneDeep(state);

  if (!game.faction) {
    throw new Error("You are not in a faction");
  }

  const emblem = FACTION_EMBLEMS[game.faction.name];
  if (game.inventory[emblem]?.gt(0)) {
    throw new Error("Cannot leave a faction with emblems");
  }

  if (createdAt - game.faction.pledgedAt < 1000 * 60 * 60 * 24) {
    throw new Error("Cannot leave a newly joined faction");
  }

  delete game.faction;
  delete game.inventory.Mark;

  // Clean up the banners
  Object.values(FACTION_BANNERS).forEach((name) => {
    delete game.inventory[name];
    delete game.collectibles[name];
    delete game.home.collectibles[name];
  });

  return game;
}
