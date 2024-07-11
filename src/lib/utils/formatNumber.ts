import Decimal from "decimal.js-light";

/**
 * The options for formatting a number.
 * @param decimalPlaces The number of decimal places to round the number down to.
 * @param showTrailingZeros true, if trailing zeros are shown (eg. '23.1000' instead of '23.1').
 */
export type NumberFormatOptions = {
  decimalPlaces: number;
  showTrailingZeros?: boolean;
};

/**
 * Format a number to a string.  The number is rounded down to the specified number of decimal places.
 * @param _number The number to format.
 * @param options The options for formatting the number.  Defaults to 2 decimal places and not showing trailing zeros.
 * @returns The formatted number as a string.
 */
export const formatNumber = (
  _number: Decimal | number | undefined,
  options: NumberFormatOptions = {
    decimalPlaces: 2,
  },
) => {
  if (_number === undefined) return "";

  const number = new Decimal(_number);
  const roundedNumber = number.toDecimalPlaces(
    options.decimalPlaces,
    Decimal.ROUND_DOWN,
  );

  // append minus to zero if it is negative
  if (roundedNumber.isZero() && number.isNegative()) return "-0";

  return `${roundedNumber.isZero() && number.isNegative() ? "-" : ""}${options.showTrailingZeros ? roundedNumber.toFixed(options.decimalPlaces) : roundedNumber.toString()}`;
};

/**
 * Set the precision of a number to a specified number of decimal places, rounding down.
 * This is not intended for formatting numbers for display. Use formatNumber if you want to format a number for display.
 * @param number The number to set the precision of.
 * @param decimalPlaces The number of decimal places to round the number down to.  Defaults to 4.
 * @returns the number with the specified precision
 */
export const setPrecision = (_number: Decimal | number, decimalPlaces = 4) => {
  const number = new Decimal(_number);
  return number.toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN);
};

/**
 * Format like in shortAddress
 * Rules/Limits:
 * - rounded down explicitly
 * - denominate by k, m, b, ... for now
 */
export const shortenCount = (_count: Decimal | number | undefined): string => {
  if (_count === undefined) return "";

  const count = new Decimal(_count);

  const isPositive = count.greaterThanOrEqualTo(0);
  const roundingMethod = isPositive ? Decimal.ROUND_FLOOR : Decimal.ROUND_CEIL;
  const absoluteCount = count.absoluteValue();

  if (absoluteCount.lessThan(0.01)) return isPositive ? "0" : "-0";

  if (absoluteCount.lessThan(10))
    return count.toDecimalPlaces(2, roundingMethod).toString();

  if (absoluteCount.lessThan(100))
    return count.toDecimalPlaces(1, roundingMethod).toString();

  if (absoluteCount.lessThan(1000))
    return count.toDecimalPlaces(0, roundingMethod).toString();

  const power = absoluteCount
    .log()
    .dividedBy(3)
    .toDecimalPlaces(0, Decimal.ROUND_FLOOR);

  let powerFloor = power;
  let suffix;
  let overMaxSupportedRange = false;
  switch (true) {
    case power.lessThanOrEqualTo(1):
      suffix = "k";
      break;
    case power.lessThanOrEqualTo(2):
      suffix = "m";
      break;
    case power.lessThanOrEqualTo(3):
      suffix = "b";
      break;
    case power.lessThanOrEqualTo(4):
      suffix = "t";
      break;
    case power.lessThanOrEqualTo(5):
      suffix = "q";
      break;
    default:
      suffix = "q";
      powerFloor = new Decimal(5);
      overMaxSupportedRange = true;
      break;
  }

  const magnitude = count.div(new Decimal(1e3).pow(powerFloor));

  if (overMaxSupportedRange) {
    return `${magnitude
      .toDecimalPlaces(0, roundingMethod)
      .toString()}${suffix}`;
  }

  let value;
  if (magnitude.lessThan(100))
    value = magnitude.toDecimalPlaces(1, roundingMethod).toString();
  else value = magnitude.toDecimalPlaces(0, roundingMethod).toString();

  value = value.substring(0, 4);
  if (value.lastIndexOf(".") === value.length - 1) {
    value = value.substring(0, value.length - 1);
  }

  return `${value}${suffix}`;
};
