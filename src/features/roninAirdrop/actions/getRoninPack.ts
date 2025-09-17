import { CONFIG } from "lib/config";
import { RoninPackName } from "../RoninAirdrop";

export type RoninPackData = {
  reward: RoninPackName;
};

export const getRoninPack = async ({
  address,
  twitterUrl,
}: {
  address: string;
  twitterUrl: string;
}): Promise<RoninPackData & { lastUpdated: number }> => {
  const res = await fetch(
    `${CONFIG.API_URL}/ronin-airdrop?address=${address}&twitter=${twitterUrl}`,
  );

  const response = await res.json();

  return response;
};
