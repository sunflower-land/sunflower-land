import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GameProvider";

import barn from "assets/buildings/barn.png";
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
        width: `${GRID_WIDTH_PX * 5.5}px`,
        left: `${-GRID_WIDTH_PX * 2.25}px`,
        top: `${-GRID_WIDTH_PX * 5}px`,
      }}
    >
      <div
        className={classNames({
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      >
        <img src={barn} alt="barn" onClick={openBarn} className="w-full" />
        {isNotReadOnly && (
          <Action
            className="absolute bottom-12 left-16"
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
