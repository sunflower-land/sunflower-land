import type { GameState } from "../../types/game";
import { makeGame } from "../transforms";
import { getLastTemperateSeasonStartedAt } from "../temperateSeason";
import RAW from "./veteranFarm.json";

/**
 * "Veteran" preloaded farm — Adam's real account export, VERBATIM
 * (veteranFarm.json, the full server farm shape): volcano island, his exact
 * 12 expansions, every placement exactly where he put it (101 placed
 * collectibles, buildings, crops, home layout, salt farm, pets...), the
 * level-82 bumpkin with full skill tree, balances, wardrobe, chore board.
 *
 * Selected via the DevPanel Layout preset "veteran". The export runs through
 * `makeGame` — the same deserializer the client uses for the live API — so
 * nothing here is synthesized or approximated.
 */
export function makeVeteranFarm(): GameState {
  const game = makeGame(RAW);
  return {
    ...game,
    // Offline QoL: never re-open the Rules/T&C modal on reload, and stamp
    // the season to the current temperate window so the machine doesn't
    // boot into the blocking `seasonChanged` screen on every load (the
    // export's chapter has since rolled over).
    tcsAcknowledged: Date.now(),
    season: {
      ...game.season,
      startedAt: getLastTemperateSeasonStartedAt(),
    },
  };
}
