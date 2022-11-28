import { wallet } from "lib/blockchain/wallet";

export async function loadTradingPost(farmId: number, farmAddress: string) {
  const [remainingListings, farmSlots, freeListings, itemLimits] =
    await Promise.all([
      wallet.getTrader().getRemainingListings(farmId),
      wallet.getTrader().getFarmSlots(farmId),
      wallet.getInventory().getBalance(farmAddress, 713),
      wallet.getTrader().getLimits(),
    ]);

  return { farmSlots, remainingListings, freeListings, itemLimits };
}
