import React, { useState } from "react";

import { DiscordChannelName, getDiscordNewsData } from "../actions/discordNews";
import { useAuth } from "features/auth/lib/Provider";
import useSWR from "swr";
import { Loading } from "features/auth/components";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { ButtonPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import speakerIcon from "assets/icons/speaker.webp";
import newsIcon from "assets/icons/chapter_icon_2.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";
import { NPCFixed, NPCParts } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { ITEM_DETAILS } from "features/game/types/images";

const DISCORD_CHANNEL_ICONS: Record<DiscordChannelName, string> = {
  news: newsIcon,
  announcements: speakerIcon,
  updates: ITEM_DETAILS.Cheer.image,
};

const TEAM_NPCS: Record<string, BumpkinParts> = {
  Adam: NPC_WEARABLES.adam,
  Elias: NPC_WEARABLES["pumpkin' pete"],
  Aeon: NPC_WEARABLES.dreadhorn,
  Dcol: NPC_WEARABLES.grubnuk,
  Spencer: NPC_WEARABLES["farmer flesh"],
  Craig: NPC_WEARABLES.craig,
  Jammy: NPC_WEARABLES.goldtooth,
};

const PUMPKIN_PETE_PARTS = NPC_WEARABLES["pumpkin' pete"] as Partial<NPCParts>;

export const DiscordNews: React.FC = () => {
  const { authState } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { t } = useAppTranslation();
  const now = useNow({ live: true });

  const { data, isLoading, error } = useSWR(
    ["/data?type=flowerDashboard"],
    () =>
      getDiscordNewsData({ token: authState.context.user.rawToken as string }),
  );

  if (isLoading) return <Loading />;

  if (error || !data) return <p>Error</p>;

  if (selectedId) {
    const announcement = data.find(
      (announcement) => announcement.id === selectedId,
    );
    if (!announcement) return <p>{t("error")}</p>;

    const createdAt = new Date(announcement.createdAt).getTime();
    const relativeTime = getRelativeTime(createdAt, now);
    const sender =
      announcement.sender.displayName ?? announcement.sender.username;

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
            <NPCFixed
              width={PIXEL_SCALE * 12}
              parts={TEAM_NPCS[sender] ?? NPC_WEARABLES["pumpkin' pete"]}
            />
            <div className="flex flex-col">
              <p className="text-xs">{sender}</p>
              <a
                href={announcement.url}
                target="_blank"
                rel="noreferrer"
                className="text-xxs underline"
              >
                {relativeTime} on Discord
              </a>
            </div>
          </div>
        </div>

        <p className="text-sm discord-news-body break-words mb-2 px-1">
          {announcement.content}
        </p>
        {announcement.images.map((image) => (
          <img key={image.url} src={image.url} className="w-full mb-2" />
        ))}
      </div>
    );
  }

  // TODO - put actual quests/announcements/actual news on top here (From Bumpkins)

  const announcements = data;
  return (
    <div className="max-h-[450px] overflow-y-auto scrollable pr-0.5">
      {announcements.map((announcement) => {
        const createdAt = new Date(announcement.createdAt).getTime();
        const relativeTime = getRelativeTime(createdAt, now);

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
                <p className="text-xxs capitalize mb-1 flex items-center justify-between gap-2">
                  <span className="underline">{announcement.channelName}</span>
                  <span>{relativeTime}</span>
                </p>
                <p className="text-sm discord-news-preview break-words">
                  {announcement.content}
                </p>
              </div>
            </div>
          </ButtonPanel>
        );
      })}
    </div>
  );
};
