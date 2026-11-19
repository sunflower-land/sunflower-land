import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { getPigsNeedingMud } from "features/game/events/landExpansion/bulkApplyMud";
import { MUD_PER_APPLICATION } from "features/game/lib/animals";

/** Building-level Apply Mud is usable: Mud to spend and a Pig to spend it on. */
export const canApplyMud = (game: GameState, now: number) =>
  (game.inventory.Mud ?? new Decimal(0)).gte(MUD_PER_APPLICATION) &&
  getPigsNeedingMud(game, now).length > 0;
