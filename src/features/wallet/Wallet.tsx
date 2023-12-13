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
import { WalletContext } from "./WalletProvider";

interface Props {
  onReady?: (payload: {
    signature?: string;
    address?: string;
    farmAddress?: string;
  }) => void;
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

  const { walletService } = useContext(WalletContext);

  useEffect(() => {
    walletService.send("INITIALISE", {
      id,
      jwt: authState.context.user.rawToken,
      linkedAddress,
      farmAddress,
      requiresNFT,
    });
  }, []);

  const [walletState] = useActor(walletService);

  useEffect(() => {
    if (walletState.matches("ready") && !!onReady) {
      onReady({
        signature: walletState.context.signature,
        address: walletState.context.address,
        farmAddress: walletState.context.farmAddress,
      });
    }

    if (onStart && walletState.matches("initialising")) {
      onStart();
    }
  }, [walletState.value]);

  if (walletState.matches("ready")) {
    return <>{children}</>;
  }

  const Content = () => {
    const linkedAddress = walletState.context.linkedAddress;

    if (walletState.matches("idle")) {
      return <p>Idle</p>;
    }

    if (walletState.matches("chooseWallet")) {
      return (
        <>
          {
            // Only show after login
            !!id && linkedAddress && (
              <div className="flex justify-between">
                <Label
                  className="ml-2 mt-1 mb-2"
                  icon={walletIcon}
                  type="default"
                >
                  Select your wallet
                </Label>
                <Label className="ml-2 mt-1 mb-2" type="formula">
                  {shortAddress(linkedAddress)}
                </Label>
              </div>
            )
          }

          {!!id && !linkedAddress && (
            <>
              <div className="flex justify-between">
                <Label
                  className="ml-2 mt-1 mb-2"
                  icon={walletIcon}
                  type="default"
                >
                  Link a Web3 Wallet
                </Label>
              </div>
              <p className="text-xs mx-1 mb-2">
                To access this feature, you must first setup a Web3 wallet.
              </p>
            </>
          )}

          <Wallets
            onConnect={(chosenProvider) =>
              walletService.send("CONNECT_TO_WALLET", {
                chosenProvider,
              })
            }
            // Once logged in, only show Metamask for simplicity
            showAll={!id}
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
        <div className="p-2">
          <div className="flex justify-between items-center">
            <Label type="danger" icon={walletIcon}>
              Wrong Wallet
            </Label>
            {linkedAddress && (
              <Label type="formula">{shortAddress(linkedAddress)}</Label>
            )}
          </div>
          <p className="text-sm my-2">You are connected to the wrong wallet.</p>
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
              Missing NFT
            </Label>
            <p className="text-sm mb-2">
              To store rare NFTs & access bonus content, we must first secure
              your farm on the Blockchain.
            </p>
            <p className="text-xs mb-2">
              A unique farm NFT will be minted to store your progress.
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
            walletState.context.address as string
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
          readyAt={walletState.context.nftReadyAt as number}
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
        farmAddress={gameState.context.farmAddress}
        requiresNFT={requiresNFT}
        onReady={({ address, signature, farmAddress, id }) => {
          const hasChanged =
            (!gameState.context.linkedWallet && address) ||
            (!gameState.context.farmAddress && farmAddress);

          if (hasChanged)
            gameService.send("WALLET_UPDATED", {
              linkedWallet: address,
              farmAddress,
            });

          if (!!onReady) {
            onReady({ address, signature, farmAddress, id });
          }
        }}
        wrapper={wrapper}
      >
        {children}
      </Wallet>
    </>
  );
};
