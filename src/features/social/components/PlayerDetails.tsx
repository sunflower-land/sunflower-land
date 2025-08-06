/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from "react";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel, Panel } from "components/ui/Panel";

import vipIcon from "assets/icons/vip.webp";
import basicIsland from "assets/icons/islands/basic.webp";
import springIsland from "assets/icons/islands/spring.webp";
import desertIsland from "assets/icons/islands/desert.webp";
import volcanoIsland from "assets/icons/islands/volcano.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import cheer from "assets/icons/cheer.webp";
import socialPointsIcon from "assets/icons/social_score.webp";
import followingIcon from "assets/icons/following.webp";

import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { capitalize } from "lib/utils/capitalize";
import { isMobile } from "mobile-device-detect";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { FollowerFeed } from "./FollowerFeed";
import { InventoryItemName, IslandType } from "features/game/types/game";
import { useTranslation } from "react-i18next";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { useLocation, useNavigate } from "react-router";
import { useVisiting } from "lib/utils/visitUtils";
import { ActiveProjects, Player } from "../types/types";
import { useSocial } from "../hooks/useSocial";
import { KeyedMutator } from "swr";
import { PlayerDetailsSkeleton } from "./skeletons/PlayerDetailsSkeleton";
import { FollowerFeedSkeleton } from "./skeletons/FollowerFeedSkeleton";
import { OnlineStatus } from "./OnlineStatus";
import { FollowsIndicator } from "./FollowsIndicator";
import { formatNumber } from "lib/utils/formatNumber";
import { FACTION_TO_EMBLEM } from "features/world/ui/factions/emblemTrading/EmblemsTrading";
import { ITEM_DETAILS } from "features/game/types/images";
import { ModalOverlay } from "components/ui/ModalOverlay";
import Decimal from "decimal.js-light";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { getKeys } from "features/game/lib/crafting";
import { ProgressBar } from "components/ui/ProgressBar";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const ISLAND_ICONS: Record<IslandType, string> = {
  basic: basicIsland,
  spring: springIsland,
  desert: desertIsland,
  volcano: volcanoIsland,
};

type Props = {
  data?: Player;
  error?: Error;
  loggedInFarmId: number;
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

const _cheersAvailable = (state: MachineState) => {
  return (
    (state.context.visitorState ?? state.context.state).inventory["Cheer"] ??
    new Decimal(0)
  );
};
const _hasCheeredToday = (farmId: number) => (state: MachineState) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    (state.context.visitorState ?? state.context.state).socialFarming
      .cheersGiven.date === today &&
    (
      state.context.visitorState ?? state.context.state
    ).socialFarming.cheersGiven.farms.includes(farmId)
  );
};

export const PlayerDetails: React.FC<Props> = ({
  data,
  error,
  playerLoading,
  followLoading,
  loggedInFarmId,
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
  const location = useLocation();
  const { isVisiting } = useVisiting();

  const player = data?.data;

  const cheersAvailable = useSelector(gameService, _cheersAvailable);
  const [showCheerModal, setShowCheerModal] = useState(false);

  useOnMachineTransition(
    gameService,
    "cheeringFarm",
    "cheeringFarmSuccess",
    mutate,
  );

  const hasCheeredToday = useSelector(
    gameService,
    _hasCheeredToday(player?.id ?? 0),
  );

  useSocial({
    farmId: loggedInFarmId,
    following: player?.followedBy ?? [],
    callbacks: {
      onFollow: () => mutate(),
      onUnfollow: () => mutate(),
    },
  });

  // Show skeleton if data is loading or undefined
  if (playerLoading) {
    return (
      <div className="flex gap-1 w-full max-h-[400px]">
        <PlayerDetailsSkeleton />
        {!isMobile && <FollowerFeedSkeleton />}
      </div>
    );
  }

  if (error) {
    return (
      <InnerPanel className="flex gap-1 w-full max-h-[400px]">
        <div className="flex flex-col justify-center mr-2 mb-1 gap-2">
          <Label type="default" className="relative">
            {t("player.notFound")}
          </Label>
          <span className="text-xs p-1">
            {t("player.notFound.description")}
          </span>
        </div>
      </InnerPanel>
    );
  }

  const visitFarm = () => {
    if (!player) return;

    // Setting from route to navigate back to the correct page after visit
    setFromRoute(location.pathname);

    gameService.send("VISIT", { landId: player.id });
    navigate(`/visit/${player.id}`);
  };

  const cheerPlayer = () => {
    gameService.send("farm.cheered", {
      effect: {
        type: "farm.cheered",
        farmId: player?.id,
      },
    });
    setShowCheerModal(false);
  };

  const startDate = new Date(player?.farmCreatedAt ?? 0).toLocaleString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    },
  );

  const isSelf = player?.id === loggedInFarmId;
  const hasCheersAvailable = cheersAvailable.gt(0);
  const displayName = player?.username ?? `#${player?.id}`;
  const inProgressProjects = getKeys(
    (player?.projects ?? {}) as ActiveProjects,
  ).sort((a, b) => {
    const projectA = player?.projects?.[a];
    const projectB = player?.projects?.[b];

    if (!projectA || !projectB) return 0;

    const projectAProgress =
      (projectA.receivedCheers / projectA.requiredCheers) * 100;
    const projectBProgress =
      (projectB.receivedCheers / projectB.requiredCheers) * 100;

    return projectBProgress - projectAProgress;
  });

  return (
    <div className="flex gap-1 w-full max-h-[400px]">
      <div className="flex flex-col flex-1 gap-1">
        <InnerPanel className="flex flex-col pb-1 px-1">
          <ModalOverlay
            show={showCheerModal}
            onBackdropClick={() => setShowCheerModal(false)}
          >
            <Panel>
              <div className="flex sm:flex-row flex-col space-y-1">
                <Label type="default" icon={cheer} className="ml-1">
                  {t("cheers.available", {
                    count: cheersAvailable.toNumber(),
                  })}
                </Label>
              </div>

              <div className="p-2 text-xs flex flex-col gap-2">
                <span>{t("cheers.confirm.description")}</span>
                <span>{t("cheers.confirm", { username: displayName })}</span>
              </div>
              <div className="flex space-x-1">
                <Button onClick={() => setShowCheerModal(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={cheerPlayer} disabled={!hasCheersAvailable}>
                  {t("cheer")}
                </Button>
              </div>
            </Panel>
          </ModalOverlay>
          <div className="flex justify-between">
            <div className="flex items-center relative">
              <div className="flex items-center flex-wrap gap-1">
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
                <div className="flex items-center mr-2 mb-1">
                  <Label type="default" className="relative">
                    {player?.username}
                    <div className="absolute -top-2 -right-2 z-10">
                      {player?.id && (
                        <OnlineStatus
                          playerId={player?.id}
                          loggedInFarmId={loggedInFarmId}
                          lastUpdatedAt={player?.lastUpdatedAt ?? 0}
                        />
                      )}
                    </div>
                  </Label>
                  {player?.isVip && <img src={vipIcon} className="w-5 ml-2" />}
                </div>
                <Label type="chill" className="ml-0.5" icon={socialPointsIcon}>
                  {player?.socialPoints === 1
                    ? t("socialPoint")
                    : t("socialPoints", { points: player?.socialPoints })}
                </Label>
              </div>
            </div>
            {!isSelf && (
              <Button
                className="flex w-fit h-9 justify-between items-center gap-1 mr-1 -mb-2 mt-1"
                onClick={() => setShowCheerModal(true)}
                disabled={hasCheeredToday}
              >
                <div className="flex items-center px-1">
                  <img
                    src={cheer}
                    className="flex justify-center items-center w-4 h-4"
                  />
                </div>
              </Button>
            )}
          </div>
          <div className="flex ">
            <div className="relative">
              <NPCIcon
                parts={player?.clothing ?? {}}
                width={PIXEL_SCALE * 14}
              />
            </div>
            <div className="flex flex-col gap-1 text-xs mt-1 ml-2 flex-1 mb-1">
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
                className="flex w-fit h-9 justify-between items-center gap-1 -mt-2.5 align-top"
                disabled={isSelf}
                onClick={visitFarm}
              >
                <div className="flex items-center px-1">
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
          <div className="flex flex-col gap-1 px-1 w-full ml-1 pt-0">
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
                <img
                  src={iAmFollowing ? SUNNYSIDE.icons.drag : followingIcon}
                  className="w-4 h-4 mr-1 pt-0.5 object-contain"
                />
                <span className="text-xs">
                  {followLoading ? `...` : iAmFollowing ? `Unfollow` : `Follow`}
                </span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-1 mb-1 w-full">
            <div className="text-xs">
              {player?.cleaning.youCleanedThemCount === 1
                ? t("playerModal.youCleanedThemCount.singular", {
                    count: player?.cleaning.youCleanedThemCount,
                  })
                : t("playerModal.youCleanedThemCount.plural", {
                    count: player?.cleaning.youCleanedThemCount,
                  })}
            </div>
            <div className="text-xs">
              {player?.cleaning.theyCleanedYouCount === 1
                ? t("playerModal.theyCleanedYouCount.singular", {
                    count: player?.cleaning.theyCleanedYouCount,
                  })
                : t("playerModal.theyCleanedYouCount.plural", {
                    count: player?.cleaning.theyCleanedYouCount,
                  })}
            </div>
          </div>
        </InnerPanel>

        <InnerPanel className="flex flex-1 flex-col gap-1 max-h-[121px] overflow-y-auto scrollable">
          <Label type="default">{t("playerModal.projectsInProgress")}</Label>
          <div className="flex gap-2 flex-wrap py-1">
            {inProgressProjects.length > 0 ? (
              inProgressProjects.map((monumentName, index) => {
                const { receivedCheers, requiredCheers } = player?.projects?.[
                  monumentName
                ] ?? {
                  receivedCheers: 0,
                  requiredCheers: 0,
                };

                return (
                  <div
                    key={`${monumentName}-${index}`}
                    className="mb-4 relative"
                  >
                    <Popover>
                      <PopoverButton as="div" className="cursor-pointer">
                        <ButtonPanel className="flex flex-col">
                          <img
                            src={
                              ITEM_DETAILS[monumentName as InventoryItemName]
                                .image
                            }
                            className="w-7 h-7 object-contain"
                          />
                        </ButtonPanel>
                      </PopoverButton>
                      <PopoverPanel
                        anchor={{ to: "right start", gap: 1, offset: 5 }}
                        className="flex pointer-events-none"
                      >
                        <InnerPanel className="flex flex-col gap-1 p-1">
                          <span className="text-xxs">{monumentName}</span>
                          <div className="flex items-center gap-1">
                            <img
                              src={cheer}
                              className="w-4 h-4 object-contain"
                            />
                            <span className="text-xxs">
                              {`${receivedCheers}/${requiredCheers}`}
                            </span>
                          </div>
                        </InnerPanel>
                      </PopoverPanel>
                    </Popover>
                    <ProgressBar
                      percentage={(receivedCheers / requiredCheers) * 100}
                      type="progress"
                      formatLength="short"
                      className="absolute bottom-0 w-full left-[5px]"
                    />
                  </div>
                );
              })
            ) : (
              <div className="text-xs ml-1">
                {t("playerModal.noProjectsInProgress")}
              </div>
            )}
          </div>
        </InnerPanel>
      </div>
      {!isMobile && player && !isSelf && (
        <FollowerFeed
          loggedInFarmId={loggedInFarmId}
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
