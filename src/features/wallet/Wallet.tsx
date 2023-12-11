import { useActor, useInterpret } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";

import { Label } from "components/ui/Label";
import { Wallets } from "features/auth/components/SignIn";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { walletMachine } from "features/wallet/walletMachine";
import { CONFIG } from "lib/config";

import walletIcon from "assets/icons/wallet.png";

import { Context } from "features/game/GameProvider";
import { WalletErrorMessage } from "features/wallet/components/WalletErrors";
import { ErrorCode } from "lib/errors";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { shortAddress } from "lib/utils/shortAddress";
import { Minting } from "features/game/components/Minting";
import { NFTMinting } from "./components/NFTMinting";

interface Props {
  onReady?: (payload: { signature: string; address: string }) => void;
  onStart?: () => void;
  id?: number;
  linkedAddress?: string;
  farmAddress?: string;
  wallet?: string;
  wrapper?: React.FC;
  requiresNFT?: boolean;
}

export const Wallet: React.FC<Props> = ({
  onReady,
  onStart,
  children,
  id,
  linkedAddress,
  farmAddress,
  wrapper = ({ children }) => <>{children}</>,
  requiresNFT = true,
}) => {
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const walletService = useInterpret(walletMachine, {
    context: {
      id,
      jwt: authState.context.user.rawToken,
      linkedAddress,
      farmAddress,
      requiresNFT,
    },
  });

  const [walletState] = useActor(walletService);

  const provider = walletState.context.provider;
  const address = walletState.context.address;

  console.log({ state: walletState.value, context: walletState.context });
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

  if (walletState.matches("ready")) {
    return <>{children}</>;
  }

  const Content = () => {
    if (walletState.matches("idle")) {
      return (
        <>
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
        </>
      );
    }

    if (walletState.matches("error")) {
      return (
        <WalletErrorMessage
          errorCode={walletState.context.errorCode as ErrorCode}
          onRefresh={() => walletService.send("REFRESH")}
        />
      );
    }

    if (walletState.matches("wrongWallet")) {
      return (
        <div>
          <p>Wrong wallet</p>
        </div>
      );
    }

    if (walletState.matches("missingNFT")) {
      return (
        <>
          <div className="p-2">
            <Label
              icon={SUNNYSIDE.resource.pirate_bounty}
              type="default"
              className="mb-2"
            >
              Missing Account NFT
            </Label>
            <p className="text-sm mb-2">
              An Account NFT is needed to secure your items on the Blockchain.
            </p>
          </div>
          <Button onClick={() => walletService.send("MINT")}>
            Mint your free NFT
          </Button>
        </>
      );
    }

    if (walletState.matches("wrongNetwork")) {
      return (
        <div className="p-2">
          <p>Wrong Chain</p>
        </div>
      );
    }

    if (walletState.matches("alreadyLinkedWallet")) {
      return (
        <div className="p-2">
          <Label type="danger" icon={walletIcon}>
            Wallet already linked
          </Label>
          <p className="my-2 text-sm">{`Wallet ${shortAddress(
            walletState.context.address
          )} has already been linked to an account.`}</p>
          <p className="text-xs my-2">Please link another wallet.</p>
        </div>
      );
    }

    if (walletState.matches("signing")) {
      return (
        <div className="p-2">
          <Label icon={walletIcon} type="default" className="mb-1">
            Sign
          </Label>
          <p className="text-sm">
            Sign the request in your wallet to continue.
          </p>
        </div>
      );
    }

    if (walletState.matches("minting")) {
      return <p className="loading">Minting</p>;
    }

    if (walletState.matches("waiting")) {
      return (
        <NFTMinting
          onComplete={() => walletService.send("CONTINUE")}
          readyAt={walletState.context.nftReadyAt}
        />
      );
    }

    return <p className="loading">Connecting</p>;
  };

  const Wrapper = wrapper;

  // Show wallet states
  return <Wrapper>{Content()}</Wrapper>;
};

export const GameWallet: React.FC<Props> = ({
  children,
  onReady,
  wrapper,
  requiresNFT,
}) => {
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
        farmAddress={""}
        requiresNFT={requiresNFT}
      >
        {children}
      </Wallet>
    </>
  );
};
