import {
  createMachine,
  Interpreter,
  EventObject,
  interpret,
  assign,
} from "xstate";
import { Charity } from "./types/contract";
import { BlockChain } from "./Blockchain";
import { Recipe } from "./types/crafting";
import { hasOnboarded } from "./utils/localStorage";

export interface Context {
  blockChain: BlockChain;
  errorCode?: "NO_WEB3" | "WRONG_CHAIN";
  gasPrice?: number;
}

const hasFarm = ({ blockChain }: Context) => {
  return blockChain.isTrial || blockChain.hasFarm;
};

const MOBILE_DEVICES =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const isMobile = () => {
  return MOBILE_DEVICES.test(navigator.userAgent);
};

export interface FarmCreatedEvent extends EventObject {
  type: "FARM_CREATED";
}

export interface NetworkChangedEvent extends EventObject {
  type: "NETWORK_CHANGED";
}

export interface GetStartedEvent extends EventObject {
  type: "GET_STARTED";
}

export interface SaveEvent extends EventObject {
  type: "SAVE";
}

export interface RetryEvent extends EventObject {
  type: "RETRY";
}

export interface TrialEvent extends EventObject {
  type: "TRIAL";
}
export interface TimerCompleteEvent extends EventObject {
  type: "TIMER_COMPLETE";
}

export interface DonateEvent extends EventObject {
  type: "DONATE";
  donation: {
    charity: Charity;
    value: string;
  };
}

export interface UpgradeEvent extends EventObject {
  type: "UPGRADE";
}

export interface FinishEvent extends EventObject {
  type: "FINISH";
}

export interface CloseOnboardingEvent extends EventObject {
  type: "CLOSE";
}

export interface NextOnboardingEvent extends EventObject {
  type: "NEXT";
}

export interface HarvestedOnboardingEvent extends EventObject {
  type: "HARVEST";
}

export interface PlantedOnboardingEvent extends EventObject {
  type: "PLANT";
}

export interface CraftEvent extends EventObject {
  type: "CRAFT";
  recipe: Recipe;
  amount: number;
}

export interface ChopEvent extends EventObject {
  type: "CHOP";
  resource: string;
  amount: number;
}

export interface MineEvent extends EventObject {
  type: "MINE";
  resource: string;
  amount: number;
}

export interface CollectEggs extends EventObject {
  type: "COLLECT_EGGS";
}

type OnboardingEvent =
  | CloseOnboardingEvent
  | NextOnboardingEvent
  | HarvestedOnboardingEvent
  | PlantedOnboardingEvent;

export type BlockchainEvent =
  | FarmCreatedEvent
  | NetworkChangedEvent
  | GetStartedEvent
  | SaveEvent
  | UpgradeEvent
  | DonateEvent
  | TrialEvent
  | TimerCompleteEvent
  | FinishEvent
  | CloseOnboardingEvent
  | OnboardingEvent
  | CraftEvent
  | RetryEvent
  | ChopEvent
  | MineEvent
  | CollectEggs
  | {
      type: "ACCOUNT_CHANGED";
    }
  | {
      type: "OPEN_REWARD";
    }
  | {
      type: "CANCEL";
    };

export type OnboardingStates =
  | "harvesting"
  | "token"
  | "planting"
  | "saving"
  | "market";

export type BlockchainState = {
  value:
    | "loading"
    | "initial"
    | "registering"
    | "creating"
    | "onboarding"
    | "farming"
    | "failure"
    | "upgrading"
    | "rewarding"
    | "saving"
    | "warning"
    | "confirming"
    | "crafting"
    | "chopping"
    | "collecting"
    | "mining"
    | "timerComplete"
    | "unsupported"
    | "saveFailure"
    | OnboardingStates;
  context: Context;
};

export type BlockchainInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;
export const blockChainMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  id: "farmMachine",
  initial: "initial",
  context: {
    blockChain: new BlockChain(),
    errorCode: null,
  },
  states: {
    initial: {
      on: {
        GET_STARTED: [
          {
            target: "unsupported",
            cond: isMobile,
          },
          {
            target: "loading",
          },
        ],
      },
    },
    loading: {
      invoke: {
        src: ({ blockChain }) => blockChain.initialise(),
        onDone: [
          {
            target: "farming",
            cond: hasFarm,
          },
          {
            target: "registering",
          },
        ],
        onError: {
          target: "failure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    registering: {
      on: {
        DONATE: {
          target: "creating",
        },
      },
    },
    creating: {
      invoke: {
        src: ({ blockChain }, event) =>
          blockChain.createFarm((event as DonateEvent).donation),
        onDone: {
          target: "onboarding",
        },
        onError: {
          target: "registering",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    onboarding: {
      on: {
        FINISH: {
          target: "farming",
        },
        CLOSE: {
          target: "farming",
        },
      },
      initial: "harvesting",
      states: {
        harvesting: {
          on: {
            HARVEST: { target: "token" },
          },
        },
        token: {
          on: {
            NEXT: { target: "planting" },
          },
        },
        planting: {
          on: {
            PLANT: { target: "saving" },
          },
        },
        saving: {
          on: {
            NEXT: { target: "market" },
          },
        },
        market: {},
      },
    },
    farming: {
      on: {
        SAVE: {
          target: "saving",
        },
        UPGRADE: {
          target: "upgrading",
        },
        OPEN_REWARD: {
          target: "rewarding",
        },
        CRAFT: {
          target: "crafting",
        },
        CHOP: {
          target: "chopping",
        },
        MINE: {
          target: "mining",
        },
        COLLECT_EGGS: {
          target: "collecting",
        },
        TIMER_COMPLETE: {
          target: "timerComplete",
        },
        ACCOUNT_CHANGED: {
          target: "loading",
          actions: (context) => context.blockChain.resetFarm(),
        },
        NETWORK_CHANGED: {
          target: "loading",
          actions: (context) => context.blockChain.resetFarm(),
        },
      },
    },
    warning: {
      on: {
        SAVE: "confirming",
      },
    },
    saving: {
      invoke: {
        id: "save",
        src: async ({ blockChain }, event) => {
          const estimate = await blockChain.estimate();

          return { estimate };
        },
        onDone: [
          {
            cond: (_, event) => {
              // First time saving, show the warning
              if (!hasOnboarded()) {
                return true;
              }

              console.log({ event });
              // Woh! Gas prices are large, give the player a hint
              return event.data.estimate > 40000000000;
            },
            target: "warning",
            actions: assign({
              gasPrice: (context, event) => event.data.estimate,
            }),
          },
          {
            target: "confirming",
          },
        ],
        onError: {
          target: "saveFailure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    confirming: {
      invoke: {
        id: "save",
        src: async ({ blockChain }, event) => blockChain.save(),
        onDone: {
          target: "farming",
        },
        onError: {
          target: "saveFailure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    upgrading: {
      invoke: {
        id: "upgrading",
        src: async ({ blockChain }) => {
          await blockChain.levelUp();
        },
        onDone: {
          target: "farming",
        },
        onError: {
          target: "failure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    rewarding: {
      invoke: {
        id: "rewarding",
        src: async ({ blockChain }, event) => blockChain.receiveReward(),
        onDone: {
          target: "farming",
          // actions - assign() data?
        },
        onError: {
          target: "failure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    crafting: {
      invoke: {
        id: "crafting",
        src: async ({ blockChain }, event) =>
          blockChain.craft(event as CraftEvent),
        onDone: {
          target: "farming",
          // actions - assign() data?
        },
        onError: {
          target: "failure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    chopping: {
      invoke: {
        id: "chopping",
        src: async ({ blockChain }, event) =>
          blockChain.stake(event as ChopEvent),
        onDone: {
          target: "farming",
          // actions - assign() data?
        },
        onError: {
          target: "failure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    mining: {
      invoke: {
        id: "mining",
        src: async ({ blockChain }, event) =>
          blockChain.stake(event as ChopEvent),
        onDone: {
          target: "farming",
        },
        onError: {
          target: "failure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    collecting: {
      invoke: {
        id: "collecting",
        src: async ({ blockChain }) => blockChain.collectEggs(),
        onDone: {
          target: "farming",
        },
        onError: {
          target: "failure",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    failure: {
      on: {
        NETWORK_CHANGED: {
          target: "loading",
          actions: (context) => {
            context.blockChain.endTrialMode();
          },
        },
        TRIAL: {
          target: "onboarding",
          actions: (context) => {
            context.blockChain.startTrialMode();
          },
        },
      },
    },
    saveFailure: {
      on: {
        SAVE: {
          target: "saving",
          actions: (context) => {
            context.blockChain.offsetTime();
          },
        },
        CLOSE: {
          target: "farming",
        },
      },
    },
    timerComplete: {
      on: {
        SAVE: {
          target: "saving",
          actions: (context) => {
            context.blockChain.offsetTime();
          },
        },
      },
    },
    unsupported: {},
  },
});

export const service = interpret<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>(blockChainMachine);

service.start();
