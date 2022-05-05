import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { secondsToLongString } from "lib/utils/time";

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
export async function loadWishingWell(): Promise<WishingWellTokens> {
  const tokensInWellPromise = metamask.getWishingWell().getBalance();
  const canCollectPromise = metamask.getWishingWell().canCollect();
  const lastCollectedPromise = metamask.getWishingWell().lastCollected();
  const lockedPeriodPromise = metamask.getWishingWell().getLockedPeriod();
  const lpTokensPromise = metamask.getPair().getBalance();
  const totalTokensInWellPromise = metamask
    .getToken()
    .balanceOf(wishingWellAddress as string);

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
    lockedTime = secondsToLongString(remaining);
  }

  return {
    myTokensInWell,
    totalTokensInWell,
    canCollect,
    lpTokens,
    lockedTime,
    lockedPeriod,
  };
}
