import React, { } from "react";
import { Modal } from "react-bootstrap";

import { Inbox } from "./components/Inbox";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

/**
 * TODO:
 *  replace Action with Mailbox Image only
 */
export const Mailbox: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 2.5}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * -12}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 15}px)`,
      }}
    >
      <Action
        className="absolute -bottom-8 left-0"
        text="Mail"
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Inbox />
      </Modal>
    </div>
  );
};
