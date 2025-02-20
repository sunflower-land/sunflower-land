import { useActor } from "@xstate/react";
import React, { useContext, useEffect } from "react";

import { Label } from "components/ui/Label";
import { Wallets } from "features/auth/components/SignIn";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { WalletAction } from "features/wallet/walletMachine";

import walletIcon from "assets/icons/wallet.png";

import { Context } from "features/game/GameProvider";
import { WalletErrorMessage } from "features/wallet/components/WalletErrors";
import { ErrorCode } from "lib/errors";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { shortAddress } from "lib/utils/shortAddress";
import { NFTMigrating, NFTMinting, NFTWaiting } from "./components/NFTMinting";
import { WalletContext, config } from "./WalletProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { PortalContext } from "features/portal/example/lib/PortalProvider";
import { WagmiProvider, useAccount } from "wagmi";
import { CONFIG } from "lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PolygonRequired } from "./components/PolygonRequired";

interface Props {
  action: WalletAction;
  onReady?: (payload: {
    signature?: string;
    address?: string;
    farmAddress?: string;
    nftId?: number;
  }) => void;
  id?: number;
  linkedAddress?: string;
  farmAddress?: string;
  wallet?: string;
}

const WalletContent: React.FC<{ id?: number }> = ({ id }) => {
  const { walletService } = useContext(WalletContext);

  const [walletState] = useActor(walletService);
  const { t } = useAppTranslation();

  const linkedAddress = walletState.context.linkedAddress;

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
                {t("wallet.connect")}
                {"-"}
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
                {t("wallet.linkWeb3")}
              </Label>
            </div>
            <p className="text-xs mx-1 mb-2">
              {t("wallet.setupWeb3")}
              {"."}
            </p>
          </>
        )}

        <Wallets
          onConnect={(connector) =>
            walletService.send("CONNECT_TO_WALLET", {
              connector,
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
        onRefresh={() => walletService.send("RESET")}
      />
    );
  }

  if (walletState.matches("wrongWallet")) {
    return (
      <>
        <div className="p-2">
          <div className="flex justify-between items-center">
            <Label type="danger" icon={walletIcon}>
              {t("wallet.wrongWallet")}
            </Label>
            {linkedAddress && (
              <Label type="formula">{shortAddress(linkedAddress)}</Label>
            )}
          </div>
          <p className="text-sm my-2">
            {t("wallet.connectedWrongWallet")}
            {"."}
          </p>
        </div>
        <Button onClick={() => walletService.send("CONTINUE")}>
          {t("wallet.changeWallet")}
        </Button>
      </>
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
            {t("wallet.missingNFT")}
          </Label>
          <p className="text-sm mb-2">
            {t("wallet.requireFarmNFT")}
            {"."}
          </p>
          <p className="text-xs mb-2">
            {t("wallet.uniqueFarmNFT")}
            {"."}
          </p>
        </div>
        <Button onClick={() => walletService.send("MINT")}>
          {t("wallet.mintFreeNFT")}
        </Button>
      </>
    );
  }

  if (walletState.matches("wrongNetwork")) {
    return <PolygonRequired canContinue={true} />;
  }

  if (walletState.matches("networkNotSupported")) {
    return <PolygonRequired canContinue={false} />;
  }

  if (walletState.matches("alreadyLinkedWallet")) {
    return (
      <div className="p-2">
        <Label type="danger" icon={walletIcon}>
          {t("wallet.walletAlreadyLinked")}
        </Label>
        <p className="my-2 text-sm">{`Wallet ${shortAddress(
          walletState.context.address as string,
        )} has already been linked to an account.`}</p>
        <p className="text-xs my-2">
          {t("wallet.linkAnotherWallet")}
          {"."}
        </p>
      </div>
    );
  }

  if (walletState.matches("alreadyHasFarm")) {
    return (
      <div className="p-2">
        <Label type="danger" icon={walletIcon}>
          {t("wallet.walletAlreadyLinked")}
        </Label>
        <p className="my-2 text-sm">{`Wallet ${shortAddress(
          walletState.context.address as string,
        )} has already been linked to an account.`}</p>
        <p className="text-xs my-2">
          {t("wallet.transferFarm")}
          {"."}
        </p>
      </div>
    );
  }

  if (walletState.matches("signingFailed")) {
    return (
      <>
        <div className="p-2">
          <Label icon={walletIcon} type="default" className="mb-1">
            {t("wallet.signRequest")}
          </Label>
          <p className="text-sm">
            {t("wallet.signRequestInWallet")}
            {"."}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => walletService.send("BACK")}>
            {t("back")}
          </Button>
          <Button onClick={() => walletService.send("CONTINUE")}>
            {t("wallet.signIn")}
          </Button>
        </div>
      </>
    );
  }

  if (walletState.matches("signing")) {
    return (
      <div className="p-2">
        <Label icon={walletIcon} type="default" className="mb-1">
          {t("wallet.signRequest")}
        </Label>
        <p className="text-sm">
          {t("wallet.signRequestInWallet")}
          {"."}
        </p>
      </div>
    );
  }

  if (walletState.matches("waiting")) {
    return (
      <NFTWaiting
        onComplete={() => walletService.send("CONTINUE")}
        readyAt={walletState.context.nftReadyAt as number}
      />
    );
  }

  if (walletState.matches("minting")) {
    return <NFTMinting />;
  }

  if (walletState.matches("migrating")) {
    return <NFTMigrating />;
  }

  return <Loading text={t("connecting")} />;
};

const WrappedWallet: React.FC<Props> = ({
  action,
  onReady,
  children,
  id,
  linkedAddress,
  farmAddress,
}) => {
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const { walletService } = useContext(WalletContext);

  const { address, chainId } = useAccount();

  useEffect(() => {
    const walletServiceAddress = walletService.state.context.address;

    // Metamask Mobile accidentally triggers this on route changes
    const didChange = address !== walletServiceAddress;
    if (
      didChange &&
      (
        ["initialising", "signing", "linking", "minting", "migrating"] as const
      ).every((state) => !walletState.matches(state))
    ) {
      walletService.send("ACCOUNT_CHANGED");
    }
  }, [address]);

  useEffect(() => {
    if (
      chainId !== CONFIG.POLYGON_CHAIN_ID &&
      (
        ["initialising", "signing", "linking", "minting", "migrating"] as const
      ).every((state) => !walletState.matches(state))
    ) {
      walletService.send("CHAIN_CHANGED");
    }
  }, [chainId]);

  useEffect(() => {
    walletService.send("INITIALISE", {
      id,
      jwt: authState.context.user.rawToken,
      linkedAddress,
      farmAddress,
      action,
    });
  }, []);

  const [walletState] = useActor(walletService);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (walletState.matches("ready") && !!onReady) {
      onReady({
        signature: walletState.context.signature,
        address: walletState.context.address,
        farmAddress: walletState.context.farmAddress,
        nftId: walletState.context.nftId,
      });
    }
  }, [walletState.value]);

  if (walletState.matches("ready")) {
    return <>{children}</>;
  }

  // Show wallet states
  return (
    <>
      <WalletContent id={id} />
    </>
  );
};

export const queryClient = new QueryClient();

export const Wallet: React.FC<Props> = (props) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <WrappedWallet {...props} />
    </QueryClientProvider>
  </WagmiProvider>
);

export const GameWallet: React.FC<Props> = ({ children, onReady, action }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      <Wallet
        action={action}
        id={gameState.context.farmId}
        linkedAddress={gameState.context.linkedWallet}
        wallet={gameState.context.wallet}
        farmAddress={gameState.context.farmAddress}
        onReady={({ address, signature, farmAddress, nftId }) => {
          const hasChanged =
            (!gameState.context.linkedWallet && address) ||
            (!gameState.context.farmAddress && farmAddress);
          !gameState.context.nftId && nftId;

          if (hasChanged)
            gameService.send("WALLET_UPDATED", {
              nftId,
              linkedWallet: address,
              farmAddress,
            });

          if (onReady) {
            onReady({ address, signature, farmAddress, nftId });
          }
        }}
      >
        {children}
      </Wallet>
    </>
  );
};

const PortalWalletContent: React.FC<Props> = ({ id, farmAddress, action }) => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const { walletService } = useContext(WalletContext);

  useEffect(() => {
    walletService.send("INITIALISE", {
      id,
      jwt: portalState.context.jwt,
      linkedAddress,
      farmAddress,
      action,
    });
  }, []);

  const [walletState] = useActor(walletService);
  const { t } = useAppTranslation();

  const linkedAddress = walletState.context.linkedAddress;

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
                {t("wallet.connect")}
                {"-"}
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
                {t("wallet.linkWeb3")}
              </Label>
            </div>
            <p className="text-xs mx-1 mb-2">
              {t("wallet.setupWeb3")}
              {"."}
            </p>
          </>
        )}

        <Wallets
          onConnect={(connector) =>
            walletService.send("CONNECT_TO_WALLET", {
              connector,
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
        onRefresh={() => walletService.send("RESET")}
      />
    );
  }

  if (walletState.matches("wrongWallet")) {
    return (
      <div className="p-2">
        <div className="flex justify-between items-center">
          <Label type="danger" icon={walletIcon}>
            {t("wallet.wrongWallet")}
          </Label>
          {linkedAddress && (
            <Label type="formula">{shortAddress(linkedAddress)}</Label>
          )}
        </div>
        <p className="text-sm my-2">
          {t("wallet.connectedWrongWallet")}
          {"."}
        </p>
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
            {t("wallet.missingNFT")}
          </Label>
          <p className="text-sm mb-2">
            {t("wallet.requireFarmNFT")}
            {"."}
          </p>
          <p className="text-xs mb-2">
            {t("wallet.uniqueFarmNFT")}
            {"."}
          </p>
        </div>
        <Button onClick={() => walletService.send("MINT")}>
          {t("wallet.mintFreeNFT")}
        </Button>
      </>
    );
  }

  if (walletState.matches("wrongNetwork")) {
    return <PolygonRequired canContinue={true} />;
  }

  if (walletState.matches("networkNotSupported")) {
    return <PolygonRequired canContinue={false} />;
  }

  if (walletState.matches("alreadyLinkedWallet")) {
    return (
      <div className="p-2">
        <Label type="danger" icon={walletIcon}>
          {t("wallet.walletAlreadyLinked")}
        </Label>
        <p className="my-2 text-sm">{`Wallet ${shortAddress(
          walletState.context.address as string,
        )} has already been linked to an account.`}</p>
        <p className="text-xs my-2">
          {t("wallet.linkAnotherWallet")}
          {"."}
        </p>
      </div>
    );
  }

  if (walletState.matches("alreadyHasFarm")) {
    return (
      <div className="p-2">
        <Label type="danger" icon={walletIcon}>
          {t("wallet.walletAlreadyLinked")}
        </Label>
        <p className="my-2 text-sm">{`Wallet ${shortAddress(
          walletState.context.address as string,
        )} has already been linked to an account.`}</p>
        <p className="text-xs my-2">
          {t("wallet.transferFarm")}
          {"."}
        </p>
      </div>
    );
  }

  if (walletState.matches("signingFailed")) {
    return (
      <>
        <div className="p-2">
          <Label icon={walletIcon} type="default" className="mb-1">
            {t("wallet.signRequest")}
          </Label>
          <p className="text-sm">
            {t("wallet.signRequestInWallet")}
            {"."}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => walletService.send("BACK")}>
            {t("back")}
          </Button>
          <Button onClick={() => walletService.send("CONTINUE")}>
            {t("wallet.signIn")}
          </Button>
        </div>
      </>
    );
  }

  if (walletState.matches("signing")) {
    return (
      <div className="p-2">
        <Label icon={walletIcon} type="default" className="mb-1">
          {t("wallet.signRequest")}
        </Label>
        <p className="text-sm">
          {t("wallet.signRequestInWallet")}
          {"."}
        </p>
      </div>
    );
  }

  if (walletState.matches("waiting")) {
    return (
      <NFTWaiting
        onComplete={() => walletService.send("CONTINUE")}
        readyAt={walletState.context.nftReadyAt as number}
      />
    );
  }

  if (walletState.matches("minting")) {
    return <NFTMinting />;
  }

  if (walletState.matches("migrating")) {
    return <NFTMigrating />;
  }

  return <Loading text={t("connecting")} />;
};

export const PortalWallet: React.FC<Props> = ({
  action,
  onReady,
  children,
  id,
  linkedAddress,
  farmAddress,
}) => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const { walletService } = useContext(WalletContext);

  useEffect(() => {
    walletService.send("INITIALISE", {
      id,
      jwt: portalState.context.jwt,
      linkedAddress,
      farmAddress,
      action,
    });
  }, []);

  const [walletState] = useActor(walletService);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (walletState.matches("ready") && !!onReady) {
      onReady({
        signature: walletState.context.signature,
        address: walletState.context.address,
        farmAddress: walletState.context.farmAddress,
        nftId: walletState.context.nftId,
      });
    }
  }, [walletState.value]);

  if (walletState.matches("ready")) {
    return <>{children}</>;
  }

  // Show wallet states
  return (
    <>
      <PortalWalletContent
        action={action}
        onReady={onReady}
        id={id}
        linkedAddress={linkedAddress}
        farmAddress={farmAddress}
      >
        {children}
      </PortalWalletContent>
    </>
  );
};
