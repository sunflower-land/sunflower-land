import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import blacksmith from "assets/buildings/blacksmith_building.gif";
import hammer from "assets/icons/hammer.png";

import { Crafting } from "./components/Crafting";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { blacksmithAudio } from "lib/utils/sfx";

export const GoblinBlacksmith: React.FC = () => {
  // const { gameService } = useContext(Context);
  // const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const openBlacksmith = () => {
    setIsOpen(true);
    blacksmithAudio.play();
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 6}px`,
        right: `${GRID_WIDTH_PX * 15}px`,
        top: `${GRID_WIDTH_PX * 25}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={blacksmith}
          alt="market"
          onClick={openBlacksmith}
          className="w-full"
        />
        <Action
          className="absolute -bottom-8 left-1"
          text="Craft"
          icon={hammer}
          onClick={openBlacksmith}
        />
      </div>

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Crafting onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
