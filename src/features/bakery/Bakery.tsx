import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import bakery from "assets/buildings/bakery.gif";
import soup from "assets/nfts/roasted_cauliflower.png";

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
        alt="market"
        onClick={isNotReadOnly ? () => setIsOpen(true) : undefined}
        className={classNames("w-full", {
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
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
