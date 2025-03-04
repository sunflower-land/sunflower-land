import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Context } from "features/auth/lib/Provider";
import { isAddress } from "ethers/lib/utils";
import { useSelector } from "@xstate/react";
import { Wallet } from "features/wallet/Wallet";
import { ClaimAccount } from "./NoAccount";
import { Label } from "components/ui/Label";
import { removeJWT } from "../actions/social";
import { AuthMachineState } from "../lib/authMachine";

const _userAddress = (state: AuthMachineState) =>
  state.context.user.token?.address;

export const WalletInUse: React.FC = () => {
  const { authService } = useContext(Context);
  const userAddress = useSelector(authService, _userAddress);

  const { t } = useAppTranslation();

  const [showClaimAccount, setShowClaimAccount] = useState(false);

  if (showClaimAccount) {
    return (
      <Wallet action="login">
        <ClaimAccount
          onBack={() => setShowClaimAccount(false)}
          onClaim={(id) => authService.send("CLAIM", { id })}
        />
      </Wallet>
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
        {isAddress(userAddress ?? "") && (
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
            authService.send("BACK");
          }}
        >
          {t("error.walletInUse.three")}
        </Button>
      </div>
    </>
  );
};
