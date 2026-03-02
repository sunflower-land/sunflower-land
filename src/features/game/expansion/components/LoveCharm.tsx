import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { ClaimReward } from "./ClaimReward";

export const LoveCharm: React.FC = () => {
  const { gameService } = useContext(Context);
  const [page, setPage] = useState(0);

  const { t } = useAppTranslation();

  if (page === 0) {
    return (
      <>
        <div className="p-1">
          <Label
            icon={ITEM_DETAILS["Love Charm"].image}
            type="default"
            className="mb-2"
          >
            {t("loveCharm.update")}
          </Label>
          <p className="text-sm mb-2">{t("loveCharm.intro")}</p>
          <p className="text-sm mb-2">{t("loveCharm.intro.two")}</p>
        </div>
        <Button onClick={() => setPage(1)}>{t("continue")}</Button>
      </>
    );
  }

  const communityCoins =
    gameService
      .getSnapshot()
      .context.state.inventory["Community Coin"]?.toNumber() ?? 0;

  const onClaim = () => {
    gameService.send({
      type: "garbage.sold",
      item: "Community Coin",
      amount: communityCoins,
    });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  return (
    <ClaimReward
      onClaim={onClaim}
      reward={{
        message: "Spend them wisely!",
        id: "revealed-reward",
        items: { "Love Charm": communityCoins * 25 },
        wearables: {},
        sfl: 0,
        coins: 0,
      }}
    />
  );
};
