import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import levelIcon from "assets/icons/level_up.png";

import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { BumpkinLevel } from "features/bumpkins/components/BumpkinModal";
import { SUNNYSIDE } from "assets/sunnyside";
import { PlayerTrade } from "./PlayerTrade";

type Player = {
  id: number;
  clothing: BumpkinParts;
  experience: number;
};

class PlayerModalManager {
  private listener?: (player: Player) => void;

  public open(player: Player) {
    if (this.listener) {
      this.listener(player);
    }
  }

  public listen(cb: (player: Player) => void) {
    this.listener = cb;
  }
}

export const playerModalManager = new PlayerModalManager();

export const PlayerModals: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    playerModalManager.listen((npc) => {
      setTab(0);
      setPlayer(npc);
    });
  }, []);

  const closeModal = () => {
    setPlayer(undefined);
  };

  return (
    <>
      <Modal
        // dialogClassName="npc-dialog"
        show={!!player}
        centered
        onHide={closeModal}
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
            {
              icon: SUNNYSIDE.icons.heart,
              name: "Trades",
            },
          ]}
        >
          {tab === 0 && (
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
                    Level {getBumpkinLevel(player?.experience ?? 0)}
                  </p>
                  {/* Progress bar */}
                  <BumpkinLevel experience={player?.experience} />
                </div>
              </div>
            </>
          )}
          {tab === 1 && (
            <PlayerTrade onClose={closeModal} farmId={player?.id as number} />
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
