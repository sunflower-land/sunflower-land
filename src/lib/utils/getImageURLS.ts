import { CONFIG } from "lib/config";

export function getImageUrl(wearableId: number) {
  if (CONFIG.NETWORK === "mainnet") {
    return `https://bumpkins.io/erc1155/images/${wearableId}.png`;
  }

  return `https://testnet.bumpkins.io/erc1155/images/${wearableId}.png`;
}
