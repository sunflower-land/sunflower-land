import Decimal from "decimal.js-light";
import type { CollectibleName } from "features/game/types/craftables";
import type {
  GameState,
  InventoryItemName,
  PlacedItem,
} from "features/game/types/game";
import {
  getWeatherShop,
  type WeatherShopItem,
} from "features/game/types/calendar";
import { EXPIRY_COOLDOWNS } from "./collectibleBuilt";
import { getCollectiblesAcrossLocations } from "./getCollectiblesAcrossLocations";

type WeatherRenewalRequirements = {
  coins: number;
  resources: Partial<Record<InventoryItemName, Decimal>>;
};

export const WEATHER_PROTECTION_COLLECTIBLES = [
  "Tornado Pinwheel",
  "Mangrove",
  "Thermal Stone",
  "Protective Pesticide",
] as const;

export type WeatherProtectionCollectibleName =
  (typeof WEATHER_PROTECTION_COLLECTIBLES)[number];

export const INVENTORY_RENEWABLE_COLLECTIBLES = [
  "Time Warp Totem",
  "Super Totem",
  "Gourmet Hourglass",
  "Harvest Hourglass",
  "Timber Hourglass",
  "Orchard Hourglass",
  "Blossom Hourglass",
  "Fisher's Hourglass",
  "Ore Hourglass",
  ...WEATHER_PROTECTION_COLLECTIBLES,
] as const;

export type InventoryRenewableCollectibleName =
  (typeof INVENTORY_RENEWABLE_COLLECTIBLES)[number];

export const isWeatherProtectionCollectible = (
  name: CollectibleName,
): name is WeatherProtectionCollectibleName =>
  WEATHER_PROTECTION_COLLECTIBLES.includes(
    name as WeatherProtectionCollectibleName,
  );

export const isInventoryRenewableCollectible = (
  name: CollectibleName,
): name is InventoryRenewableCollectibleName =>
  INVENTORY_RENEWABLE_COLLECTIBLES.includes(
    name as InventoryRenewableCollectibleName,
  );

export const hasCollectibleExpired = ({
  name,
  collectible,
  now = Date.now(),
}: {
  name: InventoryRenewableCollectibleName;
  collectible: PlacedItem;
  now?: number;
}) => {
  if (isWeatherProtectionCollectible(name)) {
    return !!collectible.createdAt;
  }

  const cooldown = EXPIRY_COOLDOWNS[name];

  if (!cooldown) {
    return false;
  }

  return (collectible.createdAt ?? 0) + cooldown <= now;
};

export const getWeatherRenewalRequirements = ({
  game,
  name,
}: {
  game: GameState;
  name: WeatherProtectionCollectibleName;
}): WeatherRenewalRequirements => {
  const weatherItem = getWeatherShop(game.island.type)[name as WeatherShopItem];
  return {
    coins: weatherItem.price,
    resources: weatherItem.ingredients(
      (game.bumpkin?.skills ?? {}) as never,
    ) as Partial<Record<InventoryItemName, Decimal>>,
  };
};

export const canRenewWeatherCollectible = ({
  game,
  name,
}: {
  game: GameState;
  name: WeatherProtectionCollectibleName;
}) => {
  const requirements = getWeatherRenewalRequirements({ game, name });

  if (game.coins < requirements.coins) {
    return false;
  }

  return Object.entries(requirements.resources).every(([item, amount]) =>
    (game.inventory[item as InventoryItemName] ?? new Decimal(0)).gte(
      amount ?? new Decimal(0),
    ),
  );
};

export const hasUsableWeatherProtectionCollectible = ({
  game,
  name,
}: {
  game: GameState;
  name: WeatherProtectionCollectibleName;
}) => {
  const inventoryCount = game.inventory[name] ?? new Decimal(0);

  if (inventoryCount.gt(0)) {
    return true;
  }

  return getCollectiblesAcrossLocations(game, name).some(
    (collectible) =>
      !!collectible.coordinates &&
      !collectible.removedAt &&
      !hasCollectibleExpired({ name, collectible }),
  );
};
