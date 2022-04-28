import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import bakery from "assets/buildings/bakery_building.png";
import smoke from "assets/buildings/bakery_smoke.gif";
import soup from "assets/icons/goblin_head.png";

import { Crafting } from "./components/Crafting";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { bakeryAudio } from "lib/utils/sfx";

export const Bakery: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isBakeryModalOpen, showBakeryModal] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const openBakeryModal = () => {
    showBakeryModal(true);
    bakeryAudio.play();
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
        onClick={isNotReadOnly ? openBakeryModal : undefined}
        className="z-10"
        style={{
          position: "absolute",
          top: `-${GRID_WIDTH_PX * 2.2}px`,
          left: `${GRID_WIDTH_PX * 0.5}px`,
          width: `${GRID_WIDTH_PX * 1}px`,
        }}
      />
      <div
        className={classNames({
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      >
        <img
          src={bakery}
          alt="bakery"
          onClick={isNotReadOnly ? openBakeryModal : undefined}
          className="w-full"
        />
        {isNotReadOnly && (
          <Action
            className="absolute bottom-14 left-0"
            text="Kitchen"
            icon={soup}
            onClick={openBakeryModal}
          />
        )}
      </div>
      <Modal centered show={isBakeryModalOpen} onHide={closeBakeryModal}>
        <Crafting onClose={closeBakeryModal} />
      </Modal>
    </div>
  );
};
