import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GameProvider";

import chicken from "assets/resources/chicken.png";
import { barnAudio } from "lib/utils/sfx";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { BarnSale } from "./BarnSale";
import classNames from "classnames";

export const Barn: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const openBarn = () => {
    setIsOpen(true);
    barnAudio.play();
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        left: `${-GRID_WIDTH_PX * 1}px`,
        top: `${-GRID_WIDTH_PX * 2}px`,
      }}
    >
      <div
        className={classNames({
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      >
        {isNotReadOnly && (
          <Action
            className="absolute top-5 left-4"
            text="Barn"
            icon={chicken}
            onClick={openBarn}
          />
        )}
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <BarnSale onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
