import { CONFIG } from "lib/config";

export type FarmNFTAccount = {
  farmId: number;
  username?: string;
};

type Request = {
  token: string;
  nftIds: number[];
};

/**
 * Looks up the farm id and username behind each farm NFT so the claim screen
 * can label them. Lookups that fail are simply left out: the caller falls
 * back to showing the NFT id.
 */
export async function loadFarmNFTAccounts({
  token,
  nftIds,
}: Request): Promise<Record<number, FarmNFTAccount>> {
  const results = await Promise.allSettled(
    nftIds.map(async (nftId) => {
      const response = await fetch(
        `${CONFIG.API_URL}/nfts/farm/${nftId}/account`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error(`Farm NFT ${nftId} lookup failed: ${response.status}`);
      }

      const { farmId, username } = await response.json();

      return [nftId, { farmId, username }] as const;
    }),
  );

  return Object.fromEntries(
    results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    ),
  );
}
