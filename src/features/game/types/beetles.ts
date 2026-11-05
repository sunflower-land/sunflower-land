/**
 * The four Beetle rarities, commonest first. Tradability is switched on
 * separately - see the trade type and `TradeResource` wiring.
 */
export const BEETLES = [
  "Green Beetle",
  "Blue Beetle",
  "Pink Beetle",
  "Amber Beetle",
] as const;

export type BeetleName = (typeof BEETLES)[number];

export function isBeetle(item: string): item is BeetleName {
  return (BEETLES as readonly string[]).includes(item);
}

/**
 * Feeding XP when a Beetle is fed straight to an animal (any of the four).
 * +25% in the beta uptake rebalance (2026-10-30): the beta cohort hoarded
 * ~3,900 beetles unfed because a Green tied the cheapest favourite Slop.
 * Chonky Feed does not apply to Beetles; a muddy Pig still gets the Mud
 * bonus.
 */
export const BEETLE_FEEDING_XP: Record<BeetleName, number> = {
  "Green Beetle": 100,
  "Blue Beetle": 200,
  "Pink Beetle": 400,
  "Amber Beetle": 800,
};
