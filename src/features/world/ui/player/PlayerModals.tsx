import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import levelIcon from "assets/icons/level_up.png";
import giftIcon from "assets/icons/gift.png";
import blossom_bonding from "assets/icons/skill_icons/Bonding.png";

import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { BumpkinLevel } from "features/bumpkins/components/BumpkinModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { FactionName, GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { LABEL_STYLES } from "components/ui/Label";
import { AirdropPlayer } from "features/island/hud/components/settings-menu/general-settings/AirdropPlayer";
import { hasFeatureAccess } from "lib/flags";
import { ReportPlayer } from "./ReportPlayer";
import { PlayerGift } from "./PlayerGift";
import { StreamReward } from "./StreamReward";
import { ITEM_DETAILS } from "features/game/types/images";
import { PlayerDetails } from "features/social/PlayerModal";
import { OuterPanel } from "components/ui/Panel";

export type PlayerModalPlayer = {
  id: number;
  username?: string;
  clothing: BumpkinParts;
  experience: number;
  isVip: boolean;
  faction: FactionName;
  createdAt: number;
};

class PlayerModalManager {
  private listener?: (player: PlayerModalPlayer) => void;

  public open(player: PlayerModalPlayer) {
    if (this.listener) {
      this.listener(player);
    }
  }

  public listen(cb: (player: PlayerModalPlayer) => void) {
    this.listener = cb;
  }
}

export const playerModalManager = new PlayerModalManager();

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
    <>
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
            copyToClipboard(player?.id as unknown as string);
          }}
        >
          {player?.username && (
            <p className="text-xs mb-1">{player?.username}</p>
          )}
          <p className="text-xs">{`#${player?.id}`}</p>
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
    </>
  );
};

interface Props {
  game: GameState;
  farmId: number;
}

export const PlayerModals: React.FC<Props> = ({ game, farmId }) => {
  const [tab, setTab] = useState<
    "Player" | "Reward" | "Stream" | "Report" | "Airdrop"
  >("Player");
  const [player, setPlayer] = useState<PlayerModalPlayer | undefined>({
    id: 1456789,
    clothing: {
      hair: "Sun Spots",
      shirt: "Red Farmer Shirt",
      pants: "Farmer Overalls",
      background: "Seashore Background",
    },
    experience: 100,
    username: "Test Player",
    isVip: true,
    faction: "goblins",
    createdAt: new Date("2027-06-01").getTime(),
  });

  useEffect(() => {
    playerModalManager.listen((npc) => {
      setPlayer(npc);
      // Automatically set to Stream tab if player has Streamer Hat and is not current player
      if (npc.clothing?.hat === "Streamer Hat" && farmId !== npc.id) {
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
      if (playerId === player.id) {
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

  const closeModal = () => setPlayer(undefined);

  const playerHasGift = player?.clothing.shirt === "Gift Giver";
  const playerHasStreamReward = player?.clothing.hat === "Streamer Hat";
  const notCurrentPlayer = farmId !== player?.id;

  return (
    <Modal show={!!player} onHide={closeModal} size="lg">
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
        {tab === "Player" && (
          <PlayerDetails player={player as PlayerModalPlayer} />
        )}
        {tab === "Reward" && <PlayerGift />}
        {tab === "Stream" && <StreamReward streamerId={player?.id as number} />}
        {tab === "Report" && <ReportPlayer id={player?.id as number} />}
        {tab === "Airdrop" && (
          <AirdropPlayer
            id={player?.id as number}
            // Noops
            onClose={alert}
            onSubMenuClick={alert}
          />
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
