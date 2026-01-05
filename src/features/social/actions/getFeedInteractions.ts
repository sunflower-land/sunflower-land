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

type CacheEntry = {
  feed: Interaction[];
  following: number[];
};

const PAGE_SIZE = 50;

// In-memory only (page refresh clears it).
const FEED_INTERACTIONS_CACHE = new Map<string, CacheEntry>();

export const getFeedInteractionsCacheKey = ({
  farmId,
  isGlobal,
  filter,
}: Pick<Request, "farmId" | "isGlobal" | "filter">) =>
  `${farmId}-${isGlobal}-${filter ?? "all"}`;

export const getCachedFeedInteractions = (
  params: Pick<Request, "farmId" | "isGlobal" | "filter">,
) => FEED_INTERACTIONS_CACHE.get(getFeedInteractionsCacheKey(params));

export const setCachedFeedInteractions = (
  params: Pick<Request, "farmId" | "isGlobal" | "filter">,
  value: CacheEntry,
) => {
  FEED_INTERACTIONS_CACHE.set(getFeedInteractionsCacheKey(params), value);
};

const interactionKey = (interaction: Interaction) =>
  interaction.id ??
  `${interaction.type}:${interaction.sender?.id ?? ""}:${interaction.recipient?.id ?? ""}:${interaction.createdAt}:${interaction.message}`;

const mergeFeed = (newer: Interaction[], existing: Interaction[]) => {
  const byKey = new Map<string, Interaction>();

  for (const interaction of [...newer, ...existing]) {
    if (!interaction) continue;
    byKey.set(interactionKey(interaction), interaction);
  }

  return Array.from(byKey.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, PAGE_SIZE);
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
  if (typeof cursor === "number") {
    url.searchParams.set("cursor", cursor.toString());
  }

  if (filter && filter !== "all") {
    url.searchParams.set("filter", filter);
  }

  // Only apply caching + "since" when fetching the first page
  const cached =
    cursor === 0
      ? getCachedFeedInteractions({ farmId, isGlobal, filter })
      : undefined;
  const since =
    cursor === 0 && cached?.feed?.[0]?.createdAt
      ? cached.feed[0].createdAt
      : undefined;

  if (typeof since === "number") {
    url.searchParams.set("since", since.toString());
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  const result = {
    feed: response.data.feed,
    following: response.data.following,
  };

  // Merge incremental updates into local memory cache (first page only)
  if (cursor === 0) {
    const entry: CacheEntry = cached
      ? {
          feed: mergeFeed(result.feed ?? [], cached.feed ?? []),
          following: result.following ?? cached.following ?? [],
        }
      : {
          feed: (result.feed ?? []).slice(0, PAGE_SIZE),
          following: result.following ?? [],
        };

    setCachedFeedInteractions({ farmId, isGlobal, filter }, entry);
    return entry;
  }

  return result;
};
