import React, { useEffect, useState } from "react";
import { useInterpret } from "@xstate/react";
import { MachineInterpreter, walletMachine } from "./walletMachine";
import { CONFIG } from "lib/config";

export const WalletContext = React.createContext<{
  walletService: MachineInterpreter;
}>(
  {} as {
    walletService: MachineInterpreter;
  },
);

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
