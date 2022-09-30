import React from "react";
import { Modal } from "react-bootstrap";

import bank from "assets/buildings/goblin_bank.gif";
import token from "assets/icons/token_2.png";

import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { BankModal } from "./components/BankModal";
import { bankAudio } from "lib/utils/sfx";

export const Bank: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBank = () => {
    setIsOpen(true);
    //Checks if bankAudio is playing, if false, plays the sound
    if (!bankAudio.playing()) {
      bankAudio.play();
    }
  };

  return (
    <div
      className="z-10 absolute"
      style={{
        width: `${GRID_WIDTH_PX * 3.4}px`,
        right: `${GRID_WIDTH_PX * 19}px`,
        top: `${GRID_WIDTH_PX * 6.4}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img src={bank} alt="bank" onClick={openBank} className="w-full" />
        <Action
          className="absolute -bottom-6 left-5"
          text="Bank"
          icon={token}
          onClick={openBank}
        />
      </div>

      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
        <BankModal onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
