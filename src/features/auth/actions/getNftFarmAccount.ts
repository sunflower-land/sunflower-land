import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";

export type NftFarmAccount = {
  farmId: number;
  username?: string;
};

/**
 * Looks up the farm id and username behind a farm NFT so the claim screen can
 * show the account a player recognises instead of the NFT token id.
 * Resolves to undefined when the lookup fails; callers fall back to the NFT id.
 */
export async function getNftFarmAccount(
  nftId: number,
): Promise<NftFarmAccount | undefined> {
  try {
    const response = await fetchWithRetry(
      `${CONFIG.API_URL}/nfts/farm/${nftId}/account`,
      { method: "GET" },
    );

    if (response.status !== 200) return undefined;

    const { farmId, username } = await response.json();

    if (typeof farmId !== "number") return undefined;

    return { farmId, username: username ?? undefined };
  } catch {
    return undefined;
  }
}
