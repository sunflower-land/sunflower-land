import React, { useEffect } from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import { HowToFarm } from "./HowToFarm";
import { HowToUpgrade } from "./HowToUpgrade";
import { HowToSync } from "./HowToSync";
import { LetsGo } from "./LetsGo";
import { useIsNewFarm } from "features/farming/hud/lib/onboarding";

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

  const previous = () => {
    setStep(step - 1);
  };

  const next = () => {
    setStep(step + 1);
  };

  const finish = () => {
    onClose();
  };

  const canClose = !useIsNewFarm();

  return (
    <Modal show={isOpen} onHide={canClose ? onClose : undefined} centered>
      <Panel>
        {step === Steps.HowToFarm && <HowToFarm onClose={onClose} />}
        {step === Steps.HowToUpgrade && (
          <HowToUpgrade onClose={onClose} onBack={previous} />
        )}
        {step === Steps.HowToSync && (
          <HowToSync onClose={onClose} onBack={previous} />
        )}
        {step === Steps.LetsGo && (
          <LetsGo onClose={onClose} onBack={previous} />
        )}

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
