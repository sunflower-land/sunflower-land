import { GameState } from "../types/game";
import { CROPS } from "../types/crops";
import { getKeys } from "./decorations";

export type ReminderType = "crops";

export const REMINDER_TYPES: ReminderType[] = ["crops"];

export type Notifications = {
  telegram: boolean;
  pwa: boolean;
  reminders: Record<ReminderType, boolean>;
};
type Reminder = {
  type: ReminderType;
  remindAt: number;
};

export function getReminders({
  game,
  remindedAt,
}: {
  game: GameState;
  remindedAt: number;
}): Reminder[] {
  const reminders: Reminder[] = [];

  const harvestAts = getKeys(game.crops)
    .filter((crop) => !!game.crops[crop].crop?.plantedAt)
    .map(
      (crop) =>
        game.crops[crop].crop!.plantedAt +
        CROPS[game.crops[crop].crop!.name].harvestSeconds * 1000,
    )
    .filter((harvestAt) => harvestAt > remindedAt);

  if (harvestAts.length > 0) {
    const nextRemindAt = Math.min(...harvestAts);

    reminders.push({
      type: "crops",
      remindAt: nextRemindAt,
    });
  }

  // Ensure all haven't been reminded already
  return reminders.filter((reminder) => reminder.remindAt > remindedAt);
}
