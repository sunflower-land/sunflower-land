import React, { useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import walletIcon from "assets/icons/wallet.png";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useContext } from "react";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ContentComponentProps } from "../GameOptions";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _socialDetails = (state: MachineState) => state.context.socialDetails;

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

  const linkedWallet = useSelector(gameService, _linkedWallet);
  const socialDetails = useSelector(gameService, _socialDetails);

  const [emailRevealed, setEmailRevealed] = useState(false);

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
        ) : (
          <Button onClick={() => onSubMenuClick("linkAccountGoogle")}>
            {t("linkedAccounts.linkGoogle")}
          </Button>
        )}
      </div>
    </div>
  );
};
