import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { WalletContext } from "features/wallet/WalletProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const MultipleWallets: React.FC = () => {
  const { walletService } = useContext(WalletContext);
  const { t } = useAppTranslation();
  const goToDocs = () => {
    window.open(
      "https://docs.sunflower-land.com/getting-started/web3-wallets#multiple-wallets",
      "_blank",
    );
  };

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
        <p className="text-center mb-3">{t("error.multipleWallets.one")}</p>
        <p className="mb-2 text-xs">{t("error.multipleWallets.two")}</p>
      </div>
      <div className="flex space-x-1">
        <Button
          onClick={() => walletService.send("RESET")}
          className="overflow-hidden"
        >
          <span>{t("back")}</span>
        </Button>
        <Button onClick={goToDocs} className="overflow-hidden">
          <span>{t("statements.docs")}</span>
        </Button>
      </div>
    </>
  );
};
