import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "../lib/Provider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const MultipleWallets: React.FC = () => {
  const { authService } = useContext(Context);

  const goToDocs = () => {
    window.open(
      "https://docs.sunflower-land.com/getting-started/web3-wallets#multiple-wallets",
      "_blank"
    );
  };
  const { t } = useAppTranslation();
  return (
    <>
      <div className="flex flex-col p-1">
        <div className="flex mb-3 justify-center">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            alt="Warning"
            className="w-3 mr-3"
          />
        </div>
        <p className="text-center mb-3">Multiple Wallets</p>
        <p className="mb-2 text-xs">
          It looks like you have multiple wallets installed. This can cause
          unexpected behaviour.Try to disable all but one wallet.
        </p>
      </div>
      <div className="flex space-x-1">
        <Button
          onClick={() => authService.send("REFRESH")}
          className="overflow-hidden"
        >
          <span>{t("back")}</span>
        </Button>
        <Button onClick={goToDocs} className="overflow-hidden">
          <span>Go to docs</span>
        </Button>
      </div>
    </>
  );
};
