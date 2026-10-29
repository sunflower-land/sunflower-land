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
 * Feeding XP when a Beetle is fed straight to an animal (any of the four),
 * from the #7721 Balance Update. Chonky Feed does not apply to Beetles; a
 * muddy Pig still gets the Mud bonus.
 */
export const BEETLE_FEEDING_XP: Record<BeetleName, number> = {
  "Green Beetle": 80,
  "Blue Beetle": 160,
  "Pink Beetle": 320,
  "Amber Beetle": 640,
};
