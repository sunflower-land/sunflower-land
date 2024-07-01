import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export type CompleteSpecialEventTaskAction = {
  type: "specialEvent.taskCompleted";
  event: string;
  task: number;
};

type Options = {
  state: GameState;
  action: CompleteSpecialEventTaskAction;
  createdAt?: number;
};

export function completeSpecialEventTask({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);

  const event = stateCopy.specialEvents.current[action.event];
  if (!event) throw new Error("Event does not exist");

  if (!event.isEligible) throw new Error("You are not eligible");

  if (createdAt < event.startAt)
    throw new Error(`${action.event} has not started`);

  if (createdAt > event.endAt) throw new Error(`${action.event} has finished`);

  const taskIndex = action.task - 1;
  const previousTaskIndex = taskIndex - 1;

  const task = event.tasks[taskIndex];
  if (!task) throw new Error("Task does not exist");

  if (task.completedAt)
    throw new Error(`Task ${action.task} already completed`);

  const previousTask = event.tasks[previousTaskIndex];
  if (previousTask) {
    if (!previousTask.completedAt) {
      throw new Error(`Task ${previousTaskIndex + 1} not completed`);
    }

    const previousDay = Math.floor(
      (previousTask.completedAt - event.startAt) / TWENTY_FOUR_HOURS,
    );
    const currentDay = Math.floor(
      (createdAt - event.startAt) / TWENTY_FOUR_HOURS,
    );

    if (previousDay === currentDay) {
      throw new Error("Task already completed today");
    }
  }

  const { items, sfl } = task.requirements;

  const balance = stateCopy.balance;
  if (balance.lt(sfl)) throw new Error("SFL requirement not met");
  stateCopy.balance = balance.minus(sfl);

  stateCopy.inventory = getKeys(items).reduce((inventory, item) => {
    const inventoryAmount = inventory[item] ?? new Decimal(0);
    const requirementAmount = items[item] ?? new Decimal(0);

    if (inventoryAmount.lt(requirementAmount)) {
      throw new Error(`${item} requirements not met`);
    }

    return { ...inventory, [item]: inventoryAmount.minus(requirementAmount) };
  }, stateCopy.inventory);

  task.completedAt = createdAt;
  getKeys(task.reward.items).forEach((item) => {
    const rewardAmount = task.reward.items[item] ?? new Decimal(0);
    stateCopy.inventory[item] = (
      stateCopy.inventory[item] ?? new Decimal(0)
    ).plus(rewardAmount);
  });
  getKeys(task.reward.wearables).forEach((item) => {
    const rewardAmount = task.reward.wearables[item] ?? 0;
    stateCopy.wardrobe[item] = (stateCopy.wardrobe[item] ?? 0) + rewardAmount;
  });
  stateCopy.balance = (stateCopy.balance ?? new Decimal(0)).plus(
    task.reward.sfl,
  );

  const eventYear = new Date(event.startAt).getUTCFullYear();
  const completedTasks = event.tasks.filter((task) => task.completedAt).length;
  const totalTasks = event.tasks.length;

  if (!stateCopy.specialEvents.history[eventYear])
    stateCopy.specialEvents.history[eventYear] = {};
  stateCopy.specialEvents.history[eventYear][action.event] = Math.floor(
    (completedTasks / totalTasks) * 100,
  );

  return stateCopy;
}
