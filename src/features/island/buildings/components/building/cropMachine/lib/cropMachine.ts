import Decimal from "decimal.js-light";
import { OIL_PER_HOUR_CONSUMPTION } from "features/game/events/landExpansion/supplyCropMachine";
import { CropMachineQueueItem } from "features/game/types/game";
import { setPrecision } from "lib/utils/formatNumber";
import { Interpreter, State as IState, createMachine, assign } from "xstate";

export interface Context {
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  growingCropPackIndex?: number;
  growingCropPackStage?: CropMachineGrowingStage;
  canHarvest: boolean;
}

export type CropMachineGrowingStage =
  | "planting"
  | "sprouting"
  | "maturing"
  | "harvesting";

type SupplyMachineEvent = {
  type: "SUPPLY_MACHINE";
  updatedQueue: CropMachineQueueItem[];
  updatedUnallocatedOilTime: number;
};

type HarvestCropsEvent = {
  type: "HARVEST_CROPS";
  updatedQueue: CropMachineQueueItem[];
  updatedUnallocatedOilTime: number;
};

type Event = SupplyMachineEvent | HarvestCropsEvent | { type: "TICK" };

type State = {
  value: "idle" | "running" | "paused";
  context: Context;
};

export type CropMachineState = IState<Context, Event, State>;

export type MachineInterpreter = Interpreter<Context, any, Event, State>;

type GrowingQueueItem = CropMachineQueueItem & { startTime: number };

function getGrowingCropPackStage(
  item: CropMachineQueueItem & { startTime: number }
): CropMachineGrowingStage {
  const now = Date.now();

  const stage1Threshold = item.startTime + item.totalGrowTime / 4;
  const stage2Threshold = stage1Threshold + item.totalGrowTime / 4;
  const stage3Threshold = stage2Threshold + item.totalGrowTime / 4;

  if (now < stage1Threshold) return "planting";
  if (now < stage2Threshold) return "sprouting";
  if (now < stage3Threshold) return "maturing";

  return "harvesting";
}

export function findGrowingCropPackIndex(queue: CropMachineQueueItem[]) {
  const index = queue.findIndex((item) => {
    const now = Date.now();
    const { startTime, readyAt, growsUntil } = item;

    const hasStarted = startTime && startTime <= now;
    const isGrowing = (readyAt && readyAt > now) || growsUntil;

    return hasStarted && isGrowing;
  });

  return index >= 0 ? index : undefined;
}

export function hasReadyCrops(queue: CropMachineQueueItem[], now = Date.now()) {
  return queue.some((item) => item.readyAt && item.readyAt <= now);
}

export function convertOilMillisToQuantity(oilRunTime: number): number {
  // Convert oil run time (in milliseconds) to hours by dividing by the run time consumption per oil
  const oilQuantity: number = oilRunTime / (OIL_PER_HOUR_CONSUMPTION * 3600000); // Convert milliseconds to hours
  return setPrecision(new Decimal(oilQuantity), 6).toNumber();
}

export function isCropPackReady(item: CropMachineQueueItem, now = Date.now()) {
  if (!item.readyAt) return false;

  return item.readyAt <= now;
}

function updateQueueAndUnallocatedOil(
  updatedQueue: CropMachineQueueItem[],
  updatedOilRemaining: number
) {
  const cropPackIndex = findGrowingCropPackIndex(updatedQueue);
  const cropPack =
    cropPackIndex !== undefined ? updatedQueue[cropPackIndex] : undefined;

  return {
    queue: updatedQueue,
    unallocatedOilTime: updatedOilRemaining,
    growingCropPackIndex: cropPackIndex,
    growingCropPackStage: cropPack
      ? getGrowingCropPackStage(cropPack as GrowingQueueItem)
      : undefined,
    canHarvest: hasReadyCrops(updatedQueue),
  };
}

export function getTotalOilMillisInMachine(
  queue: CropMachineQueueItem[],
  unallocatedOilTime: number
) {
  const now = Date.now();

  const oil = queue.reduce((totalOil, item) => {
    if (!item.startTime) return totalOil;

    if (item.readyAt && item.startTime <= now) {
      return totalOil + item.readyAt - now;
    }

    if (item.readyAt && item.startTime > now) {
      return totalOil + item.readyAt - item.startTime;
    }

    if (item.growsUntil && item.startTime <= now) {
      return totalOil + item.growsUntil - now;
    }

    if (item.growsUntil && item.startTime > now) {
      return totalOil + item.growsUntil - item.startTime;
    }

    return totalOil;
  }, unallocatedOilTime ?? 0);

  return Math.max(oil, 0);
}

export const cropStateMachine = createMachine<Context, Event, State>(
  {
    id: "cropMachine",
    preserveActionOrder: true,
    predictableActionArguments: true,
    initial: "idle",
    states: {
      idle: {
        always: [
          {
            target: "running",
            cond: "areCropsGrowing",
            actions: "updateMachine",
          },
        ],
        on: {
          SUPPLY_MACHINE: [
            {
              target: "running",
              actions: "supplyMachine",
            },
            {
              actions: "supplyMachine",
            },
          ],
        },
      },
      running: {
        id: "running",
        invoke: {
          src: "startCropMachine",
        },
        on: {
          TICK: [
            {
              target: "idle",
              cond: "noPacksReadyToGrow",
              actions: "updateMachine",
            },
            {
              target: "paused",
              cond: "needsOilToFinishPack",
              actions: "updateMachine",
            },
            { actions: "updateMachine" },
          ],
          SUPPLY_MACHINE: {
            actions: "supplyMachine",
          },
        },
      },
      paused: {
        on: {
          SUPPLY_MACHINE: [
            {
              target: "running",
              cond: "areCropsGrowing",
              actions: "supplyMachine",
            },
            {
              target: "idle",
              cond: "hasOil",
              actions: "supplyMachine",
            },
          ],
        },
      },
    },
    on: {
      HARVEST_CROPS: {
        actions: "harvestMachine",
      },
    },
  },
  {
    services: {
      startCropMachine: () => (cb) => {
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
      updateMachine: assign((context) => {
        const cropPackIndex = findGrowingCropPackIndex(context.queue);
        const cropPack =
          cropPackIndex !== undefined
            ? context.queue[cropPackIndex]
            : undefined;

        return {
          ...context,
          growingCropPackIndex: cropPackIndex,
          growingCropPackStage: cropPack
            ? getGrowingCropPackStage(cropPack as GrowingQueueItem)
            : undefined,
          canHarvest: hasReadyCrops(context.queue),
        };
      }),
      supplyMachine: assign((_, event) => {
        const { updatedQueue, updatedUnallocatedOilTime: updatedOilRemaining } =
          event as SupplyMachineEvent;

        return updateQueueAndUnallocatedOil(updatedQueue, updatedOilRemaining);
      }),
      harvestMachine: assign((_, event) => {
        const { updatedQueue, updatedUnallocatedOilTime: updatedOilRemaining } =
          event as HarvestCropsEvent;

        return updateQueueAndUnallocatedOil(updatedQueue, updatedOilRemaining);
      }),
    },
    guards: {
      noPacksReadyToGrow: (context) => {
        const nextPackToGrowIndex = findGrowingCropPackIndex(context.queue);

        return nextPackToGrowIndex === undefined;
      },
      areCropsGrowing: (context) => {
        if (context.growingCropPackIndex === undefined) return false;

        const cropPackIndex = findGrowingCropPackIndex(context.queue);

        return cropPackIndex !== undefined;
      },
      needsOilToFinishPack: (context) => {
        const cropPackIndex = context.growingCropPackIndex;

        if (cropPackIndex === undefined) return false;

        const cropPack = context.queue[cropPackIndex];

        return !!cropPack.growsUntil && cropPack.growsUntil <= Date.now();
      },
      hasOil: (context) => {
        const now = Date.now();
        if (context.unallocatedOilTime > 0) return true;

        return context.queue.some((item) => {
          if (item.growsUntil && item.growsUntil > now) return true;
          if (item.readyAt && item.readyAt > now) return true;

          return false;
        });
      },
    },
  }
);
