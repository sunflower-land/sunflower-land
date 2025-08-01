/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import giftIcon from "assets/icons/gift.png";
import cheer from "assets/icons/cheer.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { GameState } from "features/game/types/game";
import { AirdropPlayer } from "features/island/hud/components/settings-menu/general-settings/AirdropPlayer";
import { hasFeatureAccess } from "lib/flags";
import { ITEM_DETAILS } from "features/game/types/images";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { isMobile } from "mobile-device-detect";
import { StreamReward } from "features/world/ui/player/StreamReward";
import { PlayerGift } from "features/world/ui/player/PlayerGift";
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
import { Equipped } from "features/game/types/bumpkin";
import { CheersGuide } from "./components/CheersGuide";

interface Props {
  game: GameState;
  loggedInFarmId: number;
  token: string;
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
  game,
  loggedInFarmId,
  token,
}) => {
  const { t } = useAppTranslation();
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

  const setInitialTab = useCallback((equipped?: Equipped) => {
    if (
      equipped?.hat === "Streamer Hat" &&
      loggedInFarmId !== currentPlayerId
    ) {
      setTab("Stream");
    } else if (equipped?.shirt === "Gift Giver") {
      setTab("Reward");
    } else {
      setTab("Player");
    }
  }, []);

  useEffect(() => {
    setInitialTab(player?.clothing);
  }, [currentPlayerId, setInitialTab]);

  useEffect(() => {
    playerModalManager.listen((npc) => {
      setInitialPlayer(npc.farmId);
      setShowPlayerModal(true);
      // Automatically set to Stream tab if player has Streamer Hat and is not current player
      setInitialTab(npc.clothing as Equipped);
    });
  }, [loggedInFarmId, setInitialPlayer, setInitialTab]);

  const playerHasGift = player?.clothing?.shirt === "Gift Giver";
  const playerHasStreamReward = player?.clothing?.hat === "Streamer Hat";
  const notCurrentPlayer = loggedInFarmId !== currentPlayerId;

  const iAmFollowing = player?.followedBy.includes(loggedInFarmId);
  const theyAreFollowingMe = player?.following.includes(loggedInFarmId);
  const isMutual = iAmFollowing && theyAreFollowingMe;

  const isSelf = loggedInFarmId === currentPlayerId;

  // Effect to handle tab switching when player data changes
  useEffect(() => {
    if (!player) return;

    // When navigating to a new player (data changes), reset tab state appropriately
    // This ensures we maintain special tabs based on the new player's attributes

    // Check if current tab is valid for this player
    const isSpecialTab = tab === "Reward" || tab === "Stream";
    const hasSpecialTab =
      (playerHasGift && tab === "Reward") ||
      (playerHasStreamReward && notCurrentPlayer && tab === "Stream");

    // If we're on a special tab that's not valid for this player, switch to Player tab
    if (isSpecialTab && !hasSpecialTab) {
      setTab("Player");
    }
  }, [player, playerHasGift, playerHasStreamReward, notCurrentPlayer, tab]);

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
          tabs={[
            {
              icon: SUNNYSIDE.icons.player,
              name: t("player"),
            },
            ...(isMobile && !isSelf && hasFeatureAccess(game, "SOCIAL_FARMING")
              ? [
                  {
                    icon: SUNNYSIDE.icons.expression_chat,
                    name: "Activity",
                  },
                ]
              : []),
            {
              icon: SUNNYSIDE.icons.player,
              name: t("followers"),
            },
            {
              icon: SUNNYSIDE.icons.player,
              name: t("following"),
            },

            ...(playerHasGift
              ? [
                  {
                    icon: giftIcon,
                    name: t("reward"),
                  },
                ]
              : []),
            ...(playerHasStreamReward && notCurrentPlayer
              ? [
                  {
                    icon: ITEM_DETAILS["Love Charm"].image,
                    name: t("stream"),
                  },
                ]
              : []),
            {
              icon: cheer,
              name: t("guide"),
            },
          ]}
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
                className="overflow-y-auto scrollable max-h-[350px]"
                style={{ padding: 0 }}
              >
                <FollowList
                  loggedInFarmId={loggedInFarmId}
                  networkFarmId={currentPlayerId as number}
                  token={token}
                  networkList={player?.followedBy ?? []}
                  networkCount={player?.followedByCount ?? 0}
                  playerLoading={playerLoading}
                  type="followers"
                  navigateToPlayer={navigateToPlayer}
                />
              </InnerPanel>
            )}
            {tab === "Following" && (
              <InnerPanel className="overflow-y-auto scrollable max-h-[350px]">
                <FollowList
                  loggedInFarmId={loggedInFarmId}
                  networkFarmId={currentPlayerId as number}
                  token={token}
                  networkCount={player?.followingCount ?? 0}
                  networkList={player?.following ?? []}
                  playerLoading={playerLoading}
                  type="following"
                  navigateToPlayer={navigateToPlayer}
                />
              </InnerPanel>
            )}
            {tab === "Reward" && <PlayerGift />}
            {tab === "Stream" && (
              <StreamReward streamerId={currentPlayerId as number} />
            )}
            {tab === "Guide" && <CheersGuide />}
            <div className="flex items-center p-1 space-x-3 justify-end">
              <span
                className="text-xxs underline cursor-pointer"
                onClick={() => setShowReport(true)}
              >
                {t("report")}
              </span>
              {hasFeatureAccess(game, "AIRDROP_PLAYER") && (
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
