import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { WalletContext } from "features/wallet/WalletProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Web3Missing: React.FC<{
  wallet?: "PHANTOM" | "CRYPTO_COM" | "BITGET";
}> = ({ wallet }) => {
  const { walletService } = useContext(WalletContext);
  const { t } = useAppTranslation();
  const goToMetamaskSetupDocs = () => {
    window.open(
      "https://docs.sunflower-land.com/guides/getting-setup#metamask-setup",
      "_blank",
    );
  };

  const goToPhantomSetupDocs = () => {
    window.open("https://phantom.app/", "_blank");
  };

  const goToCryptoComSetupDocs = () => {
    window.open(
      "https://chrome.google.com/webstore/detail/cryptocom-wallet-extensio/hifafgmccdpekplomjjkcfgodnhcellj",
      "_blank",
    );
  };

  const goToBitgetSetupDocs = () => {
    window.open(
      "https://chrome.google.com/webstore/detail/bitget-wallet-formerly-bi/jiidiaalihmmhddjgbnbgdfflelocpak",
      "_blank",
    );
  };

  const handleClick = () => {
    if (wallet === "PHANTOM") return goToPhantomSetupDocs();
    if (wallet === "CRYPTO_COM") return goToCryptoComSetupDocs();
    if (wallet === "BITGET") return goToBitgetSetupDocs();
    return goToMetamaskSetupDocs();
  };

  return (
    <>
      <div className="flex flex-col text-center items-center p-1">
        <div className="flex mb-3 items-center">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            alt="Warning"
            className="w-3 mr-3"
          />
        </div>
        <p className="text-center mb-3">{t("error.Web3NotFound")}</p>

        <p className="text-center mb-3 text-xs">{t("statements.guide.two")}</p>
      </div>
      <div className="flex space-x-1">
        <Button
          onClick={() => walletService.send("RESET")}
          className="overflow-hidden"
        >
          <span>{t("back")}</span>
        </Button>
        <Button onClick={handleClick} className="overflow-hidden">
          <span>{t("statements.guide.one")}</span>
        </Button>
      </div>
    </>
  );
};
