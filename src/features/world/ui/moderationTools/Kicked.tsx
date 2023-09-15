import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import { ModerationEvent } from "features/world/Phaser";

export const Kicked: React.FC<{ event: ModerationEvent }> = ({ event }) => {
  return (
    <Modal show={true} centered backdrop="static" keyboard={false}>
      <Panel>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold">You have been kicked!</h1>
          </div>
          <div className="flex justify-center">
            <p className="text-xl">Reason: {event.reason}</p>
          </div>
          <div className="flex justify-center">
            <p className="text-xxs">
              Please note that you can rejoin, but if you continue to break the
              rules we will take further action.
            </p>
          </div>
          <div className="flex justify-center">
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Accept
            </Button>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
