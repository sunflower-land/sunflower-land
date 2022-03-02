import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import { Inbox } from "./components/Inbox";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Message } from "./types/message";

import baldMan from "assets/npcs/bald_man.png";
import alerted from "assets/icons/expression_alerted.png";

const MESSAGES_KEY = "readMessages";

/**
 * MVP1:
 *  - always change id to reflect unread
 * TODO:
 * - api call (separate file)
 */
const getInbox = () => {
  return [
    {
      id: "2022-02-28-1",
      title: "Announcements!",
      body: "This feature is Work in Progress. Stay tuned and head over to our Discord: https://discord.gg/sunflowerland",
    },
    {
      id: "2022-02-28-2",
      title: "Greetings!",
      body: "*You made it! **Good** job :D*",
    },
    {
      id: "2022-02-28-3",
      title: "",
      body: `*Long text ahead for testing*. **Long text** ahead for testing. ~~Long text ahead for testing.~~ 
        Long text ahead for testing. Long text ahead for testing. Long text ahead for testing. 
        Long text ahead for testing. Long text ahead for testing.
        [Inline link](https://discord.gg/sunflowerland)`,
    },
  ];
};

export const Mail: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inbox, setInbox] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  useEffect(() => {
    const readMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
    const _inbox = getInbox().map((msg) => ({
      ...msg,
      unread: !readMessages?.includes(msg.id),
    }));

    setInbox(_inbox);

    // exclude non existing ids
    const newReadMessages = _inbox
      .filter((msg) => !msg.unread)
      .map((msg) => msg.id);

    if (newReadMessages.length) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(newReadMessages));
    } else {
      localStorage.removeItem(MESSAGES_KEY);
    }
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

    const readMessages = localStorage.getItem(MESSAGES_KEY);
    const newReadMessages = [
      ...JSON.parse(readMessages || "[]"),
      newInbox[index].id,
    ];

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(newReadMessages));
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
        className="absolute w-10 hover:cursor-pointer hover:img-highlight"
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Inbox inbox={inbox} onRead={onRead} />
      </Modal>
    </div>
  );
};
