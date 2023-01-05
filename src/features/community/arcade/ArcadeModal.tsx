import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { GreedyGoblin } from "features/community/arcade/games/GreedyGoblin";
import { ChickenFight } from "features/community/arcade/games/ChickenFight";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import close from "assets/icons/close.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ArcadeDonation } from "./ArcadeDonation";
import { ARCADE_GAMES } from "../lib/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArcadeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

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
          <h1 className="my-2">{activeWindow || "Mini SFL Games"}</h1>
        </div>
        {/* Menu */}
        {activeWindow === null && (
          <ul className="list-none">
            <li className="p-1">
              <Button
                className="text-sm"
                onClick={() =>
                  setActiveWindow(ARCADE_GAMES.GREEDY_GOBLIN.title)
                }
              >
                {ARCADE_GAMES.GREEDY_GOBLIN.title}
              </Button>
            </li>
            <li className="p-1">
              <Button
                className="text-sm"
                onClick={() =>
                  setActiveWindow(ARCADE_GAMES.CHICKEN_FIGHT.title)
                }
              >
                {ARCADE_GAMES.CHICKEN_FIGHT.title}
              </Button>
            </li>
            <li className="p-1 pb-2 flex justify-content-center">
              <span
                className="underline cursor-pointer"
                onClick={() => setActiveWindow("Donation")}
              >
                Donate
              </span>
            </li>
          </ul>
        )}

        {activeWindow === ARCADE_GAMES.GREEDY_GOBLIN.title && <GreedyGoblin />}
        {activeWindow === ARCADE_GAMES.CHICKEN_FIGHT.title && <ChickenFight />}
        {activeWindow === "Donation" && <ArcadeDonation />}
      </Panel>
    </Modal>
  );
};
