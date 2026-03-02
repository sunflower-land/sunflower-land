import { Button } from "components/ui/Button";

import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { useSelector } from "@xstate/react";
import walletIcon from "assets/icons/wallet.png";
import { GameWallet } from "features/wallet/Wallet";
import { formatDateTime } from "lib/utils/time";

const FSL_WECHAT_DEPRECATION_DATE = new Date("2025-12-10");

export const MigrateToLinkedWallet: React.FC = () => {
  const { gameService } = useContext(Context);

  const isFSL = useSelector(
    gameService,
    (state) => state.context.method === "fsl",
  );
  const isWechat = useSelector(
    gameService,
    (state) => state.context.method === "wechat",
  );

  const [showLinkingWallet, setShowLinkingWallet] = useState(false);
  const { t } = useAppTranslation();

  const title = isFSL ? "FSL" : isWechat ? "Wechat" : "this";

  if (showLinkingWallet) {
    return (
      <GameWallet action="linkWallet">
        <div className="flex items-center">
          <Label type="default" icon={walletIcon} className="ml-2">
            {t("wallet.linkWeb3")}
          </Label>
        </div>
        <div className="flex flex-col p-2 text-xs mb-1">
          <span>{t("description.fslWechatDeprecationThankYou")}</span>
        </div>
        <Button
          onClick={() => {
            setShowLinkingWallet(false);
            gameService.send({ type: "ACKNOWLEDGE" });
          }}
        >
          {t("continue")}
        </Button>
      </GameWallet>
    );
  }

  return (
    <div>
      <div className="flex items-center">
        <Label type="default" icon={walletIcon} className="ml-2">
          {t("wallet.linkWeb3")}
        </Label>
      </div>
      <div className="flex flex-col p-2 text-xs space-y-1 mb-1">
        <span>
          {t("description.fslWechatDeprecation", {
            date: formatDateTime(FSL_WECHAT_DEPRECATION_DATE.toISOString()),
            title: title,
          })}
        </span>
        <span>{t("description.fslWechatDeprecationLinkWallet")}</span>
      </div>
      <Button
        onClick={() => {
          setShowLinkingWallet(true);
        }}
      >
        {t("wallet.linkWeb3")}
      </Button>
    </div>
  );
};
