import * as fs from "fs";
import * as path from "path";

import { InventoryItemName } from "../src/features/game/types/game";
import { KNOWN_IDS } from "../src/features/game/types/index";
import { ITEM_DETAILS } from "../src/features/game/types/images";

/**
 * Stringifies the markdown files for the JSON metadata
 */
async function convertMarkdown() {
  Object.values(KNOWN_IDS).forEach((id) => {
    try {
      const oldImagePath = path.join(__dirname, `./markdown/${id}.md`);

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

// type ERC1155Metadata = Record<
//   InventoryItemName,
//   {
//     description: string;
//     decimals: number;
//     image: string;
//   }
// >;

// /**
//  * Data that will be displayed on ERC721/ERC1155 compatible platforms
//  * E.g. OpenSea
//  */
// const items: ERC1155Metadata = {
//   // Seeds
//   "Sunflower Seed": {
//     description: "A seed for a sunflower plant.",
//     decimals: 0,
//     image: "src/assets/crops/sunflower/seed.png",
//   },
//   "Potato Seed": {
//     description: "A seed for a potato plant.",
//     decimals: 0,
//     image: "src/assets/crops/potato/seed.png",
//   },
//   "Pumpkin Seed": {
//     description: "A seed for a pumpkin plant.",
//     decimals: 0,
//     image: "src/assets/crops/pumpkin/seed.png",
//   },
//   "Carrot Seed": {
//     description: "A seed for a carrot plant.",
//     decimals: 0,
//     image: "src/assets/crops/carrot/seed.png",
//   },
//   "Cabbage Seed": {
//     description: "A seed for a cabbage plant.",
//     decimals: 0,
//     image: "src/assets/crops/cabbage/seed.png",
//   },
//   "Beetroot Seed": {
//     description: "A seed for a beetroot plant.",
//     decimals: 0,
//     image: "src/assets/crops/beetroot/seed.png",
//   },
//   "Cauliflower Seed": {
//     description: "A seed for a cauliflower plant.",
//     decimals: 0,
//     image: "src/assets/crops/cauliflower/seed.png",
//   },
//   "Radish Seed": {
//     description: "A seed for a radish plant.",
//     decimals: 0,
//     image: "src/assets/crops/radish/seed.png",
//   },
//   "Parsnip Seed": {
//     description: "A seed for a parsnip plant.",
//     decimals: 0,
//     image: "src/assets/crops/parsnip/seed.png",
//   },
//   "Wheat Seed": {
//     description: "A seed for a wheat plant.",
//     decimals: 0,
//     image: "src/assets/crops/wheat/seed.png",
//   },

//   // Crops
//   Sunflower: {
//     description: "A sunflower that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/sunflower/crop.png",
//   },
//   Potato: {
//     description: "A potato that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/potato/crop.png",
//   },
//   Pumpkin: {
//     description: "A pumpkin that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/pumpkin/crop.png",
//   },
//   Carrot: {
//     description: "A carrot that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/carrot/crop.png",
//   },
//   Cabbage: {
//     description: "A cavvage that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/cabbage/crop.png",
//   },
//   Beetroot: {
//     description: "A beetroot that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/beetroot/crop.png",
//   },
//   Cauliflower: {
//     description: "A cauliflower that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/cauliflower/crop.png",
//   },
//   Radish: {
//     description: "A radish that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/radish/crop.png",
//   },
//   Parsnip: {
//     description: "A parsnip that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/parsnip/crop.png",
//   },
//   Wheat: {
//     description: "Wheat that was harvested.",
//     decimals: 18,
//     image: "src/assets/crops/wheat/crop.png",
//   },
//   Axe: {
//     description: "A tool used to cut down trees.",
//     decimals: 0,
//     image: "src/assets/tools/axe.png",
//   },
//   Pickaxe: {
//     description: "A tool used to mine rocks.",
//     decimals: 0,
//     image: "src/assets/tools/wood_pickaxe.png",
//   },
//   "Stone Pickaxe": {
//     description: "A tool used to mine rocks.",
//     decimals: 0,
//     image: "src/assets/tools/stone_pickaxe.png",
//   },
//   "Iron Pickaxe": {
//     description: "A tool used to mine rocks.",
//     decimals: 0,
//     image: "src/assets/tools/iron_pickaxe.png",
//   },
//   Hammer: {
//     description: "A tool used to construct buildings",
//     decimals: 0,
//     image: "src/assets/tools/hammer.png",
//   },
//   Rod: {
//     description: "A tool used to fish.",
//     decimals: 0,
//     image: "src/assets/tools/fishing_rod.png",
//   },

//   // NFTs
//   "Chicken Coop": {
//     description:
//       "A chicken coop that can be used to raise chickens. Chickens produce 3x more eggs with this.",
//     decimals: 0,
//     image: "src/assets/nfts/chicken_coop.png",
//   },
//   "Christmas Tree": {
//     description:
//       "A christmas tree that shows during christmas. It helps santa find your farm and airdrop presents.",
//     decimals: 0,
//     image: "src/assets/nfts/christmas_tree.png",
//   },
//   "Farm Cat": {
//     description: "Victoria the cat. She helps protect your farm from rats.",
//     decimals: 0,
//     image: "src/assets/nfts/farm_cat.png",
//   },
//   "Farm Dog": {
//     description: "Bella the dog. Move sheep faster with bella on your farm.",
//     decimals: 0,
//     image: "src/assets/nfts/farm_dog.png",
//   },
//   Gnome: {
//     description: "A lucky gnome",
//     decimals: 0,
//     image: "src/assets/nfts/gnome.png",
//   },
//   "Gold Egg": {
//     description:
//       "A golden egg. What lays inside is a mystery but it looks like it will hatch soon.",
//     decimals: 0,
//     image: "src/assets/nfts/gold_egg.png",
//   },
//   "Potato Statue": {
//     description:
//       "A statue of a potato. It's a potato statue. Potato blood is in my veins",
//     decimals: 0,
//     image: "src/assets/nfts/potato_statue.png",
//   },
//   Scarecrow: {
//     description:
//       "A scary looking decoration that keeps crows away. Grow wheat 3x faster with a scarecrow on your farm",
//     decimals: 0,
//     image: "src/assets/nfts/scarecrow.png",
//   },
//   "Sunflower Statue": {
//     description: "The holy statue",
//     decimals: 0,
//     image: "src/assets/nfts/sunflower_statue.png",
//   },
//   "Sunflower Rock": {
//     description:
//       "A rare homage to the game that broke Polygon. Owned by the 100+ designers, developers and contributors of the project.",
//     decimals: 0,
//     image: "src/assets/nfts/sunflower_rock.png",
//   },
//   "Sunflower Tombstone": {
//     description: "RIP SFF",
//     decimals: 0,
//     image: "src/assets/nfts/sunflower_tombstone.png",
//   },
//   "Golden Cauliflower": {
//     description:
//       "A lucky cauliflower that gives you 2x rewards when selling your cauliflowers",
//     decimals: 0,
//     image: "src/assets/nfts/golden_cauliflower.png",
//   },
//   "Goblin Crown": {
//     description: "Summon the leader of the goblins with this unique crown",
//     decimals: 0,
//     image: "src/assets/nfts/goblin_crown.png",
//   },
//   Fountain: {
//     description: "A relaxing fountain for your farm",
//     decimals: 0,
//     image: "src/assets/nfts/fountain.gif",
//   },
//   "Woody the Beaver": {
//     description: "Increase wood drops by 20%",
//     decimals: 0,
//     image: "src/assets/nfts/beaver.png",
//   },
//   "Apprentice Beaver": {
//     description: "Trees recover 50% faster",
//     decimals: 0,
//     image: "src/assets/nfts/apprentice_beaver.png",
//   },
//   "Foreman Beaver": {
//     description: "Cut trees without axes",
//     decimals: 0,
//     image: "src/assets/nfts/construction_beaver.png",
//   },

//   // TODO IMAGES - Skills
//   "Green Thumb": {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   "Barn Manager": {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   "Seed Specialist": {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   Wrangler: {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   Lumberjack: {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   Prospector: {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   Logger: {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   "Gold Rush": {
//     description: "A skill that provides a unique boost",
//     decimals: 0,
//     image: "src/assets/icons/expression_confused.png",
//   },

//   "Australian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/australia_flag.gif",
//   },
//   "Belgian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/belgium_flag.gif",
//   },
//   "Brazilian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/brazil_flag.gif",
//   },
//   "Chinese Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/china_flag.gif",
//   },
//   "Finnish Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/finland_flag.gif",
//   },
//   "French Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/france_flag.gif",
//   },
//   "German Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/germany_flag.gif",
//   },
//   "Indian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/india_flag.gif",
//   },
//   "Indonesian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/indonesia_flag.gif",
//   },
//   "Iranian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/iran_flag.gif",
//   },
//   "Italian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/italy_flag.gif",
//   },
//   "Japanese Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/japan_flag.gif",
//   },
//   "Moroccan Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/morocco_flag.gif",
//   },
//   "Dutch Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/netherlands_flag.gif",
//   },
//   "Philippine Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/philippines_flag.gif",
//   },
//   "Polish Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/poland_flag.gif",
//   },
//   "Portuguese Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/portugal_flag.gif",
//   },
//   "Russian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/russia_flag.gif",
//   },
//   "Saudi Arabian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/saudi_arabia_flag.gif",
//   },
//   "South Korean Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/south_korea_flag.gif",
//   },
//   "Spanish Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/spain_flag.gif",
//   },
//   "Sunflower Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/sunflower_flag.gif",
//   },
//   "Thai Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/thailand_flag.gif",
//   },
//   "Turkish Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/turkey_flag.gif",
//   },
//   "Ukrainian Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/ukraine_flag.gif",
//   },
//   "American Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/usa_flag.gif",
//   },
//   "Vietnamese Flag": {
//     decimals: 0,
//     description:
//       "A beautiful flag crafted at Sunflower Land using wood and SFL",
//     image: "src/assets/nfts/flags/vietnam_flag.gif",
//   },

//   "Pumpkin Soup": {
//     description: "A creamy soup which Goblins love",
//     decimals: 0,
//     image: "src/assets/nfts/pumpkin_soup.png",
//   },
//   Sauerkraut: {
//     description: "A delicatese made from harvested cabbage",
//     decimals: 0,
//     image: "src/assets/nfts/saurrerkrat.png",
//   },
//   "Roasted Cauliflower": {
//     description:
//       "A delicious cauliflower that is roasted. Helps keep Goblins off your farm",
//     decimals: 0,
//     image: "src/assets/nfts/roasted_cauliflower.png",
//   },

//   // Resources
//   Stone: {
//     description: "A resource that can be used to craft items",
//     decimals: 18,
//     image: "src/assets/resources/stone.png",
//   },
//   Wood: {
//     description: "A resource that can be used to craft items",
//     decimals: 18,
//     image: "src/assets/resources/wood.png",
//   },
//   Iron: {
//     description: "A resource that can be used to craft items",
//     decimals: 18,
//     image: "src/assets/resources/iron_ore.png",
//   },
//   Gold: {
//     description: "A resource that can be used to craft items",
//     decimals: 18,
//     image: "src/assets/resources/gold_ore.png",
//   },
//   Chicken: {
//     description: "A resource that can be used to earn eggs",
//     decimals: 18,
//     image: "src/assets/resources/chicken.png",
//   },
//   Egg: {
//     description: "A resource that can be used in cooking recipes",
//     decimals: 18,
//     image: "src/assets/resources/egg.png",
//   },
//   Cow: {
//     description: "An animal user for producing resources",
//     decimals: 18,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   Pig: {
//     description: "An animal user for producing resources",
//     decimals: 18,
//     image: "src/assets/icons/expression_confused.png",
//   },
//   Sheep: {
//     description: "An animal user for producing resources",
//     decimals: 18,
//     image: "src/assets/icons/expression_confused.png",
//   },

//   // Flags
// };

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
