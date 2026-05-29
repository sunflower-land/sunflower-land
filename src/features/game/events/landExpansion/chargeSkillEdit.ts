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
  createdAt,
}: {
  game: Draft<GameState>;
  pointsRemoved: number;
  createdAt: number;
}) {
  const { bumpkin } = game;

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  // Always run the regen tick so additions-only edits still keep the player's
  // balance and anchor in sync with wall-clock time.
  const { balance, lastRegenAt } = getEffectiveFreeSkillPoints(
    bumpkin,
    createdAt,
  );
  bumpkin.freeSkillPoints = balance;
  bumpkin.lastFreeSkillPointsRegenAt = lastRegenAt;

  if (pointsRemoved <= 0) return;

  const { gemCost, freePointsConsumed } = getSkillEditCost(
    pointsRemoved,
    bumpkin.freeSkillPoints,
  );

  if (gemCost > 0) {
    const gemBalance = game.inventory.Gem ?? new Decimal(0);
    if (gemBalance.lt(gemCost)) {
      throw new Error(`Not enough gems. Cost: ${gemCost} gems`);
    }
    game.inventory.Gem = gemBalance.minus(gemCost);
  }

  bumpkin.freeSkillPoints -= freePointsConsumed;
}
