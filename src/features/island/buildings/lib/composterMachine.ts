import { assign, createMachine, Interpreter, State } from "xstate";
import { MachineInterpreter as GameServiceMachineInterpreter } from "src/features/game/lib/gameMachine";
import { GameEventName, PlayingEvent } from "features/game/events";
import { ComposterProduce } from "features/game/types/game";

export interface CompostingContext {
  name?: ComposterProduce;
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
};

type CollectEvent = {
  type: "COLLECT";
  item: ComposterProduce;
  event: GameEventName<PlayingEvent>;
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
        console.log("sendStartComposterEventToGameMachine");

        context.gameService.send((event as StartComposterEvent).event);
      },
      assignCompostingDetails: assign((context) => {
        // 6hrs in milliseconds
        const compostingTime = 6 * 60 * 60 * 1000;

        return {
          readyAt: Date.now() + compostingTime,
        };
      }),
      sendCollectEventToGameMachine: ({ gameService }, event) => {
        const building = () => {
          if ((event as CollectEvent).item === "Earthworm") {
            return "Basic Composter";
          }
          if ((event as CollectEvent).item === "Grub") {
            return "Advanced Composter";
          }
          return "Expert Composter";
        };

        const buildings = gameService.state.context.state.buildings;
        gameService?.send((event as CollectEvent).event, {
          building: building(),
          buildingId: buildings[building()]?.[0].id,
        });
      },
      clearCompostingDetails: assign((_) => ({
        readyAt: undefined,
        secondsTillReady: undefined,
        name: undefined,
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
