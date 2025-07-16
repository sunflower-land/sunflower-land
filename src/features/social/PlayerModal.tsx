/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import giftIcon from "assets/icons/gift.png";

import { SUNNYSIDE } from "assets/sunnyside";
import { GameState } from "features/game/types/game";
import { AirdropPlayer } from "features/island/hud/components/settings-menu/general-settings/AirdropPlayer";
import { hasFeatureAccess } from "lib/flags";
import { ITEM_DETAILS } from "features/game/types/images";
import { OuterPanel } from "components/ui/Panel";
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

interface Props {
  game: GameState;
  farmId: number;
  token: string;
}

type Tab =
  | "Player"
  | "Reward"
  | "Stream"
  | "Activity"
  | "Followers"
  | "Following";

export const mergeResponse = (current: Player, update: Player) => {
  return {
    data: { ...current.data, ...update },
  } as Player;
};

export const PlayerModal: React.FC<Props> = ({ game, farmId, token }) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<Tab>("Player");

  const [playerId, setPlayerId] = useState<number | undefined>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const {
    data,
    isLoading: playerLoading,
    error,
    mutate,
  } = useSWR(
    [playerId ? "player" : null, token, farmId, playerId],
    ([, token, farmId, followedPlayerId]) => {
      if (!followedPlayerId) return;

      return getPlayer({ token: token as string, farmId, followedPlayerId });
    },
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    playerModalManager.listen((npc) => {
      setPlayerId(npc.farmId);
      setShowPlayerModal(true);
      // Automatically set to Stream tab if player has Streamer Hat and is not current player
      if (npc.clothing?.hat === "Streamer Hat" && farmId !== npc.farmId) {
        setTab("Stream");
      } else if (npc.clothing.shirt === "Gift Giver") {
        setTab("Reward");
      } else {
        setTab("Player");
      }
    });
  }, [farmId]);

  useEffect(() => {
    if (!playerId) return;

    const handlePlayerLeave = (leavingPlayerId: number) => {
      if (playerId === leavingPlayerId) {
        closeModal();
      }
    };

    // Listen for player leave events
    window.addEventListener("player_leave", ((event: CustomEvent) =>
      handlePlayerLeave(event.detail.playerId)) as EventListener);

    return () =>
      window.removeEventListener("player_leave", ((event: CustomEvent) =>
        handlePlayerLeave(event.detail.playerId)) as EventListener);
  }, [playerId]);

  const closeModal = () => {
    setShowPlayerModal(false);
  };

  const player = data?.data;

  const iAmFollowing = player?.followedBy.includes(farmId);
  const theyAreFollowingMe = player?.following.includes(farmId);
  const isMutual = iAmFollowing && theyAreFollowingMe;

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (iAmFollowing) {
        const { data: response } = await postEffect({
          effect: {
            type: "farm.unfollowed",
            followedId: playerId,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: farmId,
        });

        mutate((current) => mergeResponse(current!, response), {
          revalidate: false,
        });
      } else {
        const { data: response } = await postEffect({
          effect: {
            type: "farm.followed",
            followedId: playerId,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: farmId,
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

  const playerHasGift = player?.clothing?.shirt === "Gift Giver";
  const playerHasStreamReward = player?.clothing?.hat === "Streamer Hat";
  const notCurrentPlayer = farmId !== playerId;

  return (
    <>
      <Modal
        show={showPlayerModal}
        onHide={closeModal}
        size="lg"
        onExited={() => setPlayerId(undefined)}
      >
        <CloseButtonPanel
          onClose={closeModal}
          bumpkinParts={player?.clothing}
          currentTab={tab}
          setCurrentTab={setTab}
          tabs={[
            {
              icon: SUNNYSIDE.icons.player,
              name: "Player",
            },
            ...(isMobile && hasFeatureAccess(game, "SOCIAL_FARMING")
              ? [
                  {
                    icon: SUNNYSIDE.icons.expression_chat,
                    name: "Activity",
                  },
                ]
              : []),
            {
              icon: SUNNYSIDE.icons.player,
              name: "Followers",
            },
            {
              icon: SUNNYSIDE.icons.player,
              name: "Following",
            },

            ...(playerHasGift
              ? [
                  {
                    icon: giftIcon,
                    name: "Reward",
                  },
                ]
              : []),
            ...(playerHasStreamReward && notCurrentPlayer
              ? [
                  {
                    icon: ITEM_DETAILS["Love Charm"].image,
                    name: "Stream",
                  },
                ]
              : []),
          ]}
          container={OuterPanel}
        >
          {tab === "Player" && (
            <PlayerDetails
              data={data}
              playerLoading={playerLoading}
              error={error}
              followLoading={followLoading}
              iAmFollowing={!!iAmFollowing}
              isFollowMutual={!!isMutual}
              mutate={mutate}
              onFollow={handleFollow}
              onFollowersClick={() => setTab("Followers")}
            />
          )}
          {tab === "Activity" && (
            <FollowerFeed
              farmId={farmId}
              playerId={playerId as number}
              playerClothing={player?.clothing}
              playerUsername={player?.username}
              playerLoading={playerLoading}
              chatDisabled={!isMutual}
            />
          )}
          {tab === "Followers" && (
            <FollowList
              farmId={farmId}
              networkFarmId={playerId as number}
              token={token}
              networkList={player?.followedBy ?? []}
              networkCount={player?.followedByCount ?? 0}
              playerLoading={playerLoading}
              type="followers"
            />
          )}
          {tab === "Following" && (
            <FollowList
              farmId={farmId}
              networkFarmId={playerId as number}
              token={token}
              networkCount={player?.followingCount ?? 0}
              networkList={player?.following ?? []}
              playerLoading={playerLoading}
              type="following"
            />
          )}
          {tab === "Reward" && <PlayerGift />}
          {tab === "Stream" && <StreamReward streamerId={playerId as number} />}
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
                  id={playerId as number}
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
                <ReportPlayer id={playerId as number} />
              </CloseButtonPanel>
            </ModalOverlay>
          </>
        )}
      </Modal>
    </>
  );
};
