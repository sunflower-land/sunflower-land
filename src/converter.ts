import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "./features/game/types/images";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";


import sunflowerSeed from "assets/crops/sunflower/seed.png";

export async function main() {
  const names = Object.keys(ITEM_DETAILS) as InventoryItemName[];

  await Promise.all(
    names.map(async (name) => {
      const item = ITEM_DETAILS[name];
      const id = KNOWN_IDS[name];

      const fileName = `${id}.png`;
      const unit = getItemUnit(name);
      const json = {
        name,
        description: item.description,
        image: `https://sunflower-land.com/play/erc1155/${id}.png`,
        decimals: unit === "ether" ? 1 : 18,
      };

      //fs.writeFile(fileName, JSON.stringify(json), console.log);
    })
  );
}

main();
