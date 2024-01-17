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
  isProducing?: boolean;
  attachedFlower?: AttachedFlower;
}

type HarvestHive = { type: "HONEY_HARVESTED"; updatedHive: Beehive };
type UpdateHoneyProduced = { type: "UPDATE_HONEY_PRODUCED" };
type HiveBuzz = { type: "BUZZ" };
type UpdateHive = { type: "UPDATE_HIVE"; updatedHive: Beehive };

type BeehiveEvent = UpdateHoneyProduced | HarvestHive | HiveBuzz | UpdateHive;

type BeehiveState = {
  value: "prepareHive" | "hiveBuzzing" | "honeyReady";
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
    initial: "prepareHive",
    states: {
      prepareHive: {
        id: "prepareHive",
        always: [
          { target: "honeyReady", cond: "isFull" },
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
          getFirstAttachedFlower((event as HarvestHive).updatedHive),
        hive: (_, event) => (event as HarvestHive).updatedHive,
        honeyProduced: (_, event) =>
          getCurrentHoneyProduced((event as HarvestHive).updatedHive),
      }),
    },
    guards: {
      isFull: ({ honeyProduced }) => honeyProduced >= HONEY_PRODUCTION_TIME,
    },
  }
);
