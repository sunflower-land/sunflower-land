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

type CollectEvent = {
  type: "COLLECT";
  item: CookableName;
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
            target: "checkCrafting",
            actions: ["sendCraftEventToGameMachine", "assignCraftingDetails"],
          },
        },
      },
      checkCrafting: {
        after: {
          1: [
            {
              target: "idle",
              cond: "isHoarding",
              actions: ["clearCraftingDetails"],
            },
            {
              target: "crafting",
            },
          ],
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
              actions: ["clearCraftingDetails"],
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
      sendCraftEventToGameMachine: (context, event) => {
        if (!context.buildingId) return;

        context.gameService.send((event as CraftEvent).event, {
          item: (event as CraftEvent).item,
          buildingId: context.buildingId,
        });
      },
      assignCraftingDetails: assign((context, event) => {
        const { bumpkin } = context.gameService.state.context.state;
        const reducedSeconds = getCookingTime(
          getCookingOilBoost(
            (event as CraftEvent).item,
            context.gameService.state.context.state,
            context.buildingId
          ).timeToCook,
          bumpkin,
          context.gameService.state.context.state
        );

        return {
          readyAt: Date.now() + reducedSeconds * 1000,
          name: (event as CraftEvent).item,
        };
      }),
      sendCollectEventToGameMachine: ({ gameService, buildingId }, event) => {
        const { building } = COOKABLES[(event as CollectEvent).item];

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

          return (readyAt - now) / 1000;
        },
      }),
    },
    guards: {
      isReady: ({ readyAt: readyAt }) => {
        return readyAt ? readyAt <= Date.now() : false;
      },
      isCrafting: ({ readyAt }) => (readyAt ? readyAt > Date.now() : false),
      isHoarding: ({ gameService }) => {
        return gameService.state.matches("hoarding");
      },
    },
  }
);
