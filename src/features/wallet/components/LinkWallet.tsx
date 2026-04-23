import React, { useContext } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import walletIcon from "assets/icons/wallet.png";
import { WalletWall } from "./WalletWall";
import { Context } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { GoogleButton } from "features/auth/components/buttons/GoogleButton";
import { useGoogleLinkPopup } from "features/auth/lib/useGoogleLinkPopup";

const LinkHeader: React.FC = () => {
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

/**
 * Wallet linking now requires re-confirming the EXISTING Google
 * identity before the new wallet ceremony, so a stolen JWT alone
 * can't perform the link.
 *
 * Flow:
 *   1. User clicks "Confirm with Google" → opens OAuth popup → returns id_token.
 *   2. Once id_token captured, the wallet selection / sign UI renders.
 *   3. On signed message, dispatch `wallet.linked` with both credentials.
 */
export const LinkWallet: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const google = useGoogleLinkPopup();

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

  return (
    <WalletWall
      header={<LinkHeader />}
      onSignMessage={({ address, signature }) => {
        gameService.send("wallet.linked", {
          effect: {
            type: "wallet.linked",
            linkedWallet: address,
            signature,
            googleIdToken: google.idToken,
          },
          authToken: authService.getSnapshot().context.user.rawToken as string,
        });
      }}
    />
  );
};
