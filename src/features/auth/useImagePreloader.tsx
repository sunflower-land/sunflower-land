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
import brokenRocket from "assets/mom/mom_broken_rocket.gif";
import hungryChicken from "assets/animals/chickens/hungry.gif";
import happyChicken from "assets/animals/chickens/happy.gif";
import walkingChicken from "assets/animals/chickens/walking.gif";
import sleepingChicken from "assets/animals/chickens/sleeping.gif";
import layingEggSheet from "assets/animals/chickens/laying-egg-sheet.png";
import egg from "assets/resources/egg.png";
import richChicken from "assets/animals/chickens/rich_chicken.png";
import fatChicken from "assets/animals/chickens/fat_chicken.png";
import speedChicken from "assets/animals/chickens/speed_chicken.png";
import hair1 from "assets/bumpkins/large/hair/basic.png";
import hair2 from "assets/bumpkins/large/hair/explorer.png";
import eyes1 from "assets/bumpkins/large/eyes/rosy_wide.png";
import eyes2 from "assets/bumpkins/large/eyes/rosy_squint.png";
import body1 from "assets/bumpkins/large/body/light_farmer.png";
import body2 from "assets/bumpkins/large/body/dark_farmer.png";
import shirt1 from "assets/bumpkins/large/shirts/farmer_shirt.png";
import shirt2 from "assets/bumpkins/large/shirts/lumberjack_shirt.png";
// Default
import farmerPantsLg from "assets/bumpkins/large/pants/farmer_pants.png";
import blackShoesLg from "assets/bumpkins/large/shoes/black_shoes.png";
import smileLg from "assets/bumpkins/large/mouths/smile.png";
import hairIcon from "assets/bumpkins/icons/hair_icon.png";
import eyesIcon from "assets/bumpkins/icons/eyes_icon.png";
import bodyIcon from "assets/bumpkins/icons/body_icon.png";
import shirtIcon from "assets/bumpkins/icons/shirt_icon.png";
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
  brokenRocket,
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
  hair1,
  hair2,
  eyes1,
  eyes2,
  body1,
  body2,
  shirt1,
  shirt2,
  farmerPantsLg,
  blackShoesLg,
  smileLg,
  hairIcon,
  eyesIcon,
  bodyIcon,
  shirtIcon,
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
