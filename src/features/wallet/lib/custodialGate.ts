/**
 * Custodial farms (Google signup, no own wallet linked) can only link a
 * real wallet once they've reached Seedling reputation. This compensates
 * for the lazy-mint policy: anyone can grab a Google farm, but only
 * engaged players can take true custody of it.
 *
 * Shared by `LinkedAccounts.tsx` (the settings row that opens the link
 * flow) and `LinkWallet.tsx` (the link flow itself) so the gate stays
 * in lockstep across call sites.
 */
export function isCustodialWalletLinkBlocked({
  linkedWallet,
  custodialWallet,
  hasSeedlingReputation,
}: {
  linkedWallet?: string;
  custodialWallet?: string;
  hasSeedlingReputation: boolean;
}): boolean {
  return !linkedWallet && !!custodialWallet && !hasSeedlingReputation;
}
