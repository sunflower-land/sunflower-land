import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Context as AuthContext } from "../lib/Provider";
import { SUNNYSIDE } from "assets/sunnyside";
import walletIcon from "assets/icons/wallet.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";

import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { isMobile } from "mobile-device-detect";
import { Loading } from "./Loading";
import {
  ConnectErrorType,
  Connector,
  CreateConnectorFn,
  SignMessageErrorType,
} from "@wagmi/core";
import {
  useAccount,
  useConnect,
  useConnections,
  useDisconnect,
  useSignMessage,
  useSwitchAccount,
} from "wagmi";
import { fslAuthorization } from "../actions/oauth";
import { shortAddress } from "lib/utils/shortAddress";
import { GoogleButton } from "./buttons/GoogleButton";
import { InjectedProviderButtons } from "features/wallet/components/buttons/InjectedProviderButtons";
import { MetaMaskButton } from "features/wallet/components/buttons/MetaMaskButton";
import { CoinbaseButton } from "features/wallet/components/buttons/CoinbaseButton";
import { OtherWalletsButton } from "features/wallet/components/buttons/OtherWalletsButton";
import { RoninButton } from "features/wallet/components/buttons/RoninButton";
import { RoninButtons } from "features/wallet/components/buttons/RoninButtons";
import { getWalletIcon } from "features/wallet/lib/getWalletIcon";
import { WechatButton } from "./buttons/WechatButton";
import { FSLButton } from "./buttons/FSLButton";
import { SequenceButton } from "features/wallet/components/buttons/SequenceButton";
import { WalletConnectButton } from "features/wallet/components/buttons/WalletConnectButton";
import { generateSignatureMessage } from "lib/blockchain/wallet";
import { Context } from "features/game/GameProvider";
import { isAddressEqual } from "viem";
import { CopyAddress } from "components/ui/CopyAddress";

const CONTENT_HEIGHT = 365;

// This must be global so its reference doesn't change
const displayUriListener = (uri: string) => {
  window.open(`roninwallet://wc?uri=${encodeURIComponent(uri)}`, "_self");
};

const BackHeader: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex items-center mb-2 cursor-pointer " onClick={onClick}>
      <img
        src={SUNNYSIDE.icons.arrow_left}
        className="mr-2"
        style={{
          width: `${PIXEL_SCALE * 8}px`,
        }}
      />
      <span className="text-sm">{t("back")}</span>
    </div>
  );
};

const ConnectErrorMessage: React.FC<{
  error: ConnectErrorType;
}> = ({ error }) => {
  switch (error.name) {
    case "ConnectorAlreadyConnectedError":
      return (
        <div className="p-2">
          You are already connected to this wallet. Please disconnect and try
          again.
        </div>
      );
    case "UserRejectedRequestError":
      return (
        <div className="p-2">
          The connection request was rejected. Please try again.
        </div>
      );
    case "ResourceUnavailableRpcError":
      return (
        <div className="p-2">
          There is already a connection request in your wallet. Please accept it
          or try another wallet.
        </div>
      );
    case "WagmiCoreError":
      return (
        <div className="py-2">
          <Label type="warning">{error.message}</Label>
        </div>
      );
    case "Error":
      return (
        <div className="py-2">
          <Label type="warning">{error.message}</Label>
        </div>
      );
  }
};

const ConnectError: React.FC<{
  error: ConnectErrorType;
  disconnect: () => void;
}> = ({ error, disconnect }) => {
  return (
    <div>
      <div className="pt-1 pl-2">
        <Label type="default" icon={walletIcon}>
          Connecting to Wallet
        </Label>
      </div>
      <ConnectErrorMessage error={error} />
      <div>
        <Button onClick={() => disconnect()}>Try another wallet</Button>
      </div>
    </div>
  );
};

const SignMessageErrorMessage: React.FC<{
  error: SignMessageErrorType;
}> = ({ error }) => {
  switch (error.name) {
    case "SizeOverflowError":
      return (
        <div className="p-2">
          You are already connected to this wallet. Please disconnect and try
          again.
        </div>
      );
    case "IntegerOutOfRangeError":
      return (
        <div className="p-2">
          The connection request was rejected. Please try again.
        </div>
      );
    case "Error":
      return (
        <div className="p-2">
          There was an error signing the message. Please try again.
        </div>
      );
    case "SizeExceedsPaddingSizeError":
      return (
        <div className="p-2">The message is too long. Please try again.</div>
      );
    default:
      return (
        <div className="p-2">
          There was an error signing the message. Please try again.
        </div>
      );
  }
};

const ConnectingToWallet: React.FC<{
  disconnect: () => void;
}> = ({ disconnect }) => {
  return (
    <div>
      <div className="pt-1 pl-2">
        <Label type="default" icon={walletIcon}>
          Connecting to Wallet
        </Label>
      </div>
      <div className="p-2">
        <p className="text-sm">
          Please accept the wallet connection request in your wallet.
        </p>
      </div>
      <Button onClick={() => disconnect()}>Try another wallet</Button>
    </div>
  );
};

const ConnectedToWallet: React.FC<{
  onSignMessage: ({
    address,
    signature,
  }: {
    address: string;
    signature: string;
  }) => void;
}> = ({ onSignMessage }) => {
  const { disconnect } = useDisconnect();
  const { address, connector } = useAccount();
  const { signMessageAsync, error, isError } = useSignMessage();
  const { t } = useAppTranslation();

  const signIn = async (address: string) => {
    const signature = await signMessageAsync({
      message: generateSignatureMessage({
        address,
        nonce: Math.floor(Date.now() / 8.64e7),
      }),
    });

    onSignMessage({ address, signature });
  };

  return (
    <>
      <div className="flex justify-between items-center mt-1 ml-2">
        <div>
          <Label type="default" icon={walletIcon}>
            {connector?.name ?? "Connected"}
          </Label>
        </div>
        <div>
          <Label type="default" icon={getWalletIcon(connector)}>
            {shortAddress(address ?? "")}
          </Label>
        </div>
      </div>
      {isError && <SignMessageErrorMessage error={error} />}
      {!isError && (
        <div className="p-2">
          <p className="text-sm">
            {t("wallet.signRequestInWallet")}
            {"."}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center space-x-1">
        <Button onClick={() => signIn(address)}>Sign Message</Button>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>
    </>
  );
};

export const SignIn: React.FC<{
  type: "signin" | "signup";
}> = ({ type }) => {
  const [page, setPage] = useState<"home" | "other" | "ronin">("home");

  const { authService } = useContext(AuthContext);

  const [showLoading, setShowLoading] = useState(false);
  const { t } = useAppTranslation();

  const { isConnected, isConnecting } = useAccount();
  const { connect, reset, error, isError } = useConnect();

  const { disconnect } = useDisconnect();

  const onConnect = (connector: Connector | CreateConnectorFn) => {
    connect({ connector });
  };

  const isPWA = useIsPWA();
  const isMobilePWA = isMobile && isPWA;

  const showWechat = !isMobile && type !== "signup";

  if (showLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (isConnecting) {
    return <ConnectingToWallet disconnect={disconnect} />;
  }

  if (isError) {
    return <ConnectError error={error} disconnect={reset} />;
  }

  if (isConnected) {
    return (
      <ConnectedToWallet
        onSignMessage={({ address, signature }) =>
          authService.send("CONNECTED", { address, signature })
        }
      />
    );
  }

  if (page === "ronin") {
    return (
      <>
        <BackHeader onClick={() => setPage("home")} />
        <RoninButtons onConnect={onConnect} />
      </>
    );
  }

  return (
    <div
      className="overflow-y-auto scrollable"
      style={{ maxHeight: CONTENT_HEIGHT }}
    >
      <>
        {page === "home" && (
          <>
            <BackHeader onClick={() => authService.send("BACK")} />
            <GoogleButton
              onClick={() => {
                setShowLoading(true);
                window.location.href = `${CONFIG.API_URL}/auth/google/authorize`;
              }}
            />
            <button
              onClick={async () => {
                const response = await fetch(
                  `${CONFIG.API_URL}/auth/dev/authorize`,
                );
                const data = await response.json();
                window.location.href = data.link;
              }}
            >
              DEV ONLY BUTTON DELETE ME
            </button>
            <InjectedProviderButtons onConnect={onConnect} />
            <MetaMaskButton onConnect={onConnect} />
            <CoinbaseButton onConnect={onConnect} />
            <RoninButton onClick={() => setPage("ronin")} />
          </>
        )}

        {page === "other" && (
          <>
            <BackHeader onClick={() => setPage("home")} />
            <SequenceButton onConnect={onConnect} />
            <WalletConnectButton onConnect={onConnect} />
            {showWechat && (
              <WechatButton
                onClick={() => {
                  setShowLoading(true);
                  window.location.href = `${CONFIG.API_URL}/auth/wechat/authorize`;
                }}
              />
            )}
            <FSLButton
              onClick={() => {
                setShowLoading(true);
                fslAuthorization.signIn().then((code) => {
                  if (code) {
                    window.location.href = `${CONFIG.API_URL}/auth/fsl/callback?code=${code}`;
                  }
                });
              }}
            />
          </>
        )}

        {page === "home" && (
          <OtherWalletsButton
            onClick={() => setPage("other")}
            title="Show More"
          />
        )}
        {page === "other" && (
          <OtherWalletsButton
            onClick={() => setPage("home")}
            title="Show Less"
          />
        )}
      </>

      <div className="flex justify-between my-1 items-center">
        <a href="https://discord.gg/sunflowerland" className="mr-4">
          <img
            src="https://img.shields.io/discord/880987707214544966?label=Sunflower%20Land&logo=Discord&style=social"
            alt="Discord: Sunflower Land"
          />
        </a>
        <a
          href="https://docs.sunflower-land.com/getting-started/how-to-start"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-base font-secondary"
        >
          {t("welcome.needHelp")}
        </a>
      </div>
    </div>
  );
};

export const SignUp = () => <SignIn type="signup" />;

const ConnectHeader: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between">
        <Label className="ml-2 mt-1 mb-2" icon={walletIcon} type="default">
          {t("wallet.linkWeb3")}
        </Label>
      </div>
      <p className="text-xs mx-1 mb-2">
        {t("wallet.setupWeb3")}
        {"."}
      </p>
    </>
  );
};

const LinkedWalletHeader: React.FC<{
  address: `0x${string}`;
  linkedWallet: `0x${string}`;
  icon: string;
}> = ({ address, linkedWallet, icon }) => {
  const { t } = useAppTranslation();

  const isLinkedWallet = isAddressEqual(address, linkedWallet);

  return (
    <>
      <div className="flex justify-between items-center ml-2 mt-1">
        <Label icon={walletIcon} type="default">
          Connect your linked wallet
        </Label>
        <Label type={isLinkedWallet ? "default" : "danger"} icon={icon}>
          {shortAddress(address)}
        </Label>
      </div>
      <p className="text-xs p-2">
        This feature requires a connection to your linked wallet.
      </p>
      <div className="flex text-xs sm:text-xs space-x-1 p-2 pt-0">
        <span className="whitespace-nowrap">
          {`${t("deposit.linkedWallet")}`}
        </span>
        <CopyAddress address={linkedWallet} />
      </div>
    </>
  );
};

const LinkedWalletNotSelectedHeader: React.FC<{
  address: `0x${string}`;
  linkedWallet: `0x${string}`;
  icon: string;
}> = ({ address, linkedWallet, icon }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between items-center ml-2 mt-1">
        <Label icon={walletIcon} type="default">
          Connect your linked wallet
        </Label>
        <Label type="danger" icon={icon}>
          {shortAddress(address)}
        </Label>
      </div>
      <p className="text-xs p-2">Your linked wallet is not connected.</p>
      <div className="flex text-xs sm:text-xs space-x-1 p-2 pt-0">
        <span className="whitespace-nowrap">
          {`${t("deposit.linkedWallet")}`}
        </span>
        <CopyAddress address={linkedWallet} />
      </div>
    </>
  );
};

export const ConnectWallet: React.FC = () => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const [page, setPage] = useState<"home" | "other" | "ronin">("home");

  const { t } = useAppTranslation();

  const { isConnected, isConnecting } = useAccount();
  const { connect, reset, error, isError } = useConnect();

  const { disconnect } = useDisconnect();

  const onConnect = (connector: Connector | CreateConnectorFn) => {
    connect({ connector });
  };

  const isPWA = useIsPWA();
  const isMobilePWA = isMobile && isPWA;

  if (isConnecting) {
    return <ConnectingToWallet disconnect={disconnect} />;
  }

  if (isError) {
    return <ConnectError error={error} disconnect={reset} />;
  }

  if (isConnected) {
    return (
      <ConnectedToWallet
        onSignMessage={({ address, signature }) => {
          gameService.send("wallet.linked", {
            effect: {
              type: "wallet.linked",
              linkedWallet: address,
              signature,
            },
            authToken: authService.state.context.user.rawToken as string,
          });
        }}
      />
    );
  }

  if (page === "ronin") {
    return (
      <>
        <RoninButtons onConnect={onConnect} />
        <OtherWalletsButton onClick={() => setPage("home")} title="Show Less" />
      </>
    );
  }

  return (
    <div
      className="overflow-y-auto scrollable"
      style={{ maxHeight: CONTENT_HEIGHT }}
    >
      <>
        <ConnectHeader />
        {page === "home" && (
          <>
            <InjectedProviderButtons onConnect={onConnect} />
            <MetaMaskButton onConnect={onConnect} />
            <CoinbaseButton onConnect={onConnect} />
            <RoninButton onClick={() => setPage("ronin")} />
          </>
        )}

        {page === "other" && (
          <>
            <SequenceButton onConnect={onConnect} />
            <WalletConnectButton onConnect={onConnect} />
          </>
        )}

        {page === "home" && (
          <OtherWalletsButton
            onClick={() => setPage("other")}
            title="Show More"
          />
        )}
        {page === "other" && (
          <OtherWalletsButton
            onClick={() => setPage("home")}
            title="Show Less"
          />
        )}
      </>
    </div>
  );
};

export const LinkedWalletNotConnected: React.FC<{
  linkedWallet: `0x${string}`;
}> = ({ linkedWallet }) => {
  const [page, setPage] = useState<"home" | "other" | "ronin">("home");

  const { t } = useAppTranslation();

  const { isConnected, isConnecting, addresses } = useAccount();
  const { connect, reset, error, isError, data: connectData } = useConnect();

  const { disconnect } = useDisconnect();

  const onConnect = (connector: Connector | CreateConnectorFn) => {
    const hi = connect({ connector });
  };

  const isPWA = useIsPWA();
  const isMobilePWA = isMobile && isPWA;

  if (isConnecting) {
    return <ConnectingToWallet disconnect={disconnect} />;
  }

  if (isError) {
    return <ConnectError error={error} disconnect={reset} />;
  }

  // if (isConnected) {
  //   return (
  //     <ConnectedToWallet
  //       onSignMessage={({ address, signature }) => {
  //         gameService.send("wallet.linked", {
  //           effect: {
  //             type: "wallet.linked",
  //             linkedWallet: address,
  //             signature,
  //           },
  //           authToken: authService.state.context.user.rawToken as string,
  //         });
  //       }}
  //     />
  //   );
  // }

  if (page === "ronin") {
    return (
      <>
        <RoninButtons onConnect={onConnect} />
        <OtherWalletsButton onClick={() => setPage("home")} title="Show Less" />
      </>
    );
  }

  return (
    <div
      className="overflow-y-auto scrollable"
      style={{ maxHeight: CONTENT_HEIGHT }}
    >
      <>
        <LinkedWalletHeader
          linkedWallet={linkedWallet}
          address={linkedWallet}
          icon={walletIcon}
        />
        {page === "home" && (
          <>
            <InjectedProviderButtons onConnect={onConnect} />
            <MetaMaskButton onConnect={onConnect} />
            <CoinbaseButton onConnect={onConnect} />
            <RoninButton onClick={() => setPage("ronin")} />
          </>
        )}

        {page === "other" && (
          <>
            <SequenceButton onConnect={onConnect} />
            <WalletConnectButton onConnect={onConnect} />
          </>
        )}

        {page === "home" && (
          <OtherWalletsButton
            onClick={() => setPage("other")}
            title="Show More"
          />
        )}
        {page === "other" && (
          <OtherWalletsButton
            onClick={() => setPage("home")}
            title="Show Less"
          />
        )}
      </>
    </div>
  );
};

export const LinkedWalletNotSelected: React.FC<{
  linkedWallet: `0x${string}`;
}> = ({ linkedWallet }) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const [page, setPage] = useState<"home" | "other" | "ronin">("home");

  const { t } = useAppTranslation();

  const { isConnected, isConnecting, address, connector } = useAccount();
  const { connect, isError, error, reset } = useConnect();
  const connections = useConnections();

  const { disconnect } = useDisconnect();

  const onConnect = (connector: Connector | CreateConnectorFn) => {
    const hi = connect({ connector });
  };

  const isPWA = useIsPWA();
  const isMobilePWA = isMobile && isPWA;

  if (isConnecting) {
    return <ConnectingToWallet disconnect={disconnect} />;
  }

  if (isError) {
    return <ConnectError error={error} disconnect={reset} />;
  }

  // if (isConnected) {
  //   return (
  //     <ConnectedToWallet
  //       onSignMessage={({ address, signature }) => {
  //         gameService.send("wallet.linked", {
  //           effect: {
  //             type: "wallet.linked",
  //             linkedWallet: address,
  //             signature,
  //           },
  //           authToken: authService.state.context.user.rawToken as string,
  //         });
  //       }}
  //     />
  //   );
  // }

  if (page === "ronin") {
    return (
      <>
        <RoninButtons onConnect={onConnect} />
        <OtherWalletsButton onClick={() => setPage("home")} title="Show Less" />
      </>
    );
  }

  console.log({ address, connector });

  return (
    <div
      className="overflow-y-auto scrollable"
      style={{ maxHeight: CONTENT_HEIGHT }}
    >
      <>
        <LinkedWalletNotSelectedHeader
          linkedWallet={linkedWallet}
          address={address ?? linkedWallet}
          icon={getWalletIcon(connector)}
        />
        <Button
          onClick={() => {
            connections.forEach((connection) =>
              disconnect({ connector: connection.connector }),
            );
          }}
        >
          Disconnect
        </Button>
      </>
    </div>
  );
};
