import { assign, createMachine, Interpreter, State } from "xstate";
import { MachineInterpreter as GameServiceMachineInterpreter } from "src/features/game/lib/gameMachine";
import { GameEventName, PlayingEvent } from "features/game/events";
import { ComposterName, Bait } from "features/game/types/composters";

export interface CompostingContext {
  bait?: Bait;
  compost?: ComposterName;
  readyAt?: number;
  secondsTillReady?: number;
  gameService: GameServiceMachineInterpreter;
}

type CompostingState = {
  value:
    | "loading"
    | "idle"
    | "composting"
    | "checkComposting"
    | "ready"
    | "checkReady";
  context: CompostingContext;
};

type StartComposterEvent = {
  type: "START_COMPOST";
  event: GameEventName<PlayingEvent>;
  buildingId: string;
  building: ComposterName;
};

type CollectEvent = {
  type: "COLLECT";
  event: GameEventName<PlayingEvent>;
  buildingId: string;
  building: ComposterName;
};

type CompostingEvent = StartComposterEvent | CollectEvent | { type: "TICK" };

export type MachineState = State<
  CompostingContext,
  CompostingEvent,
  CompostingState
>;

export type MachineInterpreter = Interpreter<
  CompostingContext,
  any,
  CompostingEvent,
  CompostingState
>;

export const composterMachine = createMachine<
  CompostingContext,
  CompostingEvent,
  CompostingState
>(
  {
    initial: "loading",
    states: {
      loading: {
        always: [
          {
            target: "composting",
            cond: "isComposting",
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
          START_COMPOST: {
            target: "checkComposting",
            actions: [
              "sendStartComposterEventToGameMachine",
              "assignCompostingDetails",
            ],
          },
        },
      },
      checkComposting: {
        after: {
          1: [
            {
              target: "idle",
              cond: "isHoarding",
              actions: ["clearCompostingDetails"],
            },
            {
              target: "composting",
            },
          ],
        },
      },
      composting: {
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
            target: "checkReady",
            actions: ["sendCollectEventToGameMachine"],
          },
        },
      },
      checkReady: {
        after: {
          1: [
            {
              target: "ready",
              cond: "isHoarding",
            },
            {
              target: "idle",
              actions: ["clearCompostingDetails"],
            },
          ],
        },
      },
    },
  },
  {
    services: {
      createTimer: (_) => (cb) => {
        cb("TICK");
        const interval = setInterval(() => {
          cb("TICK");
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      },
    },
    actions: {
      sendStartComposterEventToGameMachine: (context, event) => {
        context.gameService.send((event as StartComposterEvent).event, {
          buildingId: (event as CollectEvent).buildingId,
          building: (event as CollectEvent).building,
        });
      },
      assignCompostingDetails: assign((context, event) => {
        const { building } = event as StartComposterEvent;

        if (building === "Basic Composter") {
          // 6hrs in milliseconds
          const compostingTime = 6 * 60 * 60 * 1000;
          return {
            readyAt: Date.now() + compostingTime,
          };
        }
        if (building === "Advanced Composter") {
          // 8hrs in milliseconds
          const compostingTime = 8 * 60 * 60 * 1000;
          return {
            readyAt: Date.now() + compostingTime,
          };
        } else
          return {
            readyAt: Date.now() + 12 * 60 * 60 * 1000,
          };
      }),
      sendCollectEventToGameMachine: ({ gameService }, event) => {
        gameService?.send((event as CollectEvent).event, {
          buildingId: (event as CollectEvent).buildingId,
          building: (event as CollectEvent).building,
        });
      },
      clearCompostingDetails: assign((_) => ({
        readyAt: undefined,
        secondsTillReady: undefined,
        bait: undefined,
        compost: undefined,
      })),
      updateSecondsTillReady: assign({
        secondsTillReady: ({ readyAt }) => {
          if (!readyAt) return;

          const now = Date.now();

          return (readyAt - now) / 1000;
        },
      }),
    },
    guards: {
      isReady: ({ readyAt: readyAt }) => {
        return readyAt ? readyAt <= Date.now() : false;
      },
      isComposting: ({ readyAt }) => (readyAt ? readyAt > Date.now() : false),
      isHoarding: ({ gameService }) => {
        return gameService.state.matches("hoarding");
      },
    },
  }
);
