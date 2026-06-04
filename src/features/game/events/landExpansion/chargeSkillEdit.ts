import Decimal from "decimal.js-light";
import type { Draft } from "immer";
import type { GameState } from "features/game/types/game";

// Players accrue a balance of "free" skill points used to wipe out the gem
// cost of removing skills. A single +REGEN_AMOUNT tick fires every REGEN_MS,
// capped at MAX_FREE_POINTS. Going dormant past one cycle does not stack
// missed ticks. Removing a point that is not absorbed by the balance costs
// GEM_COST_PER_POINT gems.
export const REGEN_AMOUNT = 50;
export const MAX_FREE_POINTS = 100;
export const REGEN_MS = 90 * 24 * 60 * 60 * 1000;
export const GEM_COST_PER_POINT = 5;

// Saves written before this feature have no balance field. We treat them as
// "one regen-worth at launch" so existing players are not stranded with 0.
const MIGRATION_DEFAULT_BALANCE = REGEN_AMOUNT;

type FreeSkillPointsState = {
  freeSkillPoints?: number;
  lastFreeSkillPointsRegenAt?: number;
};

// Returns the player's current free-point balance and regen anchor, applying
// a single +REGEN_AMOUNT tick if enough time has passed since the last anchor.
// Used by both the charging path and read-only UI helpers — keep this pure so
// the UI can preview the same balance the next edit will see.
export function getEffectiveFreeSkillPoints(
  bumpkin: FreeSkillPointsState,
  now: number,
): { balance: number; lastRegenAt: number } {
  const storedBalance = bumpkin.freeSkillPoints ?? MIGRATION_DEFAULT_BALANCE;
  const storedAnchor = bumpkin.lastFreeSkillPointsRegenAt ?? now;

  if (now - storedAnchor < REGEN_MS) {
    return { balance: storedBalance, lastRegenAt: storedAnchor };
  }

  return {
    balance: Math.min(MAX_FREE_POINTS, storedBalance + REGEN_AMOUNT),
    lastRegenAt: now,
  };
}

export function getSkillEditCost(
  pointsRemoved: number,
  freeSkillPoints: number,
): { gemCost: number; freePointsConsumed: number } {
  if (pointsRemoved <= 0) return { gemCost: 0, freePointsConsumed: 0 };

  const freePointsConsumed = Math.min(freeSkillPoints, pointsRemoved);
  const paidPoints = pointsRemoved - freePointsConsumed;

  return {
    gemCost: paidPoints * GEM_COST_PER_POINT,
    freePointsConsumed,
  };
}

export function chargeSkillEdit({
  game,
  pointsRemoved,
  useTicket = false,
  createdAt,
}: {
  game: Draft<GameState>;
  pointsRemoved: number;
  // Consume 1 Skill Reset Ticket to grant +REGEN_AMOUNT free balance, but only
  // when doing so actually lowers the gem cost. Throws if requested with no
  // removal to offset, or if it would help but the player has no ticket.
  useTicket?: boolean;
  createdAt: number;
}) {
  const { bumpkin } = game;

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  // Apply the regen tick exactly once so balance + anchor track wall-clock
  // time even for additions-only edits. All later free-point math reads this
  // single up-to-date value — never re-derive it, or the tick double-applies.
  const { balance, lastRegenAt } = getEffectiveFreeSkillPoints(
    bumpkin,
    createdAt,
  );
  bumpkin.freeSkillPoints = balance;
  bumpkin.lastFreeSkillPointsRegenAt = lastRegenAt;

  if (pointsRemoved <= 0) {
    // Nothing is being removed, so there is no cost for a ticket to offset.
    if (useTicket) {
      throw new Error(
        "Skill Reset Ticket can only be used when removing skills",
      );
    }
    return;
  }

  let { gemCost, freePointsConsumed } = getSkillEditCost(
    pointsRemoved,
    bumpkin.freeSkillPoints,
  );

  // A ticket grants +REGEN_AMOUNT to the free balance (capped) before the edit
  // consumes from it. Only spend it when it genuinely reduces the gem cost —
  // otherwise the grant has nothing to absorb and the ticket would be wasted.
  if (useTicket && gemCost > 0) {
    const balanceWithTicket = Math.min(
      MAX_FREE_POINTS,
      bumpkin.freeSkillPoints + REGEN_AMOUNT,
    );
    const withTicket = getSkillEditCost(pointsRemoved, balanceWithTicket);

    if (withTicket.gemCost < gemCost) {
      const ticketBalance =
        game.inventory["Skill Reset Ticket"] ?? new Decimal(0);
      if (ticketBalance.lt(1)) {
        throw new Error("You do not have a Skill Reset Ticket");
      }
      game.inventory["Skill Reset Ticket"] = ticketBalance.minus(1);
      bumpkin.freeSkillPoints = balanceWithTicket;
      ({ gemCost, freePointsConsumed } = withTicket);
    }
  }

  if (gemCost > 0) {
    const gemBalance = game.inventory.Gem ?? new Decimal(0);
    if (gemBalance.lt(gemCost)) {
      throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
    }
    game.inventory.Gem = gemBalance.minus(gemCost);
  }

  bumpkin.freeSkillPoints -= freePointsConsumed;
}
