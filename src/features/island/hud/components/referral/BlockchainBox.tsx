import React, { useContext, useState } from "react";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { GameWallet } from "features/wallet/Wallet";
import { useGame } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const BlockchainBox: React.FC = () => {
  const { gameService, gameState } = useGame();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const [showWalletWall, setShowWalletWall] = useState(false);

  const { t } = useAppTranslation();

  const wallet = gameState.context.linkedWallet;

  const handleCheckEligibility = () => {
    if (!wallet) {
      setShowWalletWall(true);
      return;
    }

    handleOpenBox();
  };

  const handleOpenBox = async () => {
    gameService.send("blockchainBox.claimed", {
      effect: {
        type: "blockchainBox.claimed",
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  const reward = gameState.context.state.pumpkinPlaza.blockchainBox;

  if (reward) {
    return (
      <ClaimReward
        reward={{
          message: t("reward.blockchainBoxSuccess"),
          id: "revealed-reward",
          items: reward.items,
          wearables: {},
          sfl: 0,
          coins: 0,
          vipDays: reward.vipDays,
        }}
      />
    );
  }

  if (showWalletWall && !wallet) {
    return <GameWallet action="dailyReward" />;
  }

  return (
    <div className="p-1">
      <Label type="info" className="mb-1">
        {t("blockchain.limited.airdrop")}
      </Label>
      <p className="text-sm mb-2">{t("blockchain.bonus.rewards")}</p>
      <p className="text-sm mb-2">{t("blockchain.earn.items")}</p>
      <p className="text-xxs mb-2">{t("blockchain.claim.once")}</p>
      <Button onClick={handleCheckEligibility}>
        {t("blockchain.check.eligibility")}
      </Button>
    </div>
  );
};
