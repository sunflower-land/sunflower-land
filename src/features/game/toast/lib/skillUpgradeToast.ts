import { getAvailableUpgrades, getLevel, Profession } from "features/game/types/skills";
import { GameState } from "features/game/types/game";
import { SetToast } from "../ToastQueueProvider";

import plant from "assets/icons/plant.png";
import pickaxe from "assets/tools/stone_pickaxe.png";

export function skillUpgradeToast(profession: Profession, state: GameState, setToast: SetToast) {
  const lvl = getLevel(state.skills[profession])
  const upgrades = getAvailableUpgrades(state);
  const UPGRADE_TOAST_KEY = `${state.farmAddress}.${profession}.level-${lvl}`;

  // show the toast once every skill upgrade
  if (localStorage.getItem(UPGRADE_TOAST_KEY)) return;

  if (upgrades.length > 0) {
    localStorage.setItem(UPGRADE_TOAST_KEY, new Date().toDateString());
    setToast({content: "Skill upgrade available", icon: profession === "farming" ? plant : pickaxe, timeout: 5800})
  }
}
