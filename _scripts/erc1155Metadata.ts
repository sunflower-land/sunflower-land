import * as fs from "fs";
import * as path from "path";

import { InventoryItemName } from "../src/features/game/types/game";
import { KNOWN_IDS } from "../src/features/game/types/index";

type ERC1155Metadata = Record<
  InventoryItemName,
  {
    description: string;
    decimals: number;
    image: string;
  }
>;

const items: ERC1155Metadata = {
  "Sunflower Seed": {
    description: "A seed for a sunflower plant.",
    decimals: 1,
    image: "src/assets/crops/sunflower/seed.png",
  },
  "Potato Seed": {
    description: "A seed for a potato plant.",
    decimals: 1,
    image: "src/assets/crops/potato/seed.png",
  },
  "Pumpkin Seed": {
    description: "A seed for a pumpkin plant.",
    decimals: 1,
    image: "src/assets/crops/pumpkin/seed.png",
  },
  "Carrot Seed": {
    description: "A seed for a carrot plant.",
    decimals: 1,
    image: "src/assets/crops/carrot/seed.png",
  },
  "Cabbage Seed": {
    description: "A seed for a cabbage plant.",
    decimals: 1,
    image: "src/assets/crops/cabbage/seed.png",
  },
  "Beetroot Seed": {
    description: "A seed for a beetroot plant.",
    decimals: 1,
    image: "src/assets/crops/beetroot/seed.png",
  },
  "Cauliflower Seed": {
    description: "A seed for a cauliflower plant.",
    decimals: 1,
    image: "src/assets/crops/cauliflower/seed.png",
  },
  "Radish Seed": {
    description: "A seed for a radish plant.",
    decimals: 1,
    image: "src/assets/crops/radish/seed.png",
  },
  "Parsnip Seed": {
    description: "A seed for a parsnip plant.",
    decimals: 1,
    image: "src/assets/crops/parsnip/seed.png",
  },
  "Wheat Seed": {
    description: "A seed for a wheat plant.",
    decimals: 1,
    image: "src/assets/crops/wheat/seed.png",
  },

  Sunflower: {
    description: "A sunflower that was harvested.",
    decimals: 18,
    image: "src/assets/crops/sunflower/crop.png",
  },
} as any;

async function convert() {
  const names = Object.keys(items) as InventoryItemName[];

  const scalePixelArt = require("scale-pixel-art");

  await Promise.all(
    names.map(async (name) => {
      const item = items[name];
      const id = KNOWN_IDS[name];

      const json = {
        name,
        description: item.description,
        image: `https://sunflower-land.com/play/erc1155/${id}.png`,
        decimals: item.decimals,
      };

      const inputBuffer = fs.readFileSync(item.image);
      console.log({ inputBuffer });

      const fileName = `${id}.json`;
      const filePath = path.join(__dirname, "../public/erc1155", fileName);
      fs.writeFile(filePath, JSON.stringify(json), console.log);

      const oldImagePath = path.join(__dirname, "../", item.image);
      const buffer = fs.readFileSync(oldImagePath);

      console.log({ scalePixelArt });
      const scaledImage = await scalePixelArt(buffer, 20);
      console.log({ scaledImage });
      const fileType = item.image.split(".").pop();
      console.log({ fileType });
      const imagePath = path.join(
        __dirname,
        "../public/erc1155",
        `${id}.${fileType}`
      );
      fs.writeFile(imagePath, scaledImage, console.log);
    })
  );
}

convert();
