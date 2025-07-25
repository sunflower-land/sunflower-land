import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import levelIcon from "assets/icons/level_up.png";
import giftIcon from "assets/icons/gift.png";
import blossom_bonding from "assets/icons/skill_icons/Bonding.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { BumpkinLevel } from "features/bumpkins/components/BumpkinModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { LABEL_STYLES } from "components/ui/Label";
import { AirdropPlayer } from "features/island/hud/components/settings-menu/general-settings/AirdropPlayer";
import { hasFeatureAccess } from "lib/flags";
import { ReportPlayer } from "./ReportPlayer";
import { PlayerGift } from "./PlayerGift";
import { StreamReward } from "./StreamReward";
import { ITEM_DETAILS } from "features/game/types/images";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { isMobile } from "mobile-device-detect";
import {
  playerModalManager,
  PlayerModalPlayer,
} from "features/social/lib/playerModalManager";

const OldPlayerDetails: React.FC<{ player: PlayerModalPlayer }> = ({
  player,
}) => {
  const { t } = useAppTranslation();
  const [showLabel, setShowLabel] = useState(false);

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setShowLabel(true);
    } catch (e: unknown) {
      setShowLabel(typeof e === "string" ? e : t("copy.failed"));
    }

    setTimeout(() => {
      setShowLabel(false);
    }, 2000);
  };

  return (
    <InnerPanel>
      <div className="flex items-center ml-1 mt-2 mb-4">
        <img
          src={levelIcon}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            marginRight: `${PIXEL_SCALE * 4}px`,
          }}
        />
        <div>
          <p className="text-base">
            {t("lvl")} {getBumpkinLevel(player?.experience ?? 0)}
          </p>
          {/* Progress bar */}
          <BumpkinLevel experience={player?.experience} />
        </div>

        <div
          className="flex-auto self-start text-right text-xs mr-3 f-10 font-secondary cursor-pointer"
          onClick={() => {
            copyToClipboard(player?.farmId as unknown as string);
          }}
        >
          {player?.username && (
            <p className="text-xs mb-1">{player?.username}</p>
          )}
          <p className="text-xs">{`#${player?.farmId}`}</p>
          {showLabel && (
            <div
              className="absolute right-2 text-xs pointer-events-none"
              style={{
                ...LABEL_STYLES["default"].borderStyle,
                background: LABEL_STYLES["default"].background,
              }}
            >
              {t("copied")}
            </div>
          )}
        </div>
      </div>
    </InnerPanel>
  );
};

interface Props {
  game: GameState;
  farmId: number;
  isOpen?: boolean;
}

export const PlayerModals: React.FC<Props> = ({ game, farmId, isOpen }) => {
  const [tab, setTab] = useState<
    "Player" | "Reward" | "Stream" | "Report" | "Airdrop" | "Activity"
  >("Player");
  const [player, setPlayer] = useState<PlayerModalPlayer | undefined>();
  const [showPlayerModal, setShowPlayerModal] = useState(isOpen ?? false);

  useEffect(() => {
    playerModalManager.listen((npc) => {
      setPlayer(npc);
      setShowPlayerModal(true);
      // Automatically set to Stream tab if player has Streamer Hat and is not current player
      if (npc.clothing?.hat === "Streamer Hat" && farmId !== npc.farmId) {
        setTab("Stream");
      } else if (npc.clothing?.shirt === "Gift Giver") {
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

  const playerHasGift = player?.clothing?.shirt === "Gift Giver";
  const playerHasStreamReward = player?.clothing?.hat === "Streamer Hat";
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
        {tab === "Player" && player && <OldPlayerDetails player={player} />}
        {tab === "Reward" && <PlayerGift />}
        {tab === "Stream" && (
          <StreamReward streamerId={player?.farmId as number} />
        )}
        {tab === "Report" && (
          <InnerPanel>
            <ReportPlayer id={player?.farmId as number} />
          </InnerPanel>
        )}
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
