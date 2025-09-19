import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

import { GameState } from "features/game/types/game";
import { isFullMoonBerry } from "./seedBought";
import { SeedName } from "features/game/types/seeds";

export const getFruitHarvests = (
  state: Readonly<GameState>,
  seed: SeedName,
) => {
  let harvests = [3, 5];
  if (isFullMoonBerry(seed)) {
    harvests = [4, 4];
  }
  if (isCollectibleBuilt({ name: "Immortal Pear", game: state })) {
    harvests = harvests.map(
      (harvest) => harvest + (state.bumpkin.skills["Pear Turbocharge"] ? 2 : 1),
    );
  }

  return harvests;
};
