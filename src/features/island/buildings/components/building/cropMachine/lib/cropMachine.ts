import { CropMachineQueueItem } from "features/game/types/game";
import { Interpreter, State as IState, createMachine, assign } from "xstate";
import { CropMachineGrowingStage } from "../CropMachine";

export interface Context {
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  growingQueueItem?: CropMachineQueueItem;
  growingItemState?: Omit<CropMachineGrowingStage, "idle">;
  hasReadyCrops: boolean;
  totalOilInMachine: number;
}

type SupplyMachineEvent = {
  type: "SUPPLY_MACHINE";
  updatedQueue: CropMachineQueueItem[];
  updatedOilRemaining: number;
};

type Event = SupplyMachineEvent | "TICK";

type State = {
  value:
    | "empty"
    | "running"
    | { running: "planting" }
    | { running: "sprouting" }
    | { running: "matured" }
    | { running: "harvesting" }
    | "prepared";
  context: Context;
};

export type CropMachineState = IState<Context, Event, State>;

export type MachineInterpreter = Interpreter<Context, any, Event, State>;

function allCropsReady(queue: CropMachineQueueItem[]) {
  return queue.every((item) => {
    if (!item.startTime) return false;

    return getGrowingQueueItemState(item as GrowingQueueItem) === "prepared";
  });
}

type GrowingQueueItem = CropMachineQueueItem & { startTime: number };

function getGrowingQueueItemState(
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

export function findGrowingQueueItem(queue: CropMachineQueueItem[]) {
  return queue.find((item) => {
    const now = Date.now();
    const { startTime, readyAt, growsUntil } = item;

    const hasStarted = startTime && startTime <= now;
    const isGrowing = (readyAt && readyAt > now) || growsUntil;

    return hasStarted && isGrowing;
  });
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
        always: [
          {
            target: "running",
            cond: "areCropsGrowing",
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
              cond: "isCurrentPackReady",
              actions: "updateMachine",
            },
            { target: "outOfOil", cond: "hasNoOil" },
            { actions: "updateMachine" },
          ],
          SUPPLY_MACHINE: {
            actions: "supplyMachine",
          },
        },
      },
      outOfOil: {
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
        const growingQueueItem = findGrowingQueueItem(context.queue);

        return {
          growingQueueItem,
          growingItemState: growingQueueItem
            ? getGrowingQueueItemState(growingQueueItem as GrowingQueueItem)
            : undefined,
          hasReadyCrops: hasReadyCrops(context.queue),
        };
      }),
      supplyMachine: assign((context, event) => {
        const { updatedQueue, updatedOilRemaining } =
          event as SupplyMachineEvent;
        const growingQueueItem = findGrowingQueueItem(updatedQueue);

        return {
          queue: updatedQueue,
          unallocatedOilTime: updatedOilRemaining,
          growingQueueItem,
          growingItemState: growingQueueItem
            ? getGrowingQueueItemState(growingQueueItem as GrowingQueueItem)
            : undefined,
          hasReadyCrops: hasReadyCrops(updatedQueue),
        };
      }),
    },
    guards: {
      isCurrentPackReady: (context) => {
        if (!context.growingQueueItem || !context.growingQueueItem.readyAt)
          return false;

        return context.growingQueueItem.readyAt <= Date.now();
      },
      areCropsGrowing: (context) => {
        if (!context.growingQueueItem) return false;

        return !!findGrowingQueueItem(context.queue);
      },
      hasNoOil: (context) => {
        if (context.growingQueueItem && context.growingQueueItem.growsUntil) {
          const { growsUntil } = context.growingQueueItem;

          return growsUntil && growsUntil <= Date.now();
        }
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
