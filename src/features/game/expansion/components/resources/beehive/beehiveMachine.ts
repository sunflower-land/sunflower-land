import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import { Beehive, GameState } from "features/game/types/game";
import { Interpreter, State, createMachine, assign } from "xstate";

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

type BeehiveState = {
  value: "prepareHive" | "hiveBuzzing" | "showBeeAnimation" | "honeyReady";
  context: BeehiveContext;
};

export type BeehiveMachineState = State<
  BeehiveContext,
  BeehiveEvent,
  BeehiveState
>;

export type MachineInterpreter = Interpreter<
  BeehiveContext,
  any,
  BeehiveEvent,
  BeehiveState
>;

export const getActiveFlower = (hive: Beehive) => {
  const now = Date.now();
  const activeFlower = hive.flowers.find((flower) => {
    return flower.attachedAt <= now && flower.attachedUntil > now;
  });

  return activeFlower;
};

export const getCurrentHoneyProduced = (hive: Beehive) => {
  const attachedFlowers = hive.flowers.sort(
    (a, b) => a.attachedAt - b.attachedAt
  );

  return attachedFlowers.reduce((produced, attachedFlower) => {
    const start = Math.max(hive.honey.updatedAt, attachedFlower.attachedAt);
    const end = Math.min(Date.now(), attachedFlower.attachedUntil);

    // Prevent future dates
    const honey = Math.max(end - start, 0) * (attachedFlower.rate ?? 1);

    return (produced += honey);
  }, hive.honey.produced);
};

export const getCurrentSpeed = (hive: Beehive) => {
  const attachedFlowers = hive.flowers.sort(
    (a, b) => a.attachedAt - b.attachedAt
  );

  return attachedFlowers.reduce((rate, attachedFlower) => {
    if (attachedFlower.attachedUntil <= Date.now()) return rate;

    return (rate += attachedFlower.rate ?? 1);
  }, 0);
};

export const beehiveMachine = createMachine<
  BeehiveContext,
  BeehiveEvent,
  BeehiveState
>(
  {
    id: "beehive",
    preserveActionOrder: true,
    initial: "prepareHive",
    states: {
      prepareHive: {
        id: "prepareHive",
        always: [
          { target: "honeyReady", cond: "isFull" },
          {
            target: "showBeeAnimation",
            cond: "hasNewActiveFlower",
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
              cond: "isFull",
              actions: "checkAndUpdateHoney",
            },
            {
              cond: "isFlowerReady",
              actions: ["checkAndUpdateHoney", "removeActiveFlower"],
            },
            {
              target: "showBeeAnimation",
              cond: "hasNewActiveFlower",
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
              cond: "isFull",
              actions: "checkAndUpdateHoney",
            },
            {
              cond: "isFlowerReady",
              actions: ["checkAndUpdateHoney", "removeActiveFlower"],
            },
            {
              target: "showBeeAnimation",
              cond: "hasNewActiveFlower",
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
  },
  {
    services: {
      startHive: () => (cb) => {
        cb("BUZZ");
        const interval = setInterval(() => {
          cb("BUZZ");
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      },
    },
    actions: {
      checkAndUpdateHoney: assign({
        honeyProduced: ({ hive }) => getCurrentHoneyProduced(hive),
        currentSpeed: ({ hive }) => getCurrentSpeed(hive),
        isProducing: ({ attachedFlower }) => {
          if (!attachedFlower) return false;
          if (attachedFlower.attachedAt > Date.now()) return false;
          if (attachedFlower.attachedUntil < Date.now()) return false;

          return true;
        },
      }),
      updateActiveFlower: assign({
        attachedFlower: ({ hive }) => getActiveFlower(hive),
      }),
      updateHive: assign({
        hive: (_, event) => {
          return (event as UpdateHive).updatedHive;
        },
      }),
      harvestHoney: assign({
        hive: (_, event) => {
          return (event as UpdateHive).updatedHive;
        },
        honeyProduced: ({ hive }) => hive.honey.produced,
      }),
      removeActiveFlower: assign((_) => ({
        attachedFlower: undefined,
      })),
    },
    guards: {
      hasNewActiveFlower: ({ attachedFlower, hive }) => {
        if (attachedFlower) return false;
        const activeFlower = getActiveFlower(hive);

        return !!activeFlower;
      },
      isFull: (context) => {
        return context.honeyProduced >= DEFAULT_HONEY_PRODUCTION_TIME;
      },
      isFlowerReady: ({ attachedFlower }) => {
        if (!attachedFlower) return false;

        return attachedFlower.attachedUntil < Date.now();
      },
    },
  }
);
