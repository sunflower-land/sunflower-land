/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
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
import {
  playerModalManager,
  PlayerModalPlayer,
} from "./lib/playerModalManager";
import { PlayerDetails } from "./components/PlayerDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalOverlay } from "components/ui/ModalOverlay";
import useSWR from "swr";
import { getPlayer } from "./actions/getPlayer";
import { postEffect } from "features/game/actions/effect";
import { randomID } from "lib/utils/random";
import { mergeResponse } from "./lib/mergePlayerResponse";
import { Interaction } from "./types/types";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { FollowerFeed } from "./components/FollowerFeed";
import { Followers } from "./components/Followers";

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

const _myClothing = (state: MachineState) =>
  state.context.state.bumpkin.equipped;
const _myUsername = (state: MachineState) => state.context.state.username;

export const PlayerModal: React.FC<Props> = ({ game, farmId, token }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();
  const [tab, setTab] = useState<Tab>("Player");

  const [player, setPlayer] = useState<PlayerModalPlayer | undefined>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const myClothing = useSelector(gameService, _myClothing);
  const myUsername = useSelector(gameService, _myUsername);

  const {
    data,
    isLoading: playerLoading,
    error,
    mutate,
  } = useSWR(
    [player ? "player" : null, token, farmId, player?.farmId],
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
      setPlayer(npc);
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
    if (!player) return;

    const handlePlayerLeave = (playerId: number) => {
      if (playerId === player.farmId) {
        closeModal();
      }
    };

    // Listen for player leave events
    window.addEventListener("player_leave", ((event: CustomEvent) =>
      handlePlayerLeave(event.detail.playerId)) as EventListener);

    return () =>
      window.removeEventListener("player_leave", ((event: CustomEvent) =>
        handlePlayerLeave(event.detail.playerId)) as EventListener);
  }, [player]);

  const closeModal = () => {
    setShowPlayerModal(false);
  };

  const iAmFollowing = data?.data?.followedBy.includes(farmId);
  const theyAreFollowingMe = data?.data?.following.includes(farmId);
  const isMutual = iAmFollowing && theyAreFollowingMe;

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (iAmFollowing) {
        const { data: response } = await postEffect({
          effect: {
            type: "farm.unfollowed",
            followedId: player?.farmId,
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
            followedId: player?.farmId,
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

  const sendMessage = async (message: string) => {
    if (!player) return;

    const newMessage: Interaction = {
      type: "chat",
      message,
      recipient: {
        id: player.farmId,
        tokenUri: tokenUriBuilder(player.clothing),
        username: player.username ?? `#${player.farmId}`,
      },
      sender: {
        id: farmId,
        tokenUri: tokenUriBuilder(myClothing),
        username: myUsername ?? `#${farmId}`,
      },
      createdAt: Date.now(),
    };

    // Optimistically update the messages
    mutate(
      async (current) => {
        const { data: response } = await postEffect({
          effect: {
            type: "message.sent",
            recipientId: player.farmId,
            message,
          },
          transactionId: randomID(),
          token: token as string,
          farmId: farmId,
        });

        return mergeResponse(current!, response);
      },
      {
        revalidate: false,
        optimisticData: (_, current) =>
          mergeResponse(current!, {
            messages: [newMessage, ...(current?.data?.messages ?? [])],
          }),
      },
    );
  };

  const playerHasGift = player?.clothing.shirt === "Gift Giver";
  const playerHasStreamReward = player?.clothing.hat === "Streamer Hat";
  const notCurrentPlayer = farmId !== player?.farmId;

  return (
    <>
      <Modal
        show={showPlayerModal}
        onHide={closeModal}
        size="lg"
        onExited={() => setPlayer(undefined)}
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
          {tab === "Player" && player && (
            <PlayerDetails
              player={player}
              data={data}
              playerLoading={playerLoading}
              error={error}
              followLoading={followLoading}
              iAmFollowing={!!iAmFollowing}
              isFollowMutual={!!isMutual}
              mutate={mutate}
              onFollow={handleFollow}
              onChatMessage={sendMessage}
              onFollowersClick={() => setTab("Followers")}
            />
          )}
          {tab === "Activity" && (
            <FollowerFeed
              farmId={farmId}
              followedPlayerId={player?.farmId as number}
              onInteraction={sendMessage}
              chatDisabled={!isMutual}
            />
          )}
          {tab === "Followers" && player && (
            <Followers
              farmId={farmId}
              followers={data?.data?.followedBy ?? []}
            />
          )}
          {tab === "Reward" && <PlayerGift />}
          {tab === "Stream" && (
            <StreamReward streamerId={player?.farmId as number} />
          )}
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
                  id={player.farmId as number}
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
                <ReportPlayer id={player?.farmId as number} />
              </CloseButtonPanel>
            </ModalOverlay>
          </>
        )}
      </Modal>
    </>
  );
};
