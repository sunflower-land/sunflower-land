import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PlayerModalPlayer } from "features/world/ui/player/PlayerModals";
import React, { useState } from "react";

import vipIcon from "assets/icons/vip.webp";
import basicIsland from "assets/icons/islands/basic.webp";
import springIsland from "assets/icons/islands/spring.webp";
import desertIsland from "assets/icons/islands/desert.webp";
import volcanoIsland from "assets/icons/islands/volcano.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import deliveryBook from "assets/icons/chapter_icon_3.webp";

import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getLevel } from "features/game/types/skills";
import Decimal from "decimal.js-light";
import { capitalize } from "lib/utils/capitalize";
import { isMobile } from "mobile-device-detect";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { FollowerFeed } from "./components/FollowerFeed";
import { IslandType } from "features/game/types/game";
import { useTranslation } from "react-i18next";

export type FarmInteraction = {
  id: string;
  sender?: string;
  timestamp: number;
  text: string;
  type: "comment" | "action" | "milestone" | "announcement";
};

export const dummyInteractions: FarmInteraction[] = [
  {
    id: "1",
    sender: "Elias",
    timestamp: Date.now() - 60000,
    text: "Nice farm!",
    type: "comment",
  },
  {
    id: "2",
    sender: "Local Hero",
    timestamp: Date.now() - 120000,
    text: "Cleaned your farm",
    type: "action",
  },
  {
    id: "3",
    timestamp: Date.now() - 180000,
    text: "Elias reached level 10",
    type: "milestone",
  },
  {
    id: "4",
    timestamp: Date.now() - 180000,
    text: "New Chapter Begins!",
    type: "announcement",
  },
  {
    id: "1",
    sender: "Elias",
    timestamp: Date.now() - 60000,
    text: "Nice farm!",
    type: "comment",
  },
  {
    id: "2",
    sender: "Local Hero",
    timestamp: Date.now() - 120000,
    text: "Cleaned your farm",
    type: "action",
  },
  {
    id: "3",
    timestamp: Date.now() - 180000,
    text: "Elias reached level 10",
    type: "milestone",
  },
  {
    id: "4",
    timestamp: Date.now() - 180000,
    text: "New Chapter Begins!",
    type: "announcement",
  },
  {
    id: "1",
    sender: "Elias",
    timestamp: Date.now() - 60000,
    text: "Nice farm!",
    type: "comment",
  },
  {
    id: "2",
    sender: "Local Hero",
    timestamp: Date.now() - 120000,
    text: "Cleaned your farm",
    type: "action",
  },
  {
    id: "3",
    timestamp: Date.now() - 180000,
    text: "Elias reached level 10",
    type: "milestone",
  },
  {
    id: "4",
    timestamp: Date.now() - 180000,
    text: "New Chapter Begins!",
    type: "announcement",
  },
  {
    id: "1",
    sender: "Elias",
    timestamp: Date.now() - 60000,
    text: "Nice farm!",
    type: "comment",
  },
  {
    id: "2",
    sender: "Local Hero",
    timestamp: Date.now() - 120000,
    text: "Cleaned your farm",
    type: "action",
  },
  {
    id: "3",
    timestamp: Date.now() - 180000,
    text: "Elias reached level 10",
    type: "milestone",
  },
  {
    id: "4",
    timestamp: Date.now() - 180000,
    text: "New Chapter Begins!",
    type: "announcement",
  },
];

const ISLAND_ICONS: Record<IslandType, string> = {
  basic: basicIsland,
  spring: springIsland,
  desert: desertIsland,
  volcano: volcanoIsland,
};

type Props = {
  player: PlayerModalPlayer;
};

export const PlayerDetails: React.FC<Props> = ({ player }) => {
  const { t } = useTranslation();
  const [interactions, setInteractions] =
    useState<FarmInteraction[]>(dummyInteractions);

  if (!player) return null;

  const startDate = new Date(player?.createdAt).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex gap-1 w-full max-h-[370px]">
      <div className="flex flex-col flex-1 gap-1">
        <InnerPanel className="flex flex-col gap-1 flex-1 pb-1 px-1">
          <div className="flex items-center">
            <Label type="default">{player?.username}</Label>
            {player?.isVip && <img src={vipIcon} className="w-5 ml-2" />}
          </div>
          <div className="flex pb-1">
            <div className="w-10">
              <NPCIcon parts={player?.clothing} width={PIXEL_SCALE * 14} />
            </div>
            <div className="flex flex-col gap-1 text-xs mt-1 ml-2 flex-1">
              <div>{`Lvl ${getLevel(new Decimal(player?.experience ?? 0))}${player?.faction ? ` - ${capitalize(player?.faction)}` : ""}`}</div>
              <div className="flex items-center justify-between">
                <span>{`#${player?.farmId}`}</span>
                <span>{t("playerModal.since", { date: startDate })}</span>
              </div>
            </div>
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col w-full pb-1">
          <div className="p-1 flex items-center">
            <div className="w-10">
              <img
                src={ISLAND_ICONS[player?.islandType ?? "basic"]}
                className="w-full"
              />
            </div>
            <div className="flex pb-1 flex-col justify-center gap-1 text-xs mt-1 ml-2 flex-1">
              <div>
                {t("playerModal.island", {
                  island: capitalize(player?.islandType ?? ""),
                })}
              </div>
              <div className="flex items-center">
                <span>{t("playerModal.marketValue", { value: 1000 })}</span>
                <img src={flowerIcon} className="w-4 h-4 ml-1 mt-0.5" />
              </div>
            </div>
            <Button className="flex w-fit h-9 justify-between items-center gap-1 mt-1">
              <div className="flex items-center px-1">
                {!isMobile && <span className="pr-1">{t("visit")}</span>}
                <img
                  src={SUNNYSIDE.icons.search}
                  className="flex justify-center items-center w-4 h-4"
                />
              </div>
            </Button>
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col items-center w-full">
          <div className="flex flex-col gap-1 p-1 w-full ml-1 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs underline cursor-pointer">
                  {t("playerModal.followers", { count: 145 })}
                </span>
                <div className="relative w-10 h-6">
                  <div className="absolute">
                    <NPCIcon
                      width={24}
                      parts={{
                        body: "Light Brown Farmer Potion",
                        pants: "Angler Waders",
                        hair: "Buzz Cut",
                        shirt: "Chic Gala Blouse",
                        tool: "Farmer Pitchfork",
                        background: "Farm Background",
                        shoes: "Black Farmer Boots",
                      }}
                    />
                  </div>
                  <div className="absolute left-3.5">
                    <NPCIcon
                      width={24}
                      parts={{
                        body: "Goblin Potion",
                        pants: "Grape Pants",
                        hair: "Ash Ponytail",
                        shirt: "Tiki Armor",
                        tool: "Axe",
                        background: "Farm Background",
                        shoes: "Crimstone Boots",
                      }}
                    />
                  </div>
                </div>
              </div>
              <Button className="flex w-fit h-9 justify-between items-center gap-1 mt-1 mr-0.5">{`Follow`}</Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-1 pt-0 mb-2 w-full">
            <div className="text-xs">{`You cleaned their farm x times`}</div>
            <div className="text-xs">{`They cleaned your farm x times`}</div>
            <div className="text-xs">{`Top friend - Craig`}</div>
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col w-full pb-1">
          <div className="p-1 flex items-center">
            <div className="w-10">
              <img src={deliveryBook} className="w-full" />
            </div>
            <div className="flex pb-1 flex-col justify-center gap-1 text-xs mt-1 ml-2 flex-1">
              <div>
                {t("playerModal.dailyStreak", { streak: player?.dailyStreak })}
              </div>
              <div>
                {t("playerModal.totalDeliveries", {
                  count: player?.totalDeliveries,
                })}
              </div>
            </div>
          </div>
        </InnerPanel>
      </div>
      {!isMobile && (
        <FollowerFeed
          className="w-2/5 h-auto"
          interactions={interactions}
          onInteraction={(interaction) => {
            setInteractions([interaction, ...interactions]);
          }}
        />
      )}
    </div>
  );
};
