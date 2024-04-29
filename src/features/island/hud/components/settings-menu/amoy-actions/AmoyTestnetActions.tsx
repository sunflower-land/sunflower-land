import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { createPortal } from "react-dom";
import { DEV_HoardingCheck } from "./DEV_HoardingCheck";

export const AmoyTestnetActions: React.FC = () => {
  const { t } = useAppTranslation();
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  return (
    <>
      <ul className="list-none">
        <li className="p-1">
          <Button
            onClick={() => setShowTimeMachine(!showTimeMachine)}
            className="p-1"
          >
            {t("gameOptions.amoyActions.timeMachine")}
          </Button>
        </li>
        <li className="p-1">
          <DEV_HoardingCheck network="mainnet" />
        </li>
        <li className="p-1">
          <DEV_HoardingCheck network="amoy" />
        </li>
      </ul>
      {showTimeMachine && createPortal(<DEV_TimeMachine />, document.body)}
    </>
  );
};
