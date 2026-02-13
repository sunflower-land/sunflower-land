import { CropMachineQueueItem } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
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
  item: CropMachineQueueItem & { startTime: number },
  now: number,
): CropMachineGrowingStage {
  const stageDuration = item.totalGrowTime / 3;

  const stage1Threshold = item.startTime + stageDuration;
  const stage2Threshold = stage1Threshold + stageDuration;
  const harvestThreshold = item.startTime + item.totalGrowTime - 5000; // 5 seconds before the end

  if (now < stage1Threshold) return "planting";
  if (now < stage2Threshold) return "sprouting";
  if (now < harvestThreshold) return "maturing";

  return "harvesting"; // Last 5 seconds
}

function isCropInProgress(item: CropMachineQueueItem, now: number) {
  const hasStarted = item.startTime && item.startTime <= now;

  if (!hasStarted) {
    return false;
  }

  if (item.readyAt && item.readyAt >= now) {
    return true;
  }

  if (item.growsUntil && !item.readyAt) {
    return true;
  }

  return false;
}

export function findGrowingCropPackIndex(
  queue: CropMachineQueueItem[],
  now: number,
) {
  const index = queue.findIndex((item) => {
    const inProgress = isCropInProgress(item, now);

    return inProgress;
  });

  return index >= 0 ? index : undefined;
}

export function hasReadyCrops(queue: CropMachineQueueItem[], now: number) {
  return queue.some((item) => item.readyAt && item.readyAt <= now);
}

export function isCropPackReady(item: CropMachineQueueItem, now: number) {
  if (!item.readyAt) return false;

  return item.readyAt <= now;
}

function updateQueueAndUnallocatedOil(
  updatedQueue: CropMachineQueueItem[],
  updatedOilRemaining: number,
  now: number,
) {
  const cropPackIndex = findGrowingCropPackIndex(updatedQueue, now);
  const cropPack =
    cropPackIndex !== undefined ? updatedQueue[cropPackIndex] : undefined;

  return {
    queue: updatedQueue,
    unallocatedOilTime: updatedOilRemaining,
    growingCropPackIndex: cropPackIndex,
    growingCropPackStage: cropPack
      ? getGrowingCropPackStage(cropPack as GrowingQueueItem, now)
      : undefined,
    canHarvest: hasReadyCrops(updatedQueue, now),
  };
}

export function useCropMachineLiveNow(
  queue: CropMachineQueueItem[],
  options?: { enabled?: boolean },
): number {
  const times = queue.flatMap((p) =>
    [p.readyAt, p.growsUntil].filter((t): t is number => t != null),
  );
  const hasAnyGrowing = times.length > 0;
  const autoEndAt = hasAnyGrowing ? Math.max(...times) : undefined;
  const live = (options?.enabled ?? true) && hasAnyGrowing;
  const now = useNow({ live, autoEndAt });

  return now;
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
        entry: "updateMachine",
        on: {
          TICK: [
            {
              target: "idle",
              cond: "noPacksGrowing",
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
        const now = Date.now();
        const cropPackIndex = findGrowingCropPackIndex(context.queue, now);
        const cropPack =
          cropPackIndex !== undefined
            ? context.queue[cropPackIndex]
            : undefined;

        return {
          ...context,
          growingCropPackIndex: cropPackIndex,
          growingCropPackStage: cropPack
            ? getGrowingCropPackStage(cropPack as GrowingQueueItem, now)
            : undefined,
          canHarvest: hasReadyCrops(context.queue, now),
        };
      }),
      supplyMachine: assign((_, event) => {
        const now = Date.now();
        const { updatedQueue, updatedUnallocatedOilTime: updatedOilRemaining } =
          event as SupplyMachineEvent;

        return updateQueueAndUnallocatedOil(
          updatedQueue,
          updatedOilRemaining,
          now,
        );
      }),
      harvestMachine: assign((_, event) => {
        const now = Date.now();
        const { updatedQueue, updatedUnallocatedOilTime: updatedOilRemaining } =
          event as HarvestCropsEvent;

        return updateQueueAndUnallocatedOil(
          updatedQueue,
          updatedOilRemaining,
          now,
        );
      }),
    },
    guards: {
      noPacksGrowing: (context) => {
        if (context.growingCropPackIndex === undefined) return true;
        const now = Date.now();

        const cropPackIndex = findGrowingCropPackIndex(context.queue, now);

        return cropPackIndex === undefined;
      },
      areCropsGrowing: (context) => {
        if (context.growingCropPackIndex === undefined) return false;
        const now = Date.now();

        const cropPackIndex = findGrowingCropPackIndex(context.queue, now);

        return cropPackIndex !== undefined;
      },
      needsOilToFinishPack: (context) => {
        const cropPackIndex = context.growingCropPackIndex;

        if (cropPackIndex === undefined) return false;

        const cropPack = context.queue[cropPackIndex];

        if (cropPack.readyAt) return false;

        return !!cropPack.growsUntil && cropPack.growsUntil <= Date.now();
      },
    },
  },
);
