import * as fs from "fs";
import * as path from "path";

import { InventoryItemName } from "../src/features/game/types/game";
import { KNOWN_IDS } from "../src/features/game/types/index";

/**
 * Stringifies the markdown files for the JSON metadata
 */
async function convertMarkdown() {
  Object.values(KNOWN_IDS).forEach((id) => {
    try {
      // All flags use the same markdown
      const fileName = id.toString().startsWith("8") ? "801" : id;
      const oldImagePath = path.join(__dirname, `./markdown/${fileName}.md`);

      fs.readFile(oldImagePath, "utf8", (err, data) => {
        console.log({ err, data });
        console.log(typeof data);

        const jsonPath = path.join(__dirname, `../public/erc1155/${id}.json`);
        fs.readFile(jsonPath, "utf8", (err, jsonData) => {
          const newJson = {
            ...JSON.parse(jsonData),
            description: data,
          };

          fs.writeFile(jsonPath, JSON.stringify(newJson), () => {
            console.log(`Wrote file`);
          });
        });
      });
    } catch (e) {
      console.log("Unable to write: ", id, e);
    }
  });
}

convertMarkdown();

// /**
//  * For each item generate the JSON representation
//  * Also scale the pixel art to an acceptable size for OpenSea
//  */
// async function convert() {
//   const names = Object.keys(items) as InventoryItemName[];

//   /* eslint-disable @typescript-eslint/no-var-requires */
//   const scalePixelArt = require("scale-pixel-art");

//   await Promise.all(
//     names.map(async (name) => {
//       const item = items[name];
//       const id = KNOWN_IDS[name];

//       const fileType = item.image.split(".").pop();
//       const json = {
//         name,
//         description: item.description,
//         image: `https://sunflower-land.com/play/erc1155/${id}.${fileType}`,
//         decimals: item.decimals,
//       };

//       const fileName = `${id}.json`;
//       const filePath = path.join(__dirname, "../public/erc1155", fileName);
//       fs.writeFile(filePath, JSON.stringify(json), () =>
//         console.log(`Wrote file: ${id}`)
//       );

//       const oldImagePath = path.join(__dirname, "../", item.image);
//       const buffer = fs.readFileSync(oldImagePath);

//       const scaledImage = await scalePixelArt(buffer, 20);
//       console.log({ scaled: id });
//       const imagePath = path.join(
//         __dirname,
//         "../public/erc1155",
//         `${id}.${fileType}`
//       );
//       fs.writeFile(imagePath, scaledImage, () =>
//         console.log(`Wrote image: ${id}`)
//       );
//     })
//   );
// }

// convert();

async function jsonFiles() {
  const names = [
    "Australian Flag",
    "Belgian Flag",
    "Brazilian Flag",
    "Chinese Flag",
    "Finnish Flag",
    "French Flag",
    "German Flag",
    "Indonesian Flag",
    "Indian Flag",
    "Iranian Flag",
    "Italian Flag",
    "Japanese Flag",
    "Moroccan Flag",
    "Dutch Flag",
    "Philippine Flag",
    "Polish Flag",
    "Portuguese Flag",
    "Russian Flag",
    "Saudi Arabian Flag",
    "South Korean Flag",
    "Spanish Flag",
    "Sunflower Flag",
    "Thai Flag",
    "Turkish Flag",
    "Ukrainian Flag",
    "American Flag",
    "Vietnamese Flag",
    "Canadian Flag",
    "Singaporean Flag",
    "British Flag",
    "Sierra Leone Flag",
    "Romanian Flag",
    "Rainbow Flag",
    "Goblin Flag",
    "Pirate Flag",
    "Algerian Flag",
    "Mexican Flag",
    "Dominican Republic Flag",
    "Argentinian Flag",
    "Lithuanian Flag",
    "Malaysian Flag",
    "Colombian Flag",
  ];

  await Promise.all(
    names.map(async (name: any) => {
      const id = KNOWN_IDS[name as InventoryItemName];

      const newJson = {
        name: name,
        description:
          "A beautiful flag crafted at Sunflower Land using wood and SFL",
        image: `https://sunflower-land.com/play/erc1155/${id}.gif`,
        decimals: 0,
        external_url: "https://docs.sunflower-land.com/crafting-guide",
        attributes: [],
      };

      const fileName = `${id}.json`;
      const filePath = path.join(__dirname, "../public/erc1155", fileName);
      fs.writeFile(filePath, JSON.stringify(newJson), () =>
        console.log(`Wrote file: ${id}`)
      );
    })
  );
}

// jsonFiles();
