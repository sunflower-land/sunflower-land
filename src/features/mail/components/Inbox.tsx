import React, { } from "react";
import { Accordion } from "react-bootstrap";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Message } from "../types/message";

import alerted from "assets/icons/expression_alerted.png";

interface Props {
  inbox: Message[],
  onRead: (index: number) => void;
}

/**
 * TODO
 * - markdown message body?
 */
export const Inbox: React.FC<Props> = ({ inbox, onRead }) => {
  return (
    <OuterPanel className="relative">
      {inbox.length
        ? <Accordion>
            {inbox.map(({ title, body, unread }, index) => 
              <Accordion.Item key={index} eventKey={index.toString()} className="flex-grow-1 bg-transparent" as={OuterPanel}>
                <Accordion.Button onClick={() => onRead(index)} className="p-2 text-white text-shadow bg-transparent">
                  {unread 
                    && <img
                        src={alerted}
                        className="w-3 mx-3"
                      />}
                  <span>{title || `${body.slice(0, 10)}...`}</span>
                </Accordion.Button>
                <Accordion.Body className="text-sm mt-2 text-shadow text-break" as={InnerPanel}>
                  {body}
                </Accordion.Body>
              </Accordion.Item>
            )}
          </Accordion>
        : <span>No messages</span>
      }
    </OuterPanel>
  );
};
