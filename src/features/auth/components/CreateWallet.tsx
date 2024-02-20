import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";
import { OfferItems } from "./Offer";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const CreateWallet = () => {
  const { authService } = useContext(Context);
  const { t } = useAppTranslation();
  const handleBack = () => {
    authService.send("BACK");
  };

  return (
    <>
      <div className="p-2">
        <div className="flex">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="h-5 mr-2 cursor-pointer"
            onClick={handleBack}
          />
          <div className="flex items-center mb-2">
            <img src={SUNNYSIDE.ui.green_bar_2} className="h-5 mr-2" />
            <span className="text-xs">{t("onboarding.step.one")}</span>
          </div>
        </div>
        <p className="mb-3">{t("onboarding.welcome")}</p>
        <p className="text-sm text-white mb-2">{t("onboarding.intro.one")}</p>
        <p className="text-sm text-white mt-2 mb-2">
          {t("onboarding.intro.two")}{" "}
        </p>
        <OfferItems />
      </div>
      <Button
        onClick={() => {
          authService.send("CONTINUE");
        }}
      >
        {t("lets.go")}
      </Button>
    </>
  );
};
