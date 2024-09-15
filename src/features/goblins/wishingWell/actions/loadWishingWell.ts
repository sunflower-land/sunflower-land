import { getPairBalance } from "lib/blockchain/Pair";
import { sflBalanceOf } from "lib/blockchain/Token";
import {
  canCollectFromWell,
  getLockedPeriod,
  getWellBalance,
  lastCollectedFromWell,
} from "lib/blockchain/WishingWell";
import { CONFIG } from "lib/config";
import { secondsToString } from "lib/utils/time";

const wishingWellAddress = CONFIG.WISHING_WELL_CONTRACT;

export type WishingWellTokens = {
  myTokensInWell: string;
  totalTokensInWell: string;
  canCollect: boolean;
  lpTokens: string;
  lockedTime?: string;
  lockedPeriod: number;
};

/**
 * Load Blockchain data for the wishing well
 */
export async function loadWishingWell(
  account: `0x${string}`,
): Promise<WishingWellTokens> {
  const tokensInWellPromise = getWellBalance(account);
  const canCollectPromise = canCollectFromWell(account);
  const lastCollectedPromise = lastCollectedFromWell(account);
  const lockedPeriodPromise = getLockedPeriod(account);
  const lpTokensPromise = getPairBalance(account);
  const totalTokensInWellPromise = sflBalanceOf(
    wishingWellAddress as `0x${string}`,
  );

  const [
    myTokensInWell,
    canCollect,
    lpTokens,
    lastCollected,
    totalTokensInWell,
    lockedPeriod,
  ] = await Promise.all([
    tokensInWellPromise,
    canCollectPromise,
    lpTokensPromise,
    lastCollectedPromise,
    totalTokensInWellPromise,
    lockedPeriodPromise,
  ]);

  let lockedTime;
  const secondsSinceLock = new Date().getTime() / 1000 - lastCollected;

  if (secondsSinceLock <= lockedPeriod) {
    const remaining = lockedPeriod - secondsSinceLock;
    lockedTime = secondsToString(remaining, { length: "full" });
  }

  return {
    myTokensInWell: String(myTokensInWell),
    totalTokensInWell: String(totalTokensInWell),
    canCollect,
    lpTokens: String(lpTokens),
    lockedTime,
    lockedPeriod,
  };
}
