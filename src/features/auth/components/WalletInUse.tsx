import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Context } from "features/auth/lib/Provider";
import { isAddress } from "ethers/lib/utils";
import { useActor } from "@xstate/react";
import { ClaimAccount } from "./NoAccount";
import { Label } from "components/ui/Label";
import { removeJWT } from "../actions/social";

export const WalletInUse: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const { t } = useAppTranslation();

  const [showClaimAccount, setShowClaimAccount] = useState(false);

  if (showClaimAccount) {
    return (
      <ClaimAccount
        onBack={() => setShowClaimAccount(false)}
        onClaim={(id) => authService.send({ type: "CLAIM", id })}
      />
    );
  }

  return (
    <>
      <div className="px-2">
        <Label type="chill" className="mb-2" icon={SUNNYSIDE.icons.heart}>
          {t("noaccount.newFarmer")}
        </Label>
        <p className="mb-3">{t("error.walletInUse.one")}</p>
        <p className="mb-2 text-xs">{t("error.walletInUse.two")}</p>
        {isAddress(authState.context.user.token?.address ?? "") && (
          <div className="mb-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xs"
              onClick={() => setShowClaimAccount(true)}
            >
              {t("noaccount.alreadyHaveNFTFarm")}
            </a>
          </div>
        )}
      </div>

      <div className="flex mt-1">
        <Button
          onClick={() => {
            removeJWT();
            authService.send({ type: "BACK" });
          }}
        >
          {t("error.walletInUse.three")}
        </Button>
      </div>
    </>
  );
};
