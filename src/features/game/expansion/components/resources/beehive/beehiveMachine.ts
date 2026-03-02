import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import { Beehive, GameState } from "features/game/types/game";
import {
  ActorRefFrom,
  SnapshotFrom,
  setup,
  assign,
  fromCallback,
} from "xstate";

export type AttachedFlower = {
  id: string;
  attachedAt: number;
  attachedUntil: number;
};

export interface BeehiveContext {
  honeyProduced: number;
  currentSpeed: number;
  hive: Beehive;
  isProducing?: boolean;
  attachedFlower?: AttachedFlower;
  gameState: GameState;
}

type UpdateHoneyProduced = { type: "UPDATE_HONEY_PRODUCED" };
type HiveBuzz = { type: "BUZZ" };
type UpdateHive = {
  type: "UPDATE_HIVE";
  updatedHive: Beehive;
};
type NewActiveFlower = { type: "NEW_ACTIVE_FLOWER" };
type BeeAnimationDone = { type: "BEE_ANIMATION_DONE" };
type HarvestHoney = {
  type: "HARVEST_HONEY";
  updatedHive: Beehive;
};

type BeehiveEvent =
  | UpdateHoneyProduced
  | HiveBuzz
  | UpdateHive
  | NewActiveFlower
  | HarvestHoney
  | BeeAnimationDone;

export const getActiveFlower = (hive: Beehive) => {
  const now = Date.now();
  const activeFlower = hive.flowers.find((flower) => {
    return flower.attachedAt <= now && flower.attachedUntil > now;
  });

  return activeFlower;
};

export const getCurrentHoneyProduced = (hive: Beehive) => {
  const attachedFlowers = hive.flowers
    .slice()
    .sort((a, b) => a.attachedAt - b.attachedAt);

  return attachedFlowers.reduce((produced, attachedFlower) => {
    const start = Math.max(hive.honey.updatedAt, attachedFlower.attachedAt);
    const end = Math.min(Date.now(), attachedFlower.attachedUntil);

    // Prevent future dates
    const honey = Math.max(end - start, 0) * (attachedFlower.rate ?? 1);

    return (produced += honey);
  }, hive.honey.produced);
};

export const getCurrentSpeed = (hive: Beehive) => {
  const attachedFlowers = hive.flowers
    .slice()
    .sort((a, b) => a.attachedAt - b.attachedAt);

  return attachedFlowers.reduce((rate, attachedFlower) => {
    if (
      attachedFlower.attachedUntil <= Date.now() ||
      attachedFlower.attachedAt > Date.now()
    )
      return rate;

    return (rate += attachedFlower.rate ?? 1);
  }, 0);
};

export const beehiveMachine = setup({
  types: {} as {
    context: BeehiveContext;
    events: BeehiveEvent;
    input: BeehiveContext;
  },
  actors: {
    startHive: fromCallback(({ sendBack }) => {
      sendBack({ type: "BUZZ" });
      const interval = setInterval(() => {
        sendBack({ type: "BUZZ" });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }),
  },
  actions: {
    checkAndUpdateHoney: assign({
      honeyProduced: ({ context }) => getCurrentHoneyProduced(context.hive),
      currentSpeed: ({ context }) => getCurrentSpeed(context.hive),
      isProducing: ({ context }) => {
        if (!context.attachedFlower) return false;
        if (context.attachedFlower.attachedAt > Date.now()) return false;
        if (context.attachedFlower.attachedUntil < Date.now()) return false;

        return true;
      },
    }),
    updateActiveFlower: assign({
      attachedFlower: ({ context }) => getActiveFlower(context.hive),
    }),
    updateHive: assign({
      hive: ({ event }) => {
        return (event as UpdateHive).updatedHive;
      },
    }),
    harvestHoney: assign({
      hive: ({ event }) => {
        return (event as HarvestHoney).updatedHive;
      },
      honeyProduced: ({ event }) =>
        (event as HarvestHoney).updatedHive.honey.produced,
    }),
    removeActiveFlower: assign({
      attachedFlower: () => undefined,
    }),
  },
  guards: {
    hasNewActiveFlower: ({ context }) => {
      if (context.attachedFlower) return false;
      const activeFlower = getActiveFlower(context.hive);

      return !!activeFlower;
    },
    isFull: ({ context }) => {
      return context.honeyProduced >= DEFAULT_HONEY_PRODUCTION_TIME;
    },
    isFlowerReady: ({ context }) => {
      if (!context.attachedFlower) return false;

      return context.attachedFlower.attachedUntil < Date.now();
    },
  },
}).createMachine({
  id: "beehive",
  context: ({ input }) => input,
  initial: "prepareHive",
  states: {
    prepareHive: {
      id: "prepareHive",
      always: [
        { target: "honeyReady", guard: "isFull" },
        {
          target: "showBeeAnimation",
          guard: "hasNewActiveFlower",
          actions: "updateActiveFlower",
        },
        {
          target: "hiveBuzzing",
        },
      ],
    },
    hiveBuzzing: {
      id: "hiveBuzzing",
      invoke: {
        src: "startHive",
      },
      on: {
        BUZZ: [
          {
            target: "honeyReady",
            guard: "isFull",
            actions: "checkAndUpdateHoney",
          },
          {
            guard: "isFlowerReady",
            actions: ["checkAndUpdateHoney", "removeActiveFlower"],
          },
          {
            target: "showBeeAnimation",
            guard: "hasNewActiveFlower",
            actions: "updateActiveFlower",
          },
          {
            actions: "checkAndUpdateHoney",
          },
        ],
        UPDATE_HIVE: {
          actions: "updateHive",
        },
      },
    },
    showBeeAnimation: {
      invoke: {
        src: "startHive",
      },
      on: {
        BUZZ: [
          {
            target: "honeyReady",
            guard: "isFull",
            actions: "checkAndUpdateHoney",
          },
          {
            guard: "isFlowerReady",
            actions: ["checkAndUpdateHoney", "removeActiveFlower"],
          },
          {
            target: "showBeeAnimation",
            guard: "hasNewActiveFlower",
            actions: "updateActiveFlower",
          },
          {
            actions: "checkAndUpdateHoney",
          },
        ],
        BEE_ANIMATION_DONE: {
          target: "hiveBuzzing",
        },
        UPDATE_HIVE: {
          actions: "updateHive",
        },
      },
    },
    honeyReady: {
      on: {
        HARVEST_HONEY: {
          target: "prepareHive",
          actions: "harvestHoney",
        },
      },
    },
  },
});

export type BeehiveMachineState = SnapshotFrom<typeof beehiveMachine>;
export type MachineInterpreter = ActorRefFrom<typeof beehiveMachine>;

export function areBeehivesEmpty(game: GameState): boolean {
  const beehiveProducing = Object.values(game.beehives).every(
    (hive) =>
      getCurrentHoneyProduced(hive) <= DEFAULT_HONEY_PRODUCTION_TIME * 0.01,
  );
  return beehiveProducing;
}
