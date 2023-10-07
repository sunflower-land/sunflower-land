import { createMachine, Interpreter, State } from "xstate";

export interface FishingContext {
  fishedAt?: number;
}

export type FishingState = {
  value: "idle" | "casting" | "waiting" | "reeling" | "caught";
  context: FishingContext;
};

type FishEvent =
  | { type: "CAST" }
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
  initial: "idle",
  states: {
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
