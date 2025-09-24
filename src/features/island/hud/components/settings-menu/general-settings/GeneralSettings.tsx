import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ContentComponentProps } from "../GameOptions";
import { SUNNYSIDE } from "assets/sunnyside";
import { connectToFSL } from "features/auth/actions/oauth";
import { hasFeatureAccess } from "lib/flags";

export const GeneralSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
      <Button onClick={() => onSubMenuClick("preferences")}>
        <span>{t("gameOptions.generalSettings.preferences")}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("changeLanguage")}>
        <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
      </Button>
      <Button
        disabled={!!gameService.getSnapshot().context.fslId}
        onClick={() =>
          connectToFSL({ nonce: gameService.getSnapshot().context.oauthNonce })
        }
        className="relative"
      >
        {`Connect FSL ID`}
        {!!gameService.getSnapshot().context.fslId && (
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute right-1 top-1 h-5"
          />
        )}
      </Button>
      <Button onClick={() => onSubMenuClick("discord")}>
        <span>{`Discord`}</span>
      </Button>
      {hasFeatureAccess(
        gameService.getSnapshot()?.context?.state,
        "FACE_RECOGNITION_TEST",
      ) && (
        <Button onClick={() => onSubMenuClick("faceRecognition")}>
          <span>{t("gameOptions.faceRecognition")}</span>
        </Button>
      )}
      <Button onClick={() => onSubMenuClick("apiKey")}>
        <span>{t("share.apiKey")}</span>
      </Button>
    </div>
  );
};
