import Decimal from "decimal.js-light";
import {
  CompetitionTaskName,
  getCompetitionPointsPerTask,
} from "features/game/types/competitions";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

export const CRAFT_TO_COMPETITION_TASK: Record<string, CompetitionTaskName> = {
  "Moo Doll": "Craft a Moo Doll",
  "Wooly Doll": "Craft a Wooly Doll",
  "Lumber Doll": "Craft a Lumber Doll",
  "Gilded Doll": "Craft a Gilded Doll",
  "Lunar Doll": "Craft a Lunar Doll",
  "Ember Doll": "Craft an Ember Doll",
};

export type CollectCraftingAction = {
  type: "crafting.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectCraftingAction;
  createdAt?: number;
};

export function collectCrafting({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { craftingBox } = copy;

    const item = craftingBox.item;

    if (!item) {
      throw new Error("No item to collect");
    }

    if (craftingBox.readyAt > createdAt) {
      throw new Error("Item is not ready");
    }

    if (item.collectible) {
      copy.inventory[item.collectible] = (
        copy.inventory[item.collectible] || new Decimal(0)
      ).plus(1);
    }

    if (item.wearable) {
      copy.wardrobe[item.wearable] = (copy.wardrobe[item.wearable] || 0) + 1;
    }

    copy.farmActivity = trackFarmActivity(
      `${item.collectible || item.wearable} Crafted`,
      copy.farmActivity,
    );

    const craftedName = item.collectible || item.wearable;
    const task = CRAFT_TO_COMPETITION_TASK[craftedName];

    if (
      task &&
      hasFeatureAccess(copy, "BUILDING_FRIENDSHIPS") &&
      copy.competitions.progress.BUILDING_FRIENDSHIPS
    ) {
      const points = getCompetitionPointsPerTask({
        game: copy,
        name: "BUILDING_FRIENDSHIPS",
        task,
      });

      copy.competitions.progress.BUILDING_FRIENDSHIPS.points += points;
      copy.competitions.progress.BUILDING_FRIENDSHIPS.currentProgress[task] =
        (copy.competitions.progress.BUILDING_FRIENDSHIPS.currentProgress[
          task
        ] || 0) + points;
    }

    copy.craftingBox.status = "idle";
    copy.craftingBox.item = undefined;

    return copy;
  });
}
