import { createMachine } from "xstate";

export type TutorialEvent =
  | {
      type: "NEXT";
    }
  | {
      type: "PREVIOUS";
    }
  | {
      type: "EXIT";
    };

export type TutorialState = {
  value:
    | "harvesting"
    | "inventory"
    | { shopping: "selling" }
    | { shopping: "buying" }
    | "planting"
    | { crafting: "tools" }
    | { crafting: "rareItems" }
    | { crafting: "food" }
    | "saving"
    | "syncOnChain"
    | "withdraw"
    | "done";
  context: null;
};

export const tutorialMachine = createMachine<
  null,
  TutorialEvent,
  TutorialState
>({
  initial: "harvesting",
  on: {
    EXIT: "done",
  },
  states: {
    harvesting: {
      on: {
        NEXT: "inventory",
      },
    },
    inventory: {
      id: "inventory",
      on: {
        NEXT: "shopping",
        PREVIOUS: "harvesting",
      },
    },
    shopping: {
      initial: "selling",
      states: {
        selling: {
          on: {
            NEXT: "buying",
            PREVIOUS: "#inventory",
          },
        },
        buying: {
          on: {
            NEXT: "#planting",
            PREVIOUS: "selling",
          },
        },
      },
    },
    planting: {
      id: "planting",
      on: {
        NEXT: "crafting",
        PREVIOUS: "shopping",
      },
    },
    crafting: {
      initial: "tools",
      states: {
        tools: {
          on: {
            NEXT: "rareItems",
            PREVIOUS: "#planting",
          },
        },
        rareItems: {
          on: {
            NEXT: "food",
            PREVIOUS: "tools",
          },
        },
        food: {
          on: {
            NEXT: "#saving",
            PREVIOUS: "rareItems",
          },
        },
      },
    },
    saving: {
      id: "saving",
      on: {
        NEXT: "syncOnChain",
        PREVIOUS: "crafting",
      },
    },
    syncOnChain: {
      on: {
        NEXT: "withdraw",
        PREVIOUS: "saving",
      },
    },
    withdraw: {
      on: {
        NEXT: "done",
        PREVIOUS: "syncOnChain",
      },
    },
    done: {
      type: "final",
    },
  },
});
