import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ContentComponentProps } from "../GameOptions";
import { hasFeatureAccess } from "lib/flags";
import { SUNNYSIDE } from "assets/sunnyside";

export const GeneralSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();

  const { gameService, showAnimations, toggleAnimations } = useContext(Context);

  const onToggleAnimations = () => {
    toggleAnimations();
  };

  const connectToFSL = () => {
    const redirect = encodeURIComponent(
      "https://api-hannigan.sunflower-land.com/oauth/fsl",
    );
    const appKey = "RWi72tQ1oz8i";
    const state = gameService.state.context.oauthNonce;
    const url = `https://id.fsl.com/api/account/oauth/authorize?response_type=code&appkey=${appKey}&redirect_uri=${redirect}&state=${state}&scope=basic%20wallet`;

    window.location.href = url;
  };

  return (
    <>
      {hasFeatureAccess(gameService.state.context.state, "FSL") && (
        <Button
          disabled={!!gameService.state.context.fslId}
          onClick={connectToFSL}
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
      )}

      <Button onClick={() => onSubMenuClick("discord")} className="mb-1">
        <span>{`Discord`}</span>
      </Button>
      <Button onClick={() => onSubMenuClick("changeLanguage")} className="mb-1">
        <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
      </Button>

      <Button className="mb-1" onClick={() => onSubMenuClick("appearance")}>
        <span>{t("gameOptions.generalSettings.appearance")}</span>
      </Button>
      <Button className="mb-1" onClick={onToggleAnimations}>
        <span>
          {showAnimations
            ? t("gameOptions.generalSettings.disableAnimations")
            : t("gameOptions.generalSettings.enableAnimations")}
        </span>
      </Button>
      <Button onClick={() => onSubMenuClick("share")} className="mb-1">
        <span>{t("gameOptions.generalSettings.share")}</span>
      </Button>
    </>
  );
};
