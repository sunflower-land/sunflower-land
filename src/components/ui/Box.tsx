import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import darkBorder from "assets/ui/panel/dark_border.png";
import selectBox from "assets/ui/select/select_box.png";
import { Label } from "./Label";

export interface BoxProps {
  image: any;
  secondaryImage?: any;
  isSelected?: boolean;
  count?: Decimal;
  onClick?: () => void;
  disabled?: boolean;
}

// scoped to this component?
Decimal.set({
  rounding: Decimal.ROUND_FLOOR,
});

/**
 * Format like in shortAddress
 * Rules/Limits:
 * - rounded down via Decimal.set
 * - denominate by k, m for now
 */
const shortenCount = (count: Decimal | undefined): string => {
  if (!count) return "";

  if (count.lessThan(1)) return count.toDecimalPlaces(2).toString();

  if (count.lessThan(1000)) return count.toInteger().toString();

  const isThousand = count.lessThan(1e6);

  return `${count
    .div(isThousand ? 1000 : 1e6)
    .toDecimalPlaces(1)
    .toString()}${isThousand ? "k" : "m"}`;
};

export const Box: React.FC<BoxProps> = ({
  image,
  secondaryImage,
  isSelected,
  count,
  onClick,
  disabled,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [shortCount, setShortCount] = useState("");

  // re execute function on count change
  useEffect(() => setShortCount(shortenCount(count)), [count]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={classNames(
          "w-12 h-12 bg-brown-600  m-1.5 cursor-pointer flex items-center justify-center relative",
          {
            "bg-brown-600 cursor-not-allowed": disabled,
            "bg-brown-200": isSelected,
          }
        )}
        onClick={onClick}
        // Custom styles to get pixellated border effect
        style={{
          // border: "6px solid transparent",
          borderStyle: "solid",
          borderWidth: "6px",
          borderImage: `url(${darkBorder}) 30 stretch`,
          borderImageSlice: "25%",
          imageRendering: "pixelated",
          borderImageRepeat: "repeat",
          borderRadius: "20px",
        }}
      >
        {secondaryImage ? (
          <div className="w-full flex">
            <img src={image} className="w-4/5 object-contain" alt="item" />

            <img
              src={secondaryImage}
              className="absolute right-0 bottom-1 w-1/2 h-1/2 object-contain"
              alt="crop"
            />
          </div>
        ) : (
          <img
            src={image}
            className="h-full w-full object-contain"
            alt="item"
          />
        )}

        {!!count && count.greaterThan(0) && (
          <Label
            className={classNames(
              "absolute -top-4 -right-3 px-0.5 text-xs z-10",
              {
                "z-20": isHover,
              }
            )}
          >
            {isHover ? count.toString() : shortCount}
          </Label>
        )}
      </div>
      {(isSelected || isHover) && (
        <img
          className="absolute w-14 h-14 top-0.5 left-0.5 pointer-events-none"
          src={selectBox}
        />
      )}
    </div>
  );
};
