import { CONFIG } from "lib/config";

export type FarmAccount = {
  farmId: number;
  username?: string;
};

/**
 * The farm id and username behind a farm NFT, so the claim screen can show
 * the farm players know rather than the NFT id. Resolves to undefined when
 * the lookup fails, so callers can fall back to the NFT id.
 */
export async function getFarmAccount(
  nftId: number,
): Promise<FarmAccount | undefined> {
  try {
    const response = await fetch(
      `${CONFIG.API_URL}/nfts/farm/${nftId}/account`,
    );

    if (!response.ok) return undefined;

    const { farmId, username } = await response.json();

    if (typeof farmId !== "number") return undefined;

    return { farmId, username };
  } catch {
    return undefined;
  }
}
