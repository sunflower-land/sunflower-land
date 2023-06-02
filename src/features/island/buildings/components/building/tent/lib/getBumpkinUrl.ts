import { CONFIG } from "lib/config";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";

const URL =
  CONFIG.NETWORK === "mainnet"
    ? "https://images.bumpkins.io/nfts"
    : "https://testnet-images.bumpkins.io/nfts";

export const getBumpkinUrl = (equipped: BumpkinParts) => {
  const tokenUri = tokenUriBuilder(equipped);
  const size = 100;

  return `${URL}/${tokenUri}x${size}.png`;
};
