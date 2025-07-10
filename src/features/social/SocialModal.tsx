import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import giftIcon from "assets/icons/gift.png";
import blossom_bonding from "assets/icons/skill_icons/Bonding.png";

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
import {
  playerModalManager,
  PlayerModalPlayer,
} from "./lib/playerModalManager";
import { PlayerDetails } from "./components/PlayerDetails";

interface Props {
  game: GameState;
  farmId: number;
}

export const SocialModal: React.FC<Props> = ({ game, farmId }) => {
  const [tab, setTab] = useState<
    "Player" | "Reward" | "Stream" | "Report" | "Airdrop" | "Activity"
  >("Player");
  const [player, setPlayer] = useState<PlayerModalPlayer | undefined>();
  const [showPlayerModal, setShowPlayerModal] = useState(false);

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
          ...(notCurrentPlayer
            ? [
                {
                  icon: SUNNYSIDE.icons.search,
                  name: "Report",
                },
              ]
            : []),
          ...(hasFeatureAccess(game, "AIRDROP_PLAYER")
            ? [
                {
                  icon: blossom_bonding,
                  name: "Airdrop",
                },
              ]
            : []),
        ]}
        container={OuterPanel}
      >
        {tab === "Player" && player && <PlayerDetails player={player} />}
        {tab === "Reward" && <PlayerGift />}
        {tab === "Stream" && (
          <StreamReward streamerId={player?.farmId as number} />
        )}
        {tab === "Report" && <ReportPlayer id={player?.farmId as number} />}
        {tab === "Airdrop" && (
          <InnerPanel className="flex flex-col gap-1 max-h-[500px] overflow-y-auto scrollable">
            <AirdropPlayer
              id={player?.farmId as number}
              // Noops
              onClose={alert}
              onSubMenuClick={alert}
            />
          </InnerPanel>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
