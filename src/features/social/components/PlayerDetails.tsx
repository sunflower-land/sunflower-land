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
import { useLocation, useNavigate } from "react-router";
import { useVisiting } from "lib/utils/visitUtils";
import { Player } from "../types/types";
import { useSocial } from "../hooks/useSocial";
import { KeyedMutator } from "swr";
import { PlayerDetailsSkeleton } from "./skeletons/PlayerDetailsSkeleton";
import { FollowerFeedSkeleton } from "./skeletons/FollowerFeedSkeleton";
import { OnlineStatus } from "./OnlineStatus";
import { FollowsIndicator } from "./FollowsIndicator";
import { formatNumber } from "lib/utils/formatNumber";
import { FACTION_TO_EMBLEM } from "features/world/ui/factions/emblemTrading/EmblemsTrading";
import { ITEM_DETAILS } from "features/game/types/images";

const ISLAND_ICONS: Record<IslandType, string> = {
  basic: basicIsland,
  spring: springIsland,
  desert: desertIsland,
  volcano: volcanoIsland,
};

type Props = {
  data?: Player;
  error?: Error;
  playerLoading: boolean;
  playerValidating: boolean;
  followLoading: boolean;
  iAmFollowing: boolean;
  isFollowMutual: boolean;
  mutate: KeyedMutator<Player | undefined>;
  canGoBack?: boolean;
  onFollow: () => void;
  onFollowersClick: () => void;
  onGoBack?: () => void;
};

const _farmId = (state: MachineState) => state.context.farmId;

export const PlayerDetails: React.FC<Props> = ({
  data,
  error,
  playerLoading,
  followLoading,
  iAmFollowing,
  isFollowMutual,
  mutate,
  onFollow,
  onFollowersClick,
  canGoBack,
  onGoBack,
}) => {
  const { gameService, setFromRoute } = useContext(Context);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isVisiting } = useVisiting();
  const farmId = useSelector(gameService, _farmId);
  const location = useLocation();

  const player = data?.data;

  useSocial({
    farmId,
    following: player?.followedBy ?? [],
    callbacks: {
      onFollow: () => mutate(),
      onUnfollow: () => mutate(),
    },
  });

  // Show skeleton if data is loading or undefined
  if (playerLoading) {
    return (
      <div className="flex gap-1 w-full max-h-[370px]">
        <PlayerDetailsSkeleton />
        {!isMobile && <FollowerFeedSkeleton />}
      </div>
    );
  }

  const visitFarm = () => {
    if (!player) return;

    // Setting from route to navigate back to the correct page after visit
    setFromRoute(location.pathname);

    gameService.send("VISIT", { landId: player.id });
    navigate(`/visit/${player.id}`);
  };

  const startDate = new Date(player?.farmCreatedAt ?? 0).toLocaleString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    },
  );

  const isSelf = player?.id === farmId;

  return (
    <div className="flex gap-1 w-full max-h-[370px]">
      <div className="flex flex-col flex-1 gap-1">
        <InnerPanel className="flex flex-col gap-1 flex-1 pb-1 px-1">
          <div className="flex items-center relative">
            <div className="flex items-center">
              {canGoBack && (
                <div
                  className="flex items-center justify-center w-6 h-6 mr-2 cursor-pointer hover:bg-brown-200 active:bg-brown-300 rounded-sm transition-colors"
                  onClick={onGoBack}
                >
                  <img
                    src={SUNNYSIDE.icons.arrow_left}
                    className="w-6"
                    alt="Back"
                  />
                </div>
              )}
              <Label type="default" className="relative">
                {player?.username}
                <div className="absolute -top-2 -right-2 z-10">
                  {player?.id && (
                    <OnlineStatus
                      playerId={player?.id}
                      farmId={farmId}
                      lastUpdatedAt={player?.lastUpdatedAt ?? 0}
                    />
                  )}
                </div>
              </Label>
            </div>
            {player?.isVip && <img src={vipIcon} className="w-5 ml-2" />}
          </div>
          <div className="flex pb-1 gap-1">
            <div className="relative">
              <NPCIcon
                parts={player?.clothing ?? {}}
                width={PIXEL_SCALE * 14}
              />
            </div>
            <div className="flex flex-col gap-1 text-xs mt-1 ml-2 flex-1">
              <div className="flex items-center">
                {`Lvl ${player?.level}${player?.faction ? ` - ${capitalize(player?.faction)}` : ""}`}
                {player?.faction && (
                  <img
                    src={ITEM_DETAILS[FACTION_TO_EMBLEM[player.faction]].image}
                    className="w-5 ml-1"
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>{`#${player?.id}`}</span>
                <span>{t("playerModal.since", { date: startDate })}</span>
              </div>
            </div>
          </div>
        </InnerPanel>
        <InnerPanel className="flex flex-col w-full pb-1">
          <div className="p-1 flex items-center">
            <div className="w-10">
              <img
                src={ISLAND_ICONS[player?.island ?? "basic"]}
                className="w-full"
              />
            </div>
            <div className="flex pb-1 flex-col justify-center gap-1 text-xs mt-1 ml-2 flex-1">
              <div>
                {t("playerModal.island", {
                  island: capitalize(player?.island ?? ""),
                })}
              </div>
              <div className="flex items-center">
                <span>
                  {t("playerModal.marketValue", {
                    value: formatNumber(
                      player?.marketValue ?? 0,
                    ).toLocaleString(),
                  })}
                </span>
                <img src={flowerIcon} className="w-4 h-4 ml-1 mt-0.5" />
              </div>
            </div>
            {!isVisiting && (
              <Button
                className="flex w-fit h-9 justify-between items-center gap-1 mt-1"
                disabled={isSelf}
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
              <FollowsIndicator
                count={data?.data?.followedByCount ?? 0}
                onClick={onFollowersClick}
                type="followers"
              />
              <Button
                className="flex w-fit h-9 justify-between items-center gap-1 mt-1 mr-0.5"
                disabled={playerLoading || followLoading || !!error || isSelf}
                onClick={onFollow}
              >
                {followLoading ? `...` : iAmFollowing ? `Unfollow` : `Follow`}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-1 pt-0 mb-2 w-full">
            <div className="text-xs">{`You cleaned their farm x times`}</div>
            <div className="text-xs">{`They cleaned your farm x times`}</div>
            <div className="text-xs">{`Top friend - x`}</div>
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
      {!isMobile && player && !isSelf && (
        <FollowerFeed
          farmId={farmId}
          playerId={player.id}
          playerClothing={player.clothing}
          playerUsername={player.username}
          playerLoading={playerLoading}
          chatDisabled={!isFollowMutual}
        />
      )}
    </div>
  );
};
