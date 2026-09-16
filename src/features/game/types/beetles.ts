/**
 * The four Beetle rarities, commonest first. Tradability is switched on
 * separately - see the trade type and `TradeResource` wiring.
 */
export const BEETLES = [
  "Brown Beetle",
  "Blue Beetle",
  "Pink Beetle",
  "Amber Beetle",
] as const;

export type BeetleName = (typeof BEETLES)[number];
