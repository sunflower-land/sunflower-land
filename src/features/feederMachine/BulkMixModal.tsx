import React from "react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { NumberInput } from "components/ui/NumberInput";
import { Panel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";
import type { Inventory } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";
import { formatNumber } from "lib/utils/formatNumber";

interface Props {
  show: boolean;
  onClose: () => void;
  ingredients: Inventory;
  maxAmount: number;
  amount: Decimal;
  setAmount: (amount: Decimal) => void;
  onMix: () => void;
}

export const BulkMixModal: React.FC<Props> = ({
  show,
  onClose,
  ingredients,
  maxAmount,
  amount,
  setAmount,
  onMix,
}) => {
  const { t } = useAppTranslation();
  const isOutOfRange =
    !amount.isInteger() ||
    amount.lessThanOrEqualTo(0) ||
    amount.greaterThan(maxAmount);
  const halfAmount = Math.max(1, Math.floor(maxAmount / 2));

  return (
    <Modal show={show} onHide={onClose}>
      <Panel className="w-4/5 m-auto">
        <div className="flex flex-col items-center">
          <p className="text-sm text-start w-full mb-1">
            {t("feeder.enterMixAmount")}
          </p>
          <div className="flex items-center w-full">
            <NumberInput
              value={amount}
              maxDecimalPlaces={0}
              isOutOfRange={isOutOfRange}
              onValueChange={setAmount}
            />
            <Button
              disabled={maxAmount <= 0}
              onClick={() => setAmount(new Decimal(halfAmount))}
              className="ml-2 px-1 py-1 w-auto"
            >
              {`50%`}
            </Button>
            <Button
              disabled={maxAmount <= 0}
              onClick={() => setAmount(new Decimal(maxAmount))}
              className="ml-2 px-1 py-1 w-auto"
            >
              {t("max")}
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2">
            <span>{`${t("feeder.ingredientsToMix")}:`}</span>
            {getKeys(ingredients).map((ingredient) => (
              <span key={ingredient} className="inline-flex items-center">
                {formatNumber(
                  (ingredients[ingredient] ?? new Decimal(0)).mul(amount),
                )}
                <SquareIcon
                  icon={ITEM_DETAILS[ingredient].image}
                  width={7}
                  className="ml-1"
                />
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-around mt-2 space-x-1">
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button disabled={isOutOfRange} onClick={onMix}>
            {t("feeder.mix")}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
