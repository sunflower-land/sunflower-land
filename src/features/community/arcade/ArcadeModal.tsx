import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { GreedyGoblin } from "features/community/arcade/games/GreedyGoblin";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import close from "assets/icons/close.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

enum GAMES {
  GREEDY_GOBLIN = "Greedy Goblin",
}

export const ArcadeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentGame, setCurrentGame] = useState<GAMES | null>(null);

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel>
        <div className="flex flex-col items-center mt-1 mb-1">
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <h1 className="my-2">{currentGame || "Mini SFL Games"}</h1>
        </div>
        {/* Menu */}
        {currentGame === null && (
          <ul className="list-none">
            <li className="p-1">
              <Button
                className="text-sm"
                onClick={() => setCurrentGame(GAMES.GREEDY_GOBLIN)}
              >
                {GAMES.GREEDY_GOBLIN}
              </Button>
            </li>
          </ul>
        )}

        {currentGame === GAMES.GREEDY_GOBLIN && <GreedyGoblin />}
      </Panel>
    </Modal>
  );
};
