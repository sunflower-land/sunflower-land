import React from "react";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import walletIcon from "assets/icons/wallet.png";
import { WalletWall } from "./WalletWall";

const ConnectHeader: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between">
        <Label className="ml-2 mt-1 mb-2" icon={walletIcon} type="default">
          Connect Wallet
        </Label>
      </div>
      <p className="text-xs mx-1 mb-2">
        This feature requires a wallet connection. Connect a wallet to continue.
      </p>
    </>
  );
};

export const ConnectWallet: React.FC = () => {
  return <WalletWall header={<ConnectHeader />} onSignMessage={() => {}} />;
};
