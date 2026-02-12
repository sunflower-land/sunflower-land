import React, { useEffect, useState } from "react";
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
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";

import lockIcon from "assets/icons/lock.png";
import switchIcon from "assets/icons/switch.webp";
import sflIcon from "assets/icons/flower_token.webp";
import tradeIcon from "assets/icons/trade.png";
import infoIcon from "assets/icons/info.webp";
import { useGame } from "features/game/GameProvider";
import { getResourceTax } from "features/game/types/marketplace";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";

const LISTING_MULTIPLE_MIN = 1;
const MAX_LISTINGS_OF_RESOURCE_FOR_BULK = 20;

type Props = {
  inventoryCount: Decimal;
  itemName: TradeResource;
  floorPrice: number;
  isSaving: boolean;
  price: number;
  quantity: number;
  setPrice: (price: number) => void;
  setQuantity: (quantity: number) => void;
  /** How many identical listings to create (1–20). Shown only for resources. */
  multiple: number;
  setMultiple: (value: number) => void;
  /** Max allowed multiple given current listing count for this resource (e.g. 20 - currentCount). */
  maxMultiple: number;
  onCancel: () => void;
  onList: (
    items: Partial<Record<InventoryItemName, number>>,
    sfl: number,
  ) => void;
};

const MAX_SFL = 150;
const LOCAL_STORAGE_KEY = "resourceListInputType";

export const ResourceList: React.FC<Props> = ({
  inventoryCount,
  itemName,
  floorPrice,
  isSaving,
  price,
  quantity,
  setPrice,
  setQuantity,
  multiple,
  setMultiple,
  maxMultiple,
  onCancel,
  onList,
}) => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [inputType, setInputType] = useState<"price" | "pricePerUnit">(
    () =>
      (localStorage.getItem(LOCAL_STORAGE_KEY) as "price" | "pricePerUnit") ||
      "price",
  );

  useEffect(() => {
    return () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, inputType);
    };
  }, [inputType]);

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

  const tax = getResourceTax({
    game: gameState.context.state,
  });

  if (gameState.context.state.island.type === "basic") {
    return (
      <div>
        <Label type="danger" className="mb-1">
          {t("marketplace.growFarm.title")}
        </Label>
        <p className="text-sm p-1 mb-1">
          {t("marketplace.growFarm.description")}
        </p>
        <Button onClick={onCancel}>{t("marketplace.ok")}</Button>
      </div>
    );
  }

  return (
    <>
      <div>
        <Label type="default" className="my-1 ml-2" icon={tradeIcon}>
          {t("marketplace.listItem", {
            type: t("marketplace.resource"),
          })}
        </Label>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Box image={ITEM_DETAILS[itemName].image} disabled />
            <span className="text-sm">{itemName}</span>
          </div>
          <div className="flex flex-col items-end pr-1">
            <Label
              type={
                inventoryCount.lt(new Decimal(quantity).mul(multiple))
                  ? "danger"
                  : "info"
              }
              className="my-1"
            >
              {t("bumpkinTrade.available")}
            </Label>
            <span className="text-sm mr-1 font-secondary">
              {formatNumber(inventoryCount, {
                decimalPlaces: 0,
              })}
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
                    {t("bumpkinTrade.max", {
                      max: TRADE_LIMITS[itemName] ?? 0,
                    })}
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
                  inventoryCount.lt(new Decimal(quantity).mul(multiple)) ||
                  new Decimal(quantity).greaterThan(
                    TRADE_LIMITS[itemName] ?? 0,
                  ) ||
                  new Decimal(quantity).equals(0)
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
            <div className="flex-1 flex items-end">
              <div className="flex flex-col">
                <div className="flex items-center justify-end">
                  {new Decimal(pricePerUnit * quantity).greaterThan(
                    MAX_SFL,
                  ) && (
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
                      setInputType(
                        inputType === "price" ? "pricePerUnit" : "price",
                      )
                    }
                  >
                    {inputType === "pricePerUnit"
                      ? t("marketplace.label.pricePerUnit")
                      : t("bumpkinTrade.price")}
                  </Label>
                </div>
                <div className="flex items-center w-full justify-end">
                  <NumberInput
                    isRightAligned={true}
                    value={inputType === "pricePerUnit" ? pricePerUnit : price}
                    maxDecimalPlaces={4}
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
            </div>
          </div>
          {/* Number of identical listings to create (1–20). Small two-digit input. */}
          <div
            className="flex flex-col items-end justify-between flex-shrink-0"
            style={{ width: 44 }}
          >
            <Label
              className="h-[26px] w-[30px] my-1 relative mr-0.5"
              type="default"
            >
              <div className="absolute -top-1 pl-0.5 text-sm">{"#"}</div>
            </Label>
            <NumberInput
              value={multiple}
              isRightAligned={true}
              maxDecimalPlaces={0}
              isOutOfRange={
                multiple < LISTING_MULTIPLE_MIN || multiple > maxMultiple
              }
              onValueChange={(value) => {
                const n = Math.round(value.toNumber());
                setMultiple(
                  Math.min(
                    maxMultiple,
                    Math.max(LISTING_MULTIPLE_MIN, isNaN(n) ? 1 : n),
                  ),
                );
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label type="default" icon={lockIcon} className="my-1 ml-1">
            {t("marketplace.resourcesSecured")}
          </Label>
          <Popover>
            <PopoverButton as="div" className="cursor-pointer">
              <Label
                type="default"
                secondaryIcon={infoIcon}
                className="my-1 ml-2 mr-1"
              >
                {`Max bulk: ${maxMultiple}`}
              </Label>
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: "bottom end" }}
              className="flex mt-1 pointer-events-none"
            >
              <InnerPanel>
                <p className="text-xxs w-40 px-0.5">
                  {t("marketplace.maxBulk", {
                    max: MAX_LISTINGS_OF_RESOURCE_FOR_BULK,
                  })}
                </p>
              </InnerPanel>
            </PopoverPanel>
          </Popover>
        </div>
        <div className="text-xxs mb-1.5">
          {t("marketplace.resourcesSecuredWarning")}
        </div>

        {multiple > 1 && (
          <div
            className="flex justify-between"
            style={{
              borderBottom: "1px solid #ead4aa",
              padding: "5px 5px 5px 2px",
            }}
          >
            <span className="text-xs"> {t("marketplace.totalItems")}</span>
            <p className="text-xs font-secondary">{`${formatNumber(
              quantity * multiple,
            )} ${itemName}`}</p>
          </div>
        )}
        <div
          className="flex justify-between"
          style={{
            borderBottom: "1px solid #ead4aa",
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs"> {t("bumpkinTrade.listingPrice")}</span>
          <p className="text-xs font-secondary">{`${formatNumber(price, {
            decimalPlaces: 4,
            showTrailingZeros: true,
          })} ${t("marketplace.flower")}`}</p>
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
        <div
          className="flex justify-between"
          style={{
            borderBottom: "1px solid #ead4aa",
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs"> {t("bumpkinTrade.tradingFee")}</span>
          <p className="text-xs font-secondary">{`${formatNumber(
            new Decimal(price).mul(tax),
            {
              decimalPlaces: 4,
              showTrailingZeros: true,
            },
          )} ${t("marketplace.flower")}`}</p>
        </div>
        <div
          className="flex justify-between"
          style={{
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs"> {t("bumpkinTrade.youWillReceive")}</span>
          <p className="text-xs font-secondary">{`${formatNumber(
            new Decimal(price).mul(new Decimal(1).sub(tax)),
            {
              decimalPlaces: 4,
              showTrailingZeros: true,
            },
          )} ${t("marketplace.flower")}`}</p>
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
              new Decimal(quantity).mul(multiple).gt(inventoryCount) ||
              new Decimal(quantity).gt(
                TRADE_LIMITS[itemName] ?? new Decimal(0),
              ) ||
              new Decimal(quantity).equals(0) || // Disable when quantity is 0
              new Decimal(price).equals(0) || // Disable when sfl is 0
              multiple < LISTING_MULTIPLE_MIN ||
              multiple > maxMultiple ||
              isSaving
            }
            onClick={() => onList({ [itemName]: quantity }, price)}
          >
            {t("bumpkinTrade.list")}
          </Button>
        </div>
      </div>
    </>
  );
};
