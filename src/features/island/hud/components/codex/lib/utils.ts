import { CONFIG } from "lib/config";
import {
  FISH,
  FishName,
  FishType,
  MarineMarvelName,
} from "features/game/types/fishing";
import { getKeys } from "features/game/types/craftables";
import { AssetType } from "features/game/types/codex";
import {
  FLOWERS,
  FlowerName,
  FlowerSeedName,
} from "features/game/types/flowers";
import { getObjectEntries } from "features/game/expansion/lib/utils";

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
  const network = CONFIG.NETWORK === "mainnet" ? "matic" : "amoy";
  const base =
    network === "amoy" ? `https://testnets.opensea.io` : `https://opensea.io`;

  return `${base}/assets/${network}/${CONTRACTS[type]}/${id}`;
};

export const getFishByType = () => {
  const fishByType: Record<FishType, (FishName | MarineMarvelName)[]> = {
    basic: [],
    advanced: [],
    expert: [],
    "marine marvel": [],
    chapter: [],
  };

  getKeys(FISH).forEach((fishName) => {
    const fish = FISH[fishName];
    fishByType[fish.type].push(fishName);
  });

  return fishByType;
};

export const getFlowerBySeed = () => {
  const flowersBySeed: Record<FlowerSeedName, FlowerName[]> = {
    "Sunpetal Seed": [],
    "Bloom Seed": [],
    "Lily Seed": [],
    "Edelweiss Seed": [],
    "Gladiolus Seed": [],
    "Lavender Seed": [],
    "Clover Seed": [],
  };

  getKeys(FLOWERS).forEach((flowerName) => {
    const flower = FLOWERS[flowerName];
    flowersBySeed[flower.seed].push(flowerName);
  });

  return flowersBySeed;
};

export const getEncyclopediaFish = () => {
  const encyclopediaFish: (FishName | MarineMarvelName)[] = [];
  getObjectEntries(FISH).forEach(([fishName, fish]) => {
    if (fish.type !== "marine marvel" && fish.type !== "chapter") {
      encyclopediaFish.push(fishName);
    }
  });
  return encyclopediaFish;
};
