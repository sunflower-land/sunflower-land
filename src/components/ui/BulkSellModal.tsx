import React, { ChangeEvent } from "react";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import coins from "assets/icons/coins.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import classNames from "classnames";

interface BulkSellProps {
  show: boolean;
  onHide: () => void;
  cropAmount: Decimal;
  customInputAmount: string;
  setCustomInputAmount: (amount: string) => void;
  onCancel: () => void;
  onSell: () => void;
  coinAmount: Decimal;
}

export const BulkSellModal: React.FC<BulkSellProps> = ({
  show,
  onHide,
  cropAmount,
  customInputAmount,
  setCustomInputAmount,
  onCancel,
  onSell,
  coinAmount,
}) => {
  const { t } = useAppTranslation();
  const customAmount = Number(customInputAmount);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+(?!\.)/, "");

    // Check if the value has a decimal point
    const parts = value.split(".");

    // Limit the decimal places to 4
    if (parts.length > 1 && parts[1].length > 4) {
      parts[1] = parts[1].slice(0, 4);
    }

    const formattedValue = parts.join(".");

    setCustomInputAmount(formattedValue ? formattedValue.slice(0, 10) : "");
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Panel className="w-4/5 m-auto">
        <div className="flex flex-col items-center">
          <p className="text-sm text-start w-full mb-1">
            {t("confirmation.enterAmount")}
          </p>
          <div className="flex items-center w-full">
            <input
              type="number"
              placeholder="0"
              min={1}
              value={customInputAmount}
              onChange={handleInputChange}
              className={classNames(
                "mb-2 text-shadow rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10 placeholder-error",
                {
                  "text-error": new Decimal(customAmount).greaterThan(
                    cropAmount,
                  ),
                },
              )}
              style={{
                boxShadow: "#b96e50 0px 1px 1px 1px inset",
                border: "2px solid #ead4aa",
              }}
            />
            <Button
              onClick={() =>
                setCustomInputAmount(cropAmount.mul(0.5).toString())
              }
              className="ml-2 px-1 py-1 w-auto"
            >
              {`50%`}
            </Button>
            <Button
              onClick={() => setCustomInputAmount(cropAmount.toString())}
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
          <Button
            disabled={
              new Decimal(customAmount).greaterThan(cropAmount) ||
              new Decimal(customAmount).lessThanOrEqualTo(0)
            }
            onClick={onSell}
          >
            {t("sell")}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
