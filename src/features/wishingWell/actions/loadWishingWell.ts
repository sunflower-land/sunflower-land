import { metamask } from "lib/blockchain/metamask";
import { secondsToLongString } from "lib/utils/time";

// 3 days
export const LOCKED_SECONDS = 3 * 24 * 60 * 60;

export type WishingWellTokens = {
  tokensInWell: number;
  canCollect: boolean;
  lpTokens: number;
  lockedTime?: string;
};

/**
 * Load Blockchain data for the wishing well
 */
export async function loadWishingWell(): Promise<WishingWellTokens> {
  const tokensInWellPromise = metamask.getWishingWell().getBalance();
  const canCollectPromise = metamask.getWishingWell().canCollect();
  const lastCollectedPromise = metamask.getWishingWell().lastCollected();

  const lpTokensPromise = metamask.getPair().getBalance();

  const [tokensInWell, canCollect, lpTokens, lastCollected] = await Promise.all(
    [
      tokensInWellPromise,
      canCollectPromise,
      lpTokensPromise,
      lastCollectedPromise,
    ]
  );

  let lockedTime;
  const timeSinceLock = new Date().getTime() / 1000 - lastCollected;

  if (timeSinceLock > LOCKED_SECONDS * 1000) {
    lockedTime = secondsToLongString(timeSinceLock);
  }

  return {
    tokensInWell,
    canCollect,
    lpTokens,
    lockedTime,
  };
}
