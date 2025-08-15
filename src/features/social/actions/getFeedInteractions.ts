import { CONFIG } from "lib/config";
import { Interaction } from "../types/types";
import { FeedFilter } from "../Feed";

type Request = {
  token: string;
  farmId: number;
  isGlobal: boolean;
  cursor?: number;
  filter?: FeedFilter;
};

export const getFeedInteractions = async ({
  token,
  farmId,
  isGlobal,
  filter,
  cursor,
}: Request): Promise<{
  feed: Interaction[];
  following: number[];
}> => {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "feedInteractions");
  url.searchParams.set("farmId", farmId.toString());
  url.searchParams.set("isGlobal", isGlobal.toString());
  url.searchParams.set("cursor", cursor?.toString() ?? "");

  if (filter && filter !== "all") {
    url.searchParams.set("filter", filter);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return {
    feed: response.data.feed,
    following: response.data.following,
  };
};
