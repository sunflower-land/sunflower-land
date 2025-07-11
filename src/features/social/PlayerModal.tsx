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
import {
  playerModalManager,
  PlayerModalPlayer,
} from "./lib/playerModalManager";
import { PlayerDetails } from "./components/PlayerDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ModalOverlay } from "components/ui/ModalOverlay";
import useSWR from "swr";
import { getPlayer } from "./actions/getPlayer";

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

export const PlayerModal: React.FC<Props> = ({ game, farmId, token }) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<Tab>("Player");

  const [player, setPlayer] = useState<PlayerModalPlayer | undefined>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [showReport, setShowReport] = useState(false);

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
              mutate={mutate}
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
