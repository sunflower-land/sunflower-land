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
import helios from "assets/land/helios.webp";
import retreat from "assets/land/retreat.webp";
import treasureIsland from "assets/land/treasure_island.webp";
import snowKingdom from "assets/land/snow_kingdom.webp";
import stoneHeaven from "assets/land/stone_haven.webp";
import homeIslandfullEdge from "assets/land/home-island/1_1_1_1.webp";
import homeIslandnoEdge from "assets/land/home-island/0_0_0_0.webp";
import homeIslandtopAndBottomEdge from "assets/land/home-island/1_0_1_0.webp";
import homeIslandtopLeftAndBottomEdge from "assets/land/home-island/1_0_1_1.webp";
import homeIslandtopRightAndBottomEdge from "assets/land/home-island/1_1_1_0.webp";
import homeIslandtopRightAndLeftEdge from "assets/land/home-island/1_1_0_1.webp";
import homeIslandrightBottomAndLeftEdge from "assets/land/home-island/0_1_1_1.webp";
import homeIslandrightAndLeftEdge from "assets/land/home-island/0_1_0_1.webp";
import homeIslandrightEdge from "assets/land/home-island/0_1_0_0.webp";
import homeIslandbottomEdge from "assets/land/home-island/0_0_1_0.webp";
import homeIslandtopEdge from "assets/land/home-island/1_0_0_0.webp";
import homeIslandleftEdge from "assets/land/home-island/0_0_0_1.webp";
import homeIslandtopAndLeftEdge from "assets/land/home-island/1_0_0_1.webp";
import homeIslandbottomAndLeftEdge from "assets/land/home-island/0_0_1_1.webp";
import homeIslandtopAndRightEdge from "assets/land/home-island/1_1_0_0.webp";
import homeIslandbottomAndRightEdge from "assets/land/home-island/0_1_1_0.webp";
import homeIslandtopLeftAndBottomCorner from "assets/land/home-island/next_1_0_1_1.webp";
import homeIslandtopRightAndBottomCorner from "assets/land/home-island/next_1_1_1_0.webp";
import homeIslandtopRightAndLeftCorner from "assets/land/home-island/next_1_1_0_1.webp";
import homeIslandrightBottomAndLeftCorner from "assets/land/home-island/next_0_1_1_1.webp";
import homeIslandtopAndLeftCorner from "assets/land/home-island/next_1_0_0_1.webp";
import homeIslandbottomAndLeftCorner from "assets/land/home-island/next_0_0_1_1.webp";
import homeIslandtopAndRightCorner from "assets/land/home-island/next_1_1_0_0.webp";
import homeIslandbottomAndRightCorner from "assets/land/home-island/next_0_1_1_0.webp";
import homeIslanddock from "assets/land/home-island/dock.webp";

const IMAGE_LIST: string[] = [
  goblinDonation,
  humanDeath,
  lightningDeath,
  minting,
  richBegger,
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
  egg,
  richChicken,
  fatChicken,
  speedChicken,
  leftArrow,
  rightArrow,
  helios,
  retreat,
  treasureIsland,
  snowKingdom,
  stoneHeaven,
  homeIslandfullEdge,
  homeIslandnoEdge,
  homeIslandtopAndBottomEdge,
  homeIslandtopLeftAndBottomEdge,
  homeIslandtopRightAndBottomEdge,
  homeIslandtopRightAndLeftEdge,
  homeIslandrightBottomAndLeftEdge,
  homeIslandrightAndLeftEdge,
  homeIslandrightEdge,
  homeIslandbottomEdge,
  homeIslandtopEdge,
  homeIslandleftEdge,
  homeIslandtopAndLeftEdge,
  homeIslandbottomAndLeftEdge,
  homeIslandtopAndRightEdge,
  homeIslandbottomAndRightEdge,
  homeIslandtopLeftAndBottomCorner,
  homeIslandtopRightAndBottomCorner,
  homeIslandtopRightAndLeftCorner,
  homeIslandrightBottomAndLeftCorner,
  homeIslandtopAndLeftCorner,
  homeIslandbottomAndLeftCorner,
  homeIslandtopAndRightCorner,
  homeIslandbottomAndRightCorner,
  homeIslanddock,
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
