import { Button } from "components/ui/Button";
import { COINBASE_ICON } from "features/wallet/lib/getWalletIcon";
import { coinbaseConnector } from "features/wallet/WalletProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { Connector, CreateConnectorFn } from "wagmi";

export const CoinbaseButton: React.FC<{
  onConnect: (connector: Connector | CreateConnectorFn) => void;
}> = ({ onConnect }) => {
  const { t } = useAppTranslation();

  return (
    <Button
      className="mb-1 py-2 text-sm relative"
      onClick={() => onConnect(coinbaseConnector)}
    >
      <div className="px-8">
        <img
          src={COINBASE_ICON}
          className="h-7 ml-2.5 mr-6 absolute left-0 top-1"
        />
        {"Coinbase"}
      </div>
    </Button>
  );
};
