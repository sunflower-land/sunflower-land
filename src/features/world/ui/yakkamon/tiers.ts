/**
 * Tiered pre-registration for Yakkamon. Access opens to the highest levels first
 * and drops a tier each day, so everyone eventually gets a shot at a code.
 *
 * These tiers MUST mirror the backend schedule behind the `yakkamon.code` effect —
 * the client only uses them to render the table and enable the claim button; the
 * server is the authority on whether a code is actually issued.
 */
export type YakkamonTier = {
  /** Minimum ascension-aware total Bumpkin level for this tier. */
  level: number;
  unlocksAt: number;
};

/** Ordered from the earliest (highest level) tier to the latest (lowest level). */
export const YAKKAMON_TIERS: YakkamonTier[] = [
  { level: 150, unlocksAt: new Date("2026-07-31T00:00:00Z").getTime() },
  { level: 100, unlocksAt: new Date("2026-08-01T00:00:00Z").getTime() },
  { level: 50, unlocksAt: new Date("2026-08-02T00:00:00Z").getTime() },
  { level: 20, unlocksAt: new Date("2026-08-03T00:00:00Z").getTime() },
];

/**
 * The tier that is live right now - i.e. the lowest level that can currently
 * claim, mirroring the API's `requiredLevel`. Null before the first tier opens.
 */
export const getOpenTier = (now: number): YakkamonTier | null =>
  YAKKAMON_TIERS.filter((tier) => tier.unlocksAt <= now).at(-1) ?? null;

/**
 * When this player's level becomes claimable. Null if they are below every tier
 * (i.e. under the final, lowest level requirement).
 */
export const getUnlockAt = (level: number): number | null =>
  YAKKAMON_TIERS.find((tier) => level >= tier.level)?.unlocksAt ?? null;

/**
 * Beta testers can grab a code at any point; everyone else waits for their
 * level's tier to open.
 */
export const canClaimCode = ({
  level,
  now,
  isBetaTester,
}: {
  level: number;
  now: number;
  isBetaTester: boolean;
}): boolean => {
  if (isBetaTester) return true;

  const unlockAt = getUnlockAt(level);

  return unlockAt !== null && unlockAt <= now;
};
