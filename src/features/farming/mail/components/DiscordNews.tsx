import React, { useEffect, useState } from "react";

import {
  type DiscordChannelName,
  getDiscordNewsDataCached,
  storeDiscordNewsReadAt,
} from "../actions/discordNews";
import { useAuth } from "features/auth/lib/Provider";
import useSWR from "swr";
import { Loading } from "features/auth/components";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import speakerIcon from "assets/icons/speaker.webp";
import likeIcon from "assets/icons/like.webp";
import newsIcon from "assets/icons/chapter_icon_2.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ITEM_DETAILS } from "features/game/types/images";
import { NewsContent } from "./NewsContent";

const DISCORD_CHANNEL_ICONS: Record<DiscordChannelName, string> = {
  news: newsIcon,
  announcements: speakerIcon,
  updates: ITEM_DETAILS.Cheer.image,
};

const TEAM_NPCS: Record<string, BumpkinParts> = {
  Adam: NPC_WEARABLES.adam,
  Elias: {
    onesie: "Black Sheep Onesie",
    wings: "Crow Wings",
    body: "Beige Farmer Potion",
    shirt: "Red Farmer Shirt",
    pants: "Farmer Pants",
    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    hat: "Farmer Hat",
    background: "Farm Background",
    hair: "Basic Hair",
  },
  Aeon: NPC_WEARABLES.dreadhorn,
  Dcol: NPC_WEARABLES.grubnuk,
  Spencer: NPC_WEARABLES["farmer flesh"],
  Craig: NPC_WEARABLES.craig,
  Jammy: NPC_WEARABLES.goldtooth,
};

function ordinal(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function formatPostedDate(createdAtMs: number) {
  const date = new Date(createdAtMs);
  const day = date.getDate();
  const month = date.toLocaleString(undefined, { month: "long" });
  const year = date.getFullYear();

  return `${ordinal(day)} ${month} ${year}`;
}

function getDiscordPostedLabel(
  createdAtMs: number,
  nowMs: number,
  t: ReturnType<typeof useAppTranslation>["t"],
) {
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  if (nowMs - createdAtMs > SEVEN_DAYS_MS) {
    return t("discordNews.postedOn", { date: formatPostedDate(createdAtMs) });
  }

  return t("discordNews.postedAgo", {
    time: getRelativeTime(createdAtMs, nowMs),
  });
}

export const DiscordNews: React.FC = () => {
  const { authState } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { t } = useAppTranslation();
  const now = useNow({ live: true });

  const { data, isLoading, error } = useSWR(
    ["/data?type=discordAnnouncements", authState.context.user.rawToken],
    () =>
      getDiscordNewsDataCached({
        token: authState.context.user.rawToken as string,
      }),
    {
      dedupingInterval: 10 * 60 * 1000,
    },
  );

  const announcements = data ?? [];
  const selectedAnnouncement = selectedId
    ? (announcements.find((announcement) => announcement.id === selectedId) ??
      null)
    : null;

  // Mark the latest announcement as "read" once they've opened the Discord news panel.
  useEffect(() => {
    if (!data) return;
    storeDiscordNewsReadAt(now);
  }, [data]);

  if (isLoading) return <Loading />;

  if (error || !data) return <p>{`Error`}</p>;

  if (selectedId) {
    if (!selectedAnnouncement) return <p>{t("error")}</p>;

    const createdAt = new Date(selectedAnnouncement.createdAt).getTime();
    const sender =
      selectedAnnouncement.sender.displayName ??
      selectedAnnouncement.sender.username;

    const postedLabel = getDiscordPostedLabel(createdAt, now, t);

    return (
      <div className="max-h-[450px] overflow-y-auto scrollable">
        <div
          className="flex items-center cursor-pointer mb-2"
          onClick={() => setSelectedId(null)}
        >
          <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
          <p className="text-xs underline">{t("back")}</p>
        </div>

        <div className="flex items-center justify-between mb-3 w-full">
          <div className="flex items-center gap-2">
            <NPCIcon
              width={PIXEL_SCALE * 12}
              parts={TEAM_NPCS[sender] ?? NPC_WEARABLES["pumpkin' pete"]}
            />
            <div className="flex flex-col">
              <p className="text-xs">{sender}</p>
              <a
                href={selectedAnnouncement.url}
                target="_blank"
                rel="noreferrer"
                className="text-xxs underline"
              >
                {postedLabel}
              </a>
              <span className="flex items-center gap-0.5 mt-0.5">
                <span className="text-xxs">
                  {selectedAnnouncement.likes ?? 0}
                </span>
                <img src={likeIcon} className="h-3.5  object-contain" alt="" />
              </span>
            </div>
          </div>
        </div>

        <NewsContent
          content={selectedAnnouncement.content}
          variant="body"
          nowMs={now}
          className="mb-2 px-1"
        />
        {selectedAnnouncement.images.map((image) => (
          <img
            key={image.url}
            src={image.url}
            className="mb-2 max-h-96 object-contain"
          />
        ))}
      </div>
    );
  }

  // TODO - put actual quests/announcements/actual news on top here (From Bumpkins)

  return (
    <div className="max-h-[450px] overflow-y-auto scrollable pr-0.5">
      {announcements.map((announcement) => {
        const createdAt = new Date(announcement.createdAt).getTime();
        const relativeTime =
          now - createdAt > 7 * 24 * 60 * 60 * 1000
            ? formatPostedDate(createdAt)
            : getRelativeTime(createdAt, now);

        const previewText = announcement.content
          .replace(/\r?\n/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim();

        return (
          <ButtonPanel
            key={announcement.id}
            onClick={() => setSelectedId(announcement.id)}
          >
            <div className="flex items-start">
              <img
                src={DISCORD_CHANNEL_ICONS[announcement.channelName]}
                className="w-6 object-contain mr-2"
              />
              <div className="flex-1 overflow-hidden pb-1">
                <p className="text-xs capitalize mb-1.5 flex items-center justify-between gap-2">
                  <span className="underline">{announcement.channelName}</span>
                </p>
                <NewsContent
                  content={previewText}
                  variant="preview"
                  nowMs={now}
                />

                <div className="flex  justify-between ">
                  <span className="text-xxs">{relativeTime}</span>
                  <span className="flex items-center gap-0.5">
                    <span className="text-xxs">{announcement.likes ?? 0}</span>
                    <img
                      src={likeIcon}
                      className="h-3.5  object-contain"
                      alt=""
                    />
                  </span>
                </div>
              </div>
            </div>
          </ButtonPanel>
        );
      })}
    </div>
  );
};
