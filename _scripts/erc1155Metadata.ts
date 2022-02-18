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

/**
 * Data that will be displayed on ERC721/ERC1155 compatible platforms
 * E.g. OpenSea
 */
const items: ERC1155Metadata = {
  // Seeds
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

  // Crops
  Sunflower: {
    description: "A sunflower that was harvested.",
    decimals: 18,
    image: "src/assets/crops/sunflower/crop.png",
  },
  Potato: {
    description: "A potato that was harvested.",
    decimals: 18,
    image: "src/assets/crops/potato/crop.png",
  },
  Pumpkin: {
    description: "A pumpkin that was harvested.",
    decimals: 18,
    image: "src/assets/crops/pumpkin/crop.png",
  },
  Carrot: {
    description: "A carrot that was harvested.",
    decimals: 18,
    image: "src/assets/crops/carrot/crop.png",
  },
  Cabbage: {
    description: "A cavvage that was harvested.",
    decimals: 18,
    image: "src/assets/crops/cabbage/crop.png",
  },
  Beetroot: {
    description: "A beetroot that was harvested.",
    decimals: 18,
    image: "src/assets/crops/beetroot/crop.png",
  },
  Cauliflower: {
    description: "A cauliflower that was harvested.",
    decimals: 18,
    image: "src/assets/crops/cauliflower/crop.png",
  },
  Radish: {
    description: "A radish that was harvested.",
    decimals: 18,
    image: "src/assets/crops/radish/crop.png",
  },
  Parsnip: {
    description: "A parsnip that was harvested.",
    decimals: 18,
    image: "src/assets/crops/parsnip/crop.png",
  },
  Wheat: {
    description: "Wheat that was harvested.",
    decimals: 18,
    image: "src/assets/crops/wheat/crop.png",
  },
  Axe: {
    description: "A tool used to cut down trees.",
    decimals: 1,
    image: "src/assets/tools/axe.png",
  },
  Pickaxe: {
    description: "A tool used to mine rocks.",
    decimals: 1,
    image: "src/assets/tools/wood_pickaxe.png",
  },
  "Stone Pickaxe": {
    description: "A tool used to mine rocks.",
    decimals: 1,
    image: "src/assets/tools/stone_pickaxe.png",
  },
  "Iron Pickaxe": {
    description: "A tool used to mine rocks.",
    decimals: 1,
    image: "src/assets/tools/iron_pickaxe.png",
  },
  Hammer: {
    description: "A tool used to construct buildings",
    decimals: 1,
    image: "src/assets/tools/hammer.png",
  },
  Rod: {
    description: "A tool used to fish.",
    decimals: 1,
    image: "src/assets/tools/fishing_rod.png",
  },

  // NFTs
  "Chicken Coop": {
    description:
      "A chicken coop that can be used to raise chickens. Chickens produce 3x more eggs with this.",
    decimals: 1,
    image: "src/assets/nfts/chicken_coop.png",
  },
  "Christmas Tree": {
    description:
      "A christmas tree that shows during christmas. It helps santa find your farm and airdrop presents.",
    decimals: 1,
    image: "src/assets/nfts/christmas_tree.png",
  },
  "Farm Cat": {
    description: "Victoria the cat. She helps protect your farm from rats.",
    decimals: 1,
    image: "src/assets/nfts/farm_cat.png",
  },
  "Farm Dog": {
    description: "Bella the dog. Move sheep faster with bella on your farm.",
    decimals: 1,
    image: "src/assets/nfts/farm_dog.png",
  },
  Gnome: {
    description: "A lucky gnome",
    decimals: 1,
    image: "src/assets/nfts/gnome.png",
  },
  "Gold Egg": {
    description:
      "A golden egg. What lays inside is a mystery but it looks like it will hatch soon.",
    decimals: 1,
    image: "src/assets/nfts/gold_egg.png",
  },
  "Potato Statue": {
    description:
      "A statue of a potato. It's a potato statue. Potato blood is in my veins",
    decimals: 1,
    image: "src/assets/nfts/potato_statue.png",
  },
  Scarecrow: {
    description:
      "A scary looking decoration that keeps crows away. Grow wheat 3x faster with a scarecrow on your farm",
    decimals: 1,
    image: "src/assets/nfts/scarecrow.png",
  },
  "Sunflower Statue": {
    description: "The holy statue",
    decimals: 1,
    image: "src/assets/nfts/sunflower_statue.png",
  },
  "Sunflower Rock": {
    description:
      "A rare homage to the game that broke Polygon. Owned by the 100+ designers, developers and contributors of the project.",
    decimals: 1,
    image: "src/assets/nfts/sunflower_statue.png",
  },
  "Sunflower Tombstone": {
    description: "RIP SFF",
    decimals: 1,
    image: "src/assets/nfts/sunflower_statue.png",
  },
  "Golden Cauliflower": {
    description:
      "A lucky cauliflower that gives you 2x rewards when selling your cauliflowers",
    decimals: 1,
    image: "src/assets/nfts/golden_cauliflower.png",
  },
  "Goblin Crown": {
    description: "Summon the leader of the goblins with this unique crown",
    decimals: 1,
    image: "src/assets/nfts/goblin_crown.png",
  },
  Fountain: {
    description: "A relaxing fountain for your farm",
    decimals: 1,
    image: "src/assets/nfts/fountain.gif",
  },

  // FOODS
  "Pumpkin Soup": {
    description: "A creamy soup which Goblins love",
    decimals: 1,
    image: "src/assets/nfts/pumpkin_soup.png",
  },
  Sauerkraut: {
    description: "A delicatese made from harvested cabbage",
    decimals: 1,
    image: "src/assets/nfts/saurrerkrat.png",
  },
  "Roasted Cauliflower": {
    description:
      "A delicious cauliflower that is roasted. Helps keep Goblins off your farm",
    decimals: 1,
    image: "src/assets/nfts/roasted_cauliflower.png",
  },
  Flour: {
    description: "A flour that is used to make bread",
    decimals: 1,
    image: "src/assets/crops/wheat/flour.png",
  },

  // Resources
  Stone: {
    description: "A resource that can be used to craft items",
    decimals: 18,
    image: "src/assets/resources/stone.png",
  },
  Wood: {
    description: "A resource that can be used to craft items",
    decimals: 18,
    image: "src/assets/resources/wood.png",
  },
  Iron: {
    description: "A resource that can be used to craft items",
    decimals: 18,
    image: "src/assets/resources/iron_ore.png",
  },
  Gold: {
    description: "A resource that can be used to craft items",
    decimals: 18,
    image: "src/assets/resources/gold_ore.png",
  },
  Chicken: {
    description: "A resource that can be used to earn eggs",
    decimals: 18,
    image: "src/assets/resources/chicken.png",
  },
  Egg: {
    description: "A resource that can be used in cooking recipes",
    decimals: 18,
    image: "src/assets/resources/egg.png",
  },
};

/**
 * For each item generate the JSON representation
 * Also scale the pixel art to an acceptable size for OpenSea
 */
async function convert() {
  const names = Object.keys(items) as InventoryItemName[];

  /* eslint-disable @typescript-eslint/no-var-requires */
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

      const fileName = `${id}.json`;
      const filePath = path.join(__dirname, "../public/erc1155", fileName);
      fs.writeFile(filePath, JSON.stringify(json), () =>
        console.log(`Wrote file: ${id}`)
      );

      const oldImagePath = path.join(__dirname, "../", item.image);
      const buffer = fs.readFileSync(oldImagePath);

      const scaledImage = await scalePixelArt(buffer, 20);
      const fileType = item.image.split(".").pop();
      const imagePath = path.join(
        __dirname,
        "../public/erc1155",
        `${id}.${fileType}`
      );
      fs.writeFile(imagePath, scaledImage, () =>
        console.log(`Wrote image: ${id}`)
      );
    })
  );
}

convert();
