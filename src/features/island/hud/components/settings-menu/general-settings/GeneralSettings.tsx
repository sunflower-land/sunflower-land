import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import * as Auth from "features/auth/lib/Provider";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Discord } from "./DiscordModal";
import { Context as GameContext } from "features/game/GameProvider";
import { ContentComponentProps } from "../GameOptions";

export const GeneralSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(GameContext);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [authState] = useActor(authService);

  const { showAnimations, toggleAnimations } = useContext(Context);

  const handleDiscordClick = () => {
    setShowDiscordModal(true);
  };

  const onToggleAnimations = () => {
    toggleAnimations();
  };

  const Content = () => {
    return (
      <>
        <Button onClick={handleDiscordClick} className="mb-2">
          <span>
            {authState.context.user.token?.discordId
              ? t("gameOptions.generalSettings.assignRole")
              : t("gameOptions.generalSettings.connectDiscord")}
          </span>
        </Button>
        <Button
          onClick={() => onSubMenuClick("changeLanguage")}
          className="mb-2"
        >
          <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
        </Button>
        <Button className="mb-2" onClick={onToggleAnimations}>
          <span>
            {showAnimations
              ? t("gameOptions.generalSettings.disableAnimations")
              : t("gameOptions.generalSettings.enableAnimations")}
          </span>
        </Button>
        <Button onClick={() => onSubMenuClick("share")} className="mb-2">
          <span>{t("gameOptions.generalSettings.share")}</span>
        </Button>
        <Discord
          isOpen={showDiscordModal}
          onClose={() => setShowDiscordModal(false)}
        />
      </>
    );
  };

  return Content();
};
