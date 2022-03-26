import React from "react";
import { Accordion } from "react-bootstrap";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Markdown } from "components/ui/Markdown";
import { Message } from "../types/message";

import alerted from "assets/icons/expression_alerted.png";

interface Props {
  inbox: Message[];
  isLoading: boolean;
  onRead: (index: number) => void;
}

export const Inbox: React.FC<Props> = ({ inbox, isLoading, onRead }) => {
  return (
    <OuterPanel className="relative">
      {isLoading ? (
        <InnerPanel>Loading...</InnerPanel>
      ) : inbox.length ? (
        <Accordion>
          {inbox.map(({ title, body, unread }, index) => (
            <Accordion.Item
              key={index}
              eventKey={index.toString()}
              className="flex-grow-1 bg-transparent"
              as={OuterPanel}
            >
              <Accordion.Button
                onClick={() => onRead(index)}
                className="p-2 text-white text-shadow bg-transparent"
              >
                {unread && <img src={alerted} className="w-3 mx-3" />}
                <Markdown>{title || `${body.slice(0, 10)}...`}</Markdown>
              </Accordion.Button>
              <Accordion.Body
                className="text-sm mt-2 text-shadow text-break"
                as={InnerPanel}
              >
                <Markdown>{body}</Markdown>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <InnerPanel>No messages</InnerPanel>
      )}
    </OuterPanel>
  );
};
