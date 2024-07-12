import classNames from "classnames";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import React, { ChangeEvent, useEffect, useState } from "react";

const VALID_INTEGER = new RegExp(/^\d+$/);

type Props = {
  value: Decimal | number;
  maxDecimalPlaces: number;
  isRightAligned?: boolean;
  isOutOfRange?: boolean;
  onValueChange?: (value: Decimal) => void;
};

/**
 * A number input component that only accepts numbers and up to `maxDecimalPlaces` decimal places.
 * @param value The value of the input.
 * @param maxDecimalPlaces The maximum number of decimal places allowed.
 * @param isRightAligned Whether the text should be right-aligned.
 * @param isOutOfRange Whether the input is out of range.
 * @param onValueChange A callback function that is called when the value changes.
 */
export const NumberInput: React.FC<Props> = ({
  value,
  maxDecimalPlaces,
  isRightAligned,
  isOutOfRange,
  onValueChange,
}) => {
  const VALID_DECIMAL_NUMBER = new RegExp(
    `^\\d*(\\.\\d{0,${maxDecimalPlaces}})?$`,
  );
  const INPUT_MAX_CHAR = Math.max(maxDecimalPlaces + 4, 10);

  const [numberDisplay, setNumberDisplay] = useState("");

  useEffect(() => {
    // do not change the display if the value is the same
    if (
      new Decimal(value).equals(new Decimal(numberDisplay ? numberDisplay : 0))
    )
      return;

    setNumberDisplay(
      setPrecision(new Decimal(value), maxDecimalPlaces).toString(),
    );
  }, [value]);

  return (
    <input
      style={{
        boxShadow: "#b96e50 0px 1px 1px 1px inset",
        border: "2px solid #ead4aa",
        textAlign: isRightAligned ? "right" : "left",
        fontSize: "36px",
      }}
      type="number"
      placeholder="0"
      value={numberDisplay}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        // strip the leading zero from numbers
        if (/^0+(?!\.)/.test(e.target.value) && e.target.value.length > 1) {
          e.target.value = e.target.value.replace(/^0/, "");
        }

        if (e.target.value === "") {
          setNumberDisplay(""); // reset to 0 if input is empty
        } else if (
          (maxDecimalPlaces > 0 ? VALID_DECIMAL_NUMBER : VALID_INTEGER).test(
            e.target.value,
          )
        ) {
          const amount = e.target.value.slice(0, INPUT_MAX_CHAR);
          setNumberDisplay(amount);
          onValueChange?.(new Decimal(amount ?? 0));
        }
      }}
      className={classNames(
        "mb-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10 placeholder-error font-secondary",
        {
          "text-error": isOutOfRange,
        },
      )}
    />
  );
};
