import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { GoogleButton } from "features/auth/components/buttons/GoogleButton";
import { useGoogleLinkPopup } from "features/auth/lib/useGoogleLinkPopup";
import { WalletWall } from "features/wallet/components/WalletWall";
import { Loading } from "features/auth/components";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { MachineState } from "features/game/lib/gameMachine";
import type { ContentComponentProps } from "../../island/hud/components/settings-menu/GameOptions";
import { hasFeatureAccess } from "lib/flags";

const _linkingSocial = (state: MachineState) => state.matches("linkingSocial");
const _linkingSocialSuccess = (state: MachineState) =>
  state.matches("linkingSocialSuccess");
const _linkingSocialFailed = (state: MachineState) =>
  state.matches("linkingSocialFailed");
const _errorCode = (state: MachineState) => state.context.errorCode;
const _hasDualLogin = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "DUAL_LOGIN");

type WalletReauth = { address: string; signature: string };

/**
 * Google linking ceremony — symmetric counterpart to LinkWallet.
 *
 * Flow:
 *   1. WalletWall captures the EXISTING wallet signature (existing
 *      identity re-auth).
 *   2. GoogleButton opens the OAuth popup → id_token.
 *   3. Effect dispatches `social.linked` once both creds are present.
 *   4. View tracks `linkingSocial` / `linkingSocialSuccess` /
 *      `linkingSocialFailed` and routes errors through `ErrorMessage`.
 */
export const LinkGoogle: React.FC<Partial<ContentComponentProps>> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthContext);
  const google = useGoogleLinkPopup();

  const isLinking = useSelector(gameService, _linkingSocial);
  const isLinkingSuccess = useSelector(gameService, _linkingSocialSuccess);
  const isLinkingFailed = useSelector(gameService, _linkingSocialFailed);
  const errorCode = useSelector(gameService, _errorCode);
  const hasDualLogin = useSelector(gameService, _hasDualLogin);

  const [walletReauth, setWalletReauth] = useState<WalletReauth | null>(null);

  // Once both credentials are captured, fire the event exactly once.
  // Effect deps don't change after the dispatch (we don't reset state
  // here — that would cascade renders), so this fires at most once per
  // wallet-sig + id_token pair.
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

  if (!hasDualLogin) {
    return (
      <div className="flex flex-col gap-2 items-center p-4">
        <Label type="default" className="ml-2">
          {t("linkedAccounts.linkGoogle")}
        </Label>
        <p className="text-sm text-center mt-2">
          {t("linkedAccounts.googleLinkingComingSoon")}
        </p>
      </div>
    );
  }

  if (isLinking) {
    return (
      <div className="flex flex-col gap-2">
        <Label type="default" className="ml-2">
          {t("linkedAccounts.linkGoogle")}
        </Label>
        <Loading text={t("linkedAccounts.linking")} />
      </div>
    );
  }

  if (isLinkingSuccess) {
    return (
      <div className="flex flex-col gap-2">
        <Label type="default" className="ml-2">
          {t("linkedAccounts.linkGoogle")}
        </Label>
        <p className="text-sm mb-2 ml-2">
          {t("linkedAccounts.linkingSuccess")}
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

  if (isLinkingFailed) {
    return <ErrorMessage errorCode={errorCode!} />;
  }

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
      <GoogleButton onClick={google.open} />
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
};
