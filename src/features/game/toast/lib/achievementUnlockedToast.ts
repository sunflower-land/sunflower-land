import { SetToast } from "../ToastQueueProvider";

import plant from "assets/icons/plant.png";
import player from "assets/icons/player.png";
import iron from "assets/resources/iron_ore.png";
import { Achievement } from "features/game/types/achievements";

export function achievementUnlockedToast(
  achievement: Achievement,
  setToast: SetToast
) {
  let icon = null;
  switch (achievement.type) {
    case "farming":
      icon = plant;
      break;
    case "crafting":
      icon = player;
      break;
    case "gathering":
      icon = iron;
      break;
  }

  setToast({
    content: "New Achievement Unlocked",
    icon,
    timeout: 5800,
  });
}
