import { CONFIG } from "lib/config";
import { FISH, FishName, FishType } from "features/game/types/fishing";
import { getKeys } from "features/game/types/craftables";
import { AssetType } from "features/game/types/codex";

export type ItemCounts = {
  available: number;
  owned: number;
};

const CONTRACTS: Record<AssetType, string> = {
  collectible: CONFIG.INVENTORY_CONTRACT,
  wearable: CONFIG.BUMPKIN_ITEMS_CONTRACT,
  bud: CONFIG.BUD_CONTRACT,
};

export const getOpenSeaLink = (id: number, type: AssetType) => {
  const network = CONFIG.NETWORK === "mainnet" ? "matic" : "mumbai";
  const base =
    network === "mumbai" ? `https://testnets.opensea.io` : `https://opensea.io`;

  return `${base}/assets/${network}/${CONTRACTS[type]}/${id}`;
};

export const getFishByType = () => {
  const fishByType: Record<FishType, FishName[]> = {
    basic: [],
    advanced: [],
    expert: [],
  };

  getKeys(FISH).forEach((fishName) => {
    const fish = FISH[fishName];
    fishByType[fish.type].push(fishName);
  });

  return fishByType;
};
