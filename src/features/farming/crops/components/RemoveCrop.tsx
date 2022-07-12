import React from "react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import close from "assets/icons/close.png";
import rustyShovel from "assets/tools/rusty_shovel.png";

interface Props {
  showWarning: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const RemoveCrop: React.FC<Props> = ({
  showWarning,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal centered show={showWarning} onHide={onClose}>
      <Panel>
        <div className="flex justify-between">
          <h1 className="text-xl pl-2">Remove Growing Crops?</h1>
          <img src={close} className="h-6 cursor-pointer" onClick={onClose} />
        </div>
        <div className="p-2">
          <div className="flex my-4 justify-center">
            <img src={rustyShovel} style={{ width: "50px" }} />
          </div>
          <p className="text-sm mb-4 text-center">Your shovel is equipped!</p>
          <p className="text-sm mb-3">
            Are you sure you want to start removing crops? You will lose both
            the crop and its seed!
          </p>
        </div>
        <div className="flex">
          <Button className="text-sm" onClick={onConfirm}>
            Start Digging!
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
