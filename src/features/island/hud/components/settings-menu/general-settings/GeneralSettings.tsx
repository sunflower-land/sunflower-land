import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { useGame } from "features/game/GameProvider";
import { ContentComponentProps } from "../GameOptions";
import { SUNNYSIDE } from "assets/sunnyside";
import { connectToFSL } from "features/auth/actions/oauth";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { hasFeatureAccess } from "lib/flags";
import { isSupported } from "firebase/messaging";

const _fslId = (state: MachineState) => state.context.fslId;
const _oauthNonce = (state: MachineState) => state.context.oauthNonce;
const _verified = (state: MachineState) => state.context.state.verified;
const _state = (state: MachineState) => state.context.state; // to remove after featureflag removed

export const GeneralSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { gameService } = useGame();
  const fslId = useSelector(gameService, _fslId);
  const oauthNonce = useSelector(gameService, _oauthNonce);
  const verified = useSelector(gameService, _verified);
  const state = useSelector(gameService, _state); // to remove after featureflag removed

  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const { t } = useAppTranslation();

  useEffect(() => {
    const checkNotificationsSupported = async () => {
      setNotificationsSupported(await isSupported());
    };
    checkNotificationsSupported();
  }, []);

  const hasNotificationAccess = hasFeatureAccess(
    state,
    "SEASONAL_EVENTS_NOTIFICATIONS",
  );

  const isNotificationSupported =
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    notificationsSupported;

  return (
    <div className="grid grid-cols-2 gap-1 m-1">
      <Button
        disabled={!!fslId}
        className="relative col-span-2"
        onClick={() => connectToFSL({ nonce: oauthNonce })}
      >
        {`Connect FSL ID`}
        {!!fslId && (
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute right-1 top-0.5 h-7"
          />
        )}
      </Button>
      <Button
        disabled={verified}
        className="relative col-span-2"
        onClick={() => onSubMenuClick("verifyPersonhood")}
      >
        {`Verify Personhood`}
        {!!verified === true && (
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute right-1 top-0.5 h-7"
          />
        )}
      </Button>
      <Button onClick={() => onSubMenuClick("discord")}>
        <span>{`Discord`}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("changeLanguage")}>
        <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
      </Button>
      {hasNotificationAccess && (
        <Button
          onClick={() => onSubMenuClick("notifications")}
          // Not available in players browser
          disabled={!isNotificationSupported}
        >
          <div className="flex items-center space-x-1">
            <span>{t("gameOptions.notifications")}</span>
            {!isNotificationSupported && (
              <Label type="info" className="mt-0.5">
                <span className=" text-xxs sm:text-xs">
                  {t("gameOptions.notifications.notSupported")}
                </span>
              </Label>
            )}
          </div>
        </Button>
      )}
      <Button onClick={() => onSubMenuClick("share")}>
        <span>{t("gameOptions.generalSettings.share")}</span>
      </Button>
      <Button
        onClick={() => onSubMenuClick("preferences")}
        className={hasNotificationAccess ? "col-span-2" : ""}
      >
        <span>{t("gameOptions.generalSettings.preferences")}</span>
      </Button>
    </div>
  );
};
