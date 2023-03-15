import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { GameState } from "features/game/types/game";

import { EXPANSION_ORIGINS, LAND_SIZE } from "../lib/constants";
import { UpcomingExpansionModal } from "./UpcomingExpansionModal";
import { MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Pontoon } from "./Pontoon";

import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  gameState: GameState;
}

/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC<Props> = ({ gameState }) => {
  const { gameService } = useContext(Context);

  const [showBumpkinModal, setShowBumpkinModal] = useState(false);

  const latestLand = gameState.expansions[gameState.expansions.length - 1];

  // Land is still being built
  if (latestLand.readyAt > Date.now()) {
    const origin = EXPANSION_ORIGINS[gameState.expansions.length - 1];

    return (
      <MapPlacement
        x={origin.x - LAND_SIZE / 2}
        y={origin.y + LAND_SIZE / 2}
        height={LAND_SIZE}
        width={LAND_SIZE}
      >
        <Pontoon expansion={latestLand} />
      </MapPlacement>
    );
  }

  const onExpand = () => {
    gameService.send("land.expanded");
    gameService.send("SAVE");
    setShowBumpkinModal(false);
  };

  const nextPosition = EXPANSION_ORIGINS[gameState.expansions.length];

  return (
    <>
      <MapPlacement
        x={nextPosition.x - LAND_SIZE / 2}
        y={nextPosition.y + LAND_SIZE / 2}
        height={LAND_SIZE}
        width={LAND_SIZE}
      >
        <div className="w-full h-full flex items-center justify-center opacity-90 hover:opacity-100">
          <img
            src={SUNNYSIDE.icons.expand}
            width={18 * PIXEL_SCALE}
            className="relative cursor-pointer hover:img-highlight"
            onClick={() => setShowBumpkinModal(true)}
          />
        </div>
      </MapPlacement>
      <Modal
        show={showBumpkinModal}
        onHide={() => setShowBumpkinModal(false)}
        centered
      >
        <CloseButtonPanel
          bumpkinParts={gameState.bumpkin?.equipped}
          title="Expand your land"
          onClose={() => setShowBumpkinModal(false)}
        >
          <UpcomingExpansionModal
            gameState={gameState}
            onClose={() => setShowBumpkinModal(false)}
            onExpand={onExpand}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
