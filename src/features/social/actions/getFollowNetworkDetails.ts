import { Equipped } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";

type Request = {
  token: string;
  farmId: number;
  networkFarmId: number;
  nextCursor?: FollowNetworkMember;
  networkType: "followers" | "following";
};

export type FollowNetworkMember = {
  id: number;
  socialPoints: number;
  helpStreak: number;
};

export type Detail = FollowNetworkMember & {
  clothing: Equipped;
  username: string;
  lastUpdatedAt: number;
  helpedYouToday: boolean;
  helpedThemToday: boolean;
  hasCookingPot: boolean;
};

export type FollowNetworkDetails = {
  data: {
    id: number;
    network: Detail[];
    nextCursor?: FollowNetworkMember;
  };
};

export const getFollowNetworkDetails = async ({
  token,
  farmId,
  networkFarmId,
  nextCursor,
  networkType,
}: Request): Promise<FollowNetworkDetails> => {
  const url = new URL(`${CONFIG.API_URL}/data`);

  url.searchParams.set("type", "followNetworkDetails");
  url.searchParams.set("networkFarmId", networkFarmId.toString());
  url.searchParams.set("networkType", networkType);
  url.searchParams.set("farmId", farmId.toString());

  if (nextCursor !== undefined) {
    url.searchParams.set("nextCursor", JSON.stringify(nextCursor));
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response;
};
