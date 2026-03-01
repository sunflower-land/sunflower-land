import { v4 as uuidv4 } from "uuid";
import { GameEventName, PlacementEvent } from "features/game/events";
import {
  BUILDINGS_DIMENSIONS,
  BuildingName,
} from "features/game/types/buildings";
import { CollectibleName } from "features/game/types/craftables";
import { assign, createMachine, Interpreter, sendParent, State } from "xstate";
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

export type MachineState = State<Context, BlockchainEvent, BlockchainState>;

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const landscapingMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  id: "placeableMachine",
  type: "parallel",
  preserveActionOrder: true,
  on: {
    CANCEL: {
      target: ["saving.done", "editing.done"],
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
            src: async (_: Context, event: any) => {
              const saveEvent = event as SaveEvent;

              const result = await saveGame(
                saveEvent.gameMachineContext,
                undefined,
                saveEvent.farmId,
                saveEvent.rawToken,
              );

              return result;
            },
            onDone: {
              target: "idle",
              actions: sendParent((_, event) => ({
                type: "SAVE_SUCCESS",
                data: event.data,
              })),
            },
            onError: {
              actions: sendParent((_, event) => ({
                type: "SAVE_ERROR",
                data: event.data,
              })),
            },
          },
        },
        done: {
          type: "final",
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
              cond: (context) => !!context.placeable,
            },
          ],
          on: {
            SELECT: {
              target: "placing",
              actions: assign({
                placeable: (_, event) => event.placeable,
                action: (_, event) => event.action,
                requirements: (_, event) => event.requirements,
                multiple: (_, event) => event.multiple,
                maximum: (_, event) => event.maximum,
              }),
            },
            MOVE: {
              actions: assign({
                moving: (_, event) => ({
                  id: event.id,
                  name: event.name,
                }),
              }),
            },
            BLUR: {
              actions: assign({
                moving: (_, event) => undefined,
              }),
            },
            BUILD: {
              target: "idle",
            },
            REMOVE_ALL: {
              target: "idle",
              actions: [
                sendParent((_context, event) => ({
                  type: event.event,
                  location: event.location,
                })),
                assign({ moving: (_) => undefined }),
              ],
            },
            FLIP: {
              target: "idle",
              actions: [
                sendParent((_, event) => ({
                  type: "collectible.flipped",
                  id: event.id,
                  name: event.name,
                  location: event.location,
                })),
              ],
            },
            REMOVE: {
              target: "idle",
              actions: [
                sendParent((_context, event: RemoveEvent) => {
                  const isResource = event.name in RESOURCE_MOVE_EVENTS;
                  const isNFT = event.name === "Bud" || event.name === "Pet";
                  const isFarmHand = event.name === "FarmHand";
                  const hasLocation = !(event.name in RESOURCES_REMOVE_ACTIONS);

                  let nameField = {};
                  if (isNFT) nameField = { nft: event.name };
                  else if (!isResource && !isFarmHand)
                    nameField = { name: event.name };

                  return {
                    type: event.event,
                    id: event.id,
                    ...nameField,
                    ...(hasLocation ? { location: event.location } : {}),
                  };
                }),
                assign({ moving: (_) => undefined }),
              ],
            },
          },
        },
        placing: {
          on: {
            UPDATE: {
              actions: assign({
                coordinates: (_, event) => event.coordinates,
                collisionDetected: (_, event) => event.collisionDetected,
              }),
            },
            BACK: {
              target: "idle",
              actions: assign({
                placeable: (_) => undefined,
              }),
            },
            DRAG: {
              target: "dragging",
            },
            PLACE: [
              {
                target: "placing",
                // They have more to place
                cond: (context, e) => {
                  return !!context.multiple && !!e.nextOrigin;
                },
                actions: [
                  sendParent(
                    ({ placeable, action, coordinates: { x, y } }, e) => {
                      return {
                        type: action,
                        name: placeable?.name,
                        coordinates: { x, y },
                        id: uuidv4().slice(0, 8),
                        location: e.location,
                      } as PlacementEvent;
                    },
                  ),
                  assign({
                    collisionDetected: (_, event) => !!event.nextWillCollide,
                    origin: (_, event) => event.nextOrigin ?? { x: 0, y: 0 },
                    coordinates: (_, event) =>
                      event.nextOrigin ?? { x: 0, y: 0 },
                  }),
                ],
              },
              {
                target: ["#saving.done", "done"],
                cond: (context) =>
                  // When buying/crafting items, return them to playing mode once bought
                  context.action === "collectible.crafted" ||
                  context.action === "collectible.placed" ||
                  context.action === "building.constructed",
                actions: [
                  sendParent(
                    ({ placeable, action, coordinates: { x, y } }, e) => {
                      return {
                        type: action,
                        name: placeable?.name,
                        coordinates: { x, y },
                        id: uuidv4().slice(0, 8),
                        location: e.location,
                      } as PlacementEvent;
                    },
                  ),
                  assign({
                    placeable: (_) => undefined,
                  }),
                ],
              },
              {
                target: ["#saving.done", "idle"],
                actions: [
                  sendParent(
                    (
                      { placeable, action, coordinates: { x, y } },
                      { location },
                    ) => {
                      if (
                        placeable?.name === "Bud" ||
                        placeable?.name === "Pet"
                      ) {
                        return {
                          type: action,
                          coordinates: { x, y },
                          id: placeable?.id,
                          nft: placeable?.name,
                          location,
                        } as PlacementEvent;
                      }
                      if (placeable?.name === "FarmHand" && placeable?.id) {
                        return {
                          type: action,
                          coordinates: { x, y },
                          id: placeable.id,
                          location,
                        } as PlacementEvent;
                      }
                      return {
                        type: action,
                        name: placeable?.name,
                        coordinates: { x, y },
                        id: uuidv4().slice(0, 8),
                        location,
                      } as PlacementEvent;
                    },
                  ),
                  assign({
                    placeable: (_) => undefined,
                  }),
                ],
              },
            ],
          },
        },
        resetting: {
          always: {
            target: "placing",
            // Move the next piece
            actions: assign({
              coordinates: (context) => {
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
                coordinates: (_, event) => event.coordinates,
                collisionDetected: (_, event) => event.collisionDetected,
              }),
            },
            DROP: {
              target: "placing",
            },
          },
        },
        done: {
          type: "final",
        },
      },
    },
  },
});
