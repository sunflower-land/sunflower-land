import { ConsumableName, CONSUMABLES } from "features/game/types/consumables";
import { assign, createMachine, Interpreter, State } from "xstate";
import { MachineInterpreter as GameServiceMachineInterpreter } from "src/features/game/lib/gameMachine";
import { GameEventName, PlayingEvent } from "features/game/events";

export interface CraftingContext {
  name?: ConsumableName;
  buildingId: string;
  readyAt?: number;
  secondsTillReady?: number;
  gameService: GameServiceMachineInterpreter;
}

type CraftingState = {
  value: "loading" | "idle" | "crafting" | "ready";
  context: CraftingContext;
};

type CraftEvent = {
  type: "CRAFT";
  event: GameEventName<PlayingEvent>;
  item: ConsumableName;
  buildingId: string;
};

type CollectEvent = {
  type: "COLLECT";
  item: ConsumableName;
  event: GameEventName<PlayingEvent>;
};

type CraftingEvent = CraftEvent | CollectEvent | { type: "TICK" };

export type MachineState = State<CraftingContext, CraftingEvent, CraftingState>;

export type MachineInterpreter = Interpreter<
  CraftingContext,
  any,
  CraftingEvent,
  CraftingState
>;

export const craftingMachine = createMachine<
  CraftingContext,
  CraftingEvent,
  CraftingState
>(
  {
    initial: "loading",
    states: {
      loading: {
        always: [
          {
            target: "crafting",
            cond: "isCrafting",
          },
          {
            target: "ready",
            cond: "isReady",
          },
          { target: "idle" },
        ],
      },
      idle: {
        on: {
          CRAFT: {
            target: "crafting",
            actions: ["sendCraftEventToGameMachine", "assignCraftingDetails"],
          },
        },
      },
      crafting: {
        invoke: {
          src: "createTimer",
        },
        always: {
          target: "ready",
          cond: "isReady",
        },
        on: {
          TICK: {
            actions: "updateSecondsTillReady",
          },
        },
      },
      ready: {
        on: {
          COLLECT: {
            target: "idle",
            actions: ["sendCollectEventToGameMachine", "clearCraftingDetails"],
          },
        },
      },
    },
  },
  {
    services: {
      createTimer: (_) => (cb) => {
        const interval = setInterval(() => {
          cb("TICK");
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      },
    },
    actions: {
      sendCraftEventToGameMachine: (context, event) => {
        if (!context.buildingId) return;

        context.gameService.send((event as CraftEvent).event, {
          item: (event as CraftEvent).item,
          buildingId: context.buildingId,
        });
      },
      assignCraftingDetails: assign((_, event) => {
        const { cookingSeconds } = CONSUMABLES[(event as CraftEvent).item];

        return {
          readyAt: Date.now() + cookingSeconds * 1000,
          name: (event as CraftEvent).item,
        };
      }),
      sendCollectEventToGameMachine: ({ gameService, buildingId }, event) => {
        const { building } = CONSUMABLES[(event as CollectEvent).item];

        gameService?.send((event as CollectEvent).event, {
          building,
          buildingId,
        });
      },
      clearCraftingDetails: assign((_) => ({
        readyAt: undefined,
        secondsTillReady: undefined,
        name: undefined,
      })),
      updateSecondsTillReady: assign({
        secondsTillReady: ({ readyAt }) => {
          if (!readyAt) return;

          const now = Date.now();

          return Math.floor((readyAt - now) / 1000);
        },
      }),
    },
    guards: {
      isReady: ({ readyAt: readyAt }) => {
        return readyAt ? readyAt <= Date.now() : false;
      },
      isCrafting: ({ readyAt }) => (readyAt ? readyAt > Date.now() : false),
    },
  }
);
