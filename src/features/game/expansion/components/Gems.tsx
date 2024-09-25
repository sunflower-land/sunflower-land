import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import React, { useContext, useState } from "react";
import { ClaimReward } from "./ClaimReward";
import { Context } from "features/game/GameProvider";
import { BB_TO_GEM_RATION } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

export const Gems: React.FC<{ onClaim: () => void }> = () => {
  const { gameService } = useContext(Context);
  const [page, setPage] = useState(0);

  if (page === 0) {
    return (
      <>
        <div className="p-1">
          <Label icon={ITEM_DETAILS.Gem.image} type="default" className="mb-2">
            Gem update
          </Label>
          <p className="text-sm mb-2">
            To prepare for onboarding new players, we have replaced Block Bucks
            with a new currency...Gems!
          </p>
          <p className="text-sm mb-2">
            You will receive 100 Gems for every Block Buck you own.
          </p>
        </div>
        <Button onClick={() => setPage(1)}>Continue</Button>
      </>
    );
  }

  const gems =
    gameService.state.context.state.inventory["Block Buck"]?.toNumber() ?? 0;

  const onClaim = () => {
    gameService.send("garbage.sold", { item: "Block Buck", amount: gems });
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <ClaimReward
      onClaim={onClaim}
      reward={{
        message: "Spend them wisely!",
        createdAt: Date.now(),
        id: "revealed-reward",
        items: {
          Gem: gems * BB_TO_GEM_RATION,
        },
        wearables: {},
        sfl: 0,
        coins: 0,
      }}
    />
  );
};
