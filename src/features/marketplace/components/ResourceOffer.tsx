import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { NumberInput } from "components/ui/NumberInput";
import { Decimal } from "decimal.js-light";
import {
  TRADE_LIMITS,
  TRADE_MINIMUMS,
  TradeResource,
} from "features/game/actions/tradeLimits";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";

import switchIcon from "assets/icons/switch.webp";
import sflIcon from "assets/icons/flower_token.webp";
import tradeIcon from "assets/icons/trade.png";
import lockIcon from "assets/icons/lock.png";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";

type Props = {
  itemName: TradeResource;
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
const LOCAL_STORAGE_KEY = "resourceOfferInputType";

const _hasReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

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
  const { gameService } = useContext(Context);
  const hasTradeReputation = useSelector(gameService, _hasReputation);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [inputType, setInputType] = useState<"price" | "pricePerUnit">(
    () =>
      (localStorage.getItem(LOCAL_STORAGE_KEY) as "price" | "pricePerUnit") ||
      "price",
  );

  const tooLittle =
    !!quantity && new Decimal(quantity).lessThan(TRADE_MINIMUMS[itemName] ?? 0);

  const maxUnitPrice = new Decimal(floorPrice).mul(1.2).toDecimalPlaces(4);
  const isTooHigh =
    !!price &&
    !!quantity &&
    !!floorPrice &&
    new Decimal(pricePerUnit).toDecimalPlaces(4).gt(maxUnitPrice);

  const minUnitPrice = new Decimal(floorPrice).mul(0.8).toDecimalPlaces(4);
  const isTooLow =
    !!price &&
    !!quantity &&
    !!floorPrice &&
    new Decimal(pricePerUnit).toDecimalPlaces(4).lt(minUnitPrice);

  // For now, keep offchain
  const maxSFL = new Decimal(price).greaterThan(MAX_SFL);

  return (
    <>
      <div>
        <div className="flex flex-wrap justify-between mb-1">
          <Label type="default" className="my-1 ml-2" icon={tradeIcon}>
            {t("marketplace.makeOffer")}
          </Label>
          {!hasTradeReputation && (
            <RequiredReputation reputation={Reputation.Cropkeeper} />
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Box image={ITEM_DETAILS[itemName].image} disabled />
            <span className="text-sm">
              {ITEM_DETAILS[itemName].translatedName ?? itemName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label
            type={
              new Decimal(pricePerUnit).lessThan(floorPrice)
                ? "danger"
                : new Decimal(pricePerUnit).greaterThan(floorPrice)
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
                min: minUnitPrice.toNumber(),
              })}
            </Label>
          )}
          {isTooHigh && (
            <Label type="danger" className="my-1 ml-2 mr-1">
              {t("bumpkinTrade.maximumFloor", {
                max: maxUnitPrice.toNumber(),
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
              {tooLittle && (
                <Label
                  type="danger"
                  className="my-1 ml-2 mr-1 whitespace-nowrap"
                >
                  {t("bumpkinTrade.min", {
                    min: TRADE_MINIMUMS[itemName] ?? 0,
                  })}
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
                  setPricePerUnit(
                    new Decimal(estimated).dividedBy(value).toNumber(),
                  );
                }
              }}
            />
          </div>
          <div className="flex-1 flex flex-col items-end">
            <div className="flex items-center">
              {new Decimal(pricePerUnit * quantity).greaterThan(MAX_SFL) && (
                <Label type="danger" className="my-1 ml-2 mr-1">
                  {t("bumpkinTrade.max", { max: MAX_SFL })}
                </Label>
              )}
              <Label
                icon={sflIcon}
                secondaryIcon={switchIcon}
                type="default"
                className="my-1 ml-2 mr-2 cursor-pointer whitespace-nowrap"
                onClick={() =>
                  setInputType(inputType === "price" ? "pricePerUnit" : "price")
                }
              >
                {inputType === "pricePerUnit"
                  ? t("marketplace.label.pricePerUnit")
                  : t("bumpkinTrade.price")}
              </Label>
            </div>
            <NumberInput
              value={inputType === "pricePerUnit" ? pricePerUnit : price}
              maxDecimalPlaces={4}
              isRightAligned={true}
              isOutOfRange={
                maxSFL ||
                new Decimal(
                  inputType === "pricePerUnit" ? pricePerUnit : price,
                ).equals(0) ||
                isTooHigh ||
                isTooLow
              }
              onValueChange={(value) => {
                if (inputType === "pricePerUnit") {
                  if (value.equals(setPrecision(pricePerUnit, 4))) return;

                  setPricePerUnit(value.toNumber());
                  setPrice(new Decimal(value).mul(quantity).toNumber());
                } else {
                  setPrice(value.toNumber());
                  if (quantity > 0) {
                    setPricePerUnit(
                      new Decimal(value).dividedBy(quantity).toNumber(),
                    );
                  }
                }
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
          })} FLOWER`}</p>
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
              ? `0.0000 ${t("marketplace.flower")}`
              : `${formatNumber(pricePerUnit, {
                  decimalPlaces: 4,
                  showTrailingZeros: true,
                })} ${t("marketplace.flower")}`}
          </p>
        </div>
        <div className="flex mt-2">
          <Button onClick={onCancel} className="mr-1">
            {t("bumpkinTrade.cancel")}
          </Button>
          <Button
            disabled={
              tooLittle ||
              isTooHigh ||
              isTooLow ||
              maxSFL ||
              new Decimal(quantity).gt(
                TRADE_LIMITS[itemName] ?? new Decimal(0),
              ) ||
              new Decimal(quantity).equals(0) || // Disable when quantity is 0
              new Decimal(price).equals(0) || // Disable when sfl is 0
              isSaving ||
              !hasTradeReputation
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
