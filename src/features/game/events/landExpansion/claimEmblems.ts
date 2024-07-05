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

const EMBLEM_CLAIM_CUTOFF = new Date("2024-08-01T00:00:00Z").getTime();

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

  if (!faction.points) {
    throw new Error("No faction points");
  }

  if (faction.emblemsClaimedAt) {
    throw new Error("Emblems have already been claimed");
  }

  if (createdAt > EMBLEM_CLAIM_CUTOFF) {
    throw new Error("Emblem claim cutoff has passed");
  }

  const emblemName = FACTION_EMBLEMS[faction.name];
  const inventoryAmount = game.inventory[emblemName] ?? new Decimal(0);

  game.inventory[emblemName] = inventoryAmount.add(faction.points);
  faction.emblemsClaimedAt = createdAt;

  return game;
}
