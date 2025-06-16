import React from "react";
import { Label } from "components/ui/Label";
import { shortAddress } from "lib/utils/shortAddress";
import walletIcon from "assets/icons/wallet.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CopyAddress } from "components/ui/CopyAddress";
import { WalletWall } from "./WalletWall";

const ConnectLinkedWalletHeader: React.FC<{
  linkedWallet: `0x${string}`;
}> = ({ linkedWallet }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between items-center ml-2 mt-1">
        <Label icon={walletIcon} type="default">
          {t("walletWall.connectLinkedWallet")}
        </Label>
        <Label type="danger" icon={walletIcon}>
          {shortAddress(linkedWallet)}
        </Label>
      </div>
      <p className="text-xs p-2">{t("walletWall.linkedWalletNotConnected")}</p>
      <div className="flex text-xs sm:text-xs space-x-1 p-2 pt-0">
        <span className="whitespace-nowrap">
          {`${t("deposit.linkedWallet")}`}
        </span>
        <CopyAddress address={linkedWallet} />
      </div>
    </>
  );
};

export const ConnectLinkedWallet: React.FC<{
  linkedWallet: `0x${string}`;
}> = ({ linkedWallet }) => {
  return (
    <>
      <WalletWall
        header={<ConnectLinkedWalletHeader linkedWallet={linkedWallet} />}
        onSignMessage={() => null}
      />
    </>
  );
};
