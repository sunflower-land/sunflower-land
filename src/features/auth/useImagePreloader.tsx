import { useEffect, useState } from "react";

import goblinDonation from "assets/splash/goblin_donation.gif";
import humanDeath from "assets/npcs/human_death.gif";
import lightningDeath from "assets/npcs/human_death.gif";
import minting from "assets/npcs/minting.gif";
import richBegger from "assets/npcs/rich_begger.gif";
import syncing from "assets/npcs/syncing.gif";
import goblinBlacksmith from "assets/buildings/goblin_blacksmith.gif";
import goblinTailor from "assets/buildings/goblin_tailor.png";
import goblinBank from "assets/buildings/goblin_bank.gif";
import background from "assets/land/background.png";
import goblinLandBackground from "assets/land/goblin_background.png";
import waterBackground from "assets/land/water-background.png";
import farm from "assets/brand/nft.png";
import secure from "assets/npcs/synced.gif";
import hungryChicken from "assets/animals/chickens/hungry.gif";
import happyChicken from "assets/animals/chickens/happy.gif";
import walkingChicken from "assets/animals/chickens/walking.gif";
import sleepingChicken from "assets/animals/chickens/sleeping.gif";
import layingEggSheet from "assets/animals/chickens/laying-egg-sheet.png";
import egg from "assets/resources/egg.png";
import richChicken from "assets/animals/chickens/rich_chicken.png";
import fatChicken from "assets/animals/chickens/fat_chicken.png";
import speedChicken from "assets/animals/chickens/speed_chicken.png";
import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";

const IMAGE_LIST: string[] = [
  goblinDonation,
  humanDeath,
  lightningDeath,
  minting,
  richBegger,
  syncing,
  background,
  goblinLandBackground,
  farm,
  goblinBlacksmith,
  goblinTailor,
  goblinBank,
  secure,
  hungryChicken,
  happyChicken,
  walkingChicken,
  sleepingChicken,
  layingEggSheet,
  egg,
  richChicken,
  fatChicken,
  speedChicken,
  waterBackground,
  leftArrow,
  rightArrow,
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
