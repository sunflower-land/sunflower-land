import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CopyAddress } from "components/ui/CopyAddress";
import { WalletWall } from "./WalletWall";

const ConnectLinkedWalletHeader: React.FC<{
  linkedWallet: `0x${string}`;
}> = ({ linkedWallet }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <p className="p-2 pt-0.5">{t("walletWall.linkedWalletNotConnected")}</p>
      <div className="flex text-xs space-x-1 p-2 pt-0">
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
