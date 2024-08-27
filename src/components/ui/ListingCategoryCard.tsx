import React from "react";
import classNames from "classnames";
import { OuterPanel } from "./Panel";
import { formatNumber } from "lib/utils/formatNumber";
import { Label } from "./Label";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import increase_arrow from "assets/icons/increase_arrow.png";
import decrease_arrow from "assets/icons/decrease_arrow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "./SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSound } from "lib/utils/hooks/useSound";

interface Props {
  itemName: InventoryItemName;
  pricePerUnit: number | undefined;
  inventoryAmount?: Decimal;
  disabled?: boolean;
  marketBundle?: number;
  showPulse?: boolean;
  priceMovement?: "up" | "down" | "same";
  onClick: () => void;
}

export const ListingCategoryCard: React.FC<Props> = ({
  itemName,
  pricePerUnit,
  inventoryAmount,
  disabled,
  marketBundle,
  showPulse,
  priceMovement,
  onClick,
}) => {
  const { t } = useAppTranslation();

  const button = useSound("button");

  const onClickWithSound = () => {
    button.play();
    onClick?.();
  };

  return (
    <OuterPanel
      className={classNames(
        "w-full relative flex flex-col items-center justify-center",
        {
          "cursor-not-allowed opacity-50": disabled,
          "cursor-pointer hover:brightness-90": !disabled,
        },
      )}
      style={{
        borderImage: `url(${SUNNYSIDE.ui.primaryButton})`,
        borderStyle: "solid",
        borderWidth: `8px 8px 10px 8px`,
        borderImageSlice: "3 3 4 3 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        borderRadius: `${PIXEL_SCALE * 5}px`,
        color: "#674544",
      }}
      onClick={onClickWithSound}
    >
      {inventoryAmount && (
        <Label
          type="default"
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * -6}px`,
            right: `${PIXEL_SCALE * -4}px`,
          }}
        >
          {formatNumber(inventoryAmount, { decimalPlaces: 0 })}
        </Label>
      )}
      <span className="text-xs mt-1">{itemName}</span>
      <SquareIcon icon={ITEM_DETAILS[itemName].image} width={20} />
      {marketBundle && (
        <span className={"text-xxs md:text-xs mb-1.5"}>
          {/* \u{d7} is &times; in unicode */}
          {`\u{d7} ${marketBundle}`}
        </span>
      )}
      <Label
        type="warning"
        className="w-full text-center p-1"
        style={{
          width: `calc(100% + ${PIXEL_SCALE * 8}px)`,
          marginBottom: `${PIXEL_SCALE * -4}px`,
        }}
      >
        <span
          className={classNames("text-xs", {
            pulse: showPulse,
          })}
        >
          {t("bumpkinTrade.price/unit", {
            price: pricePerUnit
              ? formatNumber(pricePerUnit, {
                  decimalPlaces: 4,
                  showTrailingZeros: true,
                })
              : "?",
          })}
        </span>
        {priceMovement === "up" && (
          <img
            src={increase_arrow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              right: `${PIXEL_SCALE * -3}px`,
              top: `${PIXEL_SCALE * -11}px`,
            }}
          />
        )}
        {priceMovement === "down" && (
          <img
            src={decrease_arrow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              right: `${PIXEL_SCALE * -3}px`,
              top: `${PIXEL_SCALE * -11}px`,
            }}
          />
        )}
      </Label>
    </OuterPanel>
  );
};
