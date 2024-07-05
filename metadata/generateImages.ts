import fs from "fs";
import sharp from "sharp";

import { getKeys } from "features/game/types/decorations";
import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";

const IMAGES: Partial<Record<InventoryItemName, string>> = {
  "Goblin Gold Champion": "src/assets/sfts/goblin_gold_champion.png",
  "Goblin Silver Champion": "src/assets/sfts/goblin_silver_champion.png",
  "Goblin Bronze Champion": "src/assets/sfts/goblin_bronze_champion.png",
  "Bumpkin Bronze Champion": "src/assets/sfts/bumpkin_gold_champion.png",
  "Bumpkin Gold Champion": "src/assets/sfts/bumpkin_silver_champion.png",
  "Bumpkin Silver Champion": "src/assets/sfts/bumpkin_bronze_champion.png",
  "Nightshade Bronze Champion": "src/assets/sfts/nightshade_gold_champion.png",
  "Nightshade Gold Champion": "src/assets/sfts/nightshade_silver_champion.png",
  "Nightshade Silver Champion":
    "src/assets/sfts/nightshade_bronze_champion.png",
  "Sunflorian Bronze Champion": "src/assets/sfts/sunflorian_gold_champion.png",
  "Sunflorian Gold Champion": "src/assets/sfts/sunflorian_silver_champion.png",
  "Sunflorian Silver Champion":
    "src/assets/sfts/sunflorian_bronze_champion.png",
  "Jelly Lamp": "src/assets/sfts/jelly_lamp.webp",
};

const WIDTH = 1920;

async function generateImage({ name }: { name: InventoryItemName }) {
  const ID = KNOWN_IDS[name];

  const background = await sharp("public/erc1155/images/3x3_bg.png").toBuffer();
  const itemImage = await sharp(IMAGES[name]).toBuffer();

  // Composite item image onto background
  const mergedImage = await sharp(background)
    .composite([{ input: itemImage }])

    .toBuffer();

  const resized = await sharp(mergedImage)
    .resize({
      width: WIDTH,

      kernel: sharp.kernel.nearest,
    })
    .toBuffer();

  fs.writeFileSync(`public/erc1155/images/${ID}.png`, resized);
}

export const generateImages = () => {
  getKeys(IMAGES).forEach((item) => {
    generateImage({ name: item });
  });
};

generateImages();
