import { CropMachineQueueItem } from "features/game/types/game";
import { Interpreter, State as IState, createMachine, assign } from "xstate";
import { CropMachineGrowingStage } from "../CropMachine";

export interface Context {
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  growingCropPackIndex?: number;
  growingCropPackStage?: Omit<CropMachineGrowingStage, "idle">;
  canHarvest: boolean;
}

type SupplyMachineEvent = {
  type: "SUPPLY_MACHINE";
  updatedQueue: CropMachineQueueItem[];
  updatedOilRemaining: number;
};

type Event = SupplyMachineEvent | "TICK";

type State = {
  value: "idle" | "running" | "paused";
  context: Context;
};

export type CropMachineState = IState<Context, Event, State>;

export type MachineInterpreter = Interpreter<Context, any, Event, State>;

type GrowingQueueItem = CropMachineQueueItem & { startTime: number };

function getGrowingCropPackState(
  item: CropMachineQueueItem & { startTime: number }
): Omit<CropMachineGrowingStage, "idle"> {
  const now = Date.now();

  const stage1Threshold = item.startTime + item.totalGrowTime / 5;
  const stage2Threshold = stage1Threshold + item.totalGrowTime / 5;
  const stage3Threshold = stage2Threshold + item.totalGrowTime / 5;
  const stage4Threshold = stage3Threshold + item.totalGrowTime / 5;

  if (now < stage1Threshold) return "planting";
  if (now < stage2Threshold) return "sprouting";
  if (now < stage3Threshold) return "matured";
  if (now < stage4Threshold) return "harvesting";

  return "prepared";
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

export function calculateTotalOilInMachine(
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
    initial: "prepareMachine",
    states: {
      prepareMachine: {
        id: "prepareMachine",
        always: [
          {
            target: "running",
            cond: "areCropsGrowing",
          },
          { target: "idle" },
        ],
      },
      idle: {
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
              target: "prepareMachine",
              cond: "isCurrentPackReady",
              actions: "updateMachine",
            },
            { target: "paused", cond: "noOilRemaining" },
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
              actions: "updateMachine",
            },
            {
              target: "idle",
              cond: "hasOil",
              actions: "updateMachine",
            },
          ],
        },
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
        const cropPack = cropPackIndex
          ? context.queue[cropPackIndex]
          : undefined;

        return {
          growingCropPackIndex: cropPackIndex,
          growingCropPackStage: cropPack
            ? getGrowingCropPackState(cropPack as GrowingQueueItem)
            : undefined,
          canHarvest: hasReadyCrops(context.queue),
        };
      }),
      supplyMachine: assign((context, event) => {
        const { updatedQueue, updatedOilRemaining } =
          event as SupplyMachineEvent;
        const cropPackIndex = findGrowingCropPackIndex(updatedQueue);
        const cropPack = cropPackIndex
          ? updatedQueue[cropPackIndex]
          : undefined;

        return {
          queue: updatedQueue,
          unallocatedOilTime: updatedOilRemaining,
          growingCropPackIndex: cropPackIndex,
          growingCropPackStage: cropPack
            ? getGrowingCropPackState(cropPack as GrowingQueueItem)
            : undefined,
          canHarvest: hasReadyCrops(updatedQueue),
        };
      }),
    },
    guards: {
      isCurrentPackReady: (context) => {
        const cropPackIndex = context.growingCropPackIndex;

        if (!cropPackIndex) return false;

        const cropPack = context.queue[cropPackIndex];

        if (!cropPack.readyAt) return false;

        return cropPack.readyAt <= Date.now();
      },
      areCropsGrowing: (context) => {
        if (context.growingCropPackIndex === undefined) return false;
        const cropPackIndex = findGrowingCropPackIndex(context.queue);

        return cropPackIndex !== undefined;
      },
      noOilRemaining: (context) => {
        const cropPackIndex = context.growingCropPackIndex;

        if (!cropPackIndex) return false;

        const cropPack = context.queue[cropPackIndex];

        return cropPack.growsUntil && cropPack.growsUntil <= Date.now();
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
