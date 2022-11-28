import { wallet } from "lib/blockchain/wallet";
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
export async function loadWishingWell(): Promise<WishingWellTokens> {
  const tokensInWellPromise = wallet.getWishingWell().getBalance();
  const canCollectPromise = wallet.getWishingWell().canCollect();
  const lastCollectedPromise = wallet.getWishingWell().lastCollected();
  const lockedPeriodPromise = wallet.getWishingWell().getLockedPeriod();
  const lpTokensPromise = wallet.getPair().getBalance();
  const totalTokensInWellPromise = wallet
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
    lockedTime = secondsToString(remaining, { length: "full" });
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
