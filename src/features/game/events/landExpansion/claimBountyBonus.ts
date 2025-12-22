import Decimal from "decimal.js-light";
import { getWeekKey, weekResetsAt } from "features/game/lib/factions";
import { ANIMALS } from "features/game/types/animals";
import { GameState } from "features/game/types/game";
import { getChapterTicket } from "features/game/types/chapters";
import { produce } from "immer";

export type ClaimBountyBonusAction = {
  type: "claim.bountyBoardBonus";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimBountyBonusAction;
  createdAt?: number;
};

/**
 * Weeks that do not have a bounty bonus
 * - Final Week of Chapter
 * - Week of chapter auctions
 */
export const NO_BONUS_BOUNTIES_WEEK = [
  "2025-04-28",
  "2025-06-23", // Auction Week
  "2025-07-28", // Final Week
  "2025-08-04", // Better Together Rest Week
  "2025-10-06", // Better Together Auction Week
  "2025-11-03", // Paw Prints Rest Week
  "2026-01-05", // Paw Prints Auction Week
];

export function claimBountyBonus({
  state,
  createdAt = Date.now(),
}: Options): Readonly<GameState> {
  return produce(state, (draft) => {
    const { bounties, inventory } = draft;
    const megaBounties = bounties.requests.filter(
      (bounty) => !Object.keys(ANIMALS).includes(bounty.name),
    );

    if (megaBounties.length === 0) {
      throw new Error("No mega bounties to claim");
    }

    const isAllBountiesCompleted = megaBounties.every((bounty) =>
      bounties.completed.find((completed) => completed.id === bounty.id),
    );

    // Check if all bounties completed, else throw error
    if (!isAllBountiesCompleted) {
      throw new Error("Bounty Board not completed");
    }

    const currentWeek = getWeekKey({ date: new Date(createdAt) });

    if (NO_BONUS_BOUNTIES_WEEK.includes(currentWeek)) {
      throw new Error("Bounty Bonus not available for this week");
    }

    // If bonus already claimed for the week, throw error
    const currentWeekEnd = weekResetsAt({ date: new Date(createdAt) });
    const { bonusClaimedAt = 0 } = bounties;
    const weekStart = new Date(currentWeek).getTime();

    // Check if:
    // 1. A bonus was claimed after the start of this week
    // 2. This claim attempt is after the last bonus claim
    // 3. This claim attempt is before the end of the week
    // If all true, then player already claimed bonus this week
    if (
      bonusClaimedAt > weekStart &&
      createdAt > bonusClaimedAt &&
      createdAt < currentWeekEnd
    ) {
      throw new Error("Bounty Bonus already claimed for the week");
    }

    // Claim bonus
    const ticket = getChapterTicket(createdAt);
    inventory[ticket] = (inventory[ticket] ?? new Decimal(0)).add(50);
    bounties.bonusClaimedAt = createdAt;

    return draft;
  });
}
