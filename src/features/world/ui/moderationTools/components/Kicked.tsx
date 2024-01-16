import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import { ModerationEvent } from "features/world/Phaser";
import { translate } from "lib/i18n/translate";

export const Kicked: React.FC<{
  event?: ModerationEvent;
  onClose: () => void;
}> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <Modal show={true} centered backdrop="static" keyboard={false}>
      <Panel>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center text-center">
            <h1 className="text-lg font-bold">{translate("kicked.kicked")} </h1>
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="text-sm">{translate("kicked.Reason")}</p>
            <p className="text-sm">{event.reason}</p>
          </div>
          <div className="flex justify-center text-center">
            <p className="text-xxs">
              {translate("kicked.Message")}
            </p>
          </div>
          <div className="flex justify-center">
            <Button className="mt-1" onClick={onClose}>
              {translate("kicked.accept")}
            </Button>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
