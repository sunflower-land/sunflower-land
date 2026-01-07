/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CloseButtonPanel,
  PanelTabs,
} from "features/game/components/CloseablePanel";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "components/ui/Modal";
import cheer from "assets/icons/cheer.webp";
import followersIcon from "assets/icons/followers.webp";
import followingIcon from "assets/icons/following.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { AirdropPlayer } from "features/island/hud/components/settings-menu/general-settings/AirdropPlayer";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { isMobile } from "mobile-device-detect";
import { ReportPlayer } from "features/world/ui/player/ReportPlayer";
import { playerModalManager } from "./lib/playerModalManager";
import { PlayerDetails } from "./components/PlayerDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalOverlay } from "components/ui/ModalOverlay";
import useSWR from "swr";
import { getPlayer } from "./actions/getPlayer";
import { postEffect } from "features/game/actions/effect";
import { randomID } from "lib/utils/random";
import { FollowerFeed } from "./components/FollowerFeed";
import { FollowList } from "./components/FollowList";
import { Player } from "./types/types";
import { usePlayerNavigation } from "./hooks/usePlayerNavigation";
import { CheersGuide } from "./components/CheersGuide";

interface Props {
  loggedInFarmId: number;
  token: string;
  hasAirdropAccess: boolean;
}

type Tab =
  | "Player"
  | "Reward"
  | "Stream"
  | "Activity"
  | "Followers"
  | "Following"
  | "Guide";

export const mergeResponse = (current: Player, update: Player) => {
  return {
    data: { ...current.data, ...update },
  } as Player;
};

export const PlayerModal: React.FC<Props> = ({
  loggedInFarmId,
  token,
  hasAirdropAccess,
}) => {
  const { t } = useAppTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("Player");

  const {
    currentPlayerId,
    canGoBack,
    goBack,
    clearHistory,
    setInitialPlayer,
    navigateToPlayer,
  } = usePlayerNavigation();

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const closeModal = useCallback(() => {
    setShowPlayerModal(false);
    setTimeout(() => {
      clearHistory();
    }, 100);
  }, [clearHistory]);

  const {
    data,
    isLoading: playerLoading,
    isValidating: playerValidating,
    error,
    mutate,
  } = useSWR(
    [currentPlayerId ? "player" : null, token, loggedInFarmId, currentPlayerId],
    ([, token, loggedInFarmId, followedPlayerId]) => {
      if (!followedPlayerId) return;

      return getPlayer({
        token: token as string,
        farmId: loggedInFarmId,
        followedPlayerId,
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  const player = data?.data;

  useEffect(() => {
    playerModalManager.listen((npc) => {
      setInitialPlayer(npc.farmId);
      setShowPlayerModal(true);
    });
  }, [loggedInFarmId, setInitialPlayer]);

  useEffect(() => {
    setTab("Player");
  }, [currentPlayerId]);

  const iAmFollowing = (player?.followedBy ?? []).includes(loggedInFarmId);
  const theyAreFollowingMe = (player?.following ?? []).includes(loggedInFarmId);
  const isMutual = iAmFollowing && theyAreFollowingMe;

  const isSelf = loggedInFarmId === currentPlayerId;

  const playerTab: PanelTabs<Tab> = {
    icon: SUNNYSIDE.icons.player,
    name: t("player"),
    id: "Player",
  };

  const activityTab: PanelTabs<Tab> = {
    icon: SUNNYSIDE.icons.expression_chat,
    name: t("activity"),
    id: "Activity",
  };

  const followersTab: PanelTabs<Tab> = {
    icon: followersIcon,
    name: t("followers"),
    id: "Followers",
  };

  const followingTab: PanelTabs<Tab> = {
    icon: followingIcon,
    name: t("following"),
    id: "Following",
  };

  const guideTab: PanelTabs<Tab> = {
    icon: cheer,
    name: t("guide"),
    id: "Guide",
  };

  const tabs: PanelTabs<Tab>[] = [
    playerTab,
    ...(isMobile && !isSelf ? [activityTab] : []),
    followersTab,
    followingTab,
    guideTab,
  ];

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (iAmFollowing) {
        const { data: response } = await postEffect({
          effect: {
            type: "farm.unfollowed",
            followedId: currentPlayerId,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: loggedInFarmId,
        });

        mutate((current) => mergeResponse(current!, response), {
          revalidate: false,
        });
      } else {
        const { data: response } = await postEffect({
          effect: {
            type: "farm.followed",
            followedId: currentPlayerId,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: loggedInFarmId,
        });

        mutate((current) => mergeResponse(current!, response), {
          revalidate: false,
        });
      }
    } catch (e) {
      /* eslint-disable-next-line no-console */
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={showPlayerModal}
        onHide={closeModal}
        size="lg"
        onExited={() => clearHistory()}
      >
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={playerValidating ? undefined : player?.clothing}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={tabs}
          container={OuterPanel}
        >
          <div className="max-h-[500px]">
            {tab === "Player" && (
              <PlayerDetails
                data={data}
                loggedInFarmId={loggedInFarmId}
                playerLoading={playerLoading}
                playerValidating={playerValidating}
                error={error}
                followLoading={followLoading}
                iAmFollowing={!!iAmFollowing}
                isFollowMutual={!!isMutual}
                mutate={mutate}
                onFollow={handleFollow}
                onFollowersClick={() => setTab("Followers")}
                canGoBack={canGoBack}
                onGoBack={goBack}
              />
            )}

            {tab === "Activity" && (
              <FollowerFeed
                loggedInFarmId={loggedInFarmId}
                playerId={currentPlayerId as number}
                playerClothing={player?.clothing}
                playerUsername={player?.username}
                playerLoading={playerLoading}
                chatDisabled={!isMutual}
              />
            )}
            {tab === "Followers" && (
              <InnerPanel
                divRef={scrollContainerRef}
                className="overflow-y-auto scrollable max-h-[350px]"
                style={{ padding: 0 }}
              >
                <FollowList
                  loggedInFarmId={loggedInFarmId}
                  networkFarmId={currentPlayerId as number}
                  token={token}
                  networkList={player?.followedBy ?? []}
                  networkCount={player?.followedBy?.length ?? 0}
                  playerLoading={playerLoading}
                  networkType="followers"
                  navigateToPlayer={navigateToPlayer}
                  scrollContainerRef={scrollContainerRef}
                />
              </InnerPanel>
            )}
            {tab === "Following" && (
              <InnerPanel
                divRef={scrollContainerRef}
                className="overflow-y-auto scrollable max-h-[350px]"
              >
                <FollowList
                  loggedInFarmId={loggedInFarmId}
                  networkFarmId={currentPlayerId as number}
                  token={token}
                  networkCount={player?.following?.length ?? 0}
                  networkList={player?.following ?? []}
                  playerLoading={playerLoading}
                  networkType="following"
                  navigateToPlayer={navigateToPlayer}
                  scrollContainerRef={scrollContainerRef}
                />
              </InnerPanel>
            )}
            {tab === "Guide" && <CheersGuide />}
            <div className="flex items-center p-1 space-x-3 justify-end">
              <span
                className="text-xxs underline cursor-pointer"
                onClick={() => setShowReport(true)}
              >
                {t("report")}
              </span>
              {hasAirdropAccess && (
                <span
                  className="text-xxs underline cursor-pointer"
                  onClick={() => setShowAirdrop(true)}
                >
                  {t("special.event.airdrop")}
                </span>
              )}
            </div>
          </div>
        </CloseButtonPanel>
        {player && (
          <>
            <ModalOverlay
              show={showAirdrop}
              onBackdropClick={() => setShowAirdrop(false)}
              className="m-2"
            >
              <CloseButtonPanel onClose={() => setShowAirdrop(false)}>
                <AirdropPlayer
                  id={currentPlayerId as number}
                  onClose={() => setShowAirdrop(false)}
                  onSubMenuClick={() => void 0}
                />
              </CloseButtonPanel>
            </ModalOverlay>
            <ModalOverlay
              show={showReport}
              onBackdropClick={() => setShowReport(false)}
              className="m-2"
            >
              <CloseButtonPanel
                onClose={() => setShowReport(false)}
                className="p-1"
              >
                <ReportPlayer id={currentPlayerId as number} />
              </CloseButtonPanel>
            </ModalOverlay>
          </>
        )}
      </Modal>
    </>
  );
};
