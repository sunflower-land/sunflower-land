import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import classNames from "classnames";
import "./Event.css"
import { Context } from "features/game/GameProvider";

import wizard from "assets/npcs/Radish_wizard_300.gif";
import wizard_hat from "assets/icons/wizard_hat.png";

import { EventModal } from "./components/eventModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

export const Event: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const isNotReadOnly = !gameState.matches("readonly");

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 1.6}px`,
        left: `${GRID_WIDTH_PX * 20.1}px`,//10.4
        top: `${GRID_WIDTH_PX * -8.6}px`,//-3

      }}
    >
      <img
        src={wizard}
        alt="market"
        onClick={isNotReadOnly ? () => setIsOpen(true) : undefined}
        className={classNames("w-full", {
          "cursor-pointer": isNotReadOnly,
          "hover:img-highlight": isNotReadOnly,
        })}
        style={{transform:"scale(2.2)"}}
      />
      {isNotReadOnly && (
        <Action
          className="absolute -bottom-6 -left-3 eventButton"
          text="Event"
          icon={wizard_hat}
          onClick={() => setIsOpen(true)}
 
        />
      )}
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <EventModal
          key={isOpen ? "1" : "0"}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};
