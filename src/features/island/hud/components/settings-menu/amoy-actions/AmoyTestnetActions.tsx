import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { createPortal } from "react-dom";
import { ContentComponentProps } from "../GameOptions";

export const AmoyTestnetActions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowTimeMachine(!showTimeMachine)}
        className="p-1"
      >
        {t("gameOptions.amoyActions.timeMachine")}
      </Button>
      <Button
        onClick={() => onSubMenuClick("mainnetHoardingCheck")}
        className="p-1"
      >
        {`Hoarding Check (Mainnet)`}
      </Button>
      <Button
        onClick={() => onSubMenuClick("amoyHoardingCheck")}
        className="p-1"
      >
        {`Hoarding Check (Amoy)`}
      </Button>
      {showTimeMachine && createPortal(<DEV_TimeMachine />, document.body)}
    </>
  );
};
