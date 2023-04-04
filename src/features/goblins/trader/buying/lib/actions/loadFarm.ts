import { getFarmSlots } from "lib/blockchain/Trader";
import { wallet } from "lib/blockchain/wallet";

export const loadFarmSlots = async (farmId: number) => {
  const farmSlots = await getFarmSlots(wallet.web3Provider, farmId);

  return { farmSlots };
};
