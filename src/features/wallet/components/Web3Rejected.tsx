import React from "react";

import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useContext } from "react";
import { WalletContext } from "../WalletProvider";
import { Button } from "components/ui/Button";
import walletIcon from "assets/icons/wallet.png";

export const Web3Rejected: React.FC = () => {
  const { walletService } = useContext(WalletContext);
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center">
          <Label type="danger" icon={walletIcon}>
            {t("wallet.rejected")}
          </Label>
        </div>
        <p className="text-sm my-2">{t("wallet.rejectedDescription")}</p>
      </div>
      <Button onClick={() => walletService.send("CONTINUE")}>
        {t("wallet.selectWallet")}
      </Button>
    </>
  );
};
