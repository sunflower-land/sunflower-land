import React from "react";
import type Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import coins from "assets/icons/coins.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { NumberInput } from "./NumberInput";
import { setPrecision } from "lib/utils/formatNumber";
import type { Equipped } from "features/game/types/bumpkin";

interface BulkSellProps {
  show: boolean;
  onHide: () => void;
  itemAmount: Decimal;
  customAmount: Decimal;
  setCustomAmount: (amount: Decimal) => void;
  onCancel: () => void;
  onSell: () => void;
  coinAmount: Decimal;
  bumpkinParts?: Partial<Equipped>;
  maxDecimalPlaces: number;
}

export const BulkSellModal: React.FC<BulkSellProps> = ({
  show,
  onHide,
  itemAmount,
  customAmount,
  setCustomAmount,
  onCancel,
  onSell,
  coinAmount,
  bumpkinParts,
  maxDecimalPlaces,
}) => {
  const { t } = useAppTranslation();

  const isOutOfRange =
    customAmount.greaterThan(itemAmount) || customAmount.lessThanOrEqualTo(0);

  const minValid = setPrecision(
    new Decimal(1).div(10 ** maxDecimalPlaces),
    maxDecimalPlaces,
  );

  const half = setPrecision(itemAmount.mul(0.5), maxDecimalPlaces);
  const clampedUp = half.greaterThan(minValid) ? half : minValid;
  const safeHalf = clampedUp.greaterThan(itemAmount) ? itemAmount : clampedUp;

  const isHalfDisabled = safeHalf.lessThanOrEqualTo(0);

  return (
    <Modal show={show} onHide={onHide}>
      <Panel className="w-4/5 m-auto" bumpkinParts={bumpkinParts}>
        <div className="flex flex-col items-center">
          <p className="text-sm text-start w-full mb-1">
            {t("confirmation.enterAmount")}
          </p>
          <div className="flex items-center w-full">
            <NumberInput
              value={customAmount}
              maxDecimalPlaces={maxDecimalPlaces}
              isOutOfRange={isOutOfRange}
              onValueChange={setCustomAmount}
            />
            <Button
              disabled={isHalfDisabled}
              onClick={() => setCustomAmount(safeHalf)}
              className="ml-2 px-1 py-1 w-auto"
            >
              {`50%`}
            </Button>
            <Button
              onClick={() => setCustomAmount(itemAmount)}
              className="ml-2 px-1 py-1 w-auto"
            >
              {t("max")}
            </Button>
          </div>
          <div className="inline-flex items-center">
            {`${t("bumpkinTrade.youWillReceive")}: ${setPrecision(coinAmount, maxDecimalPlaces)}`}
            <img src={coins} alt="coins" className="ml-2 mt-1" />
          </div>
        </div>
        <div className="flex justify-around mt-2 space-x-1">
          <Button onClick={onCancel}>{t("cancel")}</Button>
          <Button disabled={isOutOfRange} onClick={onSell}>
            {t("sell")}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
