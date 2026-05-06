import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { DEV_TimeMachine } from "./DEV_TimeMachine";
import { createPortal } from "react-dom";
import { ContentComponentProps } from "../GameOptions";
import { CONFIG } from "lib/config";
import { Context as GameContext } from "features/game/GameProvider";
import { hasFeatureAccess } from "lib/flags";
import { useSelector } from "@xstate/react";

export const DeveloperOptions: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
  const { gameService, setFromRoute } = useContext(GameContext);
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const [showTimeMachine, setShowTimeMachine] = useState(false);

  const game = useSelector(gameService, (state) => state.context.state);
  const hasAdminDashboards = hasFeatureAccess(game, "ADMIN_DASHBOARDS");

  const goTo = (path: string) => {
    onClose();
    setFromRoute(window.location.hash.replace("#", "") || "/");
    navigate(path);
  };

  const hasAirdrop = hasFeatureAccess(game, "AIRDROP_PLAYER");
  const hasHoardingCheck = hasFeatureAccess(game, "HOARDING_CHECK");
  const isModerator = hasFeatureAccess(game, "MODERATOR");

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <Button className="p-1" onClick={() => onSubMenuClick("experiments")}>
          <span>{t("experiments")}</span>
        </Button>
        <Button className="p-1" onClick={() => onSubMenuClick("apiKey")}>
          <span>{t("share.apiKey")}</span>
        </Button>
        {hasAirdrop && (
          <Button className="p-1" onClick={() => onSubMenuClick("admin")}>
            <span>{`Airdrop Player`}</span>
          </Button>
        )}
        {hasHoardingCheck && (
          <Button
            onClick={() => onSubMenuClick("hoardingCheck")}
            className="p-1"
          >
            {`Hoarding Check`}
          </Button>
        )}
        {isModerator && (
          <Button
            onClick={() => onSubMenuClick("playerSearch")}
            className="p-1"
          >
            {`Player Search`}
          </Button>
        )}
        {isModerator && (
          <Button onClick={() => onSubMenuClick("errorSearch")} className="p-1">
            {`Error Search`}
          </Button>
        )}
        {hasAdminDashboards && (
          <>
            <Button
              onClick={() => goTo("/game/economy-dashboard")}
              className="p-1"
            >
              {`Economy Dashboard`}
            </Button>
            <Button
              onClick={() => goTo("/game/retention-dashboard")}
              className="p-1"
            >
              {`Retention Dashboard`}
            </Button>
          </>
        )}
        {CONFIG.NETWORK === "amoy" && (
          <Button
            onClick={() => setShowTimeMachine(!showTimeMachine)}
            className="p-1"
          >
            {t("gameOptions.developerOptions.timeMachine")}
          </Button>
        )}
      </div>
      {CONFIG.NETWORK === "amoy" &&
        showTimeMachine &&
        createPortal(<DEV_TimeMachine />, document.body)}
    </>
  );
};
