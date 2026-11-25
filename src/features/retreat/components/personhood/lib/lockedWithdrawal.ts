import type { GameState, LockedWithdrawal } from "features/game/types/game";
import type { TransactionName } from "features/game/types/transactions";

/**
 * The withdrawal support prepared for this locked farm, or `undefined` when
 * there is nothing to show.
 *
 * Only a locked farm can fire it (an unlocked one withdraws normally), and
 * nothing is shown while a transaction is open: the transaction modal owns the
 * screen until it is sent or expires.
 */
export function getPendingGrant({
  game,
  now,
}: {
  game: Pick<GameState, "ban" | "transaction">;
  now: number;
}): LockedWithdrawal | undefined {
  const grant = game.ban.withdrawalGrant;

  if (game.ban.status !== "lock" || !grant) return undefined;
  if (grant.expiresAt <= now) return undefined;
  if (game.transaction) return undefined;

  return grant;
}

/** The transaction the API opens when the grant is fired. */
export const GRANT_TRANSACTION: Record<
  LockedWithdrawal["type"],
  TransactionName
> = {
  items: "transaction.itemsWithdrawn",
  wearables: "transaction.wearablesWithdrawn",
  flower: "transaction.flowerWithdrawn",
};
