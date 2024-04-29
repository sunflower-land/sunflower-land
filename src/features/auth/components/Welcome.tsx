import { Button } from "components/ui/Button";
import React, { useContext, useState } from "react";
import { Context } from "../lib/Provider";

import walletIcon from "src/assets/icons/wallet.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { LanguageChangeModal } from "features/island/hud/components/settings-menu/general-settings/LanguageChangeModal";

export const Welcome: React.FC = () => {
  const { authService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  return (
    <div className="p-2">
      <Button
        className="mb-2 py-2 text-sm relative"
        onClick={() => authService.send("SIGN_IN")}
      >
        <div className="px-8">
          <img
            src={walletIcon}
            className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {t("welcome.login")}
        </div>
      </Button>
      <Button
        className="mb-2 py-2 text-sm relative"
        onClick={() => authService.send("SIGNUP")}
      >
        <div className="px-8">
          <img
            src={SUNNYSIDE.icons.player}
            className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {t("welcome.createAccount")}
        </div>
      </Button>
      <Button
        className="mb-2 py-2 text-sm relative"
        onClick={() => setShowLanguageModal(true)}
      >
        <div className="px-8">
          <img
            src={SUNNYSIDE.icons.expression_chat}
            className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {t("gameOptions.generalSettings.changeLanguage")}
        </div>
      </Button>
      <div className="flex justify-between">
        <a href="https://discord.gg/sunflowerland" className="mr-4">
          <img
            src="https://img.shields.io/discord/880987707214544966?label=Sunflower%20Land&logo=Discord&style=social"
            alt="Discord: Sunflower Land"
          />
        </a>
        <a
          href="https://docs.sunflower-land.com/getting-started/how-to-start"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white text-xs"
        >
          {t("welcome.needHelp")}
        </a>
      </div>
      <LanguageChangeModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </div>
  );
};
