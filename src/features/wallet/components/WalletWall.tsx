import React from "react";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useIsPWA } from "lib/utils/hooks/useIsPWA";
import { isMobile } from "mobile-device-detect";
import { useContext, useEffect, useState } from "react";
import {
  Connector,
  CreateConnectorFn,
  useAccount,
  useConnect,
  useConnections,
  useDisconnect,
} from "wagmi";
import { ConnectErrorType } from "wagmi/actions";
import { RoninButtons } from "./buttons/RoninButtons";
import { OtherWalletsButton } from "./buttons/OtherWalletsButton";
import { InjectedProviderButtons } from "./buttons/InjectedProviderButtons";
import { MetaMaskButton } from "./buttons/MetaMaskButton";
import { CoinbaseButton } from "./buttons/CoinbaseButton";
import { RoninButton } from "./buttons/RoninButton";
import { SequenceButton } from "./buttons/SequenceButton";
import { WalletConnectButton } from "./buttons/WalletConnectButton";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { GoogleButton } from "features/auth/components/buttons/GoogleButton";
import { Loading } from "features/auth/components";
import { CONFIG } from "lib/config";
import { FSLButton } from "features/auth/components/buttons/FSLButton";
import { WechatButton } from "features/auth/components/buttons/WechatButton";
import { fslAuthorization } from "features/auth/actions/oauth";
import { SignMessage } from "./SignMessage";

const CONTENT_HEIGHT = 365;

const ConnectingToWallet: React.FC<{ disconnect: () => void }> = ({
  disconnect,
}) => {
  const { t } = useAppTranslation();

  return (
    <div>
      <div className="px-2 mb-3 mt-1">
        <p className="text-sm">{t("walletWall.pleaseAcceptConnection")}</p>
      </div>
      <Button onClick={disconnect}>{t("walletWall.tryAnotherWallet")}</Button>
    </div>
  );
};

const ConnectErrorMessage: React.FC<{
  error: ConnectErrorType;
}> = ({ error }) => {
  const { t } = useAppTranslation();

  switch (error.name) {
    case "ConnectorAlreadyConnectedError":
      return (
        <div className="px-2 mt-2 mb-3">
          {t("walletWall.connectError.alreadyConnected")}
        </div>
      );
    case "UserRejectedRequestError":
      return (
        <div className="px-2 mt-2 mb-3">
          {t("walletWall.connectError.userRejectedRequest")}
        </div>
      );
    case "ResourceUnavailableRpcError":
      return (
        <div className="px-2 mt-2 mb-3">
          {t("walletWall.connectError.resourceUnavailable")}
        </div>
      );
    case "WagmiCoreError":
      return <div className="px-2 mt-2 mb-3">{error.message}</div>;
    default:
      return <div className="px-2 mt-2 mb-3">{error.message}</div>;
  }
};

const ConnectError: React.FC<{
  error: ConnectErrorType;
  disconnect: () => void;
}> = ({ error, disconnect }) => {
  const { t } = useAppTranslation();

  return (
    <div>
      <ConnectErrorMessage error={error} />
      <div>
        <Button onClick={() => disconnect()}>
          {t("walletWall.tryAnotherWallet")}
        </Button>
      </div>
    </div>
  );
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

const displayUriListener = (uri: string) => {
  window.open(`roninwallet://wc?uri=${encodeURIComponent(uri)}`, "_self");
};

export const WalletWall: React.FC<{
  header?: React.ReactNode;
  screen?: "signin" | "signup" | "walletWall";
  onSignMessage: ({
    address,
    signature,
  }: {
    address: string;
    signature: string;
  }) => void;
}> = ({ header, screen = "walletWall", onSignMessage }) => {
  const { authService } = useContext(AuthContext);
  const { t } = useAppTranslation();

  const [page, setPage] = useState<"home" | "other" | "ronin">("home");
  const [showLoading, setShowLoading] = useState(false);
  const [hasClickedWallet, setHasClickedWallet] = useState(false);

  const { isConnecting, isConnected } = useAccount();
  const { connect, reset, error, isError, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const connections = useConnections();

  /** Custom code for the WalletConnect deep link used by the Ronin wallet */
  const walletConnectConnector = connectors.filter(
    ({ id }) => id === "walletConnect",
  )[0];

  const [provider, setProvider] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const provider = await walletConnectConnector.getProvider();
      setProvider(provider);
    })();
  }, []);

  const setRoninDeepLink = (isOn: boolean) => {
    if (isOn && isMobile) {
      provider && (provider as any).once("display_uri", displayUriListener);
    }

    if (!isOn) {
      provider &&
        (provider as any).removeListener("display_uri", displayUriListener);
    }
  };

  const isPWA = useIsPWA();
  const isMobilePWA = isMobile && isPWA;
  const isLoginScreen = screen === "signin" || screen === "signup";
  const showWechat = !isMobile && screen !== "signup";

  const onConnect = (connector: Connector | CreateConnectorFn) => {
    setHasClickedWallet(true);
    connect({ connector });
  };

  const onDisconnect = () => {
    disconnect();
    connections.forEach((connection) =>
      disconnect({ connector: connection.connector }),
    );
  };

  if (showLoading) {
    return <Loading />;
  }

  if (isConnecting) {
    return <ConnectingToWallet disconnect={disconnect} />;
  }

  if (isError) {
    return <ConnectError error={error} disconnect={reset} />;
  }

  if (isConnected && (!isLoginScreen || hasClickedWallet)) {
    return (
      <SignMessage onSignMessage={onSignMessage} onDisconnect={onDisconnect} />
    );
  }

  if (isMobilePWA) {
    return (
      <div
        className="overflow-y-auto scrollable pt-1"
        style={{ maxHeight: CONTENT_HEIGHT }}
      >
        <>
          {header}

          {page === "home" && (
            <>
              {isLoginScreen && (
                <>
                  <BackHeader onClick={() => authService.send("BACK")} />
                  <GoogleButton
                    onClick={() => {
                      setShowLoading(true);
                      window.location.href = `${CONFIG.API_URL}/auth/google/authorize`;
                    }}
                  />
                </>
              )}
              <InjectedProviderButtons onConnect={onConnect} />
              <MetaMaskButton onConnect={onConnect} />
              <CoinbaseButton onConnect={onConnect} />
              <RoninButtons
                onConnect={(connector) => {
                  setRoninDeepLink(true);
                  onConnect(connector);
                }}
              />

              <OtherWalletsButton
                onClick={() => setPage("other")}
                title={t("walletWall.showMore")}
              />
            </>
          )}

          {page === "other" && (
            <>
              {isLoginScreen && <BackHeader onClick={() => setPage("home")} />}
              <WalletConnectButton
                onConnect={(connector) => {
                  setRoninDeepLink(false);
                  onConnect(connector);
                }}
              />
              <SequenceButton onConnect={onConnect} />
              {isLoginScreen && (
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
              )}
              <OtherWalletsButton
                onClick={() => setPage("home")}
                title={t("walletWall.showLess")}
              />
            </>
          )}
        </>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto scrollable"
      style={{ maxHeight: CONTENT_HEIGHT }}
    >
      <>
        {header}

        {page === "home" && (
          <>
            {isLoginScreen && (
              <>
                <BackHeader onClick={() => authService.send("BACK")} />
                <GoogleButton
                  onClick={() => {
                    setShowLoading(true);
                    window.location.href = `${CONFIG.API_URL}/auth/google/authorize`;
                  }}
                />
              </>
            )}

            <InjectedProviderButtons onConnect={onConnect} />
            <MetaMaskButton onConnect={onConnect} />
            <CoinbaseButton onConnect={onConnect} />
            <RoninButton onClick={() => setPage("ronin")} />
            <OtherWalletsButton
              onClick={() => setPage("other")}
              title={t("walletWall.showMore")}
            />
          </>
        )}

        {page === "other" && (
          <>
            {isLoginScreen && <BackHeader onClick={() => setPage("home")} />}
            <WalletConnectButton
              onConnect={(connector) => {
                setRoninDeepLink(false);
                onConnect(connector);
              }}
            />
            <SequenceButton onConnect={onConnect} />
            {showWechat && (
              <WechatButton
                onClick={() => {
                  setShowLoading(true);
                  window.location.href = `${CONFIG.API_URL}/auth/wechat/authorize`;
                }}
              />
            )}
            {isLoginScreen && (
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
            )}
            <OtherWalletsButton
              onClick={() => setPage("home")}
              title={t("walletWall.showLess")}
            />
          </>
        )}

        {page === "ronin" && (
          <>
            {isLoginScreen && <BackHeader onClick={() => setPage("home")} />}
            <RoninButtons
              onConnect={(connector) => {
                setRoninDeepLink(true);
                onConnect(connector);
              }}
            />
            <OtherWalletsButton
              onClick={() => setPage("home")}
              title={t("walletWall.showLess")}
            />
          </>
        )}
      </>
    </div>
  );
};
