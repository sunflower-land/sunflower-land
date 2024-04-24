import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import * as Auth from "features/auth/lib/Provider";
import { LanguageSwitcher } from "./LanguageChangeModal";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Discord } from "./DiscordModal";
import { Share } from "./Share";
import { Context as GameContext } from "features/game/GameProvider";

enum MENU_LEVELS {
  ROOT = "root",
}

export const GeneralSettings: React.FC = () => {
  const { t } = useAppTranslation();
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(GameContext);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [menuLevel, setMenuLevel] = useState(MENU_LEVELS.ROOT);
  const [authState] = useActor(authService);
  const [view, setView] = useState<"settings" | "language">("settings");

  const { showAnimations, toggleAnimations } = useContext(Context);

  const handleDiscordClick = () => {
    setShowDiscordModal(true);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
    setMenuLevel(MENU_LEVELS.ROOT);
  };

  const onToggleAnimations = () => {
    toggleAnimations();
  };

  const Content = () => {
    if (view === "language") {
      return (
        <>
          <div
            className="grow mb-3 text-lg"
            style={{ margin: "0 auto", display: "table" }}
          >
            {t("gameOptions.generalSettings.changeLanguage")}
          </div>
          <LanguageSwitcher />
        </>
      );
    }

    return (
      <>
        <Button onClick={handleDiscordClick} className="mb-2">
          <span>
            {authState.context.user.token?.discordId
              ? t("gameOptions.generalSettings.assignRole")
              : t("gameOptions.generalSettings.connectDiscord")}
          </span>
        </Button>
        <Button onClick={() => setView("language")} className="mb-2">
          <span>{t("gameOptions.generalSettings.changeLanguage")}</span>
        </Button>
        <Button className="mb-2" onClick={onToggleAnimations}>
          <span>
            {showAnimations
              ? t("gameOptions.generalSettings.disableAnimations")
              : t("gameOptions.generalSettings.enableAnimations")}
          </span>
        </Button>
        <Button onClick={handleShareClick} className="mb-2">
          <span>{t("gameOptions.generalSettings.share")}</span>
        </Button>
        <Discord
          isOpen={showDiscordModal}
          onClose={() => setShowDiscordModal(false)}
        />
        <Share
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          farmId={gameService.state?.context?.farmId.toString() as string}
        />
      </>
    );
  };

  return Content();
};
