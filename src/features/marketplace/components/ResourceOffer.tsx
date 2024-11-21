import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { Decimal } from "decimal.js-light";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";

import sflIcon from "assets/icons/sfl.webp";
import tradeIcon from "assets/icons/trade.png";
import lockIcon from "assets/icons/lock.png";

type Props = {
  itemName: InventoryItemName;
  floorPrice: number;
  isSaving: boolean;
  price: number;
  quantity: number;
  setPrice: (price: number) => void;
  setQuantity: (quantity: number) => void;
  onCancel: () => void;
  onOffer: () => void;
};

const MAX_SFL = 150;

export const ResourceOffer: React.FC<Props> = ({
  itemName,
  floorPrice,
  isSaving,
  price,
  quantity,
  setPrice,
  setQuantity,
  onCancel,
  onOffer,
}) => {
  const { t } = useAppTranslation();

  const unitPrice = new Decimal(quantity).equals(0)
    ? new Decimal(0)
    : new Decimal(price).dividedBy(quantity);

  const isTooHigh =
    !!price &&
    !!quantity &&
    !!floorPrice &&
    new Decimal(floorPrice).mul(1.2).lt(unitPrice);

  const isTooLow =
    !!price &&
    !!quantity &&
    !!floorPrice &&
    new Decimal(floorPrice).mul(0.8).gt(unitPrice);

  // For now, keep offchain
  const maxSFL = new Decimal(price).greaterThan(MAX_SFL);

  return (
    <>
      <div>
        <Label type="default" className="my-1 ml-2" icon={tradeIcon}>
          {t("marketplace.makeOffer")}
        </Label>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Box image={ITEM_DETAILS[itemName].image} disabled />
            <span className="text-sm">{itemName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label
            type={
              unitPrice.lessThan(floorPrice)
                ? "danger"
                : unitPrice.greaterThan(floorPrice)
                  ? "success"
                  : "warning"
            }
            className="my-1"
          >
            {t("bumpkinTrade.floorPrice", {
              price: formatNumber(floorPrice, {
                decimalPlaces: 4,
              }),
            })}
          </Label>
          {isTooLow && (
            <Label type="danger" className="my-1 ml-2 mr-1">
              {t("bumpkinTrade.minimumFloor", {
                min: formatNumber(floorPrice * 0.8, {
                  decimalPlaces: 4,
                }),
              })}
            </Label>
          )}
          {isTooHigh && (
            <Label type="danger" className="my-1 ml-2 mr-1">
              {t("bumpkinTrade.maximumFloor", {
                max: formatNumber(floorPrice * 1.2, {
                  decimalPlaces: 4,
                }),
              })}
            </Label>
          )}
        </div>

        <div className="flex">
          <div className="w-1/2 mr-1">
            <div className="flex items-center">
              <Label
                icon={SUNNYSIDE.icons.basket}
                className="my-1 ml-2"
                type="default"
              >
                {t("bumpkinTrade.quantity")}
              </Label>
              {new Decimal(quantity).greaterThan(
                TRADE_LIMITS[itemName] ?? 0,
              ) && (
                <Label
                  type="danger"
                  className="my-1 ml-2 mr-1 whitespace-nowrap"
                >
                  {t("bumpkinTrade.max", { max: TRADE_LIMITS[itemName] ?? 0 })}
                </Label>
              )}
            </div>

            <NumberInput
              value={quantity}
              maxDecimalPlaces={0}
              isOutOfRange={
                new Decimal(quantity).greaterThan(
                  TRADE_LIMITS[itemName] ?? 0,
                ) || new Decimal(quantity).equals(0)
              }
              onValueChange={(value) => {
                setQuantity(value.toNumber());

                // auto generate price
                if (floorPrice) {
                  const estimated = setPrecision(
                    new Decimal(floorPrice).mul(value),
                  );
                  setPrice(estimated.toNumber());
                }
              }}
            />
          </div>
          <div className="flex-1 flex flex-col items-end">
            <div className="flex items-center">
              {new Decimal(price).greaterThan(MAX_SFL) && (
                <Label type="danger" className="my-1 ml-2 mr-1">
                  {t("bumpkinTrade.max", { max: MAX_SFL })}
                </Label>
              )}
              <Label icon={sflIcon} type="default" className="my-1 ml-2 mr-1">
                {t("bumpkinTrade.price")}
              </Label>
            </div>
            <NumberInput
              value={price}
              maxDecimalPlaces={4}
              isRightAligned={true}
              isOutOfRange={
                maxSFL || new Decimal(price).equals(0) || isTooHigh || isTooLow
              }
              onValueChange={(value) => {
                setPrice(value.toNumber());
              }}
            />
          </div>
        </div>

        <Label type="default" icon={lockIcon} className="my-1 ml-1">
          {t("marketplace.sflLocked")}
        </Label>
        <div className="text-xxs mb-1.5">
          {t("marketplace.sflLocked.description")}
        </div>

        <div
          className="flex justify-between"
          style={{
            borderBottom: "1px solid #ead4aa",
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs"> {t("marketplace.offerPrice")}</span>
          <p className="text-xs font-secondary">{`${formatNumber(price, {
            decimalPlaces: 4,
            showTrailingZeros: true,
          })} SFL`}</p>
        </div>
        <div
          className="flex justify-between"
          style={{
            borderBottom: "1px solid #ead4aa",
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs">
            {t("bumpkinTrade.pricePerUnit", { resource: itemName })}
          </span>
          <p className="text-xs font-secondary">
            {new Decimal(quantity).equals(0)
              ? "0.0000 SFL"
              : `${formatNumber(unitPrice, {
                  decimalPlaces: 4,
                  showTrailingZeros: true,
                })} SFL`}
          </p>
        </div>
        <div
          className="flex justify-between"
          style={{
            borderBottom: "1px solid #ead4aa",
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs"> {t("bumpkinTrade.tradingFee")}</span>
          <p className="text-xs font-secondary">{`${formatNumber(
            new Decimal(price).mul(0.1),
            {
              decimalPlaces: 4,
              showTrailingZeros: true,
            },
          )} SFL`}</p>
        </div>
        <div
          className="flex justify-between"
          style={{
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs"> {t("bumpkinTrade.youWillReceive")}</span>
          <p className="text-xs font-secondary">{`${formatNumber(
            new Decimal(price).mul(0.9),
            {
              decimalPlaces: 4,
              showTrailingZeros: true,
            },
          )} SFL`}</p>
        </div>
        <div className="flex mt-2">
          <Button onClick={onCancel} className="mr-1">
            {t("bumpkinTrade.cancel")}
          </Button>
          <Button
            disabled={
              isTooHigh ||
              isTooLow ||
              maxSFL ||
              new Decimal(quantity).gt(
                TRADE_LIMITS[itemName] ?? new Decimal(0),
              ) ||
              new Decimal(quantity).equals(0) || // Disable when quantity is 0
              new Decimal(price).equals(0) || // Disable when sfl is 0
              isSaving
            }
            onClick={onOffer}
          >
            {t("marketplace.offer")}
          </Button>
        </div>
      </div>
    </>
  );
};
