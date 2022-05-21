import React from "react";
import { Modal } from "react-bootstrap";

import bakery from "assets/buildings/bakery_building.png";
import smoke from "assets/buildings/bakery_smoke.gif";
import soup from "assets/icons/goblin_head.png";

import { Crafting } from "./components/Crafting";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { bakeryAudio } from "lib/utils/sfx";

export const Bakery: React.FC = () => {
  const [isBakeryModalOpen, showBakeryModal] = React.useState(false);

  const openBakeryModal = () => {
    showBakeryModal(true);
    //Checks if bakeryAudio is playing, if false, plays the sound
    if (!bakeryAudio.playing()) {
      bakeryAudio.play();
    }
  };

  const closeBakeryModal = () => {
    showBakeryModal(false);
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        right: `${GRID_WIDTH_PX * 16}px`,
        top: `${GRID_WIDTH_PX * 1}px`,
      }}
    >
      <img
        src={smoke}
        onClick={openBakeryModal}
        className="z-10"
        style={{
          position: "absolute",
          top: `-${GRID_WIDTH_PX * 2.2}px`,
          left: `${GRID_WIDTH_PX * 0.5}px`,
          width: `${GRID_WIDTH_PX * 1}px`,
        }}
      />
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={bakery}
          alt="bakery"
          onClick={openBakeryModal}
          className="w-full"
        />
        <Action
          className="absolute bottom-14 left-0"
          text="Kitchen"
          icon={soup}
          onClick={openBakeryModal}
        />
      </div>
      <Modal centered show={isBakeryModalOpen} onHide={closeBakeryModal}>
        <Crafting onClose={closeBakeryModal} />
      </Modal>
    </div>
  );
};
