import { useActor, useInterpret } from "@xstate/react";
import React, { useContext, useEffect } from "react";

import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Wallets } from "features/auth/components/SignIn";
import { Context } from "features/auth/lib/Provider";
import { walletMachine } from "features/auth/lib/walletMachine";
import { CONFIG } from "lib/config";

import walletIcon from "assets/icons/wallet.png";

interface Props {
  id: number;
  onReady: (payload: { signature: string; address: string }) => void;
}

export const Wallet: React.FC<Props> = ({ onReady, children, id }) => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  console.log({ token: authState.context.user.rawToken });
  const walletService = useInterpret(walletMachine, {
    context: {
      id,
      jwt: authState.context.user.rawToken,
      // TODO
    },
  });

  const [walletState] = useActor(walletService);

  const provider = walletState.context.provider;
  const address = walletState.context.address;

  useEffect(() => {
    if (walletState.matches("ready")) {
      onReady({
        signature: walletState.context.signature,
        address: walletState.context.address,
      });
    }
  }, [walletState.value]);

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

  if (walletState.matches("ready")) {
    return (
      <div className="p-2">
        <Label type="formula" icon={walletIcon}>
          {walletState.context.address}
        </Label>
        {children}
      </div>
    );
  }

  return <Panel>{walletState.value}</Panel>;
};
