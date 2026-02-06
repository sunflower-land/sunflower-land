import Decimal from "decimal.js-light";
import { produce } from "immer";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import {
  REQUIRED_CHEERS,
  VillageProjectName,
  WORKBENCH_MONUMENTS,
} from "features/game/types/monuments";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type StartProjectAction = {
  type: "project.started";
  project: VillageProjectName;
};

type Options = {
  state: Readonly<GameState>;
  action: StartProjectAction;
  createdAt?: number;
};

export function startProject({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!(action.project in REQUIRED_CHEERS)) {
      throw new Error("Invalid project");
    }

    const isPlaced = isCollectibleBuilt({
      name: action.project,
      game: stateCopy,
    });

    if (!isPlaced) {
      throw new Error("Project is not placed");
    }

    if (stateCopy.socialFarming.villageProjects?.[action.project]) {
      throw new Error("Project is already active");
    }

    // Charge the same cost as building the project
    const desiredItem = WORKBENCH_MONUMENTS[action.project];
    const price = desiredItem?.coins ?? 0;

    if (price && stateCopy.coins < price) {
      throw new Error("Insufficient coins");
    }

    const ingredients = desiredItem?.ingredients ?? {};
    getKeys(ingredients).forEach((ingredient) => {
      const count = stateCopy.inventory[ingredient] ?? new Decimal(0);
      const desiredCount = ingredients[ingredient] ?? new Decimal(0);

      if (count.lessThan(desiredCount)) {
        throw new Error(`Insufficient ingredient: ${ingredient}`);
      }

      stateCopy.inventory[ingredient] = count.sub(desiredCount);
    });

    if (price > 0) {
      stateCopy.coins -= price;
      stateCopy.farmActivity = trackFarmActivity(
        "Coins Spent",
        stateCopy.farmActivity,
        new Decimal(price),
      );
    }

    // Remove from completedProjects (if present)
    const completedProjects = stateCopy.socialFarming.completedProjects ?? [];
    stateCopy.socialFarming.completedProjects = completedProjects.filter(
      (p) => p !== action.project,
    );

    // Add village project
    stateCopy.socialFarming.villageProjects[action.project] = {
      cheers: 0,
    };
  });
}
