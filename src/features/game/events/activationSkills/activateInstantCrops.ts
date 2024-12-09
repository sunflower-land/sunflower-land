import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ActivateInstantCropsAction = {
  type: "instantCrops.activated";
};

type Options = {
  state: Readonly<GameState>;
  action: ActivateInstantCropsAction;
  createdAt?: number;
};

const THREE_DAY_COOLDOWN = 3 * 24 * 60 * 60 * 1000;

export function activateInstantCrops({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { crops, bumpkin } = game;

    if (!bumpkin.skills["Instant Growth"]) {
      throw new Error("Skill not picked up!");
    }

    if (
      !!bumpkin.activationSkills &&
      !!bumpkin.activationSkills["Instant Growth"] &&
      Date.now() - bumpkin.activationSkills["Instant Growth"].activatedAt <
        THREE_DAY_COOLDOWN
    ) {
      throw new Error("You can't activate this skill yet!");
    }

    // Set each plot's plantedAt to 1 (making it grow instantly)
    getKeys(crops).forEach((plot) => {
      const plantedCrop = crops[plot].crop;
      if (plantedCrop) {
        plantedCrop.plantedAt = 1;
      }
    });

    if (!bumpkin.activationSkills) {
      bumpkin.activationSkills = {};
    }

    // Save activated time in state
    bumpkin.activationSkills["Instant Growth"] = { activatedAt: createdAt };

    return game;
  });
}
