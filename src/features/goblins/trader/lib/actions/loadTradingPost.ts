import { metamask } from "lib/blockchain/metamask";

export async function loadTradingPost(farmId: number) {
  return await metamask.getTrader().getFarmSlots(farmId);
}
