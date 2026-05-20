import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import walletIcon from "assets/icons/wallet.png";
import { WalletWall } from "./WalletWall";
import { Context } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { GoogleButton } from "features/auth/components/buttons/GoogleButton";
import { useGoogleLinkPopup } from "features/auth/lib/useGoogleLinkPopup";
import { Loading } from "features/auth/components";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { MachineState } from "features/game/lib/gameMachine";
import type { ContentComponentProps } from "../../island/hud/components/settings-menu/GameOptions";

const _linkingWallet = (state: MachineState) => state.matches("linkingWallet");
const _linkingWalletSuccess = (state: MachineState) =>
  state.matches("linkingWalletSuccess");
const _linkingWalletFailed = (state: MachineState) =>
  state.matches("linkingWalletFailed");
const _errorCode = (state: MachineState) => state.context.errorCode;

type WalletSig = { address: string; signature: string };

const LinkHeader: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between">
        <Label className="ml-2 mt-1 mb-2" icon={walletIcon} type="default">
          {t("wallet.linkWeb3")}
        </Label>
      </div>
      <p className="text-xs mx-1 mb-2">{t("wallet.setupWeb3")}</p>
    </>
  );
};

/**
 * Wallet linking requires re-confirming the EXISTING Google identity
 * before the new wallet ceremony, so a stolen JWT alone can't perform
 * the link.
 *
 * Flow (mirrors the Google linking ceremony in LinkedAccounts):
 *   1. User clicks "Confirm with Google" → opens OAuth popup → id_token.
 *   2. Wallet selection / sign UI captures the wallet signature.
 *   3. Effect dispatches `wallet.linked` once both creds are present.
 *   4. View tracks `linkingWallet` / `linkingWalletSuccess` /
 *      `linkingWalletFailed` and routes errors through `ErrorMessage`.
 */
export const LinkWallet: React.FC<Partial<ContentComponentProps>> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const google = useGoogleLinkPopup();

  const isLinking = useSelector(gameService, _linkingWallet);
  const isLinkingSuccess = useSelector(gameService, _linkingWalletSuccess);
  const isLinkingFailed = useSelector(gameService, _linkingWalletFailed);
  const errorCode = useSelector(gameService, _errorCode);

  const [walletSig, setWalletSig] = useState<WalletSig | null>(null);

  // Once both credentials are captured, fire the event exactly once.
  // Effect deps don't change after the dispatch (we don't reset state
  // here — that would cascade renders), so this fires at most once per
  // id_token + wallet-sig pair.
  useEffect(() => {
    if (!google.idToken || !walletSig) return;

    const authToken = authService.getSnapshot().context.user.rawToken;
    if (!authToken) return;

    gameService.send("wallet.linked", {
      effect: {
        type: "wallet.linked",
        linkedWallet: walletSig.address,
        signature: walletSig.signature,
        googleIdToken: google.idToken,
      },
      authToken,
    });
  }, [google.idToken, walletSig, authService, gameService]);

  // While the BE request is in flight or has resolved, the inline
  // state owns the panel — both creds are captured at this point so
  // the wallet/Google step UI below shouldn't re-render.
  if (isLinking) {
    return (
      <div className="flex flex-col gap-2">
        <LinkHeader />
        <Loading text={t("linkedAccounts.linking")} />
      </div>
    );
  }

  if (isLinkingSuccess) {
    return (
      <div className="flex flex-col gap-2">
        <LinkHeader />
        <p className="text-sm mb-2 ml-2">
          {t("linkedAccounts.walletLinkingSuccess")}
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

  // Step 1: capture the Google id_token (existing-identity re-auth).
  if (!google.idToken) {
    return (
      <div className="flex flex-col gap-2">
        <LinkHeader />
        <Label type="default" className="ml-2">
          {t("linkedAccounts.confirmExistingGoogle")}
        </Label>
        <GoogleButton onClick={google.open} />
        {google.popupBlocked && (
          <p className="text-xs text-red-500 mx-1">
            {t("linkedAccounts.popupBlocked")}
          </p>
        )}
        {google.error && (
          <>
            <p className="text-xs text-red-500 mx-1">
              {t("linkedAccounts.linkFailed")}
            </p>
            <Button onClick={google.reset}>
              {t("linkedAccounts.linkGoogle")}
            </Button>
          </>
        )}
      </div>
    );
  }

  // Step 2: capture the wallet signature.
  return (
    <WalletWall
      header={<LinkHeader />}
      onSignMessage={({ address, signature }) =>
        setWalletSig({ address, signature })
      }
    />
  );
};
