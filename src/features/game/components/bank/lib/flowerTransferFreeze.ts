/**
 * Temporary freeze on FLOWER deposits and withdrawals while a suspected
 * exploit is investigated.
 *
 * FLOWER only. Withdrawing and depositing collectibles, wearables, buds and
 * pets is deliberately left open — the concern is the token, and closing the
 * NFT flows too would strand players mid-trade for no benefit.
 *
 * Both flows are closed on their FLOWER page rather than by disabling the
 * confirm button, so a player is told what is happening before they connect
 * a wallet or type an amount.
 *
 * A hard-coded date, not a feature flag: the end of the window is already
 * agreed, and nothing should be able to lift it early by accident. Rollback
 * is deleting this file, `FlowerTransfersFrozen.tsx`, and the two guards that
 * use them.
 *
 * This is a client-side gate. The API still accepts `withdraw.flower` and
 * `flower.depositStarted`, so anyone driving those directly is unaffected.
 */
export const FLOWER_TRANSFERS_FROZEN_UNTIL = new Date(Date.UTC(2026, 7, 24));

export const areFlowerTransfersFrozen = (now: number = Date.now()): boolean =>
  now < FLOWER_TRANSFERS_FROZEN_UNTIL.getTime();

/** e.g. "24 August" — the day the FLOWER flows reopen. */
export const flowerTransfersFrozenUntilLabel = (): string =>
  FLOWER_TRANSFERS_FROZEN_UNTIL.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
