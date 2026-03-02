import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import React, { useContext, useState } from "react";
import { ClaimReward } from "./ClaimReward";
import { Context } from "features/game/GameProvider";
import { BB_TO_GEM_RATIO } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Gems: React.FC = () => {
  const { gameService } = useContext(Context);
  const [page, setPage] = useState(0);

  const { t } = useAppTranslation();

  if (page === 0) {
    return (
      <>
        <div className="p-1">
          <Label icon={ITEM_DETAILS.Gem.image} type="default" className="mb-2">
            {t("gems.update")}
          </Label>
          <p className="text-sm mb-2">{t("gems.intro")}</p>
          <p className="text-sm mb-2">{t("gems.intro.two")}</p>
        </div>
        <Button onClick={() => setPage(1)}>{t("continue")}</Button>
      </>
    );
  }

  const gems =
    gameService
      .getSnapshot()
      .context.state.inventory["Block Buck"]?.toNumber() ?? 0;

  const onClaim = () => {
    gameService.send({
      type: "garbage.sold",
      item: "Block Buck",
      amount: gems,
    });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  return (
    <ClaimReward
      onClaim={onClaim}
      reward={{
        message: "Spend them wisely!",
        id: "revealed-reward",
        items: { Gem: gems * BB_TO_GEM_RATIO },
        wearables: {},
        sfl: 0,
        coins: 0,
      }}
    />
  );
};
