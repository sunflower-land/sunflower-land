import { GameState, InventoryItemName } from "./game";
import { Tool } from "./tools";

export type CalendarEventName = "tornado";

export type CalendarEvent = {
  triggeredAt: number;
  protected?: boolean;
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
    .filter((event) => !game.calendar[event.name]?.triggeredAt)
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

export function getActiveCalenderEvent({
  game,
}: {
  game: GameState;
}): CalendarEventName | undefined {
  // If trigger in last 24 hours
  if (
    game.calendar.tornado?.triggeredAt &&
    new Date(game.calendar.tornado.triggeredAt).getTime() >
      Date.now() - 1000 * 60 * 60 * 24
  ) {
    return "tornado";
  }

  // TODO more events
  return undefined;
}

export const WEATHER_SHOP: Partial<Record<InventoryItemName, Tool>> = {
  "Tornado Pinwheel": {
    name: "Tornado Pinwheel",
    description:
      "A magical pinwheel that protects you from the tornado! One-use only.",
    ingredients: {},
    price: 1000,
  },
};
