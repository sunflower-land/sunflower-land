import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import { Inbox } from "./components/Inbox";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Message } from "./types/message";
import {
  cleanupCache,
  getInbox,
  getReadMessages,
  updateCache,
} from "./lib/mail";

import baldMan from "assets/npcs/bald_man.png";
import alerted from "assets/icons/expression_alerted.png";

export const Mail: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inbox, setInbox] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  useEffect(() => {
    const readMessages = getReadMessages();

    const initialize = async () => {
      let _inbox: any = await getInbox();

      _inbox = _inbox.map((msg: Message) => ({
        ...msg,
        unread: !readMessages?.includes(msg.id),
      }));

      setInbox(_inbox);
      cleanupCache(_inbox);
    };

    initialize();
  }, []);

  useEffect(() => {
    const _hasUnread = inbox.some((msg) => msg.unread);

    setHasUnread(_hasUnread);
  }, [inbox]);

  const onRead = (index: number) => {
    if (!inbox[index].unread) return;

    const newInbox = [...inbox];

    newInbox[index].unread = false;
    setInbox(newInbox);

    updateCache(newInbox[index].id);
  };

  return (
    <div
      className="z-5 absolute align-items-center w-10"
      style={{
        left: `${GRID_WIDTH_PX * 10.5}px`,
        top: `${GRID_WIDTH_PX * 3.5}px`,
      }}
    >
      {hasUnread && (
        <img src={alerted} className="w-3 mx-3 pb-2 animate-float" />
      )}
      <img
        src={baldMan}
        className="absolute w-10 z-10 hover:cursor-pointer hover:img-highlight npc-shadow"
        onClick={() => setIsOpen(true)}
      />
      <span className="npc-shadow" />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Inbox inbox={inbox} onRead={onRead} />
      </Modal>
    </div>
  );
};
