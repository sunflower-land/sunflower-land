import {
  GameState,
  InventoryItemName,
  IslandType,
  TemperateSeasonName,
} from "./game";
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
import fishFrenzy from "assets/icons/fish_frenzy.webp";
import Decimal from "decimal.js-light";
import { getObjectEntries } from "../expansion/lib/utils";
import { isCollectibleBuilt } from "../lib/collectibleBuilt";

export type CalendarEventName = "unknown" | "calendar" | SeasonalEventName;

export type SeasonalEventName =
  | "tornado"
  | "tsunami"
  | "fullMoon"
  | "greatFreeze"
  | "doubleDelivery"
  | "bountifulHarvest"
  | "insectPlague"
  | "sunshower"
  | "fishFrenzy";

export type CalendarEvent = {
  startedAt: number;
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
  fishFrenzy: null,
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
  calendar,
}: {
  calendar: GameState["calendar"];
}): CalendarEventName | undefined {
  if (!calendar) return undefined;

  // If trigger in last 24 hours
  if (
    calendar.tornado?.startedAt &&
    new Date(calendar.tornado.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "tornado";
  }

  if (
    calendar.tsunami?.startedAt &&
    new Date(calendar.tsunami.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "tsunami";
  }

  if (
    calendar.greatFreeze?.startedAt &&
    new Date(calendar.greatFreeze.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "greatFreeze";
  }
  if (
    calendar.doubleDelivery?.startedAt &&
    new Date(calendar.doubleDelivery.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "doubleDelivery";
  }
  if (
    calendar.bountifulHarvest?.startedAt &&
    new Date(calendar.bountifulHarvest.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "bountifulHarvest";
  }

  if (
    calendar.insectPlague?.startedAt &&
    new Date(calendar.insectPlague.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "insectPlague";
  }

  if (
    calendar.sunshower?.startedAt &&
    new Date(calendar.sunshower.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "sunshower";
  }

  if (
    calendar.fullMoon?.startedAt &&
    new Date(calendar.fullMoon.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "fullMoon";
  }

  if (
    calendar.fishFrenzy?.startedAt &&
    new Date(calendar.fishFrenzy.startedAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "fishFrenzy";
  }

  // TODO more events
  return undefined;
}

export type WeatherShopItem =
  | "Tornado Pinwheel"
  | "Mangrove"
  | "Thermal Stone"
  | "Protective Pesticide";

export const WEATHER_SHOP_ITEM_COSTS: Record<
  WeatherShopItem,
  {
    ingredients: Partial<Record<InventoryItemName, number>>;
    coins: number;
  }
> = {
  "Tornado Pinwheel": {
    ingredients: { Wood: 30, Leather: 5 },
    coins: 100,
  },
  Mangrove: {
    ingredients: { Wood: 30, Leather: 5 },
    coins: 100,
  },
  "Thermal Stone": {
    ingredients: { Stone: 5, Wool: 5 },
    coins: 100,
  },
  "Protective Pesticide": {
    ingredients: { Wood: 30, Feather: 30 },
    coins: 100,
  },
} as const;

export const getWeatherShop = (
  islandType: IslandType,
): Record<WeatherShopItem, Tool> => {
  // Base costs for each item

  const getMultiplier = (islandType: IslandType) => {
    switch (islandType) {
      case "volcano":
        return 2.5;
      case "desert":
        return 2;
      default:
        return 1;
    }
  };

  const multiplier = getMultiplier(islandType);

  const convertIngredients = (ingredients: Record<string, number>) => {
    return Object.entries(ingredients).reduce(
      (acc, [name, amount]) => {
        acc[name as InventoryItemName] = new Decimal(amount * multiplier);
        return acc;
      },
      {} as Record<InventoryItemName, Decimal>,
    );
  };

  return {
    "Tornado Pinwheel": {
      name: translate("calendar.events.tornado.prevention"),
      description: translate("description.tornadoPinwheel"),
      ingredients: () =>
        convertIngredients(
          WEATHER_SHOP_ITEM_COSTS["Tornado Pinwheel"].ingredients,
        ),
      price: WEATHER_SHOP_ITEM_COSTS["Tornado Pinwheel"].coins * multiplier,
    },
    Mangrove: {
      name: translate("calendar.events.tsunami.prevention"),
      description: translate("description.mangrove"),
      ingredients: () =>
        convertIngredients(WEATHER_SHOP_ITEM_COSTS["Mangrove"].ingredients),
      price: WEATHER_SHOP_ITEM_COSTS["Mangrove"].coins * multiplier,
    },
    "Thermal Stone": {
      name: translate("calendar.events.greatFreeze.prevention"),
      description: translate("description.thermalStone"),
      ingredients: () =>
        convertIngredients(
          WEATHER_SHOP_ITEM_COSTS["Thermal Stone"].ingredients,
        ),
      price: WEATHER_SHOP_ITEM_COSTS["Thermal Stone"].coins * multiplier,
    },
    "Protective Pesticide": {
      name: translate("calendar.events.insectPlague.prevention"),
      description: translate("description.protectivePesticide"),
      ingredients: () =>
        convertIngredients(
          WEATHER_SHOP_ITEM_COSTS["Protective Pesticide"].ingredients,
        ),
      price: WEATHER_SHOP_ITEM_COSTS["Protective Pesticide"].coins * multiplier,
    },
  };
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
  fishFrenzy: fishFrenzy,
};

export const isFullMoon = (game: GameState) =>
  getActiveCalendarEvent({ calendar: game.calendar }) === "fullMoon";

export const isFishFrenzy = (game: GameState) =>
  getActiveCalendarEvent({ calendar: game.calendar }) === "fishFrenzy";

type SeasonGuardianName = Extract<
  InventoryItemName,
  "Winter Guardian" | "Spring Guardian" | "Autumn Guardian" | "Summer Guardian"
>;

export const GUARDIAN_BOOST: Record<
  SeasonGuardianName,
  { season: TemperateSeasonName }
> = {
  "Spring Guardian": {
    season: "spring",
  },
  "Summer Guardian": {
    season: "summer",
  },
  "Autumn Guardian": {
    season: "autumn",
  },
  "Winter Guardian": {
    season: "winter",
  },
};

export const getActiveGuardian = ({
  game,
}: {
  game: GameState;
}): {
  activeGuardian: SeasonGuardianName | undefined;
} => {
  const guardian = getObjectEntries(GUARDIAN_BOOST).find(
    ([guardian, { season }]) =>
      season === game.season.season &&
      isCollectibleBuilt({ game, name: guardian }),
  );

  if (!guardian) return { activeGuardian: undefined };

  const [guardianName] = guardian;
  return { activeGuardian: guardianName };
};
