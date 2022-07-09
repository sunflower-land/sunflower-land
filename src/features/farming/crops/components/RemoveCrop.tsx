import React from "react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import close from "assets/icons/close.png";
import rustyShovel from "assets/tools/rusty_shovel.png";

interface Props {
  doShow: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const RemoveCrop: React.FC<Props> = ({ doShow, onConfirm, onClose }) => {
  return (
    <Modal centered show={doShow} onHide={onClose}>
      <Panel>
        <img
          src={close}
          className="h-6 top-4 right-4 absolute cursor-pointer"
          onClick={onClose}
        />
        <div className="p-2">
          <h1 className="text-xl text-center">Remove Growing Crops?</h1>
          <div className="flex my-4 justify-center">
            <img src={rustyShovel} style={{ width: "50px" }} />
          </div>
          <p className="text-sm mb-4">
            Warning! You have your shovel equipped.
          </p>
          <p className="text-sm mb-3">
            Are you sure you want to start removing crops? You will not recover
            the crop or it&apos;s seed!
          </p>
        </div>

        <div className="flex">
          <Button className="text-sm" onClick={onConfirm}>
            Yes, Start Removing
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
