import {
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  PatchFruit,
} from "features/game/types/fruits";
import { PlantedFruit } from "features/game/types/game";

export const isFruitReadyToHarvest = (
  createdAt: number,
  plantedFruit: PlantedFruit,
  fruitDetails: PatchFruit,
) => {
  const { seed } = PATCH_FRUIT[fruitDetails.name];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  return (
    createdAt -
      (plantedFruit.harvestedAt
        ? plantedFruit.harvestedAt
        : plantedFruit.plantedAt) >=
    plantSeconds * 1000
  );
};
