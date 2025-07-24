import { GameState, PlantedCrop, TemperateSeasonName } from "../../types/game";
import { Crop, CropName, CROPS, GreenHouseCropName } from "../../types/crops";
import { SeedName } from "features/game/types/seeds";
import Decimal from "decimal.js-light";
import {
  BumpkinActivityName,
  trackActivity,
} from "features/game/types/bumpkinActivity";
import { CropPlot } from "features/game/types/game";
import { produce } from "immer";
import { getCropYieldAmount } from "./plant";

export type LandExpansionHarvestAction = {
  type: "crop.harvested";
  index: string;
};

type Options = {
  state: GameState;
  action: LandExpansionHarvestAction;
  createdAt?: number;
};

export const isSummerCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>,
): boolean => {
  if (season !== "summer") return false;
  return seasonalSeeds.summer.includes(`${cropName} Seed` as SeedName);
};
export const isAutumnCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>, // 🔄 Pass as argument
): boolean => {
  if (season !== "autumn") return false;
  return seasonalSeeds.autumn.includes(`${cropName} Seed` as SeedName);
};
export const isSpringCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>, // 🔄 Pass as argument
): boolean => {
  if (season !== "spring") return false;
  return seasonalSeeds.spring.includes(`${cropName} Seed` as SeedName);
};
export const isWinterCrop = (
  cropName: CropName | GreenHouseCropName,
  season: TemperateSeasonName,
  seasonalSeeds: Record<TemperateSeasonName, SeedName[]>, // 🔄 Pass as argument
): boolean => {
  if (season !== "winter") return false;
  return seasonalSeeds.winter.includes(`${cropName} Seed` as SeedName);
};

export const isReadyToHarvest = (
  createdAt: number,
  plantedCrop: PlantedCrop,
  cropDetails: Crop,
) => {
  return createdAt - plantedCrop.plantedAt >= cropDetails.harvestSeconds * 1000;
};

export function isCropGrowing(plot: CropPlot) {
  const crop = plot.crop;
  if (!crop) return false;

  const cropDetails = CROPS[crop.name];
  return !isReadyToHarvest(Date.now(), crop, cropDetails);
}

export function harvest({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin, crops: plots } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const plot = plots[action.index];

    if (!plot) {
      throw new Error("Plot does not exist");
    }

    if (!plot.crop) {
      throw new Error("Nothing was planted");
    }

    const { name: cropName, plantedAt, reward, criticalHit } = plot.crop;
    const amount =
      plot.crop.amount ??
      getCropYieldAmount({
        crop: cropName,
        game: stateCopy,
        plot,
        criticalDrop: (name) => !!(criticalHit?.[name] ?? 0),
      });

    const { harvestSeconds } = CROPS[cropName];

    if (createdAt - plantedAt < harvestSeconds * 1000) {
      throw new Error("Not ready");
    }

    if (reward) {
      if (reward.coins) {
        stateCopy.coins = stateCopy.coins + reward.coins;
      }

      if (reward.items) {
        stateCopy.inventory = reward.items.reduce((acc, item) => {
          const amount = acc[item.name] || new Decimal(0);

          return {
            ...acc,
            [item.name]: amount.add(item.amount),
          };
        }, stateCopy.inventory);
      }
    }

    const activityName: BumpkinActivityName = `${cropName} Harvested`;

    bumpkin.activity = trackActivity(activityName, bumpkin.activity);

    // Remove crop data for plot
    delete plot.crop;
    delete plot.beeSwarm;
    delete plot.fertiliser;

    const cropCount = stateCopy.inventory[cropName] || new Decimal(0);

    stateCopy.inventory = {
      ...stateCopy.inventory,
      [cropName]: cropCount.add(amount),
    };

    return stateCopy;
  });
}
