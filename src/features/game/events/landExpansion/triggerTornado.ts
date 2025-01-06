import { produce } from "immer";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/decorations";
import { getActiveCalenderEvent } from "features/game/types/calendar";
import { BuildingName } from "features/game/types/buildings";

export type TriggerTornadoAction = {
  type: "tornado.triggered";
};

type Options = {
  state: Readonly<GameState>;
  action: TriggerTornadoAction;
  createdAt?: number;
};

export function triggerTornado({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (game) => {
    const tornado = game.calendar.dates.find(
      (event) => event.name === "tornado",
    );

    if (!tornado) {
      throw new Error("There is no tornado");
    }

    if (
      createdAt - new Date(tornado.date).getTime() >
      1000 * 60 * 60 * 24 * 3
    ) {
      throw new Error("Tornado is too old");
    }

    game.calendar.tornado = {
      triggeredAt: createdAt,
    };

    const hasPinwheel = !!game.collectibles["Tornado Pinwheel"];

    if (hasPinwheel) {
      delete game.collectibles["Tornado Pinwheel"];
      delete game.inventory["Tornado Pinwheel"];
    }

    game.calendar.tornado.protected = hasPinwheel;

    const cropsToRemove = getKeys(game.crops).filter((id) =>
      isCropDestroyed({ id, game }),
    );
    cropsToRemove.forEach((crop) => {
      delete game.crops[crop].crop;
    });

    return game;
  });
}

/**
 * Predictable remove half of the crops in a deterministic way
 */
export function isCropDestroyed({ id, game }: { id: string; game: GameState }) {
  // Sort oldest to newest
  const crops = getKeys(game.crops).sort((a, b) =>
    game.crops[b].createdAt > game.crops[a].createdAt ? -1 : 1,
  );
  const cropsToRemove = crops.slice(0, Math.floor(crops.length / 2));

  return cropsToRemove.includes(id);
}

const TORNADO_DESTROYED_BUILDINGS: BuildingName[] = [
  "Kitchen",
  "Barn",
  "Greenhouse",
  "Crop Machine",
  "Deli",
];

export function isBuildingDestroyed({
  name,
  game,
}: {
  name: BuildingName;
  game: GameState;
}) {
  const isTornado = getActiveCalenderEvent({ game }) === "tornado";

  if (!isTornado) {
    return false;
  }

  if (game.calendar.tornado?.protected) {
    return false;
  }

  return TORNADO_DESTROYED_BUILDINGS.includes(name);
}
