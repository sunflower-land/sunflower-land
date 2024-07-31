import fs from "fs";
import sharp from "sharp";

import { getKeys } from "features/game/types/decorations";
import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";

const IMAGES: Partial<Record<InventoryItemName, string>> = {
  Sand: "src/assets/resources/sand.webp",
  Vase: "src/assets/resources/vase.webp",
  Hieroglyph: "src/assets/resources/hieroglyph.webp",
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
