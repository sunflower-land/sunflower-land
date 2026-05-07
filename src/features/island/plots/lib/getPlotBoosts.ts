import { GameState } from "features/game/types/game";
import {
  CropName,
  isAdvancedCrop,
  isBasicCrop,
  isMediumCrop,
} from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CALENDAR_EVENT_ICONS,
  getActiveCalendarEvent,
  getActiveGuardian,
} from "features/game/types/calendar";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isCollectibleOnFarm } from "features/game/lib/aoe";
import {
  AOEItemName,
  isWithinAOE,
  Position,
} from "features/game/expansion/placeable/lib/collisionDetection";

import { CropPlot } from "features/game/types/game";

import bee from "assets/icons/bee.webp";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

export type PlotBoost = {
  image: string;
  description: string;
};

const plotPositionOf = (plot: CropPlot): Position | undefined => {
  if (plot.x === undefined || plot.y === undefined) return undefined;
  return { x: plot.x, y: plot.y, ...RESOURCE_DIMENSIONS["Crop Plot"] };
};

const collectibleAOE = (
  game: GameState,
  name: AOEItemName,
  plotPos: Position,
): boolean => {
  if (!isCollectibleOnFarm({ name, game })) return false;
  const placement = game.collectibles[name]?.[0];
  if (!placement?.coordinates) return false;
  const itemPos: Position = {
    ...placement.coordinates,
    ...COLLECTIBLES_DIMENSIONS[name],
  };
  return isWithinAOE(name, itemPos, plotPos, game.bumpkin.skills);
};

export function getPlotBoosts({
  game,
  plot,
  cropName,
}: {
  game: GameState;
  plot: CropPlot;
  cropName: CropName;
}): PlotBoost[] {
  const boosts: PlotBoost[] = [];
  const skills = game.bumpkin.skills;

  // 1. Fertiliser
  const fertiliser = plot.fertiliser?.name;
  if (fertiliser === "Sprout Mix") {
    boosts.push({
      image: ITEM_DETAILS["Sprout Mix"].image,
      description: "+0.2 yield",
    });
    if (isCollectibleBuilt({ name: "Knowledge Crab", game })) {
      boosts.push({
        image: ITEM_DETAILS["Knowledge Crab"].image,
        description: "+0.2 yield",
      });
    }
  } else if (fertiliser === "Rapid Root") {
    boosts.push({
      image: ITEM_DETAILS["Rapid Root"].image,
      description: "-50% time",
    });
  } else if (fertiliser === "Sproutroot Surprise") {
    boosts.push({
      image: ITEM_DETAILS["Sproutroot Surprise"].image,
      description: "+0.2 yield, -50% time",
    });
    if (isCollectibleBuilt({ name: "Knowledge Crab", game })) {
      boosts.push({
        image: ITEM_DETAILS["Knowledge Crab"].image,
        description: "+0.2 yield",
      });
    }
  }

  // 2. Bee Swarm (yield) — folds in Pollen Power Up bonus
  if (plot.beeSwarm) {
    const count = plot.beeSwarm.count;
    let perSwarm = 0.2;
    if (skills["Pollen Power Up"]) perSwarm += 0.1;
    const total = +(perSwarm * count).toFixed(2);
    const description =
      count > 1 ? `+${total} yield (x${count} swarms)` : `+${total} yield`;
    boosts.push({ image: bee, description });
  }

  // 3. AOE collectibles in range of this plot
  const plotPos = plotPositionOf(plot);
  if (plotPos) {
    // Time AOE: Basic Scarecrow (basic crops only)
    if (
      isBasicCrop(cropName) &&
      collectibleAOE(game, "Basic Scarecrow", plotPos)
    ) {
      const reduction = skills["Chonky Scarecrow"] ? "-30% time" : "-20% time";
      boosts.push({
        image: ITEM_DETAILS["Basic Scarecrow"].image,
        description: reduction,
      });
    }

    // Yield AOE: Scary Mike (medium crops)
    if (isMediumCrop(cropName) && collectibleAOE(game, "Scary Mike", plotPos)) {
      const bonus = skills["Horror Mike"] ? "+0.3 yield" : "+0.2 yield";
      boosts.push({
        image: ITEM_DETAILS["Scary Mike"].image,
        description: bonus,
      });
    }

    // Yield AOE: Sir Goldensnout (any plot crop)
    if (collectibleAOE(game, "Sir Goldensnout", plotPos)) {
      boosts.push({
        image: ITEM_DETAILS["Sir Goldensnout"].image,
        description: "+0.5 yield",
      });
    }

    // Yield AOE: Laurie the Chuckle Crow (advanced crops)
    if (
      isAdvancedCrop(cropName) &&
      collectibleAOE(game, "Laurie the Chuckle Crow", plotPos)
    ) {
      const bonus = skills["Laurie's Gains"] ? "+0.3 yield" : "+0.2 yield";
      boosts.push({
        image: ITEM_DETAILS["Laurie the Chuckle Crow"].image,
        description: bonus,
      });
    }

    // Yield AOE: Queen Cornelia (Corn only)
    if (
      cropName === "Corn" &&
      collectibleAOE(game, "Queen Cornelia", plotPos)
    ) {
      boosts.push({
        image: ITEM_DETAILS["Queen Cornelia"].image,
        description: "+1 yield",
      });
    }

    // Yield AOE: Gnome (medium/advanced crops + Cobalt left + Clementine right)
    if (
      (isMediumCrop(cropName) || isAdvancedCrop(cropName)) &&
      isCollectibleOnFarm({ name: "Gnome", game }) &&
      isCollectibleOnFarm({ name: "Cobalt", game }) &&
      isCollectibleOnFarm({ name: "Clementine", game })
    ) {
      const gnomeCoords = game.collectibles["Gnome"]?.[0]?.coordinates;
      const cobaltCoords = game.collectibles["Cobalt"]?.[0]?.coordinates;
      const clementineCoords =
        game.collectibles["Clementine"]?.[0]?.coordinates;
      if (gnomeCoords && cobaltCoords && clementineCoords) {
        const cobaltLeft =
          cobaltCoords.y === gnomeCoords.y &&
          cobaltCoords.x + 1 === gnomeCoords.x;
        const clementineRight =
          clementineCoords.y === gnomeCoords.y &&
          clementineCoords.x - 1 === gnomeCoords.x;
        const inRange = isWithinAOE(
          "Gnome",
          { ...gnomeCoords, ...COLLECTIBLES_DIMENSIONS["Gnome"] },
          plotPos,
          skills,
        );
        if (cobaltLeft && clementineRight && inRange) {
          boosts.push({
            image: ITEM_DETAILS["Gnome"].image,
            description: "+10 yield",
          });
        }
      }
    }
  }

  // 4. Calendar / weather events that affect this plot
  const activeEvent = getActiveCalendarEvent({ calendar: game.calendar });

  if (activeEvent === "sunshower") {
    boosts.push({
      image: CALENDAR_EVENT_ICONS.sunshower,
      description: "-50% time",
    });
    const { activeGuardian } = getActiveGuardian({ game });
    if (activeGuardian) {
      boosts.push({
        image: ITEM_DETAILS[activeGuardian].image,
        description: "-50% time",
      });
    }
  }

  if (
    activeEvent === "insectPlague" &&
    !game.calendar.insectPlague?.protected
  ) {
    boosts.push({
      image: CALENDAR_EVENT_ICONS.insectPlague,
      description: "-50% yield",
    });
  }

  if (activeEvent === "bountifulHarvest") {
    boosts.push({
      image: CALENDAR_EVENT_ICONS.bountifulHarvest,
      description: "+1 yield",
    });
    const { activeGuardian } = getActiveGuardian({ game });
    if (activeGuardian) {
      boosts.push({
        image: ITEM_DETAILS[activeGuardian].image,
        description: "+1 yield",
      });
    }
  }

  return boosts;
}
