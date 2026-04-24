import * as fs from "fs";
import * as path from "path";

import { KNOWN_IDS } from "../src/features/game/types";

import { getKeys } from "lib/object";
import { OPEN_SEA_COLLECTIBLES, OPEN_SEA_WEARABLES } from "./metadata";
import { ITEM_IDS } from "features/game/types/bumpkin";

function generateCollectibles() {
  const items = getKeys(KNOWN_IDS);

  // Generate/update metadata files
  items.forEach((name) => {
    const metadata = OPEN_SEA_COLLECTIBLES[name];

    // Construct the output with an explicit field order so the serialized
    // JSON is stable across regenerations. JS preserves insertion order, so
    // building a fresh object avoids diff churn when scripts reassign fields
    // in a different order than the original metadata.ts entry.
    const output = {
      description: `# Description\n\n${metadata.description}\n\n### Contributor\n\nSunflower Land is a community game built by a hundreds of developers and artists across the globe.\nCome join us on [Github](https://github.com/sunflower-land/sunflower-land)`,
      decimals: metadata.decimals,
      attributes: metadata.attributes,
      external_url: metadata.external_url,
      image: `https://sunflower-land.com/play/erc1155/images/${KNOWN_IDS[name]}.webp`,
      name,
    };

    // convert KNOWN_IDS[name] to hex zero padded with 64 zeros
    const zeroPadded = KNOWN_IDS[name].toString(16).padStart(64, "0");

    const jsonPath = path.join(
      __dirname,
      `../public/erc1155/${KNOWN_IDS[name]}.json`,
    );
    const hexJsonPath = path.join(
      __dirname,
      `../public/erc1155/${zeroPadded}.json`,
    );

    fs.writeFile(jsonPath, JSON.stringify(output), () => undefined);
    fs.writeFile(hexJsonPath, JSON.stringify(output), () => undefined);
  });

  // Clean-up old metadata files
  const metadataFolderPath = path.join(__dirname, "../public/erc1155/");

  const fileItemIds = fs
    .readdirSync(metadataFolderPath)
    .filter((f) => f.includes(".json"))
    .map((f) => f.split(".")[0]);

  // As of November 2023, Opensea appears to be uses hex zero padded with 64 zeros to identify token IDs
  // e.g. https://URL/0000...0001.json as per https://eips.ethereum.org/EIPS/eip-1155#metadata
  // Previously was using decimals https://URL/1.json
  // We need to support both for now
  const idLookup = new Set<string>(
    Object.values(KNOWN_IDS)
      .map(String)
      .concat(
        Object.values(KNOWN_IDS).map((id) =>
          Number(id).toString(16).padStart(64, "0"),
        ),
      ),
  );

  fileItemIds.forEach((id) => {
    if (!idLookup.has(id)) {
      fs.rmSync(path.join(__dirname, `../public/erc1155/${id}.json`));
    }
  });
}

function generateWearables() {
  const items = getKeys(ITEM_IDS);

  // Wearable images are uploaded manually — some are .png, some are .webp.
  // Detect the extension by looking at what's actually on disk so the URL
  // matches the file the team uploaded. If neither file is present we
  // skip that item rather than fabricate a URL to a non-existent asset.
  const wearablesImageDir = path.join(__dirname, "../public/wearables/images");
  const wearableExt = (id: number): "webp" | "png" | null => {
    if (fs.existsSync(path.join(wearablesImageDir, `${id}.webp`)))
      return "webp";
    if (fs.existsSync(path.join(wearablesImageDir, `${id}.png`))) return "png";
    return null;
  };

  const skipped: string[] = [];

  // Generate/update metadata files
  items.forEach((name) => {
    const metadata = OPEN_SEA_WEARABLES[name];
    const id = ITEM_IDS[name];
    const ext = wearableExt(id);
    if (ext === null) {
      skipped.push(`${name} (${id})`);
      return;
    }

    const output = {
      description: `# Description\n\n${metadata.description}\n\n### Contributor\n\nSunflower Land is a community game built by a hundreds of developers and artists across the globe.\nCome join us on [Github](https://github.com/sunflower-land/sunflower-land)`,
      decimals: metadata.decimals,
      attributes: metadata.attributes,
      external_url: metadata.external_url,
      image: `https://sunflower-land.com/play/wearables/images/${id}.${ext}`,
      name,
    };

    //convert id to hex zero padded with 64 zeros
    const zeroPadded = id.toString(16).padStart(64, "0");

    const jsonPath = path.join(__dirname, `../public/wearables/${id}.json`);
    const hexJsonPath = path.join(
      __dirname,
      `../public/wearables/${zeroPadded}.json`,
    );

    fs.writeFile(jsonPath, JSON.stringify(output), () => undefined);
    fs.writeFile(hexJsonPath, JSON.stringify(output), () => undefined);
  });

  if (skipped.length > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `Skipped ${skipped.length} wearable(s) with no image on disk: ${skipped.join(", ")}`,
    );
  }

  // Clean-up old metadata files
  const metadataFolderPath = path.join(__dirname, "../public/wearables/");

  const fileItemIds = fs
    .readdirSync(metadataFolderPath)
    .filter((f) => f.includes(".json"))
    .map((f) => f.split(".")[0]);

  // As of November 2023, Opensea appears to be uses hex zero padded with 64 zeros to identify token IDs
  // e.g. https://URL/0000...0001.json as per https://eips.ethereum.org/EIPS/eip-1155#metadata
  // Previously was using decimals https://URL/1.json
  // We need to support both for now
  const idLookup = new Set<string>(
    Object.values(ITEM_IDS)
      .map(String)
      .concat(
        Object.values(ITEM_IDS).map((id) =>
          Number(id).toString(16).padStart(64, "0"),
        ),
      ),
  );

  fileItemIds.forEach((id) => {
    if (!idLookup.has(id)) {
      fs.rmSync(path.join(__dirname, `../public/wearables/${id}.json`));
    }
  });
}

generateCollectibles();
generateWearables();
