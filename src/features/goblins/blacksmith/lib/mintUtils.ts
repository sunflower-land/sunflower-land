const SECONDS_DIVISOR = 1000;

type MintCooldownArgs = {
  cooldownSeconds: number | undefined;
  mintedAt: number | undefined;
};

/**
 * How many seconds until a user can mint again
 */
export function mintCooldown({ cooldownSeconds, mintedAt }: MintCooldownArgs) {
  if (!mintedAt || !cooldownSeconds) return 0;

  // 7 day period between minting items enforced on backend
  const diff = cooldownSeconds - (Date.now() / SECONDS_DIVISOR - mintedAt);

  if (diff < 0) return 0;

  return diff;
}
