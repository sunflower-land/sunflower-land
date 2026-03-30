import { CONFIG } from "lib/config";
import { CHAPTERS } from "./chapters";

export type PetNFTRevealConfig = {
  revealAt: Date;
  startId: number;
  endId: number;
  tradeAt?: Date;
  withdrawAt?: Date;
};

export const MAINNET_PET_NFT_REVEAL_CONFIG: PetNFTRevealConfig[] = [
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 1,
    endId: 1000,
    tradeAt: new Date("2025-11-10T00:00:00.000Z"),
    withdrawAt: new Date("2025-11-12T00:00:00.000Z"),
  },
  {
    revealAt: new Date("2026-01-13T00:00:00.000Z"),
    startId: 1001,
    endId: 1250,
    tradeAt: CHAPTERS["Paw Prints"].endDate,
    withdrawAt: new Date("2026-03-04T00:00:00Z"),
  },
  {
    revealAt: new Date("2026-04-12T00:00:00.000Z"),
    startId: 1251,
    endId: 1500,
    tradeAt: CHAPTERS["Crabs and Traps"].endDate,
    withdrawAt: new Date("2026-06-04T00:00:00Z"),
  },

  // Reserved Eggs - Crabs and Traps
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 2501,
    endId: 2510,
    tradeAt: CHAPTERS["Crabs and Traps"].endDate,
    withdrawAt: new Date("2026-06-04T00:00:00Z"),
  },

  // Reserved Eggs - Not assigned - To update when assigned
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 2511,
    endId: 2874,
    // Placeholder until wave is assigned; blocks withdraw/trade like a locked wave
    withdrawAt: new Date("2099-12-31T23:59:59.000Z"),
  },

  // Reserved Eggs - Giveaway
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 2875,
    endId: 3000,
    tradeAt: new Date("2025-11-10T00:00:00.000Z"),
    withdrawAt: new Date("2025-11-12T00:00:00.000Z"),
  },
];

export const TESTNET_PET_NFT_REVEAL_CONFIG: PetNFTRevealConfig[] = [
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 1,
    endId: 1000,
    tradeAt: new Date("2025-11-10T00:00:00.000Z"),
    withdrawAt: new Date("2025-11-12T00:00:00.000Z"),
  },
  {
    revealAt: new Date("2026-01-13T00:00:00.000Z"),
    startId: 1001,
    endId: 1250,
    tradeAt: CHAPTERS["Paw Prints"].endDate,
    withdrawAt: new Date("2026-03-04T00:00:00Z"),
  },
  {
    revealAt: new Date("2026-04-12T00:00:00.000Z"),
    startId: 1251,
    endId: 1500,
    tradeAt: CHAPTERS["Crabs and Traps"].endDate,
    withdrawAt: new Date("2026-06-04T00:00:00Z"),
  },

  // Reserved Eggs - Crabs and Traps
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 2501,
    endId: 2510,
    tradeAt: CHAPTERS["Crabs and Traps"].endDate,
    withdrawAt: new Date("2026-06-04T00:00:00Z"),
  },

  // Reserved Eggs - Not assigned - To update when assigned
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 2511,
    endId: 2874,
    // Placeholder until wave is assigned; blocks withdraw/trade like a locked wave
    withdrawAt: new Date("2099-12-31T23:59:59.000Z"),
  },

  // Reserved Eggs - Giveaway
  {
    revealAt: new Date("2025-11-12T00:00:00.000Z"),
    startId: 2875,
    endId: 3000,
    tradeAt: new Date("2025-11-10T00:00:00.000Z"),
    withdrawAt: new Date("2025-11-12T00:00:00.000Z"),
  },
];

export const getPetNFTRevealConfig = () => {
  if (CONFIG.NETWORK === "mainnet") return MAINNET_PET_NFT_REVEAL_CONFIG;

  return TESTNET_PET_NFT_REVEAL_CONFIG;
};
