import { CONFIG } from "lib/config";
import { Interaction } from "../types/types";

type Request = {
  token: string;
  farmId: number;
  isGlobal: boolean;
  cursor?: number;
};

export const getFeedInteractions = async ({
  token,
  farmId,
  isGlobal,
  cursor,
}: Request): Promise<{
  feed: Interaction[];
  following: number[];
}> => {
  const res = await fetch(
    `${CONFIG.API_URL}/data?type=feedInteractions&farmId=${farmId}&isGlobal=${isGlobal}&cursor=${cursor}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return {
    feed: response.data.feed,
    following: response.data.following,
  };
};
