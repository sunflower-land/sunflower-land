import { CookableName, COOKABLES } from "features/game/types/consumables";
import { assign, createMachine, Interpreter, State } from "xstate";
import { MachineInterpreter as GameServiceMachineInterpreter } from "src/features/game/lib/gameMachine";
import { GameEventName, PlayingEvent } from "features/game/events";
import { getCookingTime } from "features/game/expansion/lib/boosts";
import { getCookingOilBoost } from "features/game/events/landExpansion/cook";

export interface CraftingContext {
  name?: CookableName;
  buildingId: string;
  readyAt?: number;
  secondsTillReady?: number;
  queue: CookableName[];
  completedRecipes: CookableName[];
  gameService: GameServiceMachineInterpreter;
}

type CraftingState = {
  value:
    | "loading"
    | "idle"
    | "crafting"
    | "checkCrafting"
    | "ready"
    | "checkReady";
  context: CraftingContext;
};

type CraftEvent = {
  type: "CRAFT";
  event: GameEventName<PlayingEvent>;
  item: CookableName;
  buildingId: string;
};

type AddToQueue = {
  type: "ADD_TO_QUEUE";
  event: GameEventName<PlayingEvent>;
  item: CookableName;
  buildingId: string;
};

type InstantReady = {
  type: "INSTANT_READY";
  readyAt: number;
};

type CollectEvent = {
  type: "COLLECT";
  event: GameEventName<PlayingEvent>;
};

type CraftingEvent =
  | CraftEvent
  | CollectEvent
  | { type: "TICK" }
  | { type: "INSTANT" }
  | InstantReady
  | AddToQueue;

export type MachineState = State<CraftingContext, CraftingEvent, CraftingState>;

export type MachineInterpreter = Interpreter<
  CraftingContext,
  any,
  CraftingEvent,
  CraftingState
>;

/**
 * Checks if the crafting is ready based on the readyAt timestamp
 */
export function isReady(readyAt?: number): boolean {
  if (!readyAt) return false;

  return readyAt <= Date.now();
}

export const craftingMachine = createMachine<
  CraftingContext,
  CraftingEvent,
  CraftingState
>({
  initial: "loading",
  states: {
    loading: {
      always: [
        {
          target: "crafting",
          cond: ({ readyAt, queue }) => {
            // Check if currently crafting
            if (!isReady(readyAt)) return true;
            // Check if items in queue
            return Boolean(queue?.length);
          },
        },
        {
          target: "ready",
          cond: ({ readyAt, queue }) => {
            // Only ready if current item is done and queue is empty
            return isReady(readyAt) && !queue?.length;
          },
        },
        { target: "idle" },
      ],
    },
    idle: {
      on: {
        CRAFT: {
          target: "checkCrafting",
          actions: [
            (context, event) => {
              if (!context.buildingId) return;

              context.gameService.send((event as CraftEvent).event, {
                item: (event as CraftEvent).item,
                buildingId: context.buildingId,
              });
            },
            assign((context, event) => {
              const item = (event as CraftEvent).item;

              const cookingTime = getCookingTime({
                seconds: getCookingOilBoost(
                  item,
                  context.gameService.state.context.state,
                  context.buildingId,
                ).timeToCook,
                item,
                game: context.gameService.state.context.state,
              });

              return {
                readyAt: Date.now() + cookingTime * 1000,
                name: (event as CraftEvent).item,
              };
            }),
          ],
        },
      },
    },
    checkCrafting: {
      after: {
        1: [
          {
            target: "idle",
            cond: ({ gameService }) => gameService.state.matches("hoarding"),
            actions: assign((_) => ({
              readyAt: undefined,
              secondsTillReady: undefined,
              name: undefined,
            })),
          },
          {
            target: "crafting",
          },
        ],
      },
    },
    crafting: {
      invoke: {
        src: (_) => (cb) => {
          cb("TICK");
          const interval = setInterval(() => {
            cb("TICK");
          }, 1000);

          return () => {
            clearInterval(interval);
          };
        },
      },
      always: [
        // Go to ready if the crafting is ready and there are no items in the queue
        {
          target: "ready",
          cond: ({ readyAt, queue }) => isReady(readyAt) && queue.length === 0,
        },
        // Go to crafting if the current item is ready and there is another item waiting to be crafted
        {
          target: "crafting",
          cond: ({ readyAt, queue }) => isReady(readyAt) && queue.length > 0,
          actions: assign((context) => {
            const [nextItem, ...remainingQueue] = context.queue;

            const cookingTime = getCookingTime({
              seconds: getCookingOilBoost(
                nextItem,
                context.gameService.state.context.state,
                context.buildingId,
              ).timeToCook,
              item: nextItem,
              game: context.gameService.state.context.state,
            });

            return {
              queue: remainingQueue,
              completedRecipes: [
                ...context.completedRecipes,
                context.name as CookableName,
              ],
              readyAt: Date.now() + cookingTime * 1000,
              name: nextItem,
            };
          }),
        },
      ],
      on: {
        TICK: {
          actions: assign((context) => {
            if (!context.readyAt) {
              return {
                secondsTillReady: undefined,
              };
            }

            const now = Date.now();

            return {
              secondsTillReady: (context.readyAt - now) / 1000,
            };
          }),
        },
        INSTANT: [
          // If there is an item in the queue, then move to crafting and move the current
          // item to the completed recipes
          {
            target: "crafting",
            cond: ({ queue }) => queue.length > 0,
            actions: assign((context) => {
              const [nextItem, ...remainingQueue] = context.queue;

              const cookingTime = getCookingTime({
                seconds: getCookingOilBoost(
                  nextItem,
                  context.gameService.state.context.state,
                  context.buildingId,
                ).timeToCook,
                item: nextItem,
                game: context.gameService.state.context.state,
              });

              return {
                queue: remainingQueue,
                readyAt: Date.now() + cookingTime * 1000,
                name: nextItem,
                secondsTillReady: cookingTime,
                completedRecipes: [
                  ...context.completedRecipes,
                  context.name as CookableName,
                ],
              };
            }),
          },
          {
            target: "idle",
            actions: assign((_) => ({
              readyAt: undefined,
              secondsTillReady: undefined,
              name: undefined,
            })),
          },
        ],
        INSTANT_READY: [
          {
            target: "crafting",
            cond: ({ queue }) => queue.length > 0,
            actions: assign((context) => {
              const [nextItem, ...remainingQueue] = context.queue;

              const cookingTime = getCookingTime({
                seconds: getCookingOilBoost(
                  nextItem,
                  context.gameService.state.context.state,
                  context.buildingId,
                ).timeToCook,
                item: nextItem,
                game: context.gameService.state.context.state,
              });

              return {
                queue: remainingQueue,
                readyAt: Date.now() + cookingTime * 1000,
                name: nextItem,
                secondsTillReady: cookingTime,
                completedRecipes: [
                  ...context.completedRecipes,
                  context.name as CookableName,
                ],
              };
            }),
          },
          {
            target: "ready",
            actions: assign((context) => ({
              completedRecipes: [
                ...context.completedRecipes,
                context.name as CookableName,
              ],
            })),
          },
        ],
        ADD_TO_QUEUE: {
          cond: ({ queue }) => queue.length < 3,
          actions: assign((context, event) => {
            const { queue } = context;

            return {
              queue: [...queue, (event as AddToQueue).item],
            };
          }),
        },
        COLLECT: {
          target: "checkReady",
          cond: ({ completedRecipes }) => completedRecipes.length > 0,
          actions: ({ gameService, buildingId, completedRecipes }, event) => {
            const { building } = COOKABLES[completedRecipes[0]];

            gameService?.send((event as CollectEvent).event, {
              building,
              buildingId,
            });
          },
        },
      },
    },
    ready: {
      on: {
        COLLECT: {
          target: "checkReady",
          actions: ({ gameService, buildingId, completedRecipes }, event) => {
            const { building } = COOKABLES[completedRecipes[0]];

            gameService?.send((event as CollectEvent).event, {
              building,
              buildingId,
            });
          },
        },
      },
    },
    checkReady: {
      after: {
        1: [
          {
            target: "ready",
            cond: ({ gameService }) => gameService.state.matches("hoarding"),
          },
          {
            target: "crafting",
            cond: ({ readyAt, queue }) => !isReady(readyAt) || queue.length > 0,
            actions: assign((_) => ({
              completedRecipes: [],
            })),
          },
          {
            target: "idle",
            actions: assign((_) => ({
              readyAt: undefined,
              secondsTillReady: undefined,
              name: undefined,
              completedRecipes: [],
            })),
          },
        ],
      },
    },
  },
});
