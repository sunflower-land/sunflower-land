import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import wishingWell from "assets/buildings/wishing_well.png";
import icon from "assets/brand/icon.png";

import { WishingWellModal } from "./components/WishingWellModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { wishingWellAudio } from "lib/utils/sfx";

export const WishingWell: React.FC = () => {
  // const { gameService } = useContext(Context);
  // const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  // const isNotReadOnly = !gameState.matches("readonly");

  const openWell = () => {
    wishingWellAudio.play();
    setIsOpen(true);
  };
  return (
    <div
      className="absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 2}px`,
        right: `${GRID_WIDTH_PX * 15}px`,
        top: `${GRID_WIDTH_PX * 36}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={wishingWell}
          alt="market"
          onClick={openWell}
          className="w-full"
        />
        {
          <Action
            className="absolute -bottom-6 -left-3"
            text="Wish"
            icon={icon}
            onClick={openWell}
          />
        }
      </div>

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <WishingWellModal
          key={isOpen ? "1" : "0"}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};
