export type WeatherEventName =
  | "flood"
  | "tornado"
  | "insectPlague"
  | "greatFreeze"
  | "beeMigration"
  | "sunshower"
  | "heavyRains"
  | "bountifulHarvest"
  | "fishFrenzy";

/** `startAt` is inclusive, `endAt` exclusive. Events never overlap. */
export type ScheduledWeatherEvent = {
  name: WeatherEventName;
  startAt: number;
  endAt: number;
};

export type Weather = {
  /** Built by the server on every load. */
  forecast: ScheduledWeatherEvent[];
};

/**
 * The event running at `now`. Reducers pass their `createdAt`, so the client
 * and the server agree without a save in between.
 */
export function getActiveWeather({
  weather,
  now,
}: {
  // Read-only so both a plain and a frozen game state can be passed.
  weather:
    | { readonly forecast: readonly Readonly<ScheduledWeatherEvent>[] }
    | undefined;
  now: number;
}): Readonly<ScheduledWeatherEvent> | undefined {
  return weather?.forecast.find(
    (event) => event.startAt <= now && now < event.endAt,
  );
}
