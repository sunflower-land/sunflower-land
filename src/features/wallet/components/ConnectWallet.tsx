import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { WalletWall } from "./WalletWall";

const ConnectHeader: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <p className="text-xs mx-1 mt-1 mb-2">
      {t("walletWall.connectWalletDescription")}
    </p>
  );
};

export const ConnectWallet: React.FC = () => {
  return <WalletWall header={<ConnectHeader />} onSignMessage={() => null} />;
};
