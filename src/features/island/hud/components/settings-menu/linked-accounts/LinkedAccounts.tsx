import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import walletIcon from "assets/icons/wallet.png";

import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { MachineState } from "features/game/lib/gameMachine";
import { ContentComponentProps } from "../GameOptions";
import { GoogleButton } from "features/auth/components/buttons/GoogleButton";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _socialDetails = (state: MachineState) => state.context.socialDetails;
const _linkingSocial = (state: MachineState) => state.matches("linkingSocial");
const _unlinkingSocial = (state: MachineState) =>
  state.matches("unlinkingSocial");

type GoogleLinkMessage = {
  type: "sunflower-google-link";
  idToken?: string;
  email?: string;
  error?: string;
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
  const isUnlinking = useSelector(gameService, _unlinkingSocial);

  const [popupBlocked, setPopupBlocked] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Track the popup window + the origin we expect messages from.
  // Set on `onLinkGoogle`, checked in the message handler so a malicious
  // page (or a stale message from a different origin) cannot inject an
  // id_token. Both must match before we trust the message.
  const popupRef = useRef<Window | null>(null);
  const expectedOriginRef = useRef<string | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent<GoogleLinkMessage>) => {
      // Fail closed: if no popup is open or no expected origin is set,
      // ignore the message entirely.
      if (!popupRef.current || !expectedOriginRef.current) return;
      if (event.origin !== expectedOriginRef.current) return;
      if (event.source !== popupRef.current) return;
      if (event.data?.type !== "sunflower-google-link") return;

      // Consume the message; clear refs so the same popup can't deliver twice.
      popupRef.current = null;
      expectedOriginRef.current = null;

      if (event.data.error) {
        setLinkError(t("linkedAccounts.linkFailed"));
        return;
      }
      if (!event.data.idToken) {
        setLinkError(t("linkedAccounts.linkFailed"));
        return;
      }

      const authToken = authService.getSnapshot().context.user.rawToken;
      if (!authToken) {
        setLinkError(t("linkedAccounts.linkFailed"));
        return;
      }

      gameService.send("social.linked", {
        effect: {
          type: "social.linked",
          provider: "google",
          idToken: event.data.idToken,
        },
        authToken,
      });
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [authService, gameService, t]);

  const onLinkGoogle = () => {
    setLinkError(null);
    setPopupBlocked(false);

    let expectedOrigin: string;
    try {
      expectedOrigin = new URL(CONFIG.API_URL).origin;
    } catch {
      // If we can't even parse the API URL, refuse to launch — we'd
      // have no way to validate the message origin.
      setLinkError(t("linkedAccounts.linkFailed"));
      return;
    }

    const popup = window.open(
      `${CONFIG.API_URL}/google/link/authorize`,
      "sunflower-google-link",
      "width=500,height=650",
    );
    if (!popup) {
      setPopupBlocked(true);
      return;
    }

    popupRef.current = popup;
    expectedOriginRef.current = expectedOrigin;
  };

  // Testnet-only debug affordance. The backend also gates `social.unlinked`
  // to non-mainnet, so this stays inert in production even if shown.
  const onUnlinkGoogle = () => {
    const authToken = authService.getSnapshot().context.user.rawToken;
    if (!authToken) return;

    gameService.send("social.unlinked", {
      effect: { type: "social.unlinked" },
      authToken,
    });
  };

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
            <p className="text-xs break-all">{socialDetails.email}</p>
            {CONFIG.NETWORK === "amoy" && (
              <Button onClick={onUnlinkGoogle} disabled={isUnlinking}>
                {isUnlinking
                  ? t("linkedAccounts.unlinking")
                  : t("linkedAccounts.unlinkGoogleTestnet")}
              </Button>
            )}
          </>
        ) : (
          <>
            {isLinking ? (
              <Button disabled>{t("linkedAccounts.linking")}</Button>
            ) : (
              <GoogleButton onClick={onLinkGoogle} />
            )}
            {popupBlocked && (
              <p className="text-xs text-red-500">
                {t("linkedAccounts.popupBlocked")}
              </p>
            )}
            {linkError && <p className="text-xs text-red-500">{linkError}</p>}
          </>
        )}
      </div>
    </div>
  );
};
