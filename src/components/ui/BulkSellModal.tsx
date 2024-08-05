import React from "react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import coins from "assets/icons/coins.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { NumberInput } from "./NumberInput";
import { setPrecision } from "lib/utils/formatNumber";

interface BulkSellProps {
  show: boolean;
  onHide: () => void;
  cropAmount: Decimal;
  customAmount: Decimal;
  setCustomAmount: (amount: Decimal) => void;
  onCancel: () => void;
  onSell: () => void;
  coinAmount: Decimal;
}

export const BulkSellModal: React.FC<BulkSellProps> = ({
  show,
  onHide,
  cropAmount,
  customAmount,
  setCustomAmount,
  onCancel,
  onSell,
  coinAmount,
}) => {
  const { t } = useAppTranslation();

  const isOutOfRange =
    customAmount.greaterThan(cropAmount) || customAmount.lessThanOrEqualTo(0);

  return (
    <Modal show={show} onHide={onHide}>
      <Panel className="w-4/5 m-auto">
        <div className="flex flex-col items-center">
          <p className="text-sm text-start w-full mb-1">
            {t("confirmation.enterAmount")}
          </p>
          <div className="flex items-center w-full">
            <NumberInput
              value={customAmount}
              maxDecimalPlaces={2}
              isOutOfRange={isOutOfRange}
              onValueChange={setCustomAmount}
            />
            <Button
              onClick={() => setCustomAmount(setPrecision(cropAmount.mul(0.5)))}
              className="ml-2 px-1 py-1 w-auto"
            >
              {`50%`}
            </Button>
            <Button
              onClick={() => setCustomAmount(cropAmount)}
              className="ml-2 px-1 py-1 w-auto"
            >
              {t("max")}
            </Button>
          </div>
          <div className="inline-flex items-center">
            {`${t("bumpkinTrade.youWillReceive")}: ${coinAmount}`}
            <img src={coins} alt="coins" className="ml-2 mt-1" />
          </div>
        </div>
        <div className="flex justify-content-around mt-2 space-x-1">
          <Button onClick={onCancel}>{t("cancel")}</Button>
          <Button disabled={isOutOfRange} onClick={onSell}>
            {t("sell")}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
