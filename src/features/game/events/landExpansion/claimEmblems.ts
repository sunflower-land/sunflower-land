import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { FACTION_EMBLEMS } from "./joinFaction";
import { GameState } from "features/game/types/game";

export type ClaimEmblemsAction = {
  type: "emblems.claimed";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimEmblemsAction;
  createdAt?: number;
};

export function claimEmblems({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const game = cloneDeep<GameState>(state);

  const faction = game.faction;

  if (!faction) {
    throw new Error("No faction has been pledged");
  }

  if (faction.emblemsClaimedAt) {
    throw new Error("Emblems have already been claimed");
  }

  const emblemName = FACTION_EMBLEMS[faction.name];
  const inventoryAmount = game.inventory[emblemName] ?? new Decimal(0);

  game.inventory[emblemName] = inventoryAmount.add(faction.points);
  faction.emblemsClaimedAt = createdAt;

  return game;
}
