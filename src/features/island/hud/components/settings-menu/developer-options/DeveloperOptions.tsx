import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { createPortal } from "react-dom";
import { ContentComponentProps } from "../GameOptions";
import { CONFIG } from "lib/config";
import { Context as GameContext } from "features/game/GameProvider";

export const DeveloperOptions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  return (
    <>
      {(CONFIG.NETWORK === "amoy" ||
        !!gameService.state?.context?.state.wardrobe["Gift Giver"]) && (
        <Button className="p-1 mb-1" onClick={() => onSubMenuClick("admin")}>
          <span>{`Admin`}</span>
        </Button>
      )}
      <Button
        onClick={() => onSubMenuClick("hoardingCheck")}
        className="p-1 mb-1"
      >
        {`Hoarding Check`}
      </Button>
      {CONFIG.NETWORK === "amoy" && (
        <>
          <Button
            onClick={() => setShowTimeMachine(!showTimeMachine)}
            className="p-1 mb-1"
          >
            {t("gameOptions.developerOptions.timeMachine")}
          </Button>
          {showTimeMachine && createPortal(<DEV_TimeMachine />, document.body)}
        </>
      )}
    </>
  );
};
