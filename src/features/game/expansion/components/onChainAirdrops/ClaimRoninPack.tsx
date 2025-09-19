import React, { useState } from "react";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";

import { RONIN_BOX_REWARDS, RoninV2PackName } from "features/wallet/lib/ronin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRoninPack } from "features/roninAirdrop/actions/getRoninPack";
import confetti from "canvas-confetti";
import { Loading } from "features/auth/components";
import { Box } from "components/ui/Box";
import giftIcon from "assets/icons/gift.png";
import { ClaimReward } from "../ClaimReward";

const _nft = (state: MachineState) => state.context.state.nfts?.ronin;
const _createdAt = (state: MachineState) => state.context.state.createdAt;

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
      <Label className="ml-2 mb-2" type="warning">
        Flower on Ronin
      </Label>
      <p className="text-xs">
        FLOWER is now available on Ronin! To celebrate this launch, we are
        giving exclusive Ronin packs to eligible players.
      </p>

      <Button className="mt-2" onClick={check}>
        Check Eligibility
      </Button>
    </div>
  );
};
