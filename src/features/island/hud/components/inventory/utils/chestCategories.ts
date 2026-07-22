import type { CollectibleName } from "features/game/types/craftables";
import type { GameState, InventoryItemName } from "features/game/types/game";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { RESOURCES } from "features/game/types/resources";
import { BUILDINGS } from "features/game/types/buildings";
import { MONUMENTS, REWARD_ITEMS } from "features/game/types/monuments";
import { BANNERS } from "features/game/types/banners";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { WEATHER_SHOP_ITEM_COSTS } from "features/game/types/calendar";
import { DOLLS } from "features/game/lib/crafting";
import { PET_TYPES } from "features/game/types/pets";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import lightning from "assets/icons/lightning.png";
import { getChestFlowers } from "./inventory";
import { hasBoost } from "./boosts";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";

/**
 * The collectible chest categories (id + icon) in display order.
 *
 * Shared by the Chest modal and the landscaping quick panel so both group,
 * label and order placeable collectibles identically. Each `id` doubles as the
 * i18n key used for the category label.
 */
const CHEST_CATEGORIES_META = [
  { id: "pets", icon: SUNNYSIDE.icons.expression_confused },
  { id: "resource.nodes", icon: SUNNYSIDE.resource.tree },
  { id: "buildings", icon: SUNNYSIDE.icons.hammer },
  { id: "boosts", icon: lightning },
  { id: "temporaryBoosts", icon: SUNNYSIDE.icons.stopwatch },
  { id: "banners", icon: ITEM_DETAILS["Lifetime Farmer Banner"].image },
  { id: "beds", icon: ITEM_DETAILS["Basic Bed"].image },
  { id: "weatherItems", icon: ITEM_DETAILS["Tornado Pinwheel"].image },
  { id: "monuments", icon: ITEM_DETAILS["Farmer's Monument"].image },
  { id: "villageProjects", icon: ITEM_DETAILS["Big Orange"].image },
  { id: "dolls", icon: ITEM_DETAILS["Doll"].image },
  { id: "flowers", icon: ITEM_DETAILS["Prism Petal"].image },
  { id: "decorations", icon: ITEM_DETAILS["Basic Bear"].image },
] as const satisfies readonly { id: TranslationKeys; icon: string }[];

export type ChestCategoryId = (typeof CHEST_CATEGORIES_META)[number]["id"];

/**
 * Buds, Pet NFTs and Farm Hands are not inventory collectibles (their items
 * come from dedicated game state), so they are described separately. They are
 * displayed before the collectible categories.
 */
export const CHEST_SPECIAL_CATEGORIES = [
  { id: "buds", icon: SUNNYSIDE.icons.heart },
  { id: "petNFTs", icon: SUNNYSIDE.icons.heart },
  { id: "farmHands", icon: SUNNYSIDE.achievement.farmHand },
] as const satisfies readonly { id: TranslationKeys; icon: string }[];

export type ChestSpecialCategoryId =
  (typeof CHEST_SPECIAL_CATEGORIES)[number]["id"];

export interface ChestCategory {
  id: ChestCategoryId;
  icon: string;
  items: CollectibleName[];
}

/**
 * Groups the given collectibles into the chest categories, in display order.
 *
 * `collectibleNames` is supplied by the caller so each surface keeps control of
 * its own item set and ordering (e.g. the Chest pre-sorts alphabetically).
 */
export const getChestCategories = (
  state: GameState,
  items: InventoryItemName[],
): ChestCategory[] => {
  // Chest keys are a mix of resources, buildings and collectibles; the rest of
  // this module treats them uniformly as collectibles (matching the Chest UI).
  const collectibleNames = items as CollectibleName[];

  const resources = collectibleNames.filter((name) => name in RESOURCES);
  const buildings = collectibleNames.filter((name) => name in BUILDINGS);
  const monuments = collectibleNames.filter((name) => name in MONUMENTS);
  const villageProjects = collectibleNames.filter(
    (name) => name in REWARD_ITEMS,
  );
  const banners = collectibleNames.filter((name) => name in BANNERS);
  const beds = collectibleNames.filter((name) => name in BED_FARMHAND_COUNT);
  const weatherItems = collectibleNames.filter(
    (name) => name in WEATHER_SHOP_ITEM_COSTS,
  );
  const flowers = getChestFlowers(collectibleNames).filter(
    (name) => !hasBoost(name, state),
  );
  const dolls = collectibleNames.filter((name) => name in DOLLS);
  const pets = collectibleNames.filter((name) => name in PET_TYPES);

  // Sets for O(1) lookups when computing the catch-all categories below.
  const resourcesSet = new Set(resources);
  const buildingsSet = new Set(buildings);
  const monumentsSet = new Set(monuments);
  const villageProjectsSet = new Set(villageProjects);
  const bedsSet = new Set(beds);
  const bannersSet = new Set(banners);
  const weatherItemsSet = new Set(weatherItems);
  const flowersSet = new Set<CollectibleName>(flowers);
  const dollsSet = new Set(dolls);
  const petsSet = new Set(pets);

  // Totems, hourglasses and shrines expire and need re-triggering - split
  // them out from the "always on" boosts (EXPIRY_COOLDOWNS is the ground
  // truth for what's temporary, shared with the renewal/expiry logic).
  const temporaryBoosts = collectibleNames
    .filter((name) => name in EXPIRY_COOLDOWNS)
    .filter(
      (name) =>
        !resourcesSet.has(name) &&
        !buildingsSet.has(name) &&
        !monumentsSet.has(name) &&
        !villageProjectsSet.has(name) &&
        !bedsSet.has(name) &&
        !flowersSet.has(name),
    );

  const temporaryBoostsSet = new Set(temporaryBoosts);

  const boosts = collectibleNames
    .filter((name) => hasBoost(name, state))
    .filter(
      (name) =>
        !resourcesSet.has(name) &&
        !buildingsSet.has(name) &&
        !monumentsSet.has(name) &&
        !villageProjectsSet.has(name) &&
        !bedsSet.has(name) &&
        !flowersSet.has(name) &&
        !temporaryBoostsSet.has(name),
    );

  const boostsSet = new Set(boosts);

  const decorations = collectibleNames.filter(
    (name) =>
      !resourcesSet.has(name) &&
      !buildingsSet.has(name) &&
      !boostsSet.has(name) &&
      !temporaryBoostsSet.has(name) &&
      !bannersSet.has(name) &&
      !bedsSet.has(name) &&
      !weatherItemsSet.has(name) &&
      !monumentsSet.has(name) &&
      !dollsSet.has(name) &&
      !petsSet.has(name) &&
      !flowersSet.has(name) &&
      !villageProjectsSet.has(name),
  );

  const itemsById: Record<ChestCategoryId, CollectibleName[]> = {
    pets,
    "resource.nodes": resources,
    buildings,
    boosts,
    temporaryBoosts,
    banners,
    beds,
    weatherItems,
    monuments,
    villageProjects,
    dolls,
    flowers,
    decorations,
  };

  return CHEST_CATEGORIES_META.map(({ id, icon }) => ({
    id,
    icon,
    items: itemsById[id],
  }));
};
