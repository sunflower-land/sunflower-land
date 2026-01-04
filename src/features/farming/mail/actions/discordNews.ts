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
};

export type DiscordNewsDataResponse = DiscordAnnouncement[];

const DISCORD_NEWS_API_URL = `${CONFIG.API_URL}/data`;

export const getDiscordNewsData = async ({
  token,
}: {
  token: string;
}): Promise<DiscordNewsDataResponse> => {
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
