import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import {
  MAX_FREE_POINTS,
  REGEN_AMOUNT,
  getEffectiveFreeSkillPoints,
} from "./chargeSkillEdit";

export type SkillResetTicketUsedAction = {
  type: "skillResetTicket.used";
};

type Options = {
  state: GameState;
  action: SkillResetTicketUsedAction;
  createdAt?: number;
};

export function useSkillResetTicket({
  state,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const { bumpkin } = game;

    if (bumpkin == undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    const ticketBalance =
      game.inventory["Skill Reset Ticket"] ?? new Decimal(0);
    if (ticketBalance.lt(1)) {
      throw new Error("You do not have a Skill Reset Ticket");
    }

    // Apply any pending regen before adding to the balance so the cap is
    // honored against an up-to-date number.
    const { balance, lastRegenAt } = getEffectiveFreeSkillPoints(
      bumpkin,
      createdAt,
    );

    bumpkin.freeSkillPoints = Math.min(MAX_FREE_POINTS, balance + REGEN_AMOUNT);
    bumpkin.lastFreeSkillPointsRegenAt = lastRegenAt;
    game.inventory["Skill Reset Ticket"] = ticketBalance.minus(1);
  });
}
