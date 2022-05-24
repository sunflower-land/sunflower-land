import React from "react";
import { Modal } from "react-bootstrap";

import barn from "assets/buildings/barn.png";
import chicken from "assets/resources/chicken.png";
import { barnAudio } from "lib/utils/sfx";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { BarnSale } from "./BarnSale";

export const Barn: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBarn = () => {
    setIsOpen(true);
    //Checks if barnAudio is playing, if false, plays the sound
    if (!barnAudio.playing()) {
      barnAudio.play();
    }
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
      <div className="cursor-pointer hover:img-highlight">
        <img src={barn} alt="barn" onClick={openBarn} className="w-full" />
        <Action
          className="absolute bottom-12 left-16"
          text="Barn"
          icon={chicken}
          onClick={openBarn}
        />
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <BarnSale onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
