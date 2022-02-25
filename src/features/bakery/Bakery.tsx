import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import bakery from "assets/buildings/bakery.gif";
import smoke from "assets/buildings/bakery_smoke.gif";
import soup from "assets/nfts/roasted_cauliflower.png";
import goblinJump from "assets/npcs/goblin_jump.gif";
import heart from "assets/icons/heart.png";

import { Crafting } from "./components/Crafting";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Bakery: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 4}px`,
        height: `${GRID_WIDTH_PX * 3.5}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * -11.8}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 17}px)`,
      }}
    >
      <img
        src={bakery}
        alt="bakery"
        onClick={isNotReadOnly ? () => setIsOpen(true) : undefined}
        className={classNames("w-full", {
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
      />
      <img
        src={smoke}
        onClick={isNotReadOnly ? () => setIsOpen(true) : undefined}
        style={{
          position: "absolute",
          bottom: `${GRID_WIDTH_PX * 0.35}px`,
          left: `${GRID_WIDTH_PX * 0.85}px`,
          width: `${GRID_WIDTH_PX * 0.5}px`,
        }}
      />
      <img
        src={heart}
        className="absolute z-10 animate-float"
        style={{
          width: `${GRID_WIDTH_PX * 0.3}px`,
          right: `${GRID_WIDTH_PX * -0.55}px`,
          bottom: `${GRID_WIDTH_PX * 1.75}px`,
        }}
      />
      <img
        src={goblinJump}
        onClick={isNotReadOnly ? () => setIsOpen(true) : undefined}
        style={{
          position: "absolute",
          bottom: `${GRID_WIDTH_PX * -0.35}px`,
          right: `${GRID_WIDTH_PX * -2.4}px`,
          width: `${GRID_WIDTH_PX * 8}px`,
          transform: "scaleX(-1)",
        }}
      />
      {isNotReadOnly && (
        <Action
          className="absolute -bottom-10 left-10"
          text="Cook"
          icon={soup}
          onClick={() => setIsOpen(true)}
        />
      )}
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Crafting onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
