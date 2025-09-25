import React, { useState } from "react";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { Button } from "components/ui/Button";

import { RONIN_BOX_REWARDS, RoninV2PackName } from "features/wallet/lib/ronin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRoninPack } from "features/roninAirdrop/actions/getRoninPack";
import confetti from "canvas-confetti";
import { Loading } from "features/auth/components";
import { ClaimReward } from "../ClaimReward";
import { SUNNYSIDE } from "assets/sunnyside";

export const ClaimRoninPack: React.FC = () => {
  const { gameState, gameService } = useGame();
  const [isLoading, setIsLoading] = useState(false);
  const [reward, setReward] = useState<RoninV2PackName | null>(null);

  const { t } = useAppTranslation();

  const check = async () => {
    setIsLoading(true);

    const { reward } = await getRoninPack({
      address: gameState.context.linkedWallet ?? "",
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    confetti();

    setReward(reward);
    setIsLoading(false);
  };

  const claim = () => {
    gameService.send("roninPack.claimed", {
      effect: {
        type: "roninPack.claimed",
      },
    });
    gameService.send("ACKNOWLEDGE");
  };

  if (isLoading) {
    return <Loading />;
  }

  if (reward) {
    const items = RONIN_BOX_REWARDS[reward].items;
    return (
      <ClaimReward
        reward={{
          createdAt: Date.now(),
          id: "ronin-airdrop",
          items,
          wearables: {},
          sfl: 0,
          coins: 0,
          message: `You have been awarded a ${reward}!`,
        }}
        onClaim={claim}
        label={reward}
      />
    );
  }

  return (
    <div>
      <Label className="ml-2" type="warning">
        {t("ronin.flowerOnRonin")}
      </Label>
      <p className="text-sm p-2">{t("ronin.flowerOnRoninDescription")}</p>

      <img
        src={SUNNYSIDE.announcement.roninAirdrop}
        className="w-full rounded-md"
      />

      <Button className="mt-2" onClick={check}>
        {t("ronin.claimReward")}
      </Button>
    </div>
  );
};

export const RoninClaimedSuccess: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  return (
    <>
      <Label type="success" className="mb-2">
        {t("ronin.rewardClaimed")}
      </Label>
      <p className="text-sm mb-2">{t("ronin.rewardClaimedDescription")}</p>
      <p className="text-sm mb-2">{t("ronin.rewardClaimedDescription2")}</p>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
