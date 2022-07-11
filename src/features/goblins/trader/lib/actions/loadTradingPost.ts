import { metamask } from "lib/blockchain/metamask";

export async function loadTradingPost(farmId: number, farmAddress: string) {
  const [remainingListings, farmSlots, freeListings, itemLimits] =
    await Promise.all([
      metamask.getTrader().getRemainingListings(farmId),
      metamask.getTrader().getFarmSlots(farmId),
      metamask.getInventory().getBalance(farmAddress, 713),
      metamask.getTrader().getLimits(),
    ]);

  return { farmSlots, remainingListings, freeListings, itemLimits };
}
