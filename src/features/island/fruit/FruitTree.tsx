import React, { useContext } from "react";

import { PlantedFruit } from "features/game/types/game";
import { useNow } from "lib/utils/hooks/useNow";
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

const getFruitTreeStatus = (
  plantedFruit: PlantedFruit | undefined,
  now: number,
): FruitTreeStatus => {
  // No fruits planted
  if (!plantedFruit) return { stage: "Empty" };

  const { name, harvestsLeft, harvestedAt, plantedAt } = plantedFruit;

  // Dead tree/bush
  if (!harvestsLeft) return { stage: "Dead" };

  const { seed } = PATCH_FRUIT[name];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  const growMsTotal = plantSeconds * 1000;

  // If the tree has been harvested and still has harvests left, it may be replenishing.
  if (harvestedAt) {
    const replenishMsLeft = harvestedAt + growMsTotal - now;
    const replenishSecondsLeft = replenishMsLeft / 1000;

    if (replenishSecondsLeft > 0) {
      return { stage: "Replenishing", timeLeft: replenishSecondsLeft };
    }
  }

  // Otherwise, it may still be growing from the original planting time.
  const growMsLeft = plantedAt + growMsTotal - now;
  const growSecondsLeft = growMsLeft / 1000;

  if (growSecondsLeft > 0) {
    return { stage: "Seedling", timeLeft: growSecondsLeft };
  }

  // Fully grown and ready to harvest.
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

const _island = (state: MachineState) => state.context.state.island;

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
  const now = useNow({ live: !!plantedFruit });
  const treeStatus = getFruitTreeStatus(plantedFruit, now);

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
        <DeadTree patchFruitName={name} hasAxes={hasAxes} />
      </div>
    );
  }

  // Seedling tree
  if (treeStatus.stage === "Seedling" && !!treeStatus.timeLeft) {
    return (
      <div className="absolute w-full h-full" onClick={fertilise}>
        <FruitSeedling
          island={island}
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
          island={island}
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
      <ReplenishedTree island={island} patchFruitName={name} />
    </div>
  );
};
