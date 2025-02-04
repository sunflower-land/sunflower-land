import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ContentComponentProps } from "../GameOptions";
import { SUNNYSIDE } from "assets/sunnyside";
import { connectToFSL } from "features/auth/actions/oauth";

export const GeneralSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  return (
    <>
      <Button
        disabled={!!gameService.state.context.fslId}
        onClick={() =>
          connectToFSL({ nonce: gameService.state.context.oauthNonce })
        }
        className="mb-1 relative"
      >
        {`Connect FSL ID`}
        {!!gameService.state.context.fslId && (
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute right-1 top-0.5 h-7"
          />
        )}
      </Button>
      <Button onClick={() => onSubMenuClick("discord")} className="mb-1">
        <span>{`Discord`}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("changeLanguage")} className="mb-1">
        <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
      </Button>
      <Button
        className="mb-1"
        onClick={() => onSubMenuClick("appearance&behaviour")}
      >
        <span>{t("gameOptions.generalSettings.appearance&behaviour")}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("share")} className="mb-1">
        <span>{t("gameOptions.generalSettings.share")}</span>
      </Button>
    </>
  );
};
