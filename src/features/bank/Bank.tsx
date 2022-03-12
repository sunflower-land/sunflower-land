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
import bankMp3 from "../../assets/sound-effects/bank.mp3";

export const Bank: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const open = () => {
    const bankAudio = new Audio(bankMp3);
    bankAudio.volume = 0.3;

    setIsOpen(true);
    bankAudio.play();
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 2.7}px`,
        right: `${GRID_WIDTH_PX * 3.8}px`,
        top: `${GRID_WIDTH_PX * 4.65}px`,
      }}
    >
      <img
        src={bank}
        alt="bank"
        onClick={isNotReadOnly ? open : undefined}
        className={classNames("w-full", {
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      />
      {isNotReadOnly && (
        <Action
          className="absolute -bottom-6 left-2"
          text="Bank"
          icon={token}
          onClick={open}
        />
      )}
      <Modal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        centered
        dialogClassName="w-full sm:w-2/3 max-w-6xl"
      >
        <BankModal onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
