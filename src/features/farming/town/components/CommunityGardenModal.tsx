import React from "react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import sunflowerFence from "assets/land/sunflower_fence.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityGardenModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const goToCommunityGarden = () => {
    window.location.href = `${window.location.pathname}#/community-garden`;
  };

  const handleClose = () => onClose();

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel>
        <div className="p-2">
          <div className="flex flex-col items-center mb-3">
            <h1 className="text-lg mb-2 text-center">
              Do you want to visit the Community Garden?
            </h1>
            <img src={sunflowerFence} alt="sunflower fence" width="400px" />
          </div>

          <p className="mb-4 text-sm block">
            Community Garden offers unique items and{" "}
            <span className="underline">wallet</span> transactions.
          </p>
          <p className="mb-2 text-sm">
            The Community Garden will only accept coins that are on your wallet.
            Coins that are not in your wallet will not be reflected.
          </p>
        </div>

        <div className="flex">
          <Button className="mr-1" onClick={handleClose}>
            Close
          </Button>
          <Button className="ml-1" onClick={goToCommunityGarden}>
            Continue
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
