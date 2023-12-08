import { useActor, useInterpret } from "@xstate/react";
import { Panel } from "components/ui/Panel";
import { Wallets } from "features/auth/components/SignIn";
import { walletMachine } from "features/auth/lib/walletMachine";
import { CONFIG } from "lib/config";
import React, { useEffect } from "react";

export const Wallet: React.FC = () => {
  const walletService = useInterpret(walletMachine, {
    context: {
      verifiedWallet: "0x", //TODO
    },
  });

  const [walletState] = useActor(walletService);

  const provider = walletState.context.provider;
  const address = walletState.context.address;

  /**
   * Listen to web3 account/chain changes
   * TODO: move into a hook
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
  }, [provider, address]);

  console.log({ walletState: walletState.value });
  if (walletState.matches("idle")) {
    return (
      <Panel>
        <Wallets
          onConnect={(chosenProvider) =>
            walletService.send("CONNECT_TO_WALLET", {
              chosenProvider,
            })
          }
        />
      </Panel>
    );
  }

  console.log({ context: walletState.context });
  return <Panel>{walletState.value}</Panel>;
};
