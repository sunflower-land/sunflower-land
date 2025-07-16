/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext } from "react";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";

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
import { FollowerFeed } from "./FollowerFeed";
import { IslandType } from "features/game/types/game";
import { useTranslation } from "react-i18next";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { useNavigate } from "react-router";
import { useVisiting } from "lib/utils/visitUtils";
import { PlayerModalPlayer } from "../lib/playerModalManager";
import { Player } from "../types/types";
import { useSocial } from "../hooks/useSocial";
import { KeyedMutator } from "swr";

const ISLAND_ICONS: Record<IslandType, string> = {
  basic: basicIsland,
  spring: springIsland,
  desert: desertIsland,
  volcano: volcanoIsland,
};

type Props = {
  player: PlayerModalPlayer;
  data?: Player;
  error?: Error;
  playerLoading: boolean;
  followLoading: boolean;
  iAmFollowing: boolean;
  isFollowMutual: boolean;
  onFollow: () => void;
  onChatMessage: (message: string) => void;
  onFollowersClick: () => void;
  mutate: KeyedMutator<Player | undefined>;
};

const _farmId = (state: MachineState) => state.context.farmId;

export const PlayerDetails: React.FC<Props> = ({
  player,
  data,
  error,
  playerLoading,
  followLoading,
  iAmFollowing,
  isFollowMutual,
  mutate,
  onFollow,
  onChatMessage,
  onFollowersClick,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isVisiting } = useVisiting();

  const farmId = useSelector(gameService, _farmId);

  // Used only to share my online status with the followers
  useSocial({
    farmId,
    following: data?.data?.followedBy ?? [],
    callbacks: {
      onFollow: () => mutate(),
      onUnfollow: () => mutate(),
      onChat: (update) => {
        mutate((current) => {
          return {
            ...current,
            messages: [update, ...(current?.data?.messages ?? [])],
          };
        });
      },
    },
  });

  const visitFarm = () => {
    navigate(`/visit/${player.farmId}`);
  };

  const startDate = new Date(player?.createdAt ?? 0).toLocaleString("en-US", {
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
            {!isVisiting && (
              <Button
                className="flex w-fit h-9 justify-between items-center gap-1 mt-1"
                onClick={visitFarm}
              >
                <div className="flex items-center px-1">
                  {!isMobile && <span className="pr-1">{t("visit")}</span>}
                  <img
                    src={SUNNYSIDE.icons.search}
                    className="flex justify-center items-center w-4 h-4"
                  />
                </div>
              </Button>
            )}
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col items-center w-full">
          <div className="flex flex-col gap-1 p-1 w-full ml-1 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span
                  className="text-xs underline cursor-pointer"
                  onClick={onFollowersClick}
                >
                  {t("playerModal.followers", {
                    count: data?.data?.followedByCount,
                  })}
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
              <Button
                className="flex w-fit h-9 justify-between items-center gap-1 mt-1 mr-0.5"
                disabled={playerLoading || followLoading || !!error}
                onClick={onFollow}
              >
                {followLoading ? `...` : iAmFollowing ? `Unfollow` : `Follow`}
              </Button>
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
          farmId={farmId}
          followedPlayerId={player.farmId}
          onInteraction={(message) => {
            onChatMessage(message);
          }}
          chatDisabled={!isFollowMutual}
        />
      )}
    </div>
  );
};
