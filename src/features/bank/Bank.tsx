import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import bank from "assets/buildings/bank.gif";
import token from "assets/icons/token.gif";

import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { BankModal } from "./components/BankModal";
import { bankAudio } from "lib/utils/sfx";

export const Bank: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const openBank = () => {
    if (isNotReadOnly) {
      setIsOpen(true);
      bankAudio.play();
    } else {
      return;
    }
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 2.7}px`,
        right: `${GRID_WIDTH_PX * 13}px`,
        top: `${GRID_WIDTH_PX * 4.65}px`,
      }}
    >
      <div
        className={classNames({
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      >
        <img src={bank} alt="bank" onClick={openBank} className="w-full" />
        {isNotReadOnly && (
          <Action
            className="absolute -bottom-6 left-2"
            text="Bank"
            icon={token}
            onClick={openBank}
          />
        )}
      </div>

      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
        <BankModal onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
