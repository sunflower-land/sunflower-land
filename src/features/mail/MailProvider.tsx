/**
 * A wrapper that provides mail state and dispatches events
 */
import React, { useState, useEffect, useCallback } from "react";

const MESSAGES_KEY = 'readMessages';

type Message = {
  id: string;
  title: string;
  body: string;
  unread: boolean;
}

interface MailContext {
  hasUnread: boolean;
  inbox: Message[];
  setRead: (index: number) => void;
}

export const Context = React.createContext<MailContext>({} as MailContext);

/**
 * TODO
 * - fetch from API
 */
export const MailProvider: React.FC = ({ children }) => {
  const [inbox, setInbox] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  /**
   * Return list of messages
   * MVP1: 
   *  - always change id to reflect unread
   *  - remove useCallback when fetching from API?
   */
  const getInbox = useCallback(() => {
    return [
      {
        id: '1',
        title: 'Announcements!',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      {
        id: '2',
        title: '',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque aliquam ipsum velit, ac mattis est porttitor ac. Etiam in mi consequat sapien fermentum blandit.',
      },
      {
        id: '3',
        title: 'Greetings!',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque aliquam ipsum velit, ac mattis est porttitor ac. Etiam in mi consequat sapien fermentum blandit. https://discord.gg/sunflowerland',
      },
    ];
  }, []);

  const setRead = (index: number) => {
    if (!inbox[index].unread) return;

    const newInbox = [...inbox];

    newInbox[index].unread = false;
    setInbox(newInbox);

    const readMessages = localStorage.getItem(MESSAGES_KEY);
    const newReadMessages = [...JSON.parse(readMessages || '[]'), newInbox[index].id];

    localStorage.setItem(MESSAGES_KEY, JSON.stringify(newReadMessages));
  };

  useEffect(() => {
    const readMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
    const _inbox = getInbox().map((msg) => ({ ...msg, unread: !readMessages?.includes(msg.id) }));

    setInbox(_inbox);

    // exclude non existing ids
    const newReadMessages = _inbox.filter((msg) => !msg.unread).map((msg) => msg.id);

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

  return (
    <Context.Provider value={{ hasUnread, inbox, setRead }}>
      {children}
    </Context.Provider>
  );
};
