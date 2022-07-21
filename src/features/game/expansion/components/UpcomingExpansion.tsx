import { Panel } from "components/ui/Panel";
import { GameState } from "features/game/types/game";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { EXPANSION_ORIGINS } from "../lib/constants";
import { UpcomingExpansionModal } from "./UpcomingExpansionModal";
import { MapPlacement } from "./MapPlacement";

interface Props {
  gameState: GameState;
}

/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC<Props> = ({ gameState }) => {
  const [showModal, setShowModal] = useState(false);
  const nextLevel = gameState.level + 1;

  const origin = EXPANSION_ORIGINS[nextLevel];

  return (
    <>
      <MapPlacement x={origin.x} y={origin.y} height={6} width={6}>
        <div
          className="absolute inset-0 bg-slate-100 opacity-20 hover:opacity-60 cursor-pointer"
          onClick={() => {
            setShowModal(true);
          }}
        />
      </MapPlacement>
      <Modal show={showModal} centered>
        <Panel>
          <UpcomingExpansionModal
            gameState={gameState}
            onClose={() => setShowModal(false)}
          />
        </Panel>
      </Modal>
    </>
  );
};
