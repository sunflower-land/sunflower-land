import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { BONUSES } from "features/game/types/bonuses";
import { gameAnalytics } from "lib/gameAnalytics";
import { useContext, useState } from "react";
import { translate } from "lib/i18n/translate";

export const ParsnipGiveaway: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);

  const [state, setState] = useState<"connected" | "claim" | "claimed">(
    "connected"
  );

  const acknowledge = () => {
    setState("claim");
  };

  const claim = () => {
    // Fire event
    gameService.send("bonus.claimed", { name: "ygg-giveaway" });

    gameAnalytics.trackMilestone({ event: "Reward:ParsnipHorns:Claimed" });

    onClose();
  };

  if (state === "claimed") {
    return (
      <>
        <div className="p-2">
          <p className="text-sm mb-2">{translate("parsnip.hat")}</p>
          <p className="text-sm mb-2">
            {translate("parsnip.miss")}
          </p>
        </div>
      </>
    );
  }

  if (state === "claim") {
    return (
      <ClaimReward
        onClaim={claim}
        reward={{
          createdAt: Date.now(),
          id: "ygg-giveaway",
          items: BONUSES["ygg-giveaway"].reward.inventory,
          wearables: BONUSES["ygg-giveaway"].reward.wearables,
          sfl: 0,
        }}
      />
    );
  }

  return (
    <>
      <div className="p-2">
        <Label
          className="mb-2"
          type="warning"
          icon={SUNNYSIDE.decorations.treasure_chest}
        >
          {translate("parsnip.Bonus")}
        </Label>
        <p className="text-xs mb-2">{translate("parsnip.found")}</p>
        <p className="text-xs mb-2">
          {`You've discovered a special event wearable.`}
        </p>
      </div>
      <Button onClick={acknowledge}>{translate("parsnip.gift")}</Button>
    </>
  );
};
