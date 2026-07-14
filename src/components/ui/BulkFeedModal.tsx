import React from "react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { NumberInput } from "./NumberInput";
import type { Equipped } from "features/game/types/bumpkin";
import { RequirementLabel } from "./RequirementsLabel";

interface BulkFeedProps {
  show: boolean;
  onHide: () => void;
  itemAmount: Decimal;
  customAmount: Decimal;
  setCustomAmount: (amount: Decimal) => void;
  onCancel: () => void;
  onFeed: () => void;
  xpAmount: Decimal;
  feedLabel: string;
  bumpkinParts?: Partial<Equipped>;
}

export const BulkFeedModal: React.FC<BulkFeedProps> = ({
  show,
  onHide,
  itemAmount,
  customAmount,
  setCustomAmount,
  onCancel,
  onFeed,
  xpAmount,
  feedLabel,
  bumpkinParts,
}) => {
  const { t } = useAppTranslation();

  const isOutOfRange =
    !customAmount.isInteger() ||
    customAmount.greaterThan(itemAmount) ||
    customAmount.lessThanOrEqualTo(0);

  const half = new Decimal(Math.floor(itemAmount.mul(0.5).toNumber()));
  const safeHalf = half.greaterThan(0) ? half : new Decimal(1);
  const isHalfDisabled = itemAmount.lessThan(2);

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
              maxDecimalPlaces={0}
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
            <RequirementLabel type="xp" xp={xpAmount} />
          </div>
        </div>
        <div className="flex justify-around mt-2 space-x-1">
          <Button onClick={onCancel}>{t("cancel")}</Button>
          <Button disabled={isOutOfRange} onClick={onFeed}>
            {feedLabel}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
