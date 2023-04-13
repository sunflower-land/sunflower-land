import { KNOWN_IDS } from "features/game/types";
import { getInventoryBalance } from "lib/blockchain/Inventory";
import {
  getFarmSlots,
  getLimits,
  getRemainingListings,
} from "lib/blockchain/Trader";
import { wallet } from "lib/blockchain/wallet";

export async function loadTradingPost(farmId: number, farmAddress: string) {
  const [remainingListings, farmSlots, freeListings, itemLimits] =
    await Promise.all([
      getRemainingListings(wallet.web3Provider, farmId),
      getFarmSlots(wallet.web3Provider, farmId),
      getInventoryBalance(
        wallet.web3Provider,
        farmAddress,
        KNOWN_IDS["Trading Ticket"]
      ),
      getLimits(wallet.web3Provider),
    ]);

  return { farmSlots, remainingListings, freeListings, itemLimits };
}
