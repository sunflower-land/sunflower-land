import React, { useEffect } from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";

import { HowToFarm } from "./HowToFarm";
import { HowToUpgrade } from "./HowToUpgrade";
import { HowToSync } from "./HowToSync";
import { LetsGo } from "./LetsGo";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

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
  const { t } = useAppTranslation();
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

  const title =
    step === Steps.HowToFarm ? t("howToFarm.title") : t("howToUpgrade.title");

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        title={title}
        onBack={step > 1 ? previous : undefined}
        onClose={onClose}
      >
        {step === Steps.HowToFarm && <HowToFarm />}
        {step === Steps.HowToUpgrade && <HowToUpgrade />}
        {step === Steps.HowToSync && <HowToSync />}
        {step === Steps.LetsGo && <LetsGo />}

        <div className="justify-content-center">
          {step === Steps.LetsGo ? (
            <Button className="text-s px-1" onClick={finish}>
              {t("lets.go")}
            </Button>
          ) : (
            <Button className="text-s px-1" onClick={next}>
              {t("next")}
            </Button>
          )}
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
