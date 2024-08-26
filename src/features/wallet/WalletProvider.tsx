import React, { useEffect, useState } from "react";
import { useInterpret } from "@xstate/react";
import { MachineInterpreter, walletMachine } from "./walletMachine";
import { CONFIG } from "lib/config";

import { http, createConfig } from "@wagmi/core";
import { polygonAmoy } from "@wagmi/core/chains";
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
  // TODO set network
  defaultNetwork: "polygon",
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
  chains: [polygonAmoy],
  // EIP-6963 support
  multiInjectedProviderDiscovery: true,
  connectors: [sequenceConnector, walletConnectConnector, metaMaskConnector],
  transports: {
    [polygonAmoy.id]: http(),
  },
});

export const WalletProvider: React.FC = ({ children }) => {
  const walletService = useInterpret(
    walletMachine,
  ) as unknown as MachineInterpreter;

  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    walletService.onTransition((state) => {
      if (state.context.provider) {
        setProvider(state.context.provider);
      }
    });
  }, []);

  /**
   * Listen to web3 account/chain changes
   */
  useEffect(() => {
    if (provider) {
      if (provider.on) {
        provider.on("chainChanged", (chain: any) => {
          if (parseInt(chain) === CONFIG.POLYGON_CHAIN_ID) {
            return;
          }

          // Phantom handles this internally
          if (provider.isPhantom) return;

          walletService.send("CHAIN_CHANGED");
        });
        provider.on("accountsChanged", function (accounts: string[]) {
          const address = walletService.state.context.address;

          // Metamask Mobile accidentally triggers this on route changes
          const didChange = accounts[0] !== address;
          if (didChange) {
            walletService.send("ACCOUNT_CHANGED");
          }
        });
      } else if (provider.givenProvider) {
        provider.givenProvider.on("chainChanged", () => {
          walletService.send("CHAIN_CHANGED");
        });
        provider.givenProvider.on("accountsChanged", function () {
          walletService.send("ACCOUNT_CHANGED");
        });
      }
    }
  }, [provider]);

  return (
    <WalletContext.Provider value={{ walletService }}>
      {children}
    </WalletContext.Provider>
  );
};
