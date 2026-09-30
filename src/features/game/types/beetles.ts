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

export function isBeetle(item: string): item is BeetleName {
  return (BEETLES as readonly string[]).includes(item);
}

/**
 * Base feeding XP when a Beetle is fed straight to an animal (any of the
 * four). It goes through the normal feed-XP pipeline like any other food.
 * TODO(Chapter 16): placeholder values from the spec, pending a balance pass.
 */
export const BEETLE_FEEDING_XP: Record<BeetleName, number> = {
  "Brown Beetle": 100,
  "Blue Beetle": 200,
  "Pink Beetle": 500,
  "Amber Beetle": 1000,
};
