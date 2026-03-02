import { Button } from "components/ui/Button";
import React, { useContext } from "react";
import { Context } from "../lib/Provider";

import walletIcon from "assets/icons/wallet.png";
import tradeIcon from "assets/icons/trade.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Welcome: React.FC = () => {
  const { authService } = useContext(Context);
  const { t } = useAppTranslation();

  return (
    <div className="p-2">
      <div
        className="flex gap-2 overflow-x-hidden justify-center mb-1"
        style={{
          borderBottom: "1px solid #ead4aa",
          paddingBottom: "8px",
        }}
      >
        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.plant} className="h-4 mr-1" />
          <p className="text-xs">{t("welcome.action.grow")}</p>
        </div>
        <div className="flex items-center">
          <img src={SUNNYSIDE.tools.hammer} className="h-4 mr-1" />
          <p className="text-xs">{t("welcome.action.build")}</p>
        </div>
        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.fish} className="h-4 mr-1" />
          <p className="text-xs">{t("welcome.action.fish")}</p>
        </div>
        <div className="flex items-center">
          <img src={SUNNYSIDE.tools.iron_pickaxe} className="h-4 mr-1" />
          <p className="text-xs">{t("welcome.action.mine")}</p>
        </div>

        <div className="flex items-center">
          <img src={tradeIcon} className="h-4 mr-1" />
          <p className="text-xs">{t("welcome.action.trade")}</p>
        </div>
      </div>
      <p className="text-xs text-center mb-2">{t("welcome.playInstantly")}</p>
      <Button
        className="mb-1 py-2 text-sm relative"
        onClick={() => authService.send({ type: "SIGN_IN" })}
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
        className="mb-1 py-2 text-sm relative"
        onClick={() => authService.send({ type: "SIGNUP" })}
      >
        <div className="px-8">
          <img
            src={SUNNYSIDE.icons.player}
            className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
          />
          {t("welcome.createAccount")}
        </div>
      </Button>

      <div className="flex justify-between items-center">
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
          className="underline font-secondary text-sm"
        >
          {t("welcome.needHelp")}
        </a>
      </div>
    </div>
  );
};
