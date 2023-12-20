import { useEffect, useState } from "react";

import goblinDonation from "assets/splash/goblin_donation.gif";
import humanDeath from "assets/npcs/human_death.gif";
import lightningDeath from "assets/npcs/human_death.gif";
import minting from "assets/npcs/minting.gif";
import syncing from "assets/npcs/syncing.gif";
import goblinBlacksmith from "assets/buildings/goblin_blacksmith.gif";
import goblinTailor from "assets/buildings/goblin_tailor.png";
import goblinBank from "assets/buildings/goblin_bank.gif";
import secure from "assets/npcs/synced.gif";
import hungryChicken from "assets/animals/chickens/hungry.gif";
import happyChicken from "assets/animals/chickens/happy.gif";
import walkingChicken from "assets/animals/chickens/walking.gif";
import sleepingChicken from "assets/animals/chickens/sleeping.gif";
import layingEggSheet from "assets/animals/chickens/laying-egg-sheet.png";
import richChicken from "assets/animals/chickens/rich_chicken.png";
import fatChicken from "assets/animals/chickens/fat_chicken.png";
import speedChicken from "assets/animals/chickens/speed_chicken.png";
import helios from "assets/land/helios.webp";
import retreat from "assets/land/retreat.webp";
import treasureIsland from "assets/land/treasure_island.webp";
import snowKingdom from "assets/land/snow_kingdom.webp";
import stoneHeaven from "assets/land/stone_haven.webp";

import silhouette from "assets/bumpkins/silhouette.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { getKeys } from "features/game/types/craftables";

const IMAGE_LIST: string[] = [
  goblinDonation,
  humanDeath,
  lightningDeath,
  minting,
  syncing,
  goblinBlacksmith,
  goblinTailor,
  goblinBank,
  secure,
  hungryChicken,
  happyChicken,
  walkingChicken,
  sleepingChicken,
  layingEggSheet,
  richChicken,
  fatChicken,
  speedChicken,
  helios,
  retreat,
  treasureIsland,
  snowKingdom,
  stoneHeaven,
  silhouette,
  ...Object.values(SUNNYSIDE.icons),
  ...Object.values(SUNNYSIDE.resource),
  ...Object.values(SUNNYSIDE.soil),
  ...Object.values(SUNNYSIDE.tools),
  ...Object.values(SUNNYSIDE.ui),
  ...Object.values(SUNNYSIDE.npcs),
  ...getKeys(CROP_LIFECYCLE).reduce(
    (acc, crop) => [...acc, ...Object.values(CROP_LIFECYCLE[crop])],
    [] as string[]
  ),
];

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = img.onabort = function () {
      reject(src);
    };
    img.src = src;
  });
}

export function useImagePreloader() {
  const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      if (isCancelled) return;

      const imagesPromiseList: Promise<any>[] = [];
      for (const i of IMAGE_LIST) {
        imagesPromiseList.push(preloadImage(i));
      }

      await Promise.all(imagesPromiseList);

      if (isCancelled) return;

      setImagesPreloaded(true);
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { imagesPreloaded };
}
