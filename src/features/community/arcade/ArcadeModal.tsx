import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { GreedyGoblin } from "features/community/arcade/games/GreedyGoblin";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import close from "assets/icons/close.png";

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
            className="h-6 cursor-pointer mr-2 mb-1 top-3 right-2 absolute"
            onClick={onClose}
          />
          <h1>{currentGame || "Mini SFL Games"}</h1>
        </div>
        {/* Menu */}
        {currentGame === null && (
          <ul className="list-none">
            <li className="p-1">
              <Button
                className="text-xs"
                onClick={() => setCurrentGame(GAMES.GREEDY_GOBLIN)}
              >
                {GAMES.GREEDY_GOBLIN}
              </Button>
            </li>
            <li className="p-1">
              <Button
                className="text-xs"
                onClick={() => setCurrentGame(GAMES.GREEDY_GOBLIN)}
              >
                Dummy
              </Button>
            </li>
          </ul>
        )}

        {currentGame === GAMES.GREEDY_GOBLIN && <GreedyGoblin />}
      </Panel>
    </Modal>
  );
};
