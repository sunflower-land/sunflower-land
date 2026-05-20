import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { useConnections, useDisconnect } from "wagmi";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import Switch from "components/ui/Switch";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { Loading } from "features/auth/components";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { MachineState } from "features/game/lib/gameMachine";
import { GameWallet } from "features/wallet/Wallet";
import { SignMessageBody } from "features/wallet/components/SignMessage";
import { removeJWT } from "features/auth/actions/social";
import { useNow } from "lib/utils/hooks/useNow";
import { getRelativeTime } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import type { ContentComponentProps } from "../../island/hud/components/settings-menu/GameOptions";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _socialDetails = (state: MachineState) => state.context.socialDetails;
const _toggling = (state: MachineState) => state.matches("togglingSocialLogin");
const _togglingSuccess = (state: MachineState) =>
  state.matches("togglingSocialLoginSuccess");
const _togglingFailed = (state: MachineState) =>
  state.matches("togglingSocialLoginFailed");
const _errorCode = (state: MachineState) => state.context.errorCode;

type WalletReauth = { address: string; signature: string };

/**
 * Manage panel for an already-linked Google account. Lets the player
 * toggle Google as a permitted login method without removing the link.
 *
 * Layout per the design wireframe:
 *   Card 1 — Google account (display only): icon, email, "this device"
 *            line when the session is itself Google.
 *   Card 2 — Allow Google sign-in: switch + description. When the
 *            current session is Google and the user is disabling,
 *            an inline confirmation block appears inside this card
 *            warning them that they'll be logged out.
 *   Footer — Either an italic "wallet is linked, safe" reassurance
 *            or, when no wallet is linked, a permanent warning info
 *            box. The toggle itself is disabled in the no-wallet
 *            case because the BE rejects disable for wallet-less
 *            farms (lockout safeguard).
 */
export const LinkedGooglePanel: React.FC<Partial<ContentComponentProps>> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthContext);
  const { mutate: disconnect } = useDisconnect();
  const connections = useConnections();
  const now = useNow();

  const onDisconnect = () => {
    disconnect();
    connections.forEach((connection) =>
      disconnect({ connector: connection.connector }),
    );
  };

  const linkedWallet = useSelector(gameService, _linkedWallet);
  const socialDetails = useSelector(gameService, _socialDetails);
  const isToggling = useSelector(gameService, _toggling);
  const isTogglingSuccess = useSelector(gameService, _togglingSuccess);
  const isTogglingFailed = useSelector(gameService, _togglingFailed);
  const errorCode = useSelector(gameService, _errorCode);

  const sessionToken = authService.getSnapshot().context.user.token;
  const currentProvider = sessionToken?.provider;
  const isLoggedInViaGoogle = currentProvider === "google";

  const currentlyEnabled = !socialDetails?.disabled;
  const hasWallet = !!linkedWallet;

  // Local UI flow. The state machine drives the network call; this just
  // sequences the inline confirmation → wallet re-auth → log-out steps.
  const [pendingToggle, setPendingToggle] = useState<
    null | "enable" | "disable"
  >(null);
  const [walletReauth, setWalletReauth] = useState<WalletReauth | null>(null);
  const [showInlineConfirm, setShowInlineConfirm] = useState(false);

  // Once we have a wallet signature and a pending toggle, fire the
  // event exactly once. Effect dispatches to an xstate machine; we
  // don't reset state here (see CLAUDE.md — no setState cascades).
  useEffect(() => {
    if (!walletReauth || !pendingToggle) return;

    const authToken = authService.getSnapshot().context.user.rawToken;
    if (!authToken) return;

    gameService.send("social.loginToggled", {
      effect: {
        type: "social.loginToggled",
        provider: "google",
        enabled: pendingToggle === "enable",
        walletAddress: walletReauth.address,
        walletSignature: walletReauth.signature,
      },
      authToken,
    });
  }, [walletReauth, pendingToggle, authService, gameService]);

  // After a successful disable while logged in via Google, log the
  // user out so they land on WalletWall.
  useEffect(() => {
    if (
      isTogglingSuccess &&
      pendingToggle === "disable" &&
      isLoggedInViaGoogle
    ) {
      removeJWT();
      authService.send("LOGOUT");
    }
  }, [isTogglingSuccess, pendingToggle, isLoggedInViaGoogle, authService]);

  if (!socialDetails?.email) {
    // Should never render — parent only routes here when linked.
    return (
      <div className="flex flex-col gap-2 p-4">
        <p className="text-sm">{t("linkedAccounts.noGoogle")}</p>
      </div>
    );
  }

  if (isToggling) {
    return (
      <Loading
        text={t(
          currentlyEnabled
            ? "linkedAccounts.turningOffGoogleLogin"
            : "linkedAccounts.turningOnGoogleLogin",
        )}
      />
    );
  }

  if (isTogglingSuccess) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm mb-2 ml-2">
          {t(
            // The toggle has already flipped in the state machine by this
            // point, so `currentlyEnabled` already reflects the new state.
            !currentlyEnabled
              ? "linkedAccounts.turningOffGoogleLoginSuccess"
              : "linkedAccounts.turningOnGoogleLoginSuccess",
          )}
        </p>
        <Button
          onClick={() => {
            gameService.send("CONTINUE");
            onSubMenuClick?.("linkedAccounts");
          }}
        >
          {t("continue")}
        </Button>
      </div>
    );
  }

  if (isTogglingFailed) {
    return <ErrorMessage errorCode={errorCode!} />;
  }

  // Step: wallet re-auth (after the user has confirmed the toggle).
  if (pendingToggle && !walletReauth) {
    return (
      <GameWallet action="linkGoogle">
        <SignMessageBody
          onSignMessage={({ address, signature }) =>
            setWalletReauth({ address, signature })
          }
          onDisconnect={onDisconnect}
        />
      </GameWallet>
    );
  }

  const beginDisable = () => {
    if (!hasWallet) return; // toggle is disabled in UI; defence in depth
    if (isLoggedInViaGoogle) {
      // Per wireframe: inline confirmation block inside the toggle card.
      setShowInlineConfirm(true);
      return;
    }
    setPendingToggle("disable");
  };

  const handleToggle = () => {
    if (currentlyEnabled) {
      beginDisable();
    } else {
      setPendingToggle("enable");
    }
  };

  // "Signed in on this device" / "Last signed in X · this device".
  const signedInLine = (() => {
    if (!isLoggedInViaGoogle) return null;
    if (!sessionToken?.iat) {
      return t("linkedAccounts.googleSignIn.signedInThisDevice");
    }
    const relative = getRelativeTime(sessionToken.iat * 1000, now);
    return t("linkedAccounts.googleSignIn.lastSignedInThisDevice", {
      time: relative,
    });
  })();

  // Toggle is disabled when no wallet is linked (BE rejects disable to
  // avoid permanent lockout). Re-enabling without a wallet is also
  // moot — without a wallet they can't get into the panel from any
  // other login method, so a no-wallet farm in disabled state is an
  // unreachable case in practice.
  const toggleDisabled = !hasWallet;

  return (
    <div className="flex flex-col gap-2">
      {/* Card 1 — Google account display */}
      <ButtonPanel variant="card">
        <div className="flex items-start gap-2">
          <img
            src={SUNNYSIDE.icons.googleIcon}
            alt="Google"
            className="w-8 h-8 mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                {t("linkedAccounts.googleSignIn.googleAccount")}
              </span>
              <Label type="default">{t("linkedAccounts.role.signIn")}</Label>
            </div>
            <p className="text-xs break-all mt-1">{socialDetails.email}</p>
            {signedInLine && (
              <p className="text-xs italic opacity-75 mt-1">{signedInLine}</p>
            )}
          </div>
        </div>
      </ButtonPanel>

      {/* Card 2 — Allow Google sign-in toggle */}
      <ButtonPanel variant="card">
        <Switch
          checked={currentlyEnabled}
          onChange={handleToggle}
          label={t("linkedAccounts.googleSignIn.allowLabel")}
          disabled={toggleDisabled}
        />
        <p className="text-xs italic opacity-75 mt-1 ml-1">
          {t("linkedAccounts.googleSignIn.allowDescription")}
        </p>

        {showInlineConfirm && (
          <InnerPanel className="mt-2 p-2 flex flex-col gap-2">
            <p className="text-xs">
              {t("linkedAccounts.googleSignIn.confirmSelfLogout")}
            </p>
            <div className="flex gap-1 justify-end">
              <Button
                className="w-auto px-2"
                onClick={() => setShowInlineConfirm(false)}
              >
                {t("linkedAccounts.googleSignIn.keepOn")}
              </Button>
              <Button
                className="w-auto px-2"
                onClick={() => {
                  setShowInlineConfirm(false);
                  setPendingToggle("disable");
                }}
              >
                {t("linkedAccounts.googleSignIn.turnOff")}
              </Button>
            </div>
          </InnerPanel>
        )}
      </ButtonPanel>

      {/* Footer */}
      {hasWallet ? (
        <p className="text-xs italic text-center opacity-75 mx-2 mt-1">
          {t("linkedAccounts.googleSignIn.safeFooter")}
        </p>
      ) : (
        <InnerPanel className="mt-1">
          <div className="flex items-start gap-2 p-1">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              alt=""
              className="w-3 mt-0.5 shrink-0"
            />
            <p className="text-xs">
              {t("linkedAccounts.googleSignIn.noWalletWarning")}
            </p>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
