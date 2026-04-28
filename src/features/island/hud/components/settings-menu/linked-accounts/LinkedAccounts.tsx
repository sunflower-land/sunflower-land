import React, { useContext, useEffect, useState } from "react";
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
import { useGoogleLinkPopup } from "features/auth/lib/useGoogleLinkPopup";
import { WalletWall } from "features/wallet/components/WalletWall";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _socialDetails = (state: MachineState) => state.context.socialDetails;
const _linkingSocial = (state: MachineState) => state.matches("linkingSocial");
const _unlinkingSocial = (state: MachineState) =>
  state.matches("unlinkingSocial");

type WalletReauth = { address: string; signature: string };

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

  const google = useGoogleLinkPopup();

  // The "Link Google" ceremony is multi-step: capture wallet sig, then
  // open Google popup. `googleLinkMode` toggles the panel into ceremony
  // view; `walletReauth` captures the wallet sig between steps.
  const [googleLinkMode, setGoogleLinkMode] = useState(false);
  const [walletReauth, setWalletReauth] = useState<WalletReauth | null>(null);

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

  const cancelGoogleLink = () => {
    setGoogleLinkMode(false);
    setWalletReauth(null);
    google.reset();
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
          <Button onClick={cancelGoogleLink}>{t("cancel")}</Button>
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
          <Button disabled>{t("linkedAccounts.linking")}</Button>
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
        <Button onClick={cancelGoogleLink}>{t("cancel")}</Button>
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
          <Button onClick={startGoogleLink}>
            {t("linkedAccounts.linkGoogle")}
          </Button>
        )}
      </div>
    </div>
  );
};
