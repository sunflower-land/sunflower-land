import React from "react";
import { useInterpret } from "@xstate/react";
import { MachineInterpreter, walletMachine } from "./walletMachine";
import { CONFIG } from "lib/config";

import { http, createConfig, fallback } from "@wagmi/core";
import { polygon, polygonAmoy } from "@wagmi/core/chains";
import { walletConnect, metaMask } from "@wagmi/connectors";
import { sequenceWallet } from "@0xsequence/wagmi-connector";

export const WalletContext = React.createContext<{
  walletService: MachineInterpreter;
}>(
  {} as {
    walletService: MachineInterpreter;
  },
);

export const sequenceConnector = sequenceWallet({
  defaultNetwork: CONFIG.POLYGON_CHAIN_ID,
  connectOptions: {
    app: "Sunflower Land",
    projectAccessKey: CONFIG.SEQUENCE_ACCESS_KEY,
    settings: {
      theme: "dark",
      bannerUrl: "https://sunflower-land.com/play/brand/sequence_banner.png",
      includedPaymentProviders: ["ramp"],
      lockFundingCurrencyToDefault: true,
      defaultFundingCurrency: "matic",
      defaultPurchaseAmount: 10,
    },
  },
});

export const walletConnectConnector = walletConnect({
  projectId: CONFIG.WALLETCONNECT_PROJECT_ID,
});

export const metaMaskConnector = metaMask();

export const config = createConfig({
  chains: [CONFIG.NETWORK === "mainnet" ? polygon : polygonAmoy],
  // EIP-6963 support
  multiInjectedProviderDiscovery: false,
  connectors: [sequenceConnector, walletConnectConnector, metaMaskConnector],
  transports: {
    [polygon.id]: fallback([http(), http(CONFIG.ALCHEMY_RPC)]),
    [polygonAmoy.id]: fallback([http(), http(CONFIG.ALCHEMY_RPC)]),
  },
});

export const WalletProvider: React.FC = ({ children }) => {
  const walletService = useInterpret(
    walletMachine,
  ) as unknown as MachineInterpreter;

  return (
    <WalletContext.Provider value={{ walletService }}>
      {children}
    </WalletContext.Provider>
  );
};
