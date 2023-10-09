import { createMachine, Interpreter, State } from "xstate";
import { InventoryItemName } from "features/game/types/game";

export interface FishingContext {
  castedAt?: number;
  caught: Partial<Record<InventoryItemName, number>>;
}

export type FishingState = {
  value: "idle" | "casting" | "ready" | "waiting" | "reeling" | "caught";
  context: FishingContext;
};

type FishEvent =
  | { type: "CAST" }
  | { type: "BIT" }
  | { type: "WAIT" }
  | { type: "REEL" }
  | { type: "CAUGHT" }
  | { type: "CLAIMED" };

export type MachineState = State<FishingContext, FishEvent, FishingState>;

export type FishingService = Interpreter<
  FishingContext,
  any,
  FishEvent,
  FishingState
>;

export const fishingMachine = createMachine<
  FishingContext,
  FishEvent,
  FishingState
>({
  initial: "initial",
  states: {
    initial: {
      always: [
        {
          target: "ready",
          cond: (c) => !!c.caught,
        },
        {
          target: "waiting",
          cond: (c) => !!c.castedAt,
        },
        {
          target: "idle",
        },
      ],
    },
    idle: {
      on: {
        CAST: { target: "casting" },
      },
    },
    casting: {
      on: {
        WAIT: { target: "waiting" },
      },
    },
    waiting: {
      on: {
        BIT: { target: "ready" },
      },
    },
    ready: {
      on: {
        REEL: { target: "reeling" },
      },
    },
    reeling: {
      on: {
        CAUGHT: { target: "caught" },
      },
    },
    caught: {
      on: {
        CLAIMED: { target: "idle" },
      },
    },
  },
});
