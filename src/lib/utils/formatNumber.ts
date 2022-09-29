import Decimal from "decimal.js-light";

export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    notation: "compact",
  }).format(n);

/**
 * Format like in shortAddress
 * Rules/Limits:
 * - rounded down explicitly
 * - denominate by k, m for now
 */
export const shortenCount = (count: Decimal | undefined): string => {
  if (!count) return "";

  if (count.lessThan(1))
    return count.toDecimalPlaces(2, Decimal.ROUND_FLOOR).toString();

  if (count.lessThan(1000))
    return count.toDecimalPlaces(0, Decimal.ROUND_FLOOR).toString();

  const isThousand = count.lessThan(1e6);

  return `${count
    .div(isThousand ? 1000 : 1e6)
    .toDecimalPlaces(1, Decimal.ROUND_FLOOR)
    .toString()}${isThousand ? "k" : "m"}`;
};
