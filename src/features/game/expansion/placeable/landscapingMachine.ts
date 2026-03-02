import { v4 as uuidv4 } from "uuid";
import { GameEventName, PlacementEvent } from "features/game/events";
import {
  BUILDINGS_DIMENSIONS,
  BuildingName,
} from "features/game/types/buildings";
import { CollectibleName } from "features/game/types/craftables";
import {
  assign,
  createMachine,
  sendParent,
  fromPromise,
  ActorRefFrom,
  SnapshotFrom,
} from "xstate";
import { Coordinates } from "../components/MapPlacement";
import { Inventory } from "features/game/types/game";
import {
  Context as GameMachineContext,
  saveGame,
} from "features/game/lib/gameMachine";
import { RESOURCES } from "features/game/types/resources";
import { ResourceName } from "features/game/types/resources";
import {
  RESOURCE_MOVE_EVENTS,
  RESOURCES_REMOVE_ACTIONS,
} from "features/island/collectibles/MovableComponent";
import { PlaceableLocation } from "features/game/types/collectibles";
import { NFTName } from "features/game/events/landExpansion/placeNFT";

export const RESOURCE_PLACE_EVENTS: Partial<
  Record<ResourceName, GameEventName<PlacementEvent>>
> = {
  Tree: "tree.placed",
  "Ancient Tree": "tree.placed",
  "Sacred Tree": "tree.placed",
  "Stone Rock": "stone.placed",
  "Fused Stone Rock": "stone.placed",
  "Reinforced Stone Rock": "stone.placed",
  "Iron Rock": "iron.placed",
  "Refined Iron Rock": "iron.placed",
  "Tempered Iron Rock": "iron.placed",
  "Gold Rock": "gold.placed",
  "Pure Gold Rock": "gold.placed",
  "Prime Gold Rock": "gold.placed",
  "Crimstone Rock": "crimstone.placed",
  "Crop Plot": "plot.placed",
  "Fruit Patch": "fruitPatch.placed",
  Beehive: "beehive.placed",
  "Flower Bed": "flowerBed.placed",
  "Sunstone Rock": "sunstone.placed",
  "Oil Reserve": "oilReserve.placed",
  "Lava Pit": "lavaPit.placed",
};

export function placeEvent(
  name: LandscapingPlaceable,
): GameEventName<PlacementEvent> {
  if (name in RESOURCES) {
    return RESOURCE_PLACE_EVENTS[
      name as ResourceName
    ] as GameEventName<PlacementEvent>;
  }

  if (name in BUILDINGS_DIMENSIONS) {
    return "building.placed";
  }

  return "collectible.placed";
}

export type LandscapingPlaceable =
  | BuildingName
  | CollectibleName
  | ResourceName
  | NFTName
  | "FarmHand";

export type LandscapingPlaceableType =
  | {
      name: NFTName | "FarmHand";
      id: string;
    }
  | {
      name: BuildingName | CollectibleName | ResourceName;
      id?: string;
    };

export interface Context {
  action?: GameEventName<PlacementEvent>;
  coordinates: Coordinates;
  collisionDetected: boolean;
  placeable?: LandscapingPlaceableType;

  multiple?: boolean;

  origin?: Coordinates;
  requirements: {
    coins: number;
    ingredients: Inventory;
  };

  moving?: { id: string; name: LandscapingPlaceable };

  maximum?: number;
}

type SelectEvent = {
  type: "SELECT";
  placeable: LandscapingPlaceableType;
  action: GameEventName<PlacementEvent>;
  requirements: {
    coins: number;
    ingredients: Inventory;
  };
  collisionDetected: boolean;
  multiple?: boolean;
  maximum?: number;
};

type UpdateEvent = {
  type: "UPDATE";
  coordinates: Coordinates;
  collisionDetected: boolean;
};

type PlaceEvent = {
  type: "PLACE";
  nextOrigin?: Coordinates;
  nextWillCollide?: boolean;
  location: PlaceableLocation;
};

type RemoveEvent = {
  type: "REMOVE";
  event: GameEventName<PlacementEvent>;
  id: string;
  name: LandscapingPlaceable;
  location: PlaceableLocation;
};

type RemoveAllEvent = {
  type: "REMOVE_ALL";
  event: "items.removed";
  location: PlaceableLocation;
};

type FlipEvent = {
  type: "FLIP";
  id: string;
  name: CollectibleName;
  location: PlaceableLocation;
};

type ConstructEvent = {
  type: "CONSTRUCT";
  actionName: PlacementEvent;
};

type MoveEvent = {
  type: "MOVE";
  id: string;
  name: LandscapingPlaceable;
};

export type SaveEvent = {
  type: "SAVE";
  gameMachineContext: GameMachineContext;
  rawToken: string;
  farmId: number;
};

export type BlockchainEvent =
  | { type: "DRAG" }
  | { type: "DROP" }
  | { type: "BUILD" }
  | { type: "BLUR" }
  | SelectEvent
  | ConstructEvent
  | PlaceEvent
  | UpdateEvent
  | SaveEvent
  | MoveEvent
  | RemoveEvent
  | RemoveAllEvent
  | FlipEvent
  | { type: "CANCEL" }
  | { type: "BACK" };

export type BlockchainState = {
  value:
    | "saving"
    | "editing"
    | "close"
    | { saving: "idle" }
    | { saving: "autosaving" }
    | { saving: "close" }
    | { editing: "idle" }
    | { editing: "placing" }
    | { editing: "dragging" }
    | { editing: "close" }
    | { editing: "resetting" };
  context: Context;
};

export type MachineState = SnapshotFrom<typeof landscapingMachine>;

export type MachineInterpreter = ActorRefFrom<typeof landscapingMachine>;

export const landscapingMachine = createMachine({
  types: {} as {
    context: Context;
    events: BlockchainEvent;
  },
  id: "placeableMachine",
  type: "parallel",
  on: {
    CANCEL: {
      target: [".saving.done", ".editing.done"],
    },
  },
  states: {
    saving: {
      id: "saving",
      initial: "idle",
      states: {
        idle: {
          on: {
            SAVE: { target: "autosaving" },
          },
        },
        autosaving: {
          invoke: {
            src: fromPromise(async ({ input }: { input: SaveEvent }) => {
              const result = await saveGame(
                input.gameMachineContext,
                undefined,
                input.farmId,
                input.rawToken,
              );

              return result;
            }),
            input: ({ event }) => event as SaveEvent,
            onDone: {
              target: "idle",
              actions: sendParent(({ event }) => ({
                type: "SAVE_SUCCESS",
                data: (event as any).output,
              })),
            },
            onError: {
              actions: sendParent(({ event }) => ({
                type: "SAVE_ERROR",
                data: (event as any).error,
              })),
            },
          },
        },
        done: {
          type: "final" as const,
        },
      },
    },
    editing: {
      initial: "idle",
      states: {
        idle: {
          always: [
            {
              target: "placing",
              guard: ({ context }) => !!context.placeable,
            },
          ],
          on: {
            SELECT: {
              target: "placing",
              actions: assign({
                placeable: ({ event }) => (event as SelectEvent).placeable,
                action: ({ event }) => (event as SelectEvent).action,
                requirements: ({ event }) =>
                  (event as SelectEvent).requirements,
                multiple: ({ event }) => (event as SelectEvent).multiple,
                maximum: ({ event }) => (event as SelectEvent).maximum,
              }),
            },
            MOVE: {
              actions: assign({
                moving: ({ event }) => ({
                  id: (event as MoveEvent).id,
                  name: (event as MoveEvent).name,
                }),
              }),
            },
            BLUR: {
              actions: assign({
                moving: () => undefined,
              }),
            },
            BUILD: {
              target: "idle",
            },
            REMOVE_ALL: {
              target: "idle",
              actions: [
                sendParent(({ event }) => ({
                  type: (event as RemoveAllEvent).event,
                  location: (event as RemoveAllEvent).location,
                })),
                assign({ moving: () => undefined }),
              ],
            },
            FLIP: {
              target: "idle",
              actions: [
                sendParent(({ event }) => ({
                  type: "collectible.flipped",
                  id: (event as FlipEvent).id,
                  name: (event as FlipEvent).name,
                  location: (event as FlipEvent).location,
                })),
              ],
            },
            REMOVE: {
              target: "idle",
              actions: [
                sendParent(({ event }) => {
                  const e = event as RemoveEvent;
                  const isResource = e.name in RESOURCE_MOVE_EVENTS;
                  const isNFT = e.name === "Bud" || e.name === "Pet";
                  const isFarmHand = e.name === "FarmHand";
                  const hasLocation = !(e.name in RESOURCES_REMOVE_ACTIONS);

                  let nameField = {};
                  if (isNFT) nameField = { nft: e.name };
                  else if (!isResource && !isFarmHand)
                    nameField = { name: e.name };

                  return {
                    type: e.event,
                    id: e.id,
                    ...nameField,
                    ...(hasLocation ? { location: e.location } : {}),
                  };
                }),
                assign({ moving: () => undefined }),
              ],
            },
          },
        },
        placing: {
          on: {
            UPDATE: {
              actions: assign({
                coordinates: ({ event }) => (event as UpdateEvent).coordinates,
                collisionDetected: ({ event }) =>
                  (event as UpdateEvent).collisionDetected,
              }),
            },
            BACK: {
              target: "idle",
              actions: assign({
                placeable: () => undefined,
              }),
            },
            DRAG: {
              target: "dragging",
            },
            PLACE: [
              {
                target: "placing",
                guard: ({ context, event }) => {
                  const e = event as PlaceEvent;
                  return !!context.multiple && !!e.nextOrigin;
                },
                actions: [
                  sendParent(({ context, event }) => {
                    const e = event as PlaceEvent;
                    return {
                      type: context.action,
                      name: context.placeable?.name,
                      coordinates: {
                        x: context.coordinates.x,
                        y: context.coordinates.y,
                      },
                      id: uuidv4().slice(0, 8),
                      location: e.location,
                    } as PlacementEvent;
                  }),
                  assign({
                    collisionDetected: ({ event }) =>
                      !!(event as PlaceEvent).nextWillCollide,
                    origin: ({ event }) =>
                      (event as PlaceEvent).nextOrigin ?? { x: 0, y: 0 },
                    coordinates: ({ event }) =>
                      (event as PlaceEvent).nextOrigin ?? { x: 0, y: 0 },
                  }),
                ],
              },
              {
                target: ["#saving.done", "done"],
                guard: ({ context }) =>
                  context.action === "collectible.crafted" ||
                  context.action === "collectible.placed" ||
                  context.action === "building.constructed",
                actions: [
                  sendParent(({ context, event }) => {
                    const e = event as PlaceEvent;
                    return {
                      type: context.action,
                      name: context.placeable?.name,
                      coordinates: {
                        x: context.coordinates.x,
                        y: context.coordinates.y,
                      },
                      id: uuidv4().slice(0, 8),
                      location: e.location,
                    } as PlacementEvent;
                  }),
                  assign({
                    placeable: () => undefined,
                  }),
                ],
              },
              {
                target: ["#saving.done", "idle"],
                actions: [
                  sendParent(({ context, event }) => {
                    const e = event as PlaceEvent;
                    if (
                      context.placeable?.name === "Bud" ||
                      context.placeable?.name === "Pet"
                    ) {
                      return {
                        type: context.action,
                        coordinates: {
                          x: context.coordinates.x,
                          y: context.coordinates.y,
                        },
                        id: (context.placeable as any)?.id,
                        nft: context.placeable?.name,
                        location: e.location,
                      } as PlacementEvent;
                    }
                    if (
                      context.placeable?.name === "FarmHand" &&
                      (context.placeable as any)?.id
                    ) {
                      return {
                        type: context.action,
                        coordinates: {
                          x: context.coordinates.x,
                          y: context.coordinates.y,
                        },
                        id: (context.placeable as any).id,
                        location: e.location,
                      } as PlacementEvent;
                    }
                    return {
                      type: context.action,
                      name: context.placeable?.name,
                      coordinates: {
                        x: context.coordinates.x,
                        y: context.coordinates.y,
                      },
                      id: uuidv4().slice(0, 8),
                      location: e.location,
                    } as PlacementEvent;
                  }),
                  assign({
                    placeable: () => undefined,
                  }),
                ],
              },
            ],
          },
        },
        resetting: {
          always: {
            target: "placing",
            actions: assign({
              coordinates: ({ context }) => {
                return {
                  x: context.coordinates.x,
                  y: context.coordinates.y - 1,
                };
              },
            }),
          },
        },
        dragging: {
          on: {
            UPDATE: {
              actions: assign({
                coordinates: ({ event }) => (event as UpdateEvent).coordinates,
                collisionDetected: ({ event }) =>
                  (event as UpdateEvent).collisionDetected,
              }),
            },
            DROP: {
              target: "placing",
            },
          },
        },
        done: {
          type: "final" as const,
        },
      },
    },
  },
});
