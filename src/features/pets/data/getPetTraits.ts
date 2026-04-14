import { CONFIG } from "lib/config";
import { PETS_NFT_DATA } from "./pets-nfts";
import { TESTNET_PETS_NFT_DATA } from "./testnet-pets-nft";

export function getPetTraits(petId: number) {
  if (petId < 1 || petId > 3000) return undefined;

  const PETS_DATA =
    CONFIG.NETWORK === "amoy" ? TESTNET_PETS_NFT_DATA : PETS_NFT_DATA;
  return PETS_DATA[petId];
}
