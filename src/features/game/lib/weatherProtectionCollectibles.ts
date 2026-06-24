import type { CollectibleName } from "../types/craftables";
import type { WeatherShopItem } from "../types/calendar";
import type { GameState } from "../types/game";

/**
 * Weather-protection collectibles. Each one is a single-use shield against its
 * matching calendar weather event. When the event triggers, the placed item is
 * marked `used` (see {@link markWeatherCollectibleUsed}) rather than deleted, and
 * can be restored via the `weatherCollectible.renewed` event.
 */
export const WEATHER_PROTECTION_COLLECTIBLES: readonly WeatherShopItem[] = [
  "Tornado Pinwheel",
  "Mangrove",
  "Thermal Stone",
  "Protective Pesticide",
];

export const isWeatherProtectionCollectible = (
  name: CollectibleName,
): name is WeatherShopItem =>
  WEATHER_PROTECTION_COLLECTIBLES.includes(name as WeatherShopItem);

/**
 * Marks every placed instance of a weather-protection collectible as `used`
 * across all map locations, leaving the inventory entry intact. Operates on an
 * immer draft.
 */
export const markWeatherCollectibleUsed = (
  game: GameState,
  name: WeatherShopItem,
): void => {
  const groups = [
    game.collectibles[name],
    game.home.collectibles[name],
    game.interior.ground.collectibles[name],
    game.interior.level_one?.collectibles[name],
  ];

  groups.forEach((group) => {
    group?.forEach((placed) => {
      if (placed.coordinates) {
        placed.used = true;
      }
    });
  });
};
