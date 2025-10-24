import React, { ChangeEvent, useEffect, useState } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";

import bg from "assets/ui/input_box_border.png";
import activeBg from "assets/ui/active_input_box_border.png";
import { SquareIcon } from "./SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";

type Props = {
  value: Decimal | number;
  maxDecimalPlaces: number;
  isRightAligned?: boolean;
  isOutOfRange?: boolean;
  className?: string;
  onValueChange?: (value: Decimal) => void;
  icon?: string;
  readOnly?: boolean;
  allowNegative?: boolean;
};

export const NumberInput: React.FC<Props> = ({
  value,
  maxDecimalPlaces,
  isRightAligned,
  isOutOfRange,
  className,
  onValueChange,
  icon,
  readOnly,
  allowNegative = false,
}) => {
  const VALID_INTEGER = new RegExp(allowNegative ? /^-?\d+$/ : /^\d+$/);
  const VALID_DECIMAL_NUMBER_WITH_PRECISION = new RegExp(
    allowNegative
      ? `^-?\\d*(\\.\\d{0,${maxDecimalPlaces}})?$`
      : `^\\d*(\\.\\d{0,${maxDecimalPlaces}})?$`,
  );
  const INPUT_MAX_CHAR = Math.max(maxDecimalPlaces + 4, 20);

  const [numberDisplay, setNumberDisplay] = useState("");
  const [isFocused, setIsFocused] = useState(false); // State for focus

  useEffect(() => {
    const newValue = setPrecision(
      new Decimal(value),
      maxDecimalPlaces,
    ).toString();

    if (
      new Decimal(newValue).equals(
        new Decimal(numberDisplay ? numberDisplay : 0),
      )
    )
      return;

    setNumberDisplay(newValue);
    onValueChange?.(new Decimal(newValue));
  }, [value]);

  return (
    <div className="relative">
      <input
        style={{
          textAlign: isRightAligned ? "right" : "left",
          borderImageRepeat: "stretch",
          borderStyle: "solid",
          borderImage: `url(${isFocused ? activeBg : bg})`,
          borderWidth: `${PIXEL_SCALE * 4}px`,
          borderImageSlice: isFocused ? "4 fill" : "4 4 4 4 fill",
          padding: 0,
          imageRendering: "pixelated",
          outline: "none",
        }}
        type="number"
        placeholder="0"
        value={numberDisplay}
        readOnly={readOnly}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (/^0+(?!\.)/.test(e.target.value) && e.target.value.length > 1) {
            e.target.value = e.target.value.replace(/^0/, "");
          }

          if (e.target.value === "") {
            setNumberDisplay("");
            onValueChange?.(new Decimal(0));
          } else if (
            (maxDecimalPlaces > 0
              ? VALID_DECIMAL_NUMBER_WITH_PRECISION
              : VALID_INTEGER
            ).test(e.target.value)
          ) {
            const amount = e.target.value.slice(0, INPUT_MAX_CHAR);
            setNumberDisplay(amount);
            onValueChange?.(new Decimal(amount ?? 0));
          }
        }}
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => setIsFocused(false)} // Set focus state to false
        className={classNames(
          "!bg-transparent cursor-pointer w-full p-2 h-10 font-secondary",
          {
            "text-error placeholder-error": isOutOfRange,
            "placeholder-black": !isOutOfRange,
          },
          className,
        )}
      />
      {icon && (
        <div className="absolute flex flex-row items-center mx-2 pointer-events-none h-full top-0 right-0">
          <SquareIcon icon={icon} width={10} />
        </div>
      )}
    </div>
  );
};
