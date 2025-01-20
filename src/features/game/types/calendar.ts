import { GameState, InventoryItemName, TemperateSeasonName } from "./game";
import { Tool } from "./tools";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";

import summer from "assets/icons/summer.webp";
import autumn from "assets/icons/autumn.webp";
import winter from "assets/icons/winter.webp";
import spring from "assets/icons/spring.webp";
import tornado from "assets/icons/tornado.webp";
import fullMoon from "assets/icons/full_moon.png";
import tsunami from "assets/icons/tsunami.webp";
import greatFreeze from "assets/icons/great-freeze.webp";
import doubleDelivery from "assets/icons/double_delivery_icon.webp";
import bountifulHarvest from "assets/icons/bountiful_harvest_icon.webp";
import locust from "assets/icons/locust.webp";
import calendar from "assets/icons/calendar.webp";
import sunshower from "assets/icons/sunshower.webp";

export type CalendarEventName = "unknown" | "calendar" | SeasonalEventName;

export type SeasonalEventName =
  | "tornado"
  | "tsunami"
  | "fullMoon"
  | "greatFreeze"
  | "doubleDelivery"
  | "bountifulHarvest"
  | "insectPlague"
  | "sunshower";

export type CalendarEvent = {
  triggeredAt: number;
  protected?: boolean;
  acknowledgedAt?: number;
};

export const SEASONAL_EVENTS: Record<SeasonalEventName, null> = {
  tornado: null,
  tsunami: null,
  fullMoon: null,
  greatFreeze: null,
  doubleDelivery: null,
  bountifulHarvest: null,
  insectPlague: null,
  sunshower: null,
};

export function getPendingCalendarEvent({
  game,
}: {
  game: GameState;
}): CalendarEventName | null {
  const history = game.calendar?.dates ?? [];

  const upcoming = history
    // Is not in the future
    .filter((event) => new Date(event.date) <= new Date())
    // Has not been triggered already
    .filter((event) => {
      const isSeasonalEvent = (name: string): name is SeasonalEventName => {
        return Object.keys(SEASONAL_EVENTS).includes(name);
      };

      return isSeasonalEvent(event.name)
        ? !game.calendar[event.name]?.triggeredAt
        : true;
    })
    // Filter out events 3 days old
    .filter((event) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const threeDaysAgo = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 3);
      return eventDate >= threeDaysAgo;
    })
    .sort((event) => new Date(event.date).getTime());

  if (upcoming.length === 0) {
    return null;
  }

  return upcoming[0].name;
}

export function getActiveCalendarEvent({
  game,
}: {
  game: GameState;
}): CalendarEventName | undefined {
  if (!game.calendar) return undefined;

  // If trigger in last 24 hours
  if (
    game.calendar.tornado?.triggeredAt &&
    new Date(game.calendar.tornado.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "tornado";
  }

  if (
    game.calendar.tsunami?.triggeredAt &&
    new Date(game.calendar.tsunami.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "tsunami";
  }

  if (
    game.calendar.greatFreeze?.triggeredAt &&
    new Date(game.calendar.greatFreeze.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "greatFreeze";
  }
  if (
    game.calendar.doubleDelivery?.triggeredAt &&
    new Date(game.calendar.doubleDelivery.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "doubleDelivery";
  }
  if (
    game.calendar.bountifulHarvest?.triggeredAt &&
    new Date(game.calendar.bountifulHarvest.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "bountifulHarvest";
  }

  if (
    game.calendar.insectPlague?.triggeredAt &&
    new Date(game.calendar.insectPlague.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "insectPlague";
  }

  if (
    game.calendar.sunshower?.triggeredAt &&
    new Date(game.calendar.sunshower.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "sunshower";
  }

  if (
    game.calendar.fullMoon?.triggeredAt &&
    new Date(game.calendar.fullMoon.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "fullMoon";
  }

  // TODO more events
  return undefined;
}

export const WEATHER_SHOP: Partial<Record<InventoryItemName, Tool>> = {
  "Tornado Pinwheel": {
    name: translate("calendar.events.tornado.prevention"),
    description: translate("description.tornadoPinwheel"),
    ingredients: {},
    price: 1000,
  },
  Mangrove: {
    name: translate("calendar.events.tsunami.prevention"),
    description: translate("description.mangrove"),
    ingredients: {},
    price: 1000,
  },
  "Thermal Stone": {
    name: translate("calendar.events.greatFreeze.prevention"),
    description: translate("description.thermalStone"),
    ingredients: {},
    price: 1000,
  },
  "Protective Pesticide": {
    name: translate("calendar.events.insectPlague.prevention"),
    description: translate("description.protectivePesticide"),
    ingredients: {},
    price: 1000,
  },
};

export const SEASON_DETAILS: Record<
  TemperateSeasonName,
  {
    icon: string;
    description: string;
    inSeason: InventoryItemName[];
  }
> = {
  spring: {
    icon: spring,
    description: "A time of new beginnings as plants sprout and flowers bloom.",
    inSeason: [
      "Sunflower",
      // "Rhubarb",
      "Carrot",
      "Cabbage",
      "Beetroot",
      "Parsnip",
      "Corn",
      "Radish",
      "Wheat",
      "Barley",
    ],
  },
  summer: {
    icon: summer,
    description: "Long sunny days perfect for growing heat-loving crops.",
    inSeason: [
      "Sunflower",
      "Potato",
      // "Zucchini",
      "Soybean",
      // "Hot Pepper",
      // "Coffee",
      "Eggplant",
      "Corn",
      "Radish",
      "Wheat",
    ],
  },
  autumn: {
    icon: autumn,
    description: "Harvest season when crops ripen and leaves turn golden.",
    inSeason: [
      "Sunflower",
      "Potato",
      "Pumpkin",
      "Carrot",
      // "Broccoli",
      "Beetroot",
      "Eggplant",
      "Wheat",
      // "Artichoke",
      "Barley",
    ],
  },
  winter: {
    icon: winter,
    description: "Cold days when hardy vegetables and root crops prevail.",
    inSeason: [
      "Sunflower",
      "Potato",
      // "Yam",
      "Cabbage",
      "Beetroot",
      "Cauliflower",
      "Parsnip",
      // "Onion",
      // "Turnip",
      "Wheat",
      "Kale",
    ],
  },
};

export const CALENDAR_EVENT_ICONS: Record<CalendarEventName, string> = {
  tornado: tornado,
  fullMoon: fullMoon,
  tsunami: tsunami,
  unknown: SUNNYSIDE.icons.lightning,
  calendar: calendar,
  greatFreeze: greatFreeze,
  doubleDelivery: doubleDelivery,
  bountifulHarvest: bountifulHarvest,
  insectPlague: locust,
  sunshower: sunshower,
};

export const isFullMoon = (state: GameState, createdAt: number) => {
  return (
    state.calendar.fullMoon?.triggeredAt &&
    state.calendar.fullMoon?.triggeredAt > createdAt - 24 * 60 * 60 * 1000 &&
    state.calendar.fullMoon?.triggeredAt < createdAt
  );
};
