import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import walletIcon from "assets/icons/wallet.png";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { MachineState } from "features/game/lib/gameMachine";
import { ContentComponentProps } from "../GameOptions";
import { GoogleButton } from "features/auth/components/buttons/GoogleButton";
import { useGoogleLinkPopup } from "features/auth/lib/useGoogleLinkPopup";
import { WalletWall } from "features/wallet/components/WalletWall";
import { Loading } from "features/auth/components";
import { ErrorMessage } from "features/auth/ErrorMessage";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _socialDetails = (state: MachineState) => state.context.socialDetails;
const _linkingSocial = (state: MachineState) => state.matches("linkingSocial");
const _linkingSocialSuccess = (state: MachineState) =>
  state.matches("linkingSocialSuccess");
const _linkingSocialFailed = (state: MachineState) =>
  state.matches("linkingSocialFailed");
const getErrorCode = (state: MachineState) => state.context.errorCode;

type WalletReauth = { address: string; signature: string };

const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visibleLocal = local.slice(0, Math.min(2, local.length));
  const localMask = "*".repeat(Math.max(3, local.length - visibleLocal.length));
  const tld = domain.includes(".") ? domain.slice(domain.lastIndexOf(".")) : "";
  const domainBody = tld ? domain.slice(0, -tld.length) : domain;
  const domainMask = "*".repeat(Math.max(3, domainBody.length));
  return `${visibleLocal}${localMask}@${domainMask}${tld}`;
};

export const LinkedAccounts: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthContext);

  const linkedWallet = useSelector(gameService, _linkedWallet);
  const socialDetails = useSelector(gameService, _socialDetails);

  const isLinking = useSelector(gameService, _linkingSocial);
  const isLinkingSocialSuccess = useSelector(
    gameService,
    _linkingSocialSuccess,
  );
  const isLinkingSocialFailed = useSelector(gameService, _linkingSocialFailed);
  const errorCode = useSelector(gameService, getErrorCode);
  const google = useGoogleLinkPopup();

  // The "Link Google" ceremony is multi-step: capture wallet sig, then
  // open Google popup. `googleLinkMode` toggles the panel into ceremony
  // view; `walletReauth` captures the wallet sig between steps.
  const [googleLinkMode, setGoogleLinkMode] = useState(false);
  const [walletReauth, setWalletReauth] = useState<WalletReauth | null>(null);
  const [emailRevealed, setEmailRevealed] = useState(false);

  // Once both credentials are captured, fire the event exactly once.
  // Effect deps don't change after the dispatch (we don't reset state
  // here — that would cascade renders), so this fires at most once per
  // wallet-sig + id_token pair. On success, `socialDetails` populates
  // in context and the view switches to the linked state below; the
  // captured creds become stale but invisible.
  useEffect(() => {
    if (!walletReauth || !google.idToken) return;

    const authToken = authService.getSnapshot().context.user.rawToken;
    if (!authToken) return;

    gameService.send("social.linked", {
      effect: {
        type: "social.linked",
        provider: "google",
        idToken: google.idToken,
        walletAddress: walletReauth.address,
        walletSignature: walletReauth.signature,
      },
      authToken,
    });
  }, [walletReauth, google.idToken, authService, gameService]);

  const startGoogleLink = () => {
    google.reset();
    setWalletReauth(null);
    setGoogleLinkMode(true);
  };

  // Once `socialDetails.email` is populated by the game machine the link is
  // complete — fall through to the main view regardless of stale local state.
  if (googleLinkMode) {
    // Step 1: capture the wallet re-auth signature.
    if (!walletReauth) {
      return (
        <div className="flex flex-col gap-2">
          <Label type="default" className="ml-2">
            {t("linkedAccounts.confirmExistingWallet")}
          </Label>
          <WalletWall
            onSignMessage={({ address, signature }) =>
              setWalletReauth({ address, signature })
            }
          />
        </div>
      );
    }

    // Step 2: launch the Google popup.
    return (
      <div className="flex flex-col gap-2">
        <Label type="default" className="ml-2">
          {t("linkedAccounts.linkGoogle")}
        </Label>
        {isLinking ? (
          <Loading text={t("linkedAccounts.linking")} />
        ) : isLinkingSocialSuccess ? (
          <>
            <p className="text-sm mb-2 ml-2">
              {t("linkedAccounts.linkingSuccess")}
            </p>
            <Button
              onClick={() => {
                gameService.send("CONTINUE");
                setGoogleLinkMode(false);
              }}
            >
              {t("continue")}
            </Button>
          </>
        ) : isLinkingSocialFailed ? (
          <ErrorMessage errorCode={errorCode!} />
        ) : (
          <GoogleButton onClick={google.open} />
        )}
        {google.popupBlocked && (
          <p className="text-xs text-red-500 mx-1">
            {t("linkedAccounts.popupBlocked")}
          </p>
        )}
        {google.error && (
          <p className="text-xs text-red-500 mx-1">
            {t("linkedAccounts.linkFailed")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs mx-1">{t("linkedAccounts.description")}</p>
      <Label type="warning" className="ml-2">
        {t("linkedAccounts.permanenceWarning")}
      </Label>

      {/* Wallet row */}
      <div className="flex flex-col gap-1 mt-2 mx-1">
        <Label type="default" icon={walletIcon}>
          {t("linkedAccounts.wallet")}
        </Label>
        {linkedWallet ? (
          <p className="text-xs break-all">{linkedWallet}</p>
        ) : (
          <Button onClick={() => onSubMenuClick("linkAccountWallet")}>
            {t("linkedAccounts.linkWallet")}
          </Button>
        )}
      </div>

      {/* Google row */}
      <div className="flex flex-col gap-1 mt-2 mx-1">
        <Label type="default">{t("linkedAccounts.google")}</Label>
        {socialDetails?.email ? (
          <>
            <div
              className="flex items-center gap-1 cursor-pointer select-none"
              onClick={() => setEmailRevealed((v) => !v)}
            >
              <p className="text-xs break-all">
                {emailRevealed
                  ? socialDetails.email
                  : maskEmail(socialDetails.email)}
              </p>
              <img
                src={SUNNYSIDE.icons.search}
                className="h-4 shrink-0"
                alt={emailRevealed ? "Hide email" : "Reveal email"}
              />
            </div>
          </>
        ) : (
          <Button onClick={startGoogleLink}>
            {t("linkedAccounts.linkGoogle")}
          </Button>
        )}
      </div>
    </div>
  );
};
