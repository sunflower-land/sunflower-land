import { wallet } from "lib/blockchain/wallet";

export const loadFarmSlots = async (farmId: number) => {
  const farmSlots = await wallet.getTrader().getFarmSlots(farmId);

  return { farmSlots };
};
