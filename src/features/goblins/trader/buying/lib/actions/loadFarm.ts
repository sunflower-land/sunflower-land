import { metamask } from "lib/blockchain/metamask";

export const loadFarmSlots = async (farmId: number) => {
  const farmSlots = await metamask.getTrader().getFarmSlots(farmId);

  return { farmSlots };
};
