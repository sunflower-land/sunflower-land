import React from "react";
import { Checkbox } from "components/ui/Checkbox";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { UseSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";

interface Props {
  payment: UseSpeedUpPayment;
}

/**
 * Renders a Pay with Gems / Pay with Coins selector for speed-up modals.
 *
 * Returns null when the player does not have a Dino Egg Trophy placed —
 * callers can render unconditionally and it'll only show for boosted players.
 */
export const SpeedUpPaymentSelector: React.FC<Props> = ({ payment }) => {
  const { t } = useAppTranslation();

  if (!payment.canPayWithCoins) {
    return null;
  }

  const {
    paymentMethod,
    setPaymentMethod,
    gemCost,
    coinCost,
    coinsSpentToday,
    dailyLimit,
    wouldExceedDailyCoinLimit,
    hasEnoughGems,
    hasEnoughCoins,
  } = payment;

  return (
    <div className="flex flex-col gap-1 my-2 w-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={paymentMethod === "gems"}
            onChange={() => setPaymentMethod("gems")}
          />
          <span className="text-sm">{t("speedUp.payWithGems")}</span>
        </div>
        <Label
          type={hasEnoughGems ? "default" : "danger"}
          icon={ITEM_DETAILS.Gem.image}
        >
          {gemCost}
        </Label>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={paymentMethod === "coins"}
            onChange={() =>
              !wouldExceedDailyCoinLimit && setPaymentMethod("coins")
            }
            disabled={wouldExceedDailyCoinLimit}
          />
          <span className="text-sm">{t("speedUp.payWithCoins")}</span>
        </div>
        <Label
          type={
            wouldExceedDailyCoinLimit || !hasEnoughCoins ? "danger" : "default"
          }
          icon={SUNNYSIDE.ui.coins}
        >
          {coinCost}
        </Label>
      </div>
      <span className="text-xxs ml-1">
        {wouldExceedDailyCoinLimit
          ? t("speedUp.dailyCoinLimitReached")
          : t("speedUp.dailyCoinLimit", {
              used: setPrecision(new Decimal(coinsSpentToday), 0).toString(),
              limit: dailyLimit.toLocaleString(),
            })}
      </span>
    </div>
  );
};
