import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { Panel } from "components/ui/Panel";

import { GameState } from "features/game/types/game";
import pontoon from "assets/land/levels/pontoon.gif";
import expandIcon from "assets/icons/expand.png";

import { EXPANSION_ORIGINS } from "../lib/constants";
import { UpcomingExpansionModal } from "./UpcomingExpansionModal";
import { MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ProgressBar } from "components/ui/ProgressBar";

interface Props {
  gameState: GameState;
}

/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC<Props> = ({ gameState }) => {
  // Dummy state to toggle between empty and building - TODO read this from gamestate
  const [secondsLeft, setSecondsLeft] = useState(30);

  const [showModal, setShowModal] = useState(false);
  const nextLevel = gameState.level + 1;

  const origin = EXPANSION_ORIGINS[nextLevel];

  const expand = () => {
    // TODO - actual expand workflow
    setSecondsLeft(60);
    setShowModal(false);
  };

  return (
    <>
      <MapPlacement x={origin.x} y={origin.y} height={6} width={6}>
        {secondsLeft ? (
          <div
            className="w-max h-full flex items-center justify-center max-w-none"
            onClick={() => setShowModal(true)}
          >
            <img
              src={pontoon}
              width={129 * PIXEL_SCALE}
              style={{
                right: "12%",
              }}
              className="relative"
            />
            <div className="absolute left-0 right-0 bottom-2">
              <ProgressBar seconds={30} percentage={0.5} />
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer opacity-60 hover:opacity-100"
            onClick={() => setShowModal(true)}
          >
            <img
              src={expandIcon}
              width={18 * PIXEL_SCALE}
              className="relative top-4"
            />
          </div>
        )}
      </MapPlacement>
      <Modal show={showModal} centered>
        <Panel>
          <UpcomingExpansionModal
            gameState={gameState}
            onClose={() => setShowModal(false)}
            onExpand={expand}
          />
        </Panel>
      </Modal>
    </>
  );
};
