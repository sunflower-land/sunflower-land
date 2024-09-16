import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { createPortal } from "react-dom";
import { ContentComponentProps } from "../GameOptions";
import { CONFIG } from "lib/config";

export const DeveloperOptions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  return (
    <>
      <Button
        onClick={() => onSubMenuClick("mainnetHoardingCheck")}
        className="p-1"
      >
        {`Hoarding Check (Mainnet)`}
      </Button>
      {CONFIG.NETWORK === "amoy" && (
        <>
          <Button
            onClick={() => onSubMenuClick("amoyHoardingCheck")}
            className="p-1"
          >
            {`Hoarding Check (Amoy)`}
          </Button>
          <Button
            onClick={() => setShowTimeMachine(!showTimeMachine)}
            className="p-1"
          >
            {t("gameOptions.developerOptions.timeMachine")}
          </Button>
          {showTimeMachine && createPortal(<DEV_TimeMachine />, document.body)}
        </>
      )}
    </>
  );
};
