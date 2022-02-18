//import scalePixels from "pixel-scale";
import * as fs from "fs";

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
} as any;

async function convert() {
  const names = Object.keys(items) as InventoryItemName[];

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

      const fileName = `${id}.png`;

      fs.writeFile(fileName, JSON.stringify(json), console.log);
    })
  );
}
