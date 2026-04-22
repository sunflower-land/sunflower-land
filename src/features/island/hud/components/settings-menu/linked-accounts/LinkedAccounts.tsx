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

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _socialDetails = (state: MachineState) => state.context.socialDetails;
const _linkingSocial = (state: MachineState) => state.matches("linkingSocial");

type GoogleLinkMessage = {
  type: "sunflower-google-link";
  idToken?: string;
  email?: string;
  error?: string;
};

const apiOrigin = (() => {
  try {
    return new URL(CONFIG.API_URL).origin;
  } catch {
    return "";
  }
})();

export const LinkedAccounts: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthContext);

  const linkedWallet = useSelector(gameService, _linkedWallet);
  const socialDetails = useSelector(gameService, _socialDetails);
  const isLinking = useSelector(gameService, _linkingSocial);

  const [popupBlocked, setPopupBlocked] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent<GoogleLinkMessage>) => {
      if (apiOrigin && event.origin !== apiOrigin) return;
      if (event.data?.type !== "sunflower-google-link") return;

      if (event.data.error || !event.data.idToken) {
        return;
      }

      const authToken = authService.getSnapshot().context.user.rawToken as
        | string
        | undefined;
      if (!authToken) return;

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
  }, [authService, gameService]);

  const onLinkGoogle = () => {
    setPopupBlocked(false);
    const popup = window.open(
      `${CONFIG.API_URL}/google/link/authorize`,
      "sunflower-google-link",
      "width=500,height=650",
    );
    if (!popup) {
      setPopupBlocked(true);
    }
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
          <p className="text-xs break-all">{socialDetails.email}</p>
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
          </>
        )}
      </div>
    </div>
  );
};
