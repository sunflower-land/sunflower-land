import { Panel } from "components/ui/Panel";
import { GameState } from "features/game/types/game";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { LAND_ORIGINS } from "../lib/constants";
import { LandExtensionModal } from "./LandExtensionModal";
import { MapPlacement } from "./MapPlacement";

interface Props {
  gameState: GameState;
}

/**
 * The next piece of land to expand into
 */
export const LandExtension: React.FC<Props> = ({ gameState }) => {
  const [showModal, setShowModal] = useState(true);
  const nextLevel = gameState.level + 1;

  const origin = LAND_ORIGINS[nextLevel];

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
          <LandExtensionModal
            gameState={gameState}
            onClose={() => setShowModal(false)}
          />
        </Panel>
      </Modal>
    </>
  );
};
