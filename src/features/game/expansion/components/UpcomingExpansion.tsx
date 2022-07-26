import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";

import { GameState } from "features/game/types/game";
import expandIcon from "assets/icons/expand.png";

import { EXPANSION_ORIGINS } from "../lib/constants";
import { UpcomingExpansionModal } from "./UpcomingExpansionModal";
import { MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Pontoon } from "./Pontoon";

import { Context } from "features/game/GameProvider";

interface Props {
  gameState: GameState;
}

/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC<Props> = ({ gameState }) => {
  const { gameService } = useContext(Context);

  const [showBumpkinModal, setShowBumpkinModal] = useState(false);

  const noExpansionAvailable = gameState.expansionRequirements === undefined;

  if (noExpansionAvailable) {
    return <></>;
  }

  const latestLand = gameState.expansions[gameState.expansions.length - 1];

  // Land is still being built
  if (latestLand.readyAt > Date.now()) {
    const origin = EXPANSION_ORIGINS[gameState.expansions.length];
    return (
      <MapPlacement x={origin.x} y={origin.y} height={6} width={6}>
        <Pontoon expansion={latestLand} />
      </MapPlacement>
    );
  }

  const onExpand = async () => {
    gameService.send("EXPAND");
    setShowBumpkinModal(false);
  };

  const nextPosition = EXPANSION_ORIGINS[gameState.expansions.length + 1];

  return (
    <>
      <MapPlacement x={nextPosition.x} y={nextPosition.y} height={6} width={6}>
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100"
          onClick={() => setShowBumpkinModal(true)}
        >
          <img
            src={expandIcon}
            width={18 * PIXEL_SCALE}
            className="relative top-4"
          />
        </div>
      </MapPlacement>
      <Modal show={showBumpkinModal} centered>
        <Panel>
          <UpcomingExpansionModal
            gameState={gameState}
            onClose={() => setShowBumpkinModal(false)}
            onExpand={onExpand}
          />
        </Panel>
      </Modal>
    </>
  );
};
