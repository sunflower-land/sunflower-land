import { useActor, useInterpret } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Wallets } from "features/auth/components/SignIn";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { walletMachine } from "features/auth/lib/walletMachine";
import { CONFIG } from "lib/config";

import walletIcon from "assets/icons/wallet.png";
import { Context } from "features/game/GameProvider";
import { Modal } from "react-bootstrap";

interface Props {
  onReady?: (payload: { signature: string; address: string }) => void;
  onStart?: () => void;
  id?: number;
  linkedAddress?: string;
  wallet?: string;
  wrapper?: React.FC;
}

export const Wallet: React.FC<Props> = ({
  onReady,
  onStart,
  children,
  id,
  linkedAddress,
  wallet,
  wrapper = ({ children }) => <>{children}</>,
}) => {
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  console.log({ token: authState.context.user.rawToken });
  const walletService = useInterpret(walletMachine, {
    context: {
      id,
      jwt: authState.context.user.rawToken,
      linkedAddress,
      wallet,
      // TODO more?
    },
  });

  const [walletState] = useActor(walletService);

  const provider = walletState.context.provider;
  const address = walletState.context.address;

  useEffect(() => {
    if (walletState.matches("ready") && !!onReady) {
      console.log("TRIGGER UP");
      onReady({
        signature: walletState.context.signature,
        address: walletState.context.address,
      });
    }

    if (onStart && walletState.matches("initialising")) {
      onStart();
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

  console.log({ walletState: walletState.value, context: walletState.context });
  const Wrapper = wrapper;
  if (walletState.matches("idle")) {
    return (
      <Wrapper>
        <Label className="ml-2 mt-1 mb-2" icon={walletIcon} type="default">
          Connect your wallet
        </Label>
        <Wallets
          onConnect={(chosenProvider) =>
            walletService.send("CONNECT_TO_WALLET", {
              chosenProvider,
            })
          }
        />
      </Wrapper>
    );
  }

  if (walletState.matches("ready")) {
    console.log("RETURN CHILDREN!");
    return <>{children}</>;
  }

  // Show wallet states
  return (
    <Wrapper>
      <p className="text-sm loading">{walletState.value}</p>
    </Wrapper>
  );
};

export const GameWallet: React.FC<Props> = ({ children, onReady, wrapper }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      <Wallet
        id={gameState.context.farmId}
        linkedAddress={gameState.context.linkedWallet}
        wallet={gameState.context.wallet}
        onReady={onReady}
        wrapper={wrapper}
      >
        {children}
      </Wallet>
    </>
  );
};
