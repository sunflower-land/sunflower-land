import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import { Inbox } from "./components/Inbox";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Message } from "./types/message";
import {
  cleanupCache,
  getInbox,
  getReadMessages,
  updateCache,
} from "./lib/mail";

import mailbox from "assets/decorations/mailbox.png";
import alerted from "assets/icons/expression_alerted.png";
import classNames from "classnames";

export const LetterBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inbox, setInbox] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  const getMessages = async () => {
    setIsLoading(true);

    const readMessages = getReadMessages();

    let _inbox: any = await getInbox();

    _inbox = _inbox.map((msg: Message) => ({
      ...msg,
      unread: !readMessages?.includes(msg.id),
    }));

    setInbox(_inbox);
    cleanupCache(_inbox);
    setIsLoading(false);
  };

  const onRead = (index: number) => {
    if (!inbox[index].unread) return;

    const newInbox = [...inbox];

    newInbox[index].unread = false;
    setInbox(newInbox);

    updateCache(newInbox[index].id);
  };

  useEffect(() => {
    getMessages();
  }, []);

  // refresh data
  useEffect(() => {
    if (isOpen) {
      getMessages();
    }
  }, [isOpen]);

  useEffect(() => {
    const _hasUnread = inbox.some((msg) => msg.unread);

    setHasUnread(_hasUnread);
  }, [inbox]);

  return (
    <div
      className="absolute"
      id="letterbox"
      style={{
        top: `${PIXEL_SCALE * -1}px`,
        right: `${PIXEL_SCALE * 1}px`,
        width: `${GRID_WIDTH_PX}px`,
      }}
    >
      <img
        src={alerted}
        className="w-3 absolute  animate-float"
        style={{
          width: `${PIXEL_SCALE * 3}px`,
          top: `${PIXEL_SCALE * -12}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
      />
      <img
        src={mailbox}
        className={classNames(
          "absolute cursor-pointer hover:img-highlight left-0 right-0",
          {
            "img-highlight-heavy": hasUnread,
          }
        )}
        style={{
          width: `${PIXEL_SCALE * 8}px`,
        }}
        onClick={() => setIsOpen(true)}
      />

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Inbox inbox={inbox} isLoading={isLoading} onRead={onRead} />
      </Modal>
    </div>
  );
};
