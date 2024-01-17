import { Beehive } from "features/game/types/game";
import { Interpreter, State, createMachine, assign } from "xstate";

export const HONEY_PRODUCTION_TIME = 60 * 1000;

export type AttachedFlower = {
  id: string;
  attachedAt: number;
  attachedUntil: number;
};

export interface BeehiveContext {
  honeyProduced: number;
  hive: Beehive;
  showBeeAnimation: boolean;
  isProducing?: boolean;
  attachedFlower?: AttachedFlower;
}

type UpdateHoneyProduced = { type: "UPDATE_HONEY_PRODUCED" };
type HiveBuzz = { type: "BUZZ" };
type UpdateHive = { type: "UPDATE_HIVE"; updatedHive: Beehive };
type NewActiveFlower = { type: "NEW_ACTIVE_FLOWER" };
type BeeAnimationDone = { type: "BEE_ANIMATION_DONE" };

type BeehiveEvent =
  | UpdateHoneyProduced
  | HiveBuzz
  | UpdateHive
  | NewActiveFlower
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

export const getFirstAttachedFlower = (hive: Beehive) => {
  const sortedFlowers = hive.flowers.sort(
    (a, b) => a.attachedAt - b.attachedAt
  );

  return sortedFlowers[0];
};
export const getCurrentHoneyProduced = (hive: Beehive) => {
  const attachedFlower = getFirstAttachedFlower(hive);

  if (!attachedFlower) return hive.honey.produced;

  const start = attachedFlower.attachedAt;
  const end = Math.min(Date.now(), attachedFlower.attachedUntil);

  return hive.honey.produced + Math.max(end - start, 0);
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
          { target: "showBeeAnimation", cond: "hasActiveFlower" },
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
            },
            {
              actions: "checkAndUpdateHoney",
            },
          ],
          UPDATE_HIVE: {
            actions: "updateHive",
          },
          NEW_ACTIVE_FLOWER: {
            target: "showBeeAnimation",
            actions: "updateHive",
          },
        },
      },
      showBeeAnimation: {
        on: {
          BEE_ANIMATION_DONE: {
            target: "hiveBuzzing",
            actions: "resetAnimation",
          },
        },
      },
      honeyReady: {
        id: "honeyReady",
        on: {
          UPDATE_HIVE: {
            target: "hiveBuzzing",
            actions: "updateHive",
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
        isProducing: ({ attachedFlower }) => {
          if (!attachedFlower) return false;
          if (attachedFlower.attachedAt > Date.now()) return false;
          if (attachedFlower.attachedUntil < Date.now()) return false;

          return true;
        },
      }),
      updateHive: assign({
        attachedFlower: (_, event) =>
          getFirstAttachedFlower((event as UpdateHive).updatedHive),
        hive: (_, event) => (event as UpdateHive).updatedHive,
        honeyProduced: (_, event) =>
          getCurrentHoneyProduced((event as UpdateHive).updatedHive),
      }),
      resetAnimation: assign({
        showBeeAnimation: (_) => false,
      }),
    },
    guards: {
      hasActiveFlower: ({ attachedFlower }) => {
        if (!attachedFlower) return false;
        if (attachedFlower.attachedAt > Date.now()) return false;
        if (attachedFlower.attachedUntil < Date.now()) return false;

        return true;
      },
      isFull: ({ honeyProduced }) => honeyProduced >= HONEY_PRODUCTION_TIME,
    },
  }
);
