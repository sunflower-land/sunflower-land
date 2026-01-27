import { GameState, InventoryItemName } from "features/game/types/game";

import { produce } from "immer";
import {
  CHAPTER_STORES,
  getCurrentChapter,
  isChapterCollectible,
} from "features/game/types/chapters";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { BumpkinItem } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type ActivateSurgeAction = {
  type: "surge.activated";
};

type Options = {
  state: Readonly<GameState>;
  action: ActivateSurgeAction;
  createdAt?: number;
};

export const SURGE_POWER = 10;

export function activateSurge({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const chapterName = getCurrentChapter(createdAt);

    if (!copy.chapter) {
      throw new Error("Chapter not started");
    }

    if (copy.chapter.name !== chapterName) {
      throw new Error("Chapter not active");
    }

    const inventory = copy.inventory["Chapter Surge"] ?? new Decimal(0);

    if (inventory.lt(1)) {
      throw new Error("Missing surge");
    }

    copy.inventory["Chapter Surge"] = inventory.minus(1);

    const power = copy.chapter.surge?.power ?? 0;

    copy.chapter.surge = {
      power: power + SURGE_POWER,
    };

    copy.farmActivity = trackFarmActivity("Surge Activated", copy.farmActivity);

    return copy;
  });
}
