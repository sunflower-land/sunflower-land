import React from "react";
import { useAccount } from "wagmi";
import { WalletWall } from "./WalletWall";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { shortAddress } from "lib/utils/shortAddress";
import walletIcon from "assets/icons/wallet.png";
import { CopyAddress } from "components/ui/CopyAddress";
import { getWalletIcon } from "../lib/getWalletIcon";

const SelectLinkedWalletHeader: React.FC<{
  address: `0x${string}`;
  linkedWallet: `0x${string}`;
  icon: string;
}> = ({ address, linkedWallet, icon }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between items-center ml-2 mt-1">
        <Label icon={walletIcon} type="default">
          Connect your linked wallet
        </Label>
        <Label type="danger" icon={icon}>
          {shortAddress(address)}
        </Label>
      </div>
      <p className="text-xs p-2">Your linked wallet is not connected.</p>
      <div className="flex text-xs sm:text-xs space-x-1 p-2 pt-0">
        <span className="whitespace-nowrap">
          {`${t("deposit.linkedWallet")}`}
        </span>
        <CopyAddress address={linkedWallet} />
      </div>
    </>
  );
};

export const SelectLinkedWallet: React.FC<{
  linkedWallet: `0x${string}`;
}> = ({ linkedWallet }) => {
  const { address, connector } = useAccount();

  return (
    <WalletWall
      header={
        <SelectLinkedWalletHeader
          linkedWallet={linkedWallet}
          address={address ?? "0x"}
          icon={getWalletIcon(connector)}
        />
      }
      onSignMessage={() => {}}
    />
  );
};
