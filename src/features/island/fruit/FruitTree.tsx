import React, { useContext } from "react";

import { getTimeLeft } from "lib/utils/time";
import { PlantedFruit } from "features/game/types/game";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PATCH_FRUIT_SEEDS, PATCH_FRUIT } from "features/game/types/fruits";
import { FruitSoil } from "./FruitSoil";

import { FruitSeedling } from "./FruitSeedling";

import { DeadTree } from "./DeadTree";
import { ReplenishingTree } from "./ReplenishingTree";
import { ReplenishedTree } from "./ReplenishedTree";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

type Stage = "Empty" | "Seedling" | "Replenishing" | "Replenished" | "Dead";

type FruitTreeStatus = {
  stage: Stage;
  timeLeft?: number;
};

const getFruitTreeStatus = (plantedFruit?: PlantedFruit): FruitTreeStatus => {
  // No fruits planted
  if (!plantedFruit) return { stage: "Empty" };

  const { name, harvestsLeft, harvestedAt, plantedAt } = plantedFruit;

  // Dead tree/bush
  if (!harvestsLeft) return { stage: "Dead" };

  const { seed } = PATCH_FRUIT[name];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  if (harvestedAt) {
    const replenishingTimeLeft = getTimeLeft(harvestedAt, plantSeconds);

    // Replenishing tree
    if (replenishingTimeLeft > 0) {
      return { stage: "Replenishing", timeLeft: replenishingTimeLeft };
    }
  }

  const growingTimeLeft = getTimeLeft(plantedAt, plantSeconds);

  // Seedling
  if (growingTimeLeft > 0) {
    return { stage: "Seedling", timeLeft: growingTimeLeft };
  }

  // Replenished tree
  return { stage: "Replenished" };
};

interface Props {
  plantedFruit?: PlantedFruit;
  plantTree: () => void;
  harvestFruit: () => void;
  removeTree: () => void;
  fertilise: () => void;
  playShakingAnimation: boolean;
  hasAxes: boolean;
}

const _island = (state: MachineState) => state.context.state.island.type;

export const FruitTree: React.FC<Props> = ({
  plantedFruit,
  plantTree,
  harvestFruit,
  removeTree,
  fertilise,
  playShakingAnimation,
  hasAxes,
}) => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);
  const treeStatus = getFruitTreeStatus(plantedFruit);
  useUiRefresher({ active: !!treeStatus.timeLeft });

  // Empty plot
  if (!plantedFruit) {
    return (
      <div className="absolute w-full h-full" onClick={plantTree}>
        <FruitSoil />
      </div>
    );
  }

  const { name } = plantedFruit;

  // Dead tree
  if (treeStatus.stage === "Dead") {
    return (
      <div className="absolute w-full h-full" onClick={removeTree}>
        <DeadTree islandType={island} patchFruitName={name} hasAxes={hasAxes} />
      </div>
    );
  }

  // Seedling tree
  if (treeStatus.stage === "Seedling" && !!treeStatus.timeLeft) {
    return (
      <div className="absolute w-full h-full" onClick={fertilise}>
        <FruitSeedling
          islandType={island}
          patchFruitName={name}
          timeLeft={treeStatus.timeLeft}
        />
      </div>
    );
  }

  // Replenishing tree
  if (treeStatus.stage === "Replenishing" && !!treeStatus.timeLeft) {
    return (
      <div className="absolute w-full h-full" onClick={fertilise}>
        <ReplenishingTree
          islandType={island}
          patchFruitName={name}
          timeLeft={treeStatus.timeLeft}
          playShakeAnimation={playShakingAnimation}
        />
      </div>
    );
  }

  // Ready tree
  return (
    <div className="absolute w-full h-full" onClick={harvestFruit}>
      <ReplenishedTree islandType={island} patchFruitName={name} />
    </div>
  );
};
