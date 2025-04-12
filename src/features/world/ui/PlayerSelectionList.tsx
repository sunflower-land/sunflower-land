import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";

import { playerModalManager, PlayerModalPlayer } from "./player/PlayerModals";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { ButtonPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getBumpkinLevel } from "features/game/lib/level";
import giftIcon from "assets/icons/gift.png";
import { SquareIcon } from "components/ui/SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";

class PlayerSelectionListManager {
  private listener?: (players: PlayerModalPlayer[]) => void;

  public open(players: PlayerModalPlayer[]) {
    if (this.listener) {
      this.listener(players);
    }
  }

  public listen(cb: (players: PlayerModalPlayer[]) => void) {
    this.listener = cb;
  }
}

export const playerSelectionListManager = new PlayerSelectionListManager();

export const PlayerSelectionList: React.FC = () => {
  const { t } = useAppTranslation();

  const [players, setPlayers] = useState<PlayerModalPlayer[]>([]);

  useEffect(() => {
    playerSelectionListManager.listen((players) => {
      setPlayers(players);
    });
  }, []);

  const closeModal = () => {
    setPlayers([]);
  };

  const openPlayerModal = (player: PlayerModalPlayer) => {
    playerModalManager.open(player);
  };

  const playersSortedBySpecialWearables = players.sort((a, b) => {
    // Sort Streamer Hat first
    if (
      a.clothing.hat === "Streamer Hat" &&
      b.clothing.hat !== "Streamer Hat"
    ) {
      return -1;
    }
    if (
      b.clothing.hat === "Streamer Hat" &&
      a.clothing.hat !== "Streamer Hat"
    ) {
      return 1;
    }

    // Then sort Gift Giver
    if (
      a.clothing.shirt === "Gift Giver" &&
      b.clothing.shirt !== "Gift Giver"
    ) {
      return -1;
    }
    if (
      b.clothing.shirt === "Gift Giver" &&
      a.clothing.shirt !== "Gift Giver"
    ) {
      return 1;
    }

    return 0;
  });

  return (
    <Modal show={!!players.length} onHide={closeModal}>
      <CloseButtonPanel title={t("select.player")} onClose={closeModal}>
        <div className="overflow-y-auto max-h-[70vh] scrollable">
          {playersSortedBySpecialWearables.map((player) => (
            <ButtonPanel
              key={player.id}
              className="flex flex-row items-center gap-1 mx-1 text-xs"
              onClick={() => openPlayerModal(player)}
            >
              <NPCIcon parts={player.clothing} />
              {player.clothing.shirt === "Gift Giver" &&
                player.clothing.hat !== "Streamer Hat" && (
                  <SquareIcon
                    className="absolute -top-1 left-3.5"
                    icon={giftIcon}
                    width={7}
                  />
                )}
              {player.clothing.hat === "Streamer Hat" && (
                <SquareIcon
                  className="absolute -top-1 left-3.5"
                  icon={ITEM_DETAILS["Love Charm"].image}
                  width={7}
                />
              )}
              <div className="flex flex-col ml-1">
                {player.username && <div>{player.username}</div>}
                <div>{`#${player.id}`}</div>
              </div>
              <div className="flex-grow" />
              <div className="text-center">
                {t("level.number", {
                  level: getBumpkinLevel(player.experience),
                })}
              </div>
            </ButtonPanel>
          ))}
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
