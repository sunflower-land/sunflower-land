import React, { useCallback, useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { ButtonPanel, InnerPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime, secondsToString } from "lib/utils/time";
import { SEASON_DETAILS } from "features/game/types/calendar";
import { ITEM_DETAILS } from "features/game/types/images";
import { populateSeason } from "features/game/lib/season";
import { getSeasonGuardian } from "features/game/lib/boostWindows";
import {
  WEATHER_EVENTS,
  type ScheduledWeatherEvent,
  type ScheduledWeatherOverlay,
  type WeatherEventName,
} from "features/game/types/weather";
import {
  WEATHER_ITEM_EVENTS,
  type WeatherItemName,
} from "features/game/types/weatherItems";
import {
  getUnprotectedThreat,
  getWeatherEvents,
  isCoveredByGuardian,
  isWeatherItemGreyed,
} from "features/game/lib/weatherItemCover";
import { getCollectiblesAcrossLocations } from "features/game/lib/collectibleBuilt";
import type { GameState } from "features/game/types/game";
import { getKeys } from "lib/object";

import calendarIcon from "assets/icons/calendar.webp";
import tornado from "assets/icons/tornado.webp";
import tsunami from "assets/icons/tsunami.webp";
import greatFreeze from "assets/icons/great-freeze.webp";
import locust from "assets/icons/locust.webp";
import sunshower from "assets/icons/sunshower.webp";
import fishFrenzy from "assets/icons/fish_frenzy.webp";
import bountifulHarvest from "assets/icons/bountiful_harvest_icon.webp";
import bee from "assets/icons/bee.webp";
import fullMoon from "assets/icons/full_moon.png";
import doubleDelivery from "assets/icons/double_delivery_icon.webp";

const DAY_MS = 24 * 60 * 60 * 1000;
const CALENDAR_DAYS = 28;

// TODO(Weather art): Flood, Heavy Rains and Bee Migration use stand-in icons
// until their own art is decided.
export const WEATHER_EVENT_ICONS: Record<WeatherEventName, string> = {
  flood: tsunami,
  tornado,
  insectPlague: locust,
  greatFreeze,
  beeMigration: bee,
  sunshower,
  heavyRains: SUNNYSIDE.icons.water,
  bountifulHarvest,
  fishFrenzy,
};

const OVERLAY_ICONS = { fullMoon, doubleDelivery } as const;

const WEEKDAYS = [
  "days.mon",
  "days.tue",
  "days.wed",
  "days.thu",
  "days.fri",
  "days.sat",
  "days.sun",
] as const;

/** The item that covers each event, if it has one. */
const EVENT_ITEMS = getKeys(WEATHER_ITEM_EVENTS).reduce(
  (items, item) => ({ ...items, [WEATHER_ITEM_EVENTS[item]]: item }),
  {} as Partial<Record<WeatherEventName, WeatherItemName>>,
);

type ItemStatus = "placed" | "used" | "none";

/** Whether the farm has a fresh placed copy, only used ones, or none. */
const getItemStatus = (
  game: GameState,
  item: WeatherItemName,
  now: number,
): ItemStatus => {
  const placed = getCollectiblesAcrossLocations(game, item).filter(
    (placement) => !!placement.coordinates,
  );
  if (placed.length === 0) return "none";

  const events = getWeatherEvents(game);
  const fresh = placed.some(
    (placement) => !isWeatherItemGreyed({ game, item, placement, events, now }),
  );

  return fresh ? "placed" : "used";
};

type ForecastState = {
  events: ScheduledWeatherEvent[];
  overlays: ScheduledWeatherOverlay[];
  items: Record<WeatherItemName, ItemStatus>;
  /** Whether the threat running now is uncovered. */
  unprotected: boolean;
  /**
   * The starts of the threats the season's Guardian covers: out at the start,
   * or placed now for one still to come.
   */
  guardianCovered: number[];
};

/**
 * What the calendar needs from the game state, as a string so the selector
 * only re-renders the modal when it changes.
 */
const getForecastState = (game: GameState, now: number): string => {
  const events = getWeatherEvents(game);
  const active = events.find(
    (event) => event.startAt <= now && now < event.endAt,
  );
  const state: ForecastState = {
    events: [...events],
    overlays: [...(game.weather?.overlays ?? [])],
    items: getKeys(WEATHER_ITEM_EVENTS).reduce(
      (statuses, item) => ({
        ...statuses,
        [item]: getItemStatus(game, item, now),
      }),
      {} as Record<WeatherItemName, ItemStatus>,
    ),
    unprotected:
      !!active &&
      WEATHER_EVENTS[active.name].kind === "threat" &&
      !!getUnprotectedThreat({ game, name: active.name, events, now }),
    guardianCovered: events
      .filter((event) => isCoveredByGuardian(game, event))
      .map((event) => event.startAt),
  };

  return JSON.stringify(state);
};

const formatDay = (at: number) =>
  new Date(at).toLocaleString(navigator.language, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

interface Props {
  now: number;
}

/**
 * The weather calendar: this week and the next three, one card per day with
 * its event, and the details of the picked day (today by default).
 */
export const WeatherForecast: React.FC<Props> = ({ now }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const forecastJson = useSelector(
    gameService,
    useCallback(
      (state: MachineState) => getForecastState(state.context.state, now),
      [now],
    ),
  );
  const { events, overlays, items, unprotected, guardianCovered } = JSON.parse(
    forecastJson,
  ) as ForecastState;

  const monday = populateSeason(now).startedAt;
  const todayIndex = Math.floor((now - monday) / DAY_MS);
  // The picked day by its start, so a new week (past Monday 00:00 UTC) falls
  // back to today instead of keeping an index into the old week.
  const [pickedAt, setPickedAt] = useState<number>();

  const days = Array.from({ length: CALENDAR_DAYS }, (_, index) => {
    const startAt = monday + index * DAY_MS;

    return {
      startAt,
      dateNumber: new Date(startAt).getUTCDate(),
      season: populateSeason(startAt).season,
      event: events.find(
        (event) => event.startAt <= startAt && startAt < event.endAt,
      ),
      // Overlays can share a day.
      overlays: overlays.filter(
        (overlay) =>
          overlay.startAt >= startAt && overlay.startAt < startAt + DAY_MS,
      ),
    };
  });

  const pickedIndex = days.findIndex((date) => date.startAt === pickedAt);
  const selected = pickedIndex === -1 ? todayIndex : pickedIndex;
  const day = days[selected];
  const { event } = day;
  const today = days[todayIndex];

  return (
    <Panel className="flex flex-col p-1">
      <div className="flex items-center space-x-3 px-1 pb-2">
        <div className="flex items-center space-x-1 text-xs sm:text-sm">
          <span>{formatDay(now)}</span>
          <img src={calendarIcon} className="h-6 sm:h-7" />
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs sm:text-sm">
            {t(`season.${today.season}`)}
          </span>
          <img src={SEASON_DETAILS[today.season].icon} className="w-5 sm:w-6" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="ml-1 text-xs sm:text-sm">
            {t(weekday)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((date, index) => (
          <ButtonPanel
            key={date.startAt}
            selected={index === selected}
            variant={index < todayIndex ? "secondary" : "primary"}
            className="min-h-[58px] w-full relative"
            onClick={() => setPickedAt(date.startAt)}
          >
            <div className="flex items-center justify-center w-full h-full">
              <span className="absolute text-xxs -top-1 -left-0.5">
                {date.dateNumber}
              </span>
              {date.event && (
                <img
                  src={WEATHER_EVENT_ICONS[date.event.name]}
                  className="w-5 mt-2.5 mb-1 object-contain"
                />
              )}
              <img
                src={SEASON_DETAILS[date.season].icon}
                className="absolute h-[20px] -top-[11px] -right-[11px]"
              />
              {date.overlays.length > 0 && (
                <div className="absolute flex -bottom-[9px] -right-[9px]">
                  {date.overlays.map((overlay) => (
                    <img
                      key={overlay.name}
                      src={OVERLAY_ICONS[overlay.name]}
                      className="w-4 object-contain"
                    />
                  ))}
                </div>
              )}
            </div>
          </ButtonPanel>
        ))}
      </div>

      <InnerPanel className="flex flex-col gap-2 mt-2 p-2">
        <div>
          <Label type="default" icon={SEASON_DETAILS[day.season].icon}>
            {t("weather.dayInSeason", {
              day: formatDay(day.startAt),
              season: t(`season.${day.season}`),
            })}
          </Label>
        </div>

        {event && (
          <>
            <div className="flex flex-wrap items-center gap-1">
              <Label type="vibrant">{t(`weather.events.${event.name}`)}</Label>
              <EventTimeLabel event={event} now={now} />
            </div>
            <div className="flex items-center gap-2 ml-1">
              <img
                src={WEATHER_EVENT_ICONS[event.name]}
                className="w-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xs">
                  {t(`weather.effects.${event.name}`)}
                </span>
                <span className="text-xxs">
                  {t("weather.dateRange", {
                    start: formatDay(event.startAt),
                    end: formatDay(event.endAt - 1),
                  })}
                </span>
              </div>
            </div>
            {event.endAt > now && (
              <ProtectionRow
                event={event}
                now={now}
                items={items}
                unprotected={unprotected}
                guardianCovered={guardianCovered.includes(event.startAt)}
              />
            )}
          </>
        )}

        {day.overlays.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {day.overlays.map((overlay) => (
              <Label
                key={overlay.name}
                type="chill"
                icon={OVERLAY_ICONS[overlay.name]}
              >
                {t(`calendar.events.${overlay.name}.title`)}
              </Label>
            ))}
          </div>
        )}
      </InnerPanel>
    </Panel>
  );
};

const EventTimeLabel: React.FC<{
  event: ScheduledWeatherEvent;
  now: number;
}> = ({ event, now }) => {
  const { t } = useAppTranslation();

  if (event.endAt <= now) {
    return <Label type="default">{t("weather.ended")}</Label>;
  }

  const text =
    event.startAt <= now
      ? t("weather.timeLeft", {
          time: secondsToString((event.endAt - now) / 1000, {
            length: "medium",
          }),
        })
      : getRelativeTime(event.startAt, now, "medium");

  return (
    <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
      {text}
    </Label>
  );
};

/** The event's item, and whether the farm is ready for it. */
const ProtectionRow: React.FC<{
  event: ScheduledWeatherEvent;
  now: number;
  items: Record<WeatherItemName, ItemStatus>;
  unprotected: boolean;
  /** The season's Guardian covers this threat. */
  guardianCovered: boolean;
}> = ({ event, now, items, unprotected, guardianCovered }) => {
  const { t } = useAppTranslation();

  const item = EVENT_ITEMS[event.name];
  if (!item) return null;

  const isThreat = WEATHER_EVENTS[event.name].kind === "threat";
  const isActive = event.startAt <= now;
  const status = items[item];
  const guardian = guardianCovered && getSeasonGuardian(event.startAt);

  if (guardian) {
    return (
      <div className="flex items-center gap-2 ml-1">
        <img
          src={ITEM_DETAILS[guardian].image}
          className="w-8 object-contain"
        />
        <div className="flex flex-col items-start gap-1">
          <Label type="success">
            {isActive
              ? t("weather.protected")
              : t("weather.itemPlaced", { item: guardian })}
          </Label>
          <span className="text-xxs">
            {isActive
              ? t("weather.hint.guardianProtects", { guardian })
              : t("weather.hint.guardianKeep")}
          </span>
        </div>
      </div>
    );
  }

  let label: React.ReactNode;
  let hint: string;

  if (isThreat && isActive) {
    label = unprotected ? (
      <Label type="danger">{t("weather.unprotected")}</Label>
    ) : (
      <Label type="success">{t("weather.protected")}</Label>
    );
    hint = unprotected
      ? t("weather.hint.protect", { item })
      : t("weather.hint.keep");
  } else if (status === "placed") {
    label = <Label type="success">{t("weather.itemPlaced", { item })}</Label>;
    hint = t("weather.hint.keep");
  } else if (status === "used") {
    label = <Label type="default">{t("weather.itemUsed", { item })}</Label>;
    hint = t("weather.hint.renew");
  } else {
    label = (
      <Label type={isThreat ? "danger" : "default"}>
        {t("weather.noItem", { item })}
      </Label>
    );
    hint = isThreat
      ? t("weather.hint.protect", { item })
      : t("weather.hint.boost", { item });
  }

  return (
    <div className="flex items-center gap-2 ml-1">
      <img src={ITEM_DETAILS[item].image} className="w-8 object-contain" />
      <div className="flex flex-col items-start gap-1">
        {label}
        <span className="text-xxs">{hint}</span>
      </div>
    </div>
  );
};
