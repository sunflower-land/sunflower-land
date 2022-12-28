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
      getRemainingListings(wallet.web3Provider, wallet.myAccount, farmId),
      getFarmSlots(wallet.web3Provider, wallet.myAccount, farmId),
      getInventoryBalance(
        wallet.web3Provider,
        wallet.myAccount,
        farmAddress,
        713
      ),
      getLimits(wallet.web3Provider, wallet.myAccount),
    ]);

  return { farmSlots, remainingListings, freeListings, itemLimits };
}
