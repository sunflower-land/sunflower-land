import { CONFIG } from "lib/config";
import { Detail } from "./getFollowNetworkDetails";

type Request = {
  token: string;
  farmId: number;
  searchTerm: string;
  context: "following" | "all" | "followers";
  signal?: AbortSignal;
};

export const searchPlayerByUsername = async ({
  token,
  farmId,
  searchTerm,
  context,
  signal,
}: Request): Promise<{ data: Detail[] }> => {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "playerSearch");
  url.searchParams.set("farmId", farmId.toString());
  url.searchParams.set("searchTerm", searchTerm);
  url.searchParams.set("context", context);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const response = await res.json();

  return response;
};
