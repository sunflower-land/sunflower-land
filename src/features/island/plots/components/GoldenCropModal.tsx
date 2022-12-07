import React from "react";
import Modal from "react-bootstrap/esm/Modal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import michelin_stars from "assets/skills/land/cooking/michelin_stars.png";
interface Props {
  show: boolean;
  onContinue: () => void;
}

export const GoldenCropModal = ({ show, onContinue }: Props) => {
  return (
    <Modal show={show} centered>
      <Panel>
        <div className="p-2">
          <h1 className="text-lg text-center">Golden Crop!</h1>
          <div className="flex my-4 justify-center">
            <img src={michelin_stars} style={{ width: "50px" }} />
          </div>
          <p className="text-sm mb-2">{`Congratulations, you harvested a rare golden crop!`}</p>
        </div>

        <div className="flex">
          <Button className="text-sm" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
