import React, { useState } from "react";
import { useNavigate } from "react-router";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";

type Props = {
  onClose: () => void;
};

/**
 * Two-step gate before opening the Economy Hub from the kingdom secret NPC.
 */
export const SecretMinigamesHubModal: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1>(0);

  const handleFinalContinue = () => {
    onClose();
    navigate("/economy-hub");
  };

  return (
    <CloseButtonPanel
      title={
        step === 0
          ? t("kingdom.secretExperiment.title")
          : t("kingdom.secretExperiment.warningTitle")
      }
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.murmur}
    >
      <div className="p-1">
        <p className="text-sm mb-3 leading-tight">
          {step === 0
            ? t("kingdom.secretExperiment.intro")
            : t("kingdom.secretExperiment.disclaimer")}
        </p>
        <Button onClick={step === 0 ? () => setStep(1) : handleFinalContinue}>
          {t("continue")}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
