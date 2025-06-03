import { Connector, CreateConnectorFn, useConnect } from "wagmi";
import { InjectedProviderButton } from "./InjectedProviderButton";
import { fallbackConnector } from "features/wallet/WalletProvider";
import { EIP6963Button } from "./EIP6963Button";

export const InjectedProviderButtons = ({
  onConnect,
}: {
  onConnect: (connector: Connector | CreateConnectorFn) => void;
}) => {
  const { connectors } = useConnect();

  const eip6963Connectors = connectors.filter(
    (connector) => connector.type === "injected" && !!connector.icon,
  );

  const showFallback =
    !!window.ethereum &&
    !window.ethereum.isMetaMask &&
    !window.ethereum.isCoinbaseWallet;

  if (showFallback) {
    return (
      <InjectedProviderButton onClick={() => onConnect(fallbackConnector)} />
    );
  }

  return (
    <>
      {eip6963Connectors
        // Metamask and Coinbase Wallet are filtered out by their respective connectors.
        // This is internal to wagmi via the rdns property.
        // Ronin Wallet is custom by us and does not have it's eip6963 connector filtered out.
        .filter((connector) => connector.name !== "Ronin Wallet")
        .map((connector) => (
          <EIP6963Button
            onClick={() => onConnect(connector)}
            name={connector.name}
            icon={connector.icon}
          />
        ))}
    </>
  );
};
