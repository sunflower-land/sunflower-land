import React, { useEffect } from "react";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import { Modal } from "react-bootstrap";

import close from "assets/icons/close.png";

import { HowToFarm } from "./HowToFarm";
import { HowToUpgrade } from "./HowToUpgrade";
import { HowToSync } from "./HowToSync";
import { finishOnboarding, hasOnboarded } from "features/hud/lib/onboarding";
import { LetsGo } from "./LetsGo";

enum Steps {
  HowToFarm = 1,
  HowToUpgrade = 2,
  HowToSync = 3,
  LetsGo = 4,
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlay: React.FC<Props> = ({ isOpen, onClose }) => {
  const [step, setStep] = React.useState(Steps.HowToFarm);

  useEffect(() => {
    if (isOpen) {
      setStep(Steps.HowToFarm);
    }
  }, [isOpen]);
  const next = () => {
    setStep(step + 1);
  };

  const finish = () => {
    onClose();
    finishOnboarding();
  };

  const canClose = hasOnboarded();

  return (
    <Modal show={isOpen} onHide={canClose ? onClose : undefined} centered>
      <Panel>
        {canClose && (
          <img
            src={close}
            className="h-6 cursor-pointer absolute top-8 right-8"
            onClick={onClose}
          />
        )}
        {step === Steps.HowToFarm && <HowToFarm />}
        {step === Steps.HowToUpgrade && <HowToUpgrade />}
        {step === Steps.HowToSync && <HowToSync />}
        {step === Steps.LetsGo && <LetsGo />}

        <Modal.Footer className="justify-content-center">
          {step === Steps.LetsGo ? (
            <Button className="text-s px-1" onClick={finish}>
              {`Let's go!`}
            </Button>
          ) : (
            <Button className="text-s px-1" onClick={next}>
              Next
            </Button>
          )}
        </Modal.Footer>
      </Panel>
    </Modal>
  );
};
