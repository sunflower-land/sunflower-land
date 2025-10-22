import { CONFIG } from "lib/config";
import { RoninPackName } from "../RoninAirdrop";

export type RoninPackData = {
  reward: RoninPackName;
  claimed: boolean;
};

export const getRoninPack = async ({
  address,
  twitterUrl,
}: {
  address?: string;
  twitterUrl?: string;
}): Promise<RoninPackData & { lastUpdated: number }> => {
  const url = new URL(`${CONFIG.API_URL}/ronin-rewards`);

  if (address) {
    url.searchParams.set("address", address);
  }
  if (twitterUrl) {
    url.searchParams.set("twitter", twitterUrl);
  }

  const res = await fetch(url);

  const response = await res.json();

  return response;
};
