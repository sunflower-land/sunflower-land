import fs from "fs";
import sharp from "sharp";

import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";

const IMAGES: InventoryItemName[] = [
  "Porgy",
  "Muskellunge",
  "Trout",
  "Walleye",
  "Weakfish",
  "Rock Blackfish",
  "Cobia",
  "Tilapia",
];

const WIDTH = 1920;

async function generateImage({
  name,
  image,
}: {
  name: InventoryItemName;
  image: string;
}) {
  const ID = KNOWN_IDS[name];

  const background = await sharp("public/erc1155/images/3x3_bg.png").toBuffer();
  const imgFile = ITEM_DETAILS[name].image.slice(1);
  const itemImage = await sharp(imgFile).toBuffer();

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
  IMAGES.forEach((item) => {
    generateImage({ name: item, image: ITEM_DETAILS[item].image });
  });
};

generateImages();
