import { hasFeatureAccess } from "lib/flags";
import type { BuildingName } from "../types/buildings";
import type { GameState } from "../types/game";
import { getUnprotectedThreat, getWeatherEvents } from "./weatherItemCover";
import type { WeatherEvents } from "./weatherItemCover";

/** The buildings a Tornado can disable: the ones that produce something. */
export const TORNADO_BUILDINGS: readonly BuildingName[] = [
  "Fire Pit",
  "Kitchen",
  "Bakery",
  "Deli",
  "Smoothie Shack",
  "Hen House",
  "Barn",
  "Pigpen",
  "Compost Bin",
  "Turbo Composter",
  "Premium Composter",
  "Greenhouse",
  "Crop Machine",
  "Fish Market",
  "Crafting Box",
  "Aging Shed",
  "Cave",
];

/** The share of those buildings each Tornado disables, rounded. */
export const TORNADO_DISABLED_SHARE = 0.3;

/**
 * The buildings disabled at `now`: the stored pick, while its Tornado runs
 * and nothing covers it (the season's Guardian out when it started, or a
 * Balk placed now).
 */
export function getTornadoDisabledBuildings({
  game,
  now,
  events = getWeatherEvents(game),
}: {
  game: GameState;
  now: number;
  events?: WeatherEvents;
}): readonly Readonly<{ name: BuildingName; id: string }>[] {
  if (!hasFeatureAccess(game, "WEATHER")) return [];

  const tornado = getUnprotectedThreat({ game, name: "tornado", events, now });
  const pick = game.weather?.tornado;
  if (!tornado || pick?.startAt !== tornado.startAt) return [];

  return pick.buildings;
}

/**
 * Whether the building is disabled by the Tornado at `now`, which works as
 * if it isn't placed. With an `id`, that copy; without one, every placed copy
 * of `name`.
 */
export function isBuildingDisabled({
  game,
  name,
  id,
  now,
  events,
}: {
  game: GameState;
  name: BuildingName;
  id?: string;
  now: number;
  events?: WeatherEvents;
}): boolean {
  const disabled = getTornadoDisabledBuildings({ game, now, events });
  if (disabled.length === 0) return false;

  const copies = (game.buildings[name] ?? []).filter(
    (building) =>
      !!building.coordinates && (id === undefined || building.id === id),
  );

  return (
    copies.length > 0 &&
    copies.every((building) =>
      disabled.some(
        (picked) => picked.name === name && picked.id === building.id,
      ),
    )
  );
}

/** Throws when the building can't be used because of the Tornado. */
export function assertBuildingNotDisabled(
  args: Parameters<typeof isBuildingDisabled>[0],
) {
  if (isBuildingDisabled(args)) {
    throw new Error(`${args.name} is disabled by the Tornado`);
  }
}
