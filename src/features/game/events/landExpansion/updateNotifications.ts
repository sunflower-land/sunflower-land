import { GameState } from "features/game/types/game";
import { Notifications } from "features/game/types/reminders";
import { produce } from "immer";

export type NotificationsUpdatedAction = {
  type: "notifications.updated";
  notifications: Notifications;
};

type Options = {
  state: GameState;
  action: NotificationsUpdatedAction;
  createdAt?: number;
};

export function updateNotifications({ state, action }: Options) {
  return produce(state, (stateCopy) => {
    stateCopy.settings.notifications = action.notifications;

    return stateCopy;
  });
}
