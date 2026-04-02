/**
 * When the API omits `currencyDisplayName`, derive a readable label from the
 * balance token key (e.g. `goldenWorm` → "Golden Worm"). Numeric keys are left as-is.
 */
export function fallbackDisplayNameForMinigameCurrencyKey(
  currencyKey: string,
): string {
  if (!currencyKey) return "";
  if (/^\d+$/.test(currencyKey)) return currencyKey;
  const dashed = currencyKey
    .replace(/_/g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  return dashed
    .split("-")
    .filter(Boolean)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}
