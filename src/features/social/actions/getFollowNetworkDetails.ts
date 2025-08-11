import { Equipped } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { ActiveProjects } from "../types/types";

type Request = {
  token: string;
  farmId: number;
  networkFarmId: number;
  nextCursor: number | null;
  networkType: "followers" | "following";
};

export type Detail = {
  id: number;
  clothing: Equipped;
  username: string;
  lastUpdatedAt: number;
  socialPoints: number;
  cleanedToday: boolean;
  projects: ActiveProjects;
};

export type FollowNetworkDetails = {
  data: {
    id: number;
    network: Detail[];
    nextCursor: number | null;
  };
};

export const getFollowNetworkDetails = async ({
  token,
  farmId,
  networkFarmId,
  nextCursor,
  networkType,
}: Request): Promise<FollowNetworkDetails> => {
  const url = `${CONFIG.API_URL}/data?type=followNetworkDetails&networkFarmId=${networkFarmId}&networkType=${networkType}&farmId=${farmId}&nextCursor=${nextCursor}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response;
};
