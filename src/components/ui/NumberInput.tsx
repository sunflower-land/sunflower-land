import React, { ChangeEvent, useState } from "react";
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

  const [draftValue, setDraftValue] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false); // State for focus

  const formattedValue = setPrecision(value, maxDecimalPlaces).toString();

  const inputValue =
    isFocused && draftValue !== null ? draftValue : formattedValue;

  const shouldDeferCommit = (amount: string) => {
    if (!allowNegative) {
      return amount === ".";
    }

    return amount === "." || amount === "-" || amount === "-.";
  };

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
        value={inputValue}
        readOnly={readOnly}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (readOnly) return;

          let nextValue = e.target.value;

          if (
            inputValue === "0" &&
            nextValue.length === 2 &&
            nextValue.includes("0")
          ) {
            const sanitizedValue = nextValue.replace("0", "") || "0";
            nextValue = sanitizedValue;
            e.target.value = sanitizedValue;
          }

          if (/^0+(?!\.)/.test(nextValue) && nextValue.length > 1) {
            const trimmedValue = nextValue.replace(/^0/, "");
            e.target.value = trimmedValue;
            nextValue = trimmedValue;
          }

          const validator =
            maxDecimalPlaces > 0
              ? VALID_DECIMAL_NUMBER_WITH_PRECISION
              : VALID_INTEGER;

          if (nextValue === "") {
            setDraftValue("");
            onValueChange?.(new Decimal(0));
            return;
          }

          if (!validator.test(nextValue)) {
            return;
          }

          const amount = nextValue.slice(0, INPUT_MAX_CHAR);

          if (shouldDeferCommit(amount)) {
            setDraftValue(amount);
            return;
          }

          setDraftValue(amount);
          onValueChange?.(new Decimal(amount));
        }}
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => {
          setIsFocused(false);
          setDraftValue(null);
        }} // Set focus state to false
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
