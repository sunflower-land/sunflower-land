import React, { useContext } from "react";
import { Accordion } from "react-bootstrap";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Context } from "../MailProvider";

interface Props {
}

/**
 * TODO
 * - markdown message body?
 */
export const Inbox: React.FC<Props> = () => {
  const { inbox, setRead } = useContext(Context);

  const readMessage = (index: number) => {
    if (!inbox[index].unread) return;

    setRead(index);
  }

  return (
    <OuterPanel className="relative">
      {inbox.length
        ? <Accordion>
            {inbox.map(({ title, body, unread }, index) => 
              <Accordion.Item key={index} eventKey={index.toString()} className="flex-grow-1 bg-transparent" as={OuterPanel}>
                <Accordion.Button onClick={() => readMessage(index)} className="p-2 text-white text-shadow bg-transparent">
                  {unread && <span className="text-red-500">!-</span>}
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
