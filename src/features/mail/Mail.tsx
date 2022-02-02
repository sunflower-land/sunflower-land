import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import { Inbox } from "./components/Inbox";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Context } from "./MailProvider";

import baldMan from "../../assets/npcs/bald_man.png";
import exclamation from "../../assets/icons/expression_alerted.png";

export const Mail: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { hasUnread } = useContext(Context);
  
  return (
    <div
      className="z-10 absolute align-items-center w-10"
      style={{
        left: `calc(50% - ${GRID_WIDTH_PX * -12}px)`,
        // trial and error
        top: `calc(50% - ${GRID_WIDTH_PX * (hasUnread ? 12.7 : 12.05)}px)`,
      }}
    >
      {hasUnread 
        && <img
              src={exclamation}
              className="w-3 mx-3"
            />}
      <img
        src={baldMan}
        className="absolute w-10 hover:cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Inbox />
      </Modal>
    </div>
  );
};
