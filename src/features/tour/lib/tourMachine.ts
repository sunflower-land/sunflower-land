import { createMachine } from "xstate";

export type TourEvent =
  | {
      type: "NEXT";
    }
  | {
      type: "PREVIOUS";
    }
  | {
      type: "EXIT";
    };

export type TourStates = {
  value:
    | "harvesting"
    | "inventory"
    | "selling"
    | "buying"
    | "planting"
    | "tools"
    | "rareItems"
    | "food"
    | "saving"
    | "syncOnChain"
    | "withdraw"
    | "done";
  context: null;
};

export const tourMachine = createMachine<null, TourEvent, TourStates>({
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
      on: {
        NEXT: "shopping",
        PREVIOUS: "harvesting",
      },
    },
    selling: {
      on: {
        NEXT: "buying",
        PREVIOUS: "inventory",
      },
    },
    buying: {
      on: {
        NEXT: "selling",
        PREVIOUS: "selling",
      },
    },
    planting: {
      on: {
        NEXT: "crafting",
        PREVIOUS: "shopping",
      },
    },
    tools: {
      on: {
        NEXT: "rareItems",
        PREVIOUS: "planting",
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
        NEXT: "rareItems",
        PREVIOUS: "rareItems",
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
