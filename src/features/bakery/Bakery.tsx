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
import kitchenMP3 from "../../assets/sound-effects/kitchen.mp3";

export const Bakery: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  const open = () => {
    const kitchenAudio = new Audio(kitchenMP3);
    kitchenAudio.volume = 0.2;

    setIsOpen(true);
    kitchenAudio.play();
  };
  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        right: `${GRID_WIDTH_PX * 7}px`,
        top: `${GRID_WIDTH_PX * 1}px`,
      }}
    >
      <img
        src={bakery}
        alt="bakery"
        onClick={isNotReadOnly ? () => open() : undefined}
        className={classNames("w-full", {
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      />
      <img
        src={smoke}
        onClick={isNotReadOnly ? () => open() : undefined}
        style={{
          position: "absolute",
          top: `-${GRID_WIDTH_PX * 2.2}px`,
          left: `${GRID_WIDTH_PX * 0.5}px`,
          width: `${GRID_WIDTH_PX * 1}px`,
        }}
      />
      {isNotReadOnly && (
        <Action
          className="absolute bottom-14 left-0"
          text="Kitchen"
          icon={soup}
          onClick={() => open()}
        />
      )}
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Crafting onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
