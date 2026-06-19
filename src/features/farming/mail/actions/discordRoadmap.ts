import { CONFIG } from "lib/config";

export type DiscordRoadmapItem = {
  id: string;
  name: string;
  date: string;
  timestamp: string;
  description: string;
  image: string;
  createdAt: string;
};

export type DiscordRoadmapDataResponse = DiscordRoadmapItem[];

const DISCORD_ROADMAP_API_URL = `${CONFIG.API_URL}/data`;

const getStubDiscordRoadmap = (): DiscordRoadmapDataResponse => {
  return [
    {
      id: "stub-1",
      name: "Chapter 15: Ascensions",
      date: "August 2026",
      timestamp: "2026-08-01T00:00:00.000Z",
      description:
        "Reach new heights as Bumpkins learn to ascend. A brand new progression system, fresh wearables and a sky-high adventure await.",
      image: "",
      createdAt: "2026-06-01T00:00:00.000Z",
    },
    {
      id: "stub-2",
      name: "Marketplace Upgrades",
      date: "July 2026",
      timestamp: "2026-07-01T00:00:00.000Z",
      description:
        "Trading is getting a glow up with better filtering, faster listings and smoother bidding.",
      image: "",
      createdAt: "2026-05-15T00:00:00.000Z",
    },
  ];
};

const DISCORD_ROADMAP_FETCHED_AT_KEY = "discordRoadmapFetchedAt";
const DISCORD_ROADMAP_CACHE_KEY = "discordRoadmapCache";

const TEN_MINUTES = 10 * 60 * 1000;

function safeGetNumber(key: string): number | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const asNumber = Number(raw);
  if (!Number.isFinite(asNumber)) return null;

  return asNumber;
}

function getDiscordRoadmapFetchedAt(): number | null {
  return safeGetNumber(DISCORD_ROADMAP_FETCHED_AT_KEY);
}

function storeDiscordRoadmapFetchedAt(timestamp: number) {
  localStorage.setItem(DISCORD_ROADMAP_FETCHED_AT_KEY, `${timestamp}`);
}

function getDiscordRoadmapCache(): DiscordRoadmapDataResponse | null {
  try {
    const raw = localStorage.getItem(DISCORD_ROADMAP_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;

    return parsed as DiscordRoadmapDataResponse;
  } catch {
    return null;
  }
}

function storeDiscordRoadmapCache(items: DiscordRoadmapDataResponse) {
  try {
    localStorage.setItem(DISCORD_ROADMAP_CACHE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export async function getDiscordRoadmapDataCached({
  token,
  maxAgeMs = TEN_MINUTES,
}: {
  token: string;
  maxAgeMs?: number;
}): Promise<DiscordRoadmapDataResponse> {
  const now = Date.now();
  const fetchedAt = getDiscordRoadmapFetchedAt();
  const cached = getDiscordRoadmapCache();

  if (fetchedAt && now - fetchedAt < maxAgeMs && cached) {
    return cached;
  }

  const items = await getDiscordRoadmapData({ token });

  storeDiscordRoadmapFetchedAt(now);
  storeDiscordRoadmapCache(items);

  return items;
}

export const getDiscordRoadmapData = async ({
  token,
}: {
  token: string;
}): Promise<DiscordRoadmapDataResponse> => {
  if (!CONFIG.API_URL) {
    return getStubDiscordRoadmap();
  }

  const url = new URL(DISCORD_ROADMAP_API_URL);
  url.searchParams.set("type", "discordRoadmap");

  const res = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "Failed to fetch roadmap data");
  }

  // The endpoint wraps the payload in a `data` envelope: { data: { items: [...] } }.
  // Fall back to a bare `{ items: [...] }` shape just in case.
  const response = (await res.json()) as {
    data?: { items?: DiscordRoadmapDataResponse };
    items?: DiscordRoadmapDataResponse;
  };

  return response.data?.items ?? response.items ?? [];
};
