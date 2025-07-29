import fs from "fs";
import sharp from "sharp";

import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";

const IMAGES: InventoryItemName[] = [
  "Doll",
  "Buzz Doll",
  "Lunar Doll",
  "Juicy Doll",
  "Crude Doll",
  "Cluck Doll",
  "Wooly Doll",
  "Moo Doll",
  "Bloom Doll",
  "Shadow Doll",
  "Ember Doll",
  "Gilded Doll",
  "Lumber Doll",
  "Harvest Doll",
  "Sizzle Doll",
  "Angler Doll",
  "Dune Doll",
  "Mouse Doll",
  "Grubby Doll",
  "Nefari Doll",
  "Frosty Doll",
  "Cosmo Doll",
  "Bigfin Doll",
  "Solar Doll",
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

  const background = await sharp("public/erc1155/images/6x6_bg.png")
    .webp({ quality: 100, lossless: true })
    .toBuffer();
  const imgFile = ITEM_DETAILS[name].image.slice(1);
  const itemImage = await sharp(imgFile)
    .webp({ quality: 100, lossless: true })
    .toBuffer();

  // Composite item image onto background
  const mergedImage = await sharp(background)
    .webp({ quality: 100, lossless: true })
    .composite([{ input: itemImage }])
    .toBuffer();

  const resized = await sharp(mergedImage)
    .webp({ quality: 100, lossless: true })
    .resize({
      width: WIDTH,
      kernel: sharp.kernel.nearest,
    })
    .toBuffer();

  fs.writeFileSync(`public/erc1155/images/${ID}.png`, resized as any);
}

export const generateImages = () => {
  IMAGES.forEach((item) => {
    generateImage({ name: item, image: ITEM_DETAILS[item].image });
  });
};

generateImages();
