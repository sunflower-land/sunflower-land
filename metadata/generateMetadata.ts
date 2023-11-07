import * as fs from "fs";
import * as path from "path";

import { KNOWN_IDS } from "../src/features/game/types";

import { getKeys } from "features/game/types/craftables";
import { OPEN_SEA_ITEMS } from "./metadata";

function generate() {
  const items = getKeys(KNOWN_IDS);

  // Generate/update metadata files
  items.forEach((name) => {
    const metadata = OPEN_SEA_ITEMS[name];

    metadata.description = `# Description\n\n${metadata.description}\n\n### Contributor\n\nSunflower Land is a community game built by a hundreds of developers and artists across the globe.\nCome join us on [Github](https://github.com/sunflower-land/sunflower-land)`;

    const oldPath = "../public/erc1155/images/";
    const imageFileName = metadata.image.slice(oldPath.length);

    metadata.image = `https://sunflower-land.com/play/erc1155/images/${imageFileName}`;

    metadata.name = name;

    const jsonPath = path.join(
      __dirname,
      `../public/erc1155/${KNOWN_IDS[name]}.json`
    );

    fs.writeFile(jsonPath, JSON.stringify(metadata), () => undefined);
  });

  // Clean-up old metadata files
  const metadataFolderPath = path.join(__dirname, "../public/erc1155/");

  const fileItemIds = fs
    .readdirSync(metadataFolderPath)
    .filter((f) => f.includes(".json"))
    .map((f) => parseInt(f.split(".")[0]));

  const idLookup = new Set<number>(Object.values(KNOWN_IDS));

  fileItemIds.forEach((id) => {
    if (!idLookup.has(id)) {
      fs.rmSync(path.join(__dirname, `../public/erc1155/${id}.json`));
    }
  });
}

generate();
