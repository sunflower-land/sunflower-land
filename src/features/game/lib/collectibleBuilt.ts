import type { HourglassType } from "features/island/collectibles/components/Hourglass";
import type { CollectibleName } from "../types/craftables";
import { getKeys } from "lib/object";
import type { GameState, InventoryItemName, PlacedItem } from "../types/game";
import { PET_SHRINES, type PetShrineName } from "../types/pets";
import { isPetCollectible } from "../events/landExpansion/placeCollectible";
import { getCollectiblesAcrossLocations } from "./getCollectiblesAcrossLocations";

export { getCollectiblesAcrossLocations };

export function isCollectibleBuilt({
  name,
  game,
}: {
  name: CollectibleName;
  game: GameState;
}) {
  const isReady = (placed: {
    readyAt?: number;
    coordinates?: unknown;
    used?: boolean;
  }) =>
    (placed.readyAt ?? 0) <= Date.now() && !!placed.coordinates && !placed.used;

  const placedAcrossLocations = getCollectiblesAcrossLocations(game, name).some(
    isReady,
  );

  const placedInPetHouse =
    isPetCollectible(name) && !!game.petHouse.pets[name]?.some(isReady);

  return placedAcrossLocations || placedInPetHouse;
}

export type TemporaryCollectibleName = Extract<
  CollectibleName,
  | "Time Warp Totem"
  | HourglassType
  | "Super Totem"
  | "Obsidian Shrine"
  | PetShrineName
>;

export const EXPIRY_COOLDOWNS: Record<TemporaryCollectibleName, number> = {
  "Time Warp Totem": 4 * 60 * 60 * 1000,
  "Gourmet Hourglass": 6 * 60 * 60 * 1000,
  "Harvest Hourglass": 9 * 60 * 60 * 1000,
  "Timber Hourglass": 4 * 60 * 60 * 1000,
  "Ore Hourglass": 5 * 60 * 60 * 1000,
  "Orchard Hourglass": 8 * 60 * 60 * 1000,
  "Blossom Hourglass": 12 * 60 * 60 * 1000,
  "Fisher's Hourglass": 4 * 60 * 60 * 1000,
  "Super Totem": 7 * 24 * 60 * 60 * 1000,
  // All pet shrines have 7 day cooldown
  ...getKeys(PET_SHRINES).reduce(
    (acc, key) => {
      acc[key] = 7 * 24 * 60 * 60 * 1000;
      return acc;
    },
    {} as Record<PetShrineName, number>,
  ),

  // The following will replace the times set above for the following shrines
  "Legendary Shrine": 24 * 60 * 60 * 1000,
  "Obsidian Shrine": 14 * 24 * 60 * 60 * 1000,
  "Trading Shrine": 30 * 24 * 60 * 60 * 1000,
};

/**
 * Whether a collectible is one of the time-limited boosters — the items that
 * expire and can be renewed or extended, keyed by `EXPIRY_COOLDOWNS`.
 */
export const isTemporaryCollectible = (
  name: InventoryItemName,
): name is TemporaryCollectibleName => name in EXPIRY_COOLDOWNS;

/**
 * The two totems. They grant the SAME buff — identical description, 2x in every
 * windowed speed table, and `getMergedTotemWindows` unions them so they cannot
 * stack with each other — and differ only in duration and how they are obtained.
 * That interchangeability is what lets them extend one another.
 */
export const TOTEMS = ["Super Totem", "Time Warp Totem"] as const;

export type TotemName = (typeof TOTEMS)[number];

export const isTotem = (name: InventoryItemName): name is TotemName =>
  TOTEMS.includes(name as TotemName);

/**
 * The names that share a placement slot with this one. Because the totems merge
 * into a single boost window, a second totem alongside the first is wasted, so
 * the pair occupies one slot between them. Everything else is its own group.
 */
export const getPlacementGroup = (
  name: TemporaryCollectibleName,
): TemporaryCollectibleName[] => (isTotem(name) ? [...TOTEMS] : [name]);

/**
 * Wall-clock expiry of ONE placed temporary collectible: its `createdAt` plus the
 * (flag-gated) base cooldown plus any time bought via `collectible.extended` and
 * banked on the placement. Every consumer — boost windows, the active check,
 * renew/burn eligibility and the UI countdowns — must read the expiry from here
 * rather than re-deriving `createdAt + cooldown`, or an extended booster will
 * silently expire early for whichever consumer was missed.
 */
export function getCollectibleExpiry({
  name,
  collectible,
}: {
  name: TemporaryCollectibleName;
  collectible: Pick<PlacedItem, "createdAt" | "extendedMs">;
}): number {
  return (
    (collectible.createdAt ?? 0) +
    EXPIRY_COOLDOWNS[name] +
    (collectible.extendedMs ?? 0)
  );
}

/**
 * Useful for collectibles which expire after X time
 * Currently we only support Time Warp Totem
 */
export function isTemporaryCollectibleActive({
  name,
  game,
  now,
}: {
  name: TemporaryCollectibleName;
  game: GameState;
  now: number;
}) {
  return getCollectiblesAcrossLocations(game, name).some(
    (placed) => getCollectibleExpiry({ name, collectible: placed }) > now,
  );
}
