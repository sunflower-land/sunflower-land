import {
  draftPlacementEvent,
  needsDraftPlacement,
  settlePlacementEvent,
  type LandscapingPlaceable,
  type LandscapingPlaceableType,
} from "./lib/placementEvents";
import type { GameEventName, PlacementEvent } from "features/game/events";
import {
  BUILDINGS_DIMENSIONS,
  type BuildingName,
} from "features/game/types/buildings";
import type { CollectibleName } from "features/game/types/craftables";
import {
  assign,
  createMachine,
  type Interpreter,
  sendParent,
  type State,
  choose,
} from "xstate";
import type { Coordinates } from "../components/MapPlacement";
import type { Inventory } from "features/game/types/game";
import {
  type Context as GameMachineContext,
  saveGame,
} from "features/game/lib/gameMachine";
import { RESOURCES, type ResourceName } from "features/game/types/resources";
import {
  RESOURCE_MOVE_EVENTS,
  RESOURCES_REMOVE_ACTIONS,
} from "features/island/collectibles/MovableComponent";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { NFTName } from "features/game/events/landExpansion/placeNFT";
import type { FlipCollectibleAction } from "features/game/events/landExpansion/flipCollectible";
import type { FlipFarmHandAction } from "features/game/events/landExpansion/flipFarmHand";
import type { FlipBumpkinAction } from "features/game/events/landExpansion/flipBumpkin";

// Placement-event building lives in a leaf module so it can be unit-tested;
// re-exported here because this is where the rest of the app imports it from.
export { placeEvent, RESOURCE_PLACE_EVENTS } from "./lib/placementEvents";
export type {
  LandscapingPlaceable,
  LandscapingPlaceableType,
} from "./lib/placementEvents";

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

  /**
   * The landscaping sandbox experiment is on for this player: placements are
   * drafted by the parent and only reach the server on Save. With it off the
   * machine keeps its pre-sandbox behaviour - a purchase places the item in
   * one live event and hands the player straight back to playing.
   */
  sandbox?: boolean;

  /**
   * Bulk-removal mode. When true, the landscaping HUD collapses to a single
   * "exit" button and a red banner, and any click on a placed item dispatches
   * the matching `*.removed` event directly instead of selecting the item.
   */
  removalMode?: boolean;
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
  name: CollectibleName | "FarmHand" | "Bumpkin";
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
  | { type: "TOGGLE_REMOVAL_MODE" }
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
                moving: (_) => undefined,
              }),
            },
            BUILD: {
              target: "idle",
            },
            TOGGLE_REMOVAL_MODE: {
              actions: assign({
                removalMode: (context) => !context.removalMode,
                // Entering removal mode should also clear any current
                // selection so the floating action row goes away.
                moving: (_) => undefined,
              }),
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
                sendParent(
                  (_, event) =>
                    ({
                      type:
                        event.name === "FarmHand"
                          ? "farmHand.flipped"
                          : event.name === "Bumpkin"
                            ? "bumpkin.flipped"
                            : "collectible.flipped",
                      ...(event.name !== "Bumpkin" ? { id: event.id } : {}),
                      ...(event.name !== "FarmHand" && event.name !== "Bumpkin"
                        ? { name: event.name }
                        : {}),
                      location: event.location,
                    }) as
                      | FlipCollectibleAction
                      | FlipFarmHandAction
                      | FlipBumpkinAction,
                ),
              ],
            },
            REMOVE: {
              target: "idle",
              actions: [
                sendParent((_context, event: RemoveEvent) => {
                  const isResource = event.name in RESOURCE_MOVE_EVENTS;
                  const isNFT = event.name === "Bud" || event.name === "Pet";
                  const isFarmHand = event.name === "FarmHand";
                  const isBumpkin = event.name === "Bumpkin";
                  const hasLocation = !(event.name in RESOURCES_REMOVE_ACTIONS);

                  let nameField = {};
                  if (isNFT) nameField = { nft: event.name };
                  else if (!isResource && !isFarmHand && !isBumpkin)
                    nameField = { name: event.name };

                  return {
                    type: event.event,
                    ...nameField,
                    ...(!isBumpkin ? { id: event.id } : {}),
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
                  sendParent((context, e) =>
                    settlePlacementEvent(context, e.location),
                  ),
                  // Buying several in a row settles one purchase per drop, so
                  // each one needs its own draft placement too.
                  choose([
                    {
                      cond: needsDraftPlacement,
                      actions: sendParent((context, e) =>
                        draftPlacementEvent(context, e.location),
                      ),
                    },
                  ]),
                  assign({
                    collisionDetected: (_, event) => !!event.nextWillCollide,
                    origin: (_, event) => event.nextOrigin ?? { x: 0, y: 0 },
                    coordinates: (_, event) =>
                      event.nextOrigin ?? { x: 0, y: 0 },
                  }),
                ],
              },
              {
                // Sandbox experiment off: crafting or constructing places the
                // item in one live event and hands the player back to playing,
                // the way landscaping worked before the sandbox.
                target: ["#saving.done", "done"],
                cond: (context) =>
                  !context.sandbox &&
                  (context.action === "collectible.crafted" ||
                    context.action === "building.constructed"),
                actions: [
                  sendParent((context, e) =>
                    settlePlacementEvent(context, e.location),
                  ),
                  assign({
                    placeable: (_) => undefined,
                  }),
                ],
              },
              {
                // Stay in landscaping (the `saving` region keeps flushing live
                // actions). In the sandbox a purchase is sent live WITHOUT
                // coordinates - the item lands in the chest - followed by a
                // draft placement at the chosen tile, so Cancel keeps the
                // purchase but not the placement. See lib/landscapingDraft.ts.
                target: "idle",
                actions: [
                  sendParent((context, e) =>
                    settlePlacementEvent(context, e.location),
                  ),
                  choose([
                    {
                      cond: needsDraftPlacement,
                      actions: sendParent((context, e) =>
                        draftPlacementEvent(context, e.location),
                      ),
                    },
                  ]),
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
