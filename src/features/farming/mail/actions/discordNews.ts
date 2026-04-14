import { CONFIG } from "lib/config";

export type DiscordChannelName = "news" | "announcements" | "updates";
export type DiscordAnnouncementImage = {
  url: string;
  filename?: string;
  contentType?: string;
  width?: number | null;
  height?: number | null;
};

export type DiscordAnnouncement = {
  id: string;
  channelId: string;
  channelName: DiscordChannelName;
  url: string;
  content: string;
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  createdAt: string; // ISO timestamp
  images: DiscordAnnouncementImage[];
  likes?: number;
};

export type DiscordNewsDataResponse = DiscordAnnouncement[];

const DISCORD_NEWS_API_URL = `${CONFIG.API_URL}/data`;

const getStubDiscordNews = (): DiscordNewsDataResponse => {
  const now = Date.now();
  const makeDate = (offsetMs: number) => new Date(now - offsetMs).toISOString();

  return [
    {
      id: "stub-1",
      channelId: "news",
      channelName: "news",
      url: "https://discord.com/channels/sunflower-land/news",
      content:
        "Welcome to the Chapter! Check out the latest rewards, auctions, and raffles.",
      sender: {
        id: "stub-bot",
        username: "SunflowerLand",
        displayName: "Sunflower Land",
      },
      createdAt: makeDate(2 * 60 * 60 * 1000),
      images: [],
      likes: 20,
    },
    {
      id: "stub-2",
      channelId: "announcements",
      channelName: "announcements",
      url: "https://discord.com/channels/sunflower-land/announcements",
      content:
        "Daily rewards reset every day. Log in to keep your streak going!",
      sender: {
        id: "stub-bot",
        username: "SunflowerLand",
        displayName: "Sunflower Land",
      },
      createdAt: makeDate(8 * 60 * 60 * 1000),
      images: [],
      likes: 929,
    },
    {
      id: "stub-3",
      channelId: "updates",
      channelName: "updates",
      url: "https://discord.com/channels/sunflower-land/updates",
      content:
        "More chapter content is coming soon. Keep an eye on the marketplace.",
      sender: {
        id: "stub-bot",
        username: "SunflowerLand",
        displayName: "Sunflower Land",
      },
      createdAt: makeDate(20 * 60 * 60 * 1000),
      images: [],
      likes: 120,
    },
  ];
};

const DISCORD_NEWS_READ_AT_KEY = "discordNewsReadAt";
const DISCORD_NEWS_LATEST_AT_KEY = "discordNewsLatestAt";
const DISCORD_NEWS_FETCHED_AT_KEY = "discordNewsFetchedAt";
const DISCORD_NEWS_CACHE_KEY = "discordNewsCache";
export const DISCORD_NEWS_STORAGE_EVENT = "discordNewsStorage";

const TEN_MINUTES = 10 * 60 * 1000;

function safeGetNumber(key: string): number | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const asNumber = Number(raw);
  if (!Number.isFinite(asNumber)) return null;

  return asNumber;
}

function emitDiscordNewsStorage() {
  // storage event does not fire in the same tab that wrote the values.
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(DISCORD_NEWS_STORAGE_EVENT));
}

export function getDiscordNewsReadAt(): number | null {
  return safeGetNumber(DISCORD_NEWS_READ_AT_KEY);
}

export function storeDiscordNewsReadAt(timestamp: number) {
  localStorage.setItem(DISCORD_NEWS_READ_AT_KEY, `${timestamp}`);
  emitDiscordNewsStorage();
}

export function getDiscordNewsLatestAt(): number | null {
  return safeGetNumber(DISCORD_NEWS_LATEST_AT_KEY);
}

function storeDiscordNewsLatestAt(timestamp: number) {
  localStorage.setItem(DISCORD_NEWS_LATEST_AT_KEY, `${timestamp}`);
  emitDiscordNewsStorage();
}

function getDiscordNewsFetchedAt(): number | null {
  return safeGetNumber(DISCORD_NEWS_FETCHED_AT_KEY);
}

function storeDiscordNewsFetchedAt(timestamp: number) {
  localStorage.setItem(DISCORD_NEWS_FETCHED_AT_KEY, `${timestamp}`);
  emitDiscordNewsStorage();
}

function getDiscordNewsCache(): DiscordNewsDataResponse | null {
  try {
    const raw = localStorage.getItem(DISCORD_NEWS_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;

    return parsed as DiscordNewsDataResponse;
  } catch {
    return null;
  }
}

function storeDiscordNewsCache(announcements: DiscordNewsDataResponse) {
  try {
    localStorage.setItem(DISCORD_NEWS_CACHE_KEY, JSON.stringify(announcements));
  } catch {
    // ignore
  }
  emitDiscordNewsStorage();
}

export function getLatestDiscordAnnouncementAt(
  announcements: DiscordNewsDataResponse,
): number | null {
  const latest = announcements
    .map((a) => new Date(a.createdAt).getTime())
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a)[0];

  return typeof latest === "number" ? latest : null;
}

export function hasUnreadDiscordNews(latestAt: number | null): boolean {
  if (!latestAt) return false;

  const readAt = getDiscordNewsReadAt();
  if (!readAt) return true;

  return latestAt > readAt;
}

export async function getDiscordNewsDataCached({
  token,
  maxAgeMs = TEN_MINUTES,
}: {
  token: string;
  maxAgeMs?: number;
}): Promise<DiscordNewsDataResponse> {
  const now = Date.now();
  const fetchedAt = getDiscordNewsFetchedAt();
  const cached = getDiscordNewsCache();

  if (fetchedAt && now - fetchedAt < maxAgeMs && cached) {
    return cached;
  }

  const announcements = await getDiscordNewsData({ token });
  const latestAt = getLatestDiscordAnnouncementAt(announcements);

  if (latestAt) {
    storeDiscordNewsLatestAt(latestAt);
  }

  storeDiscordNewsFetchedAt(now);
  storeDiscordNewsCache(announcements);

  return announcements;
}

export async function preloadDiscordNews({
  token,
  maxAgeMs = TEN_MINUTES,
}: {
  token: string;
  maxAgeMs?: number;
}): Promise<number | null> {
  const now = Date.now();

  try {
    const fetchedAt = getDiscordNewsFetchedAt();
    const cachedLatestAt = getDiscordNewsLatestAt();
    const cached = getDiscordNewsCache();

    if (fetchedAt && now - fetchedAt < maxAgeMs && cachedLatestAt) {
      return cachedLatestAt;
    }

    const announcements =
      fetchedAt && now - fetchedAt < maxAgeMs && cached
        ? cached
        : await getDiscordNewsData({ token });
    const latestAt = getLatestDiscordAnnouncementAt(announcements);

    if (latestAt) {
      storeDiscordNewsLatestAt(latestAt);
    }

    storeDiscordNewsFetchedAt(now);
    storeDiscordNewsCache(announcements);

    return latestAt;
  } catch {
    // Fallback to cached value on failure
    return getDiscordNewsLatestAt();
  }
}

export const getDiscordNewsData = async ({
  token,
}: {
  token: string;
}): Promise<DiscordNewsDataResponse> => {
  if (!CONFIG.API_URL) {
    return getStubDiscordNews();
  }

  const url = new URL(DISCORD_NEWS_API_URL);
  url.searchParams.set("type", "discordAnnouncements");

  const res = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "Failed to fetch retention data");
  }

  const response = (await res.json()) as { data: DiscordNewsDataResponse };

  return response.data;
};
