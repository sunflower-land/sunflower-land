import { InventoryItemName } from "../src/features/game/types/game";
import { Attribute } from "./models";

type Metadata = {
  description: string;
  decimals: number;
  attributes: Attribute[];
  external_url: string;
  image_url: string;
  name?: string;
};

export const OPEN_SEA_ITEMS: Record<InventoryItemName, Metadata> = {
  "Sunflower Seed": {
    name: "Sunflower Seed",
    description:
      "A seed used to grow sunflowers. The most basic resource used to start your farming empire.\n\nYou can buy sunflower seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/101.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description:
      "A seed used to grow beetroot.\n\nYou can buy beetroot seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/106.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Potato Seed": {
    name: "Potato Seed",
    description:
      "A seed used to grow potatoes. All great hustlers start with a potato seed.\n\nYou can buy potato seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/102.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description:
      "A seed used to grow cabbage.\n\nYou can buy cabbage seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/105.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description:
      "A seed used to grow pumpkins. A goblin's favourite!\n\nYou can buy pumpkin seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/103.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description:
      "A seed used to grow carrots. An easy to grow and staple vegetable in all Bumpkin's diets!\n\nYou can buy carrot seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/104.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description:
      "A seed used to grow parsnip.\n\nYou can buy parsnip seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/108.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description:
      "A seed used to grow wheat.\n\nYou can buy wheat seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/110.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Radish Seed": {
    name: "Radish Seed",
    description:
      "A seed used to grow radishes.\n\nYou can buy radish seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/109.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Kale Seed": {
    name: "Kale Seed",
    description:
      "A seed used to grow kale.\n\nYou can buy kale seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/111.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Apple Seed": {
    name: "Apple Seed",
    description:
      "A seed used to grow apple.\n\nYou can buy apple seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/112.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description:
      "A seed used to grow cauliflower.\n\nYou can buy cauliflower seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/107.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  Sunflower: {
    name: "Sunflower",
    description: "A crop grown at Sunflower Land.\n\nA sunny flower.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/201.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  "Orange Seed": {
    name: "Orange Seed",
    description:
      "A seed used to grow orange.\n\nYou can buy orange seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/114.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Blueberry Seed": {
    name: "Blueberry Seed",
    description:
      "A seed used to grow blueberry.\n\nYou can buy blueberry seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/113.png",
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  Beetroot: {
    name: "Beetroot",
    description:
      "A crop grown at Sunflower Land.\n\nApparently, they’re an aphrodisiac...",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/206.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Pumpkin: {
    name: "Pumpkin",
    description: "A crop grown at Sunflower Land.\n\nOoooh, spoookyy",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/203.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Cauliflower: {
    name: "Cauliflower",
    description:
      "A crop grown at Sunflower Land.\n\nNow in 4 different colours!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/207.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Potato: {
    name: "Potato",
    description:
      "A crop grown at Sunflower Land.\n\nHealthier than you might think!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/202.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Cabbage: {
    name: "Cabbage",
    description:
      "A crop grown at Sunflower Land.\n\nOnce a luxury, now a food for many.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/205.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Parsnip: {
    name: "Parsnip",
    description:
      "A crop grown at Sunflower Land.\n\nNot to be mistaken for carrots.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/208.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Wheat: {
    name: "Wheat",
    description:
      "A crop grown at Sunflower Land.\n\nTraditionally only grown by Goblins.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/210.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Kale: {
    name: "Kale",
    description: "A crop grown at Sunflower Land.\n\nA Bumpkin Power Food!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/211.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Carrot: {
    name: "Carrot",
    description:
      "A crop grown at Sunflower Land.\n\nThey’re good for your eyes!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/204.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Axe: {
    name: "Axe",
    description:
      "A tool used to chop wood. It is burnt after use.\n\nYou can craft an axe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/301.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { value: "Tradable" },
    ],
  },
  Orange: {
    name: "Orange",
    description:
      "A fruit grown at Sunflower Land.\n\nVitamin C to keep your Bumpkin Healthy",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/214.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Blueberry: {
    name: "Blueberry",
    description: "A fruit grown at Sunflower Land.\n\nA Goblin's weakness",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/213.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Apple: {
    name: "Apple",
    description:
      "A fruit grown at Sunflower Land.\n\nPerfect for homemade Apple Pie",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/212.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  Pickaxe: {
    name: "Pickaxe",
    description:
      "A tool used to mine stone. It is burnt after use.\n\nYou can craft a pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/302.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { value: "Tradable" },
    ],
  },
  Radish: {
    name: "Radish",
    description:
      "A crop grown at Sunflower Land.\n\nLegend says these were once used in melee combat.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/209.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { value: "Tradable" },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description:
      "A tool used to mine iron. It is burnt after use.\n\nYou can craft a stone pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/303.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { value: "Tradable" },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description:
      "A tool used to mine gold. It is burnt after use.\n\nYou can craft an iron pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/304.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { value: "Tradable" },
    ],
  },
  Hammer: {
    name: "Hammer",
    description:
      "A tool used to upgrade buildings.\n\nYou can craft a hammer at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/305.png",
    attributes: [{ trait_type: "Purpose", value: "Tool" }],
  },
  Rod: {
    name: "Rod",
    description:
      "A tool used to capture fish.\n\nYou can craft a rod at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/306.png",
    attributes: [{ trait_type: "Purpose", value: "Tool" }],
  },
  Shovel: {
    name: "Shovel",
    description:
      "A tool used to remove unwanted crops.\n\nYou can craft a shovel at the Workbench in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/308.png",
    attributes: [{ trait_type: "Purpose", value: "Tool" }],
  },
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description:
      "A symbol of the holy Sunflower Land Token. Flex your loyalty and farming status with this rare statue.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/401.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Power Shovel": {
    name: "Power Shovel",
    description:
      "Used for landscaping\n\nYou can craft a power shovel at the Workbench in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/309.png",
    attributes: [{ trait_type: "Purpose", value: "Tool" }],
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    description:
      "A rare collectible that provides holders with an airdrop on Christmas day.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/403.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  Scarecrow: {
    name: "Scarecrow",
    description:
      "Ensures your crops grow faster when placed on your farm.\n\nRumour has it that it is crafted with a Goblin head from the great war.\n\nIncludes boosts from [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/404.png",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Speed",
        value: 15,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Yield Increase",
        value: 20,
      },
      { value: "Tradable" },
    ],
  },
  "Farm Dog": {
    name: "Farm Dog",
    description:
      "Sheep are no longer lazy when this farm dog is around. Increases wool production. Currently used for decoration purposes.\n\n~~You can craft a dog at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/406.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Potato Statue": {
    name: "Potato Statue",
    description:
      "A rare collectible for the potato hustlers of Sunflower Land.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/402.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  Gnome: {
    name: "Gnome",
    description:
      "A lucky gnome. Currently used for decoration purposes\n\n~~You can craft a gnome at the Gobblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/407.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Rusty Shovel": {
    name: "Rusty Shovel",
    description:
      "Used to remove buildings and collectibles\n\nYou can craft a rusty shovel at the Workbench in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/307.png",
    attributes: [{ trait_type: "Purpose", value: "Tool" }],
  },
  "Chicken Coop": {
    name: "Chicken Coop",
    description:
      "A chicken coop that can be used to raise chickens. Increase egg production with this rare coop on your farm.\n\n~~You can craft a chicken coop at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/408.png",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Egg production",
        value: 200,
      },
      {
        display_type: "boost_number",
        trait_type: "Max. chickens",
        value: 5,
      },
      { value: "Tradable" },
    ],
  },
  "Gold Egg": {
    name: "Gold Egg",
    description:
      "A golden egg. What lays inside is a mystery but it looks like it will hatch soon.\n\nYou can craft a golden egg at the Goblin Farmer in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/409.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description:
      "A commemorative homage to Sunflower Farmers, the prototype which birthed Sunflower Land.\n\nThis item was airdropped to anyone who maxed out their farm to level 5.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/411.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description:
      "It is rumoured that a farmer created a golden fertiliser which produced this magical Cauliflower.\n\nFor some reason, when this Cauliflower is on your farm you receive twice the rewards from growing Cauliflowers.\n\n~~You can craft a Golden Cauliflower at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/410.png",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Cauliflower production",
        value: 200,
      },
      { value: "Tradable" },
    ],
  },
  "Farm Cat": {
    name: "Farm Cat",
    description:
      "Keep the rats away with this rare item. Currently used for decoration purposes.\n\n~~You can craft a Cat at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/405.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Sunflower Rock": {
    name: "Sunflower Rock",
    description:
      "Remember the time Sunflower Farmers 'broke' Polygon? Those days are gone with Sunflower Land!\n\nThis is an extremely rare decoration for your farm.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/412.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  Fountain: {
    name: "Fountain",
    description:
      "A beautiful fountain that relaxes all Bumpkins.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/414.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Woody the Beaver": {
    name: "Woody the Beaver",
    description:
      "During the great wood shortage, Bumpkins created an alliance with the Beaver population.\n\nIncreases wood production.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/415.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      { value: "Tradable" },
    ],
  },
  "Goblin Crown": {
    name: "Goblin Crown",
    description:
      "Summon the Goblin leader and reveal who the mastermind is behind the Goblin resistance.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/413.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Apprentice Beaver": {
    name: "Apprentice Beaver",
    description:
      "A well trained Beaver who has aspirations of creating a wood monopoly.\n\nIncreases wood replenishment rates.\n\nYou can craft this item at the Goblin Blacksmith in the game.\n\nIncludes boosts from [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/416.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Recovery Speed",
        value: 50,
      },
      { value: "Tradable" },
    ],
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description:
      "No one knows where this parsnip came from, but when it is on your farm Parsnips grow 50% faster.\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/418.png",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Parsnip Growth Speed",
        value: 50,
      },
      { value: "Tradable" },
    ],
  },
  "Foreman Beaver": {
    name: "Foreman Beaver",
    description:
      "A master of construction, carving and all things wood related.\n\nChop trees without axes.\n\nIncludes boosts from [Apprentice Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/416) and [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/417.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Recovery Speed",
        value: 50,
      },
      {
        display_type: "boost_number",
        trait_type: "Cut trees without axe",
        value: 1,
      },
      { value: "Tradable" },
    ],
  },
  Nancy: {
    name: "Nancy",
    description:
      "A brave scarecrow that keeps your crops safe from crows. Ensures your crops grow faster when placed on your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/420.png",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Speed",
        value: 15,
      },
      { value: "Tradable" },
    ],
  },
  "Farmer Bath": {
    name: "Farmer Bath",
    description:
      "A beetroot scented bath for your farmer.\n\nAfter a long day of farming potatoes and fighting off Goblins, this is the perfect relaxation device for your hard working farmer.\n\nYou can craft the Farmer Bath at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/423.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description:
      "Legend has it that only a true farmer can yield this sword.\n\nIncreases the chance of finding a mutant crop!\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/419.png",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      { value: "Tradable" },
    ],
  },
  Kuebiko: {
    name: "Kuebiko",
    description:
      "An extremely rare item in Sunflower Land. This scarecrow cannot move but has in-depth knowledge of the history of the Sunflower Wars.\n\nThis scarecrow is so scary that it even frightens Bumpkins. If you have this item, all seeds are free from the market.\n\nIncludes boosts from [Scarecrow](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/404) and [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/421.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Speed",
        value: 15,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Yield Increase",
        value: 20,
      },
      { display_type: "boost_number", trait_type: "Seed Cost", value: 0 },
      { value: "Tradable" },
    ],
  },
  "Rock Golem": {
    name: "Rock Golem",
    description:
      "The Rock Golem is the protector of Stone.\n\nMining stone causes the Golem to be become enraged giving a 10% chance to get 3x stone from stone mines.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/427.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_number",
        trait_type: "Stone Critical Hit Multipler",
        value: 3,
      },
      { value: "Tradable" },
    ],
  },
  "Nyon Statue": {
    name: "Nyon Statue",
    description:
      "A homage to Sir Nyon who died at the battle of the Goblin mines.\n\n~~You can craft the Nyon Statue at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/422.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Homeless Tent": {
    name: "Homeless Tent",
    description:
      "A nice and cozy tent.\n\n~~You can craft the Homeless Tent at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/424.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Mysterious Head": {
    name: "Mysterious Head",
    description:
      "A Mysterious Head said to protect farmers.\n\nYou can craft the Mysterious Head at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/425.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Golden Bonsai": {
    name: "Golden Bonsai",
    description:
      "The pinnacle of goblin style and sophistication. A Golden Bonsai is the perfect piece to tie your farm together.\n\n~~You can only get this item trading with the Traveling Salesman in the game. ~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/426.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Tunnel Mole": {
    name: "Tunnel Mole",
    description:
      "The tunnel mole gives a 25% increase to stone mines.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/428.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Stone Drops",
        value: 25,
      },
      { value: "Tradable" },
    ],
  },
  "Rocky the Mole": {
    name: "Rocky the Mole",
    description:
      "\"Life's not about how much iron you can mine... it's about how much more you can mine, and still keep mining.\" - Rocky the Mole\n\nRocky the Mole gives a 25% increase to iron mines.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/429.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Iron Drops",
        value: 25,
      },
      { value: "Tradable" },
    ],
  },
  "Victoria Sisters": {
    name: "Victoria Sisters",
    description:
      "A Halloween collectible. Increase Pumpkin yield by 20% and summon the necromancer.\n\nTo craft this item you must collect 50 Jack-o-lantern's and trade with the travelling salesman.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/432.gif",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  Nugget: {
    name: "Nugget",
    description:
      "Seldom seen above ground, this gold digger burrows day and night searching for the next gold rush.\n\nStrike gold with this little critter! Eureka!\n\nNugget gives a 25% increase to gold mines.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/430.gif",
    attributes: [
      { trait_type: "Purpose", value: "Boost" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Gold Drops",
        value: 25,
      },
      { value: "Tradable" },
    ],
  },
  "Wicker Man": {
    name: "Wicker Man",
    description:
      "Join hands and make a chain, the shadow of the Wicker Man will rise up again.\n\nYou can only get this item trading with the Traveling Salesman in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/431.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { value: "Tradable" },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description:
      "A Goblin’s favourite! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/502.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description:
      "A creamy soup that Goblins love! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/501.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description:
      "Fermented Cabbage! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/503.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/505.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Radish Pie": {
    name: "Radish Pie",
    description:
      "Despised by humans, loved by Goblins! Owning this item unlocks crop seeds.\n\nYou can craft this item at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/504.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/508.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Potato Cake": {
    name: "Potato Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/506.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/509.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/507.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/510.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/512.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/511.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Radish Cake": {
    name: "Radish Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/513.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/514.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  Stone: {
    name: "Stone",
    description:
      "A resource collected by mining stone mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/602.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  Wood: {
    name: "Wood",
    description:
      "A resource collected by chopping down trees.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/601.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  Iron: {
    name: "Iron",
    description:
      "A resource collected by mining iron mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/603.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  Egg: {
    name: "Egg",
    description:
      "A resource collected by taking care of chickens.\n\nIt is used in a range of different crafting recipes.\n\nAt Sunflower Land, the egg came first.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/605.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  Gold: {
    name: "Gold",
    description:
      "A resource collected by mining gold mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/604.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  Chicken: {
    name: "Chicken",
    description:
      "A resource used to collect eggs.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/606.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  "Speed Chicken": {
    name: "Speed Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant increases the speed of egg production by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/610.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Egg Production Speed",
        value: 10,
      },
      { trait_type: "Purpose", value: "Boost" },
      { value: "Tradable" },
    ],
  },
  Pig: {
    name: "Pig",
    description:
      "A resource used to collect manure.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/608.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  Sheep: {
    name: "Sheep",
    description:
      "A resource used to collect wool.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/609.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  "Fat Chicken": {
    name: "Fat Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant reduces the wheat required to feed a chicken by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/611.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Reduced wheat requirement for chickens",
        value: 10,
      },
      { trait_type: "Purpose", value: "Boost" },
      { value: "Tradable" },
    ],
  },
  "Rich Chicken": {
    name: "Rich Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant adds a boost of 10% higher egg yield.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/612.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Extra egg yield",
        value: 10,
      },
      { trait_type: "Purpose", value: "Boost" },
      { value: "Tradable" },
    ],
  },
  Rooster: {
    name: "Rooster",
    description:
      "Rooster increases the chance of getting a mutant chicken 2x.\n\nYou can craft this item at the Goblin Farmer in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/613.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Mutant Chicken chance",
        value: 100,
      },
      { trait_type: "Purpose", value: "Boost" },
      { value: "Tradable" },
    ],
  },
  Honey: {
    name: "Honey",
    description: "Used to sweeten your cooking.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/614.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  "Magic Mushroom": {
    name: "Magic Mushroom",
    description: "Used to cook advanced recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/616.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  "Wild Mushroom": {
    name: "Wild Mushroom",
    description: "Used to cook basic recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/615.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  Diamond: {
    name: "Diamond",
    description:
      "A resource collected by mining diamond mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/617.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  "Green Thumb": {
    name: "Green Thumb",
    description:
      "A skill that can be earned when reaching level 5 in farming.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/701.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Profit Increase",
        value: 5,
      },
    ],
  },
  "Barn Manager": {
    name: "Barn Manager",
    description:
      "A skill that can be earned when reaching level 5 in farming.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/702.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Animal Produce increase",
        value: 5,
      },
    ],
  },
  Cow: {
    name: "Cow",
    description:
      "A resource used to collect milk.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/607.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { value: "Tradable" },
    ],
  },
  "Seed Specialist": {
    name: "Seed Specialist",
    description:
      "A skill that can be earned when reaching level 10 in farming.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/703.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop growth speed",
        value: 10,
      },
    ],
  },
  Wrangler: {
    name: "Wrangler",
    description:
      "A skill that can be learnt when reaching level 10 in farming.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/704.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Animal produce time",
        value: 10,
      },
    ],
  },
  Lumberjack: {
    name: "Lumberjack",
    description:
      "A skill that can be earned when reaching level 5 in gathering.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/705.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Wood drop increase",
        value: 10,
      },
    ],
  },
  Prospector: {
    name: "Prospector",
    description:
      "A skill that can be earned when reaching level 5 in gathering.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/706.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Stone drop increase",
        value: 20,
      },
    ],
  },
  "Gold Rush": {
    name: "Gold Rush",
    description:
      "A skill that can be earned when reaching level 10 in gathering.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/708.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Gold Drops",
        value: 50,
      },
    ],
  },
  Coder: {
    name: "Coder",
    description: "A skill that can be earned by contributing code to the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/710.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop yield",
        value: 10,
      },
    ],
  },
  Artist: {
    name: "Artist",
    description: "A skill that can be earned by contributing art to the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/709.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Tools discount",
        value: 10,
      },
    ],
  },
  Logger: {
    name: "Logger",
    description:
      "A skill that can be earned when reaching level 10 in gathering.\n\nIt can be minted only through gameplay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/707.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Axe Strength",
        value: 200,
      },
    ],
  },
  "Discord Mod": {
    name: "Discord Mod",
    description: "A skill that can be earned by moderating Discord.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/712.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Wood bonus",
        value: 35,
      },
    ],
  },
  "Trading Ticket": {
    name: "Trading Ticket",
    description:
      "This ticket grants the owner a free ride in the hot air balloon (a free trade).\n\nUsed automatically when posting a trade.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/713.png",
    attributes: [{ trait_type: "Purpose", value: "Coupon" }],
  },
  "Beta Pass": {
    name: "Beta Pass",
    description: "Gain early access to features for testing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/715.png",
    attributes: [{ trait_type: "Purpose", value: "Coupon" }],
  },
  "Liquidity Provider": {
    name: "Liquidity Provider",
    description: "A skill that can be earned by providing liquidity.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/711.png",
    attributes: [
      { trait_type: "Purpose", value: "Skill" },
      {
        display_type: "boost_percentage",
        trait_type: "Withdrawal fee discount",
        value: 50,
      },
    ],
  },
  "Belgian Flag": {
    name: "Belgian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/802.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Australian Flag": {
    name: "Australian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/801.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Brazilian Flag": {
    name: "Brazilian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/803.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Indonesian Flag": {
    name: "Indonesian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/808.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  Warrior: {
    name: "Warrior",
    description: "A skill earned by the top 10 warriors each week.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/714.png",
    attributes: [{ trait_type: "Purpose", value: "Skill" }],
  },
  "French Flag": {
    name: "French Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/806.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Finnish Flag": {
    name: "Finnish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/805.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Indian Flag": {
    name: "Indian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/809.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "German Flag": {
    name: "German Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/807.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Iranian Flag": {
    name: "Iranian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/810.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Italian Flag": {
    name: "Italian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/811.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Japanese Flag": {
    name: "Japanese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/812.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Moroccan Flag": {
    name: "Moroccan Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/813.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Chinese Flag": {
    name: "Chinese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/804.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Philippine Flag": {
    name: "Philippine Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/815.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Dutch Flag": {
    name: "Dutch Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/814.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Polish Flag": {
    name: "Polish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/816.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Russian Flag": {
    name: "Russian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/818.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Saudi Arabian Flag": {
    name: "Saudi Arabian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/819.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Portuguese Flag": {
    name: "Portuguese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/817.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Spanish Flag": {
    name: "Spanish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/821.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Thai Flag": {
    name: "Thai Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/823.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Turkish Flag": {
    name: "Turkish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/824.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "South Korean Flag": {
    name: "South Korean Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/820.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Ukrainian Flag": {
    name: "Ukrainian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/825.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Vietnamese Flag": {
    name: "Vietnamese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/827.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "American Flag": {
    name: "American Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/826.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Canadian Flag": {
    name: "Canadian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/828.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Singaporean Flag": {
    name: "Singaporean Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/829.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Sierra Leone Flag": {
    name: "Sierra Leone Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/831.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "British Flag": {
    name: "British Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/830.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Romanian Flag": {
    name: "Romanian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/832.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Pirate Flag": {
    name: "Pirate Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/835.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Mexican Flag": {
    name: "Mexican Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/837.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Rainbow Flag": {
    name: "Rainbow Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/833.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Dominican Republic Flag": {
    name: "Dominican Republic Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/838.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Algerian Flag": {
    name: "Algerian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/836.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Argentinian Flag": {
    name: "Argentinian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/839.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Sunflower Flag": {
    name: "Sunflower Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/822.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Colombian Flag": {
    name: "Colombian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/842.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Malaysian Flag": {
    name: "Malaysian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/841.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Egg Basket": {
    name: "Egg Basket",
    description:
      "An item that starts the Easter Egg Hunt.\n\nYou have 7 days to collect the 7 eggs. Every few hours an egg may appear on your farm to collect. Limited edition item!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/901.png",
    attributes: [{ value: "Tradable" }],
  },
  "Red Egg": {
    name: "Red Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/902.png",
    attributes: [{ value: "Tradable" }],
  },
  "Blue Egg": {
    name: "Blue Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/903.png",
    attributes: [{ value: "Tradable" }],
  },
  "Yellow Egg": {
    name: "Yellow Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/904.png",
    attributes: [{ value: "Tradable" }],
  },
  "Pink Egg": {
    name: "Pink Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/905.png",
    attributes: [{ value: "Tradable" }],
  },
  "Purple Egg": {
    name: "Purple Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/906.png",
    attributes: [{ value: "Tradable" }],
  },
  "Orange Egg": {
    name: "Orange Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/907.png",
    attributes: [{ value: "Tradable" }],
  },
  "Lithuanian Flag": {
    name: "Lithuanian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/840.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Green Egg": {
    name: "Green Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/908.png",
    attributes: [{ value: "Tradable" }],
  },
  Observatory: {
    name: "Observatory",
    description:
      "A limited edition Observatory gained from completing the mission from Million on Mars x Sunflower Land crossover event.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/911.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Experience Boost",
        value: 15,
      },
      { trait_type: "Purpose", value: "Boost" },
    ],
  },
  "Engine Core": {
    name: "Engine Core",
    description:
      "An exclusive event item for Million on Mars x Sunflower Land cross-over.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/910.png",
    attributes: [],
  },
  "Ancient Goblin Sword": {
    name: "Ancient Goblin Sword",
    description: "An Ancient Goblin Sword",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/914.png",
    attributes: [],
  },
  "Ancient Human Warhammer": {
    name: "Ancient Human Warhammer",
    description: "An Ancient Human Warhammer",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/915.png",
    attributes: [],
  },
  "War Bond": {
    name: "War Bond",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nWill you show your support?\n\nFor a limited time, the war collectors are offering rare War Bonds in exchange for resources. You can use these to buy rare items in Goblin Village.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/917.png",
    attributes: [{ trait_type: "Purpose", value: "Coupon" }],
  },
  "Rapid Growth": {
    name: "Rapid Growth",
    description: "A rare fertiliser. Apply to your crops to grow twice as fast",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/916.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Crops grow quicker",
        value: 50,
      },
      { trait_type: "Purpose", value: "Fertiliser" },
    ],
  },
  "Sunflower Key": {
    name: "Sunflower Key",
    description: "A Sunflower Key",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/913.png",
    attributes: [],
  },
  "Human War Point": {
    name: "Human War Point",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Human is providing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/919.png",
    attributes: [],
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description:
      "A limited edition bunny that can be crafted by those who collect all 7 eggs in the Easter Egg Hunt.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/909.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Carrot harvest",
        value: 20,
      },
      { trait_type: "Purpose", value: "Boost" },
      { value: "Tradable" },
    ],
  },
  "Goblin Flag": {
    name: "Goblin Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/834.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { value: "Tradable" },
    ],
  },
  "Goblin Key": {
    name: "Goblin Key",
    description: "A Goblin Key",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/912.png",
    attributes: [],
  },
  "Goblin War Point": {
    name: "Goblin War Point",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Goblin is providing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/918.png",
    attributes: [],
  },
  "Human War Banner": {
    name: "Human War Banner",
    description:
      "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Human cause.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/920.png",
    attributes: [],
  },
  Market: {
    name: "Market",
    description: "A market used to buy seeds and sell crops in game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1001.png",
    attributes: [],
  },
  "Jack-o-lantern": {
    name: "Jack-o-lantern",
    description: "A Halloween special event item.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/923.png",
    attributes: [],
  },
  "Golden Crop": {
    name: "Golden Crop",
    description: "A shiny golden crop",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/924.gif",
    attributes: [{ trait_type: "Purpose", value: "Coupon" }],
  },
  "Fire Pit": {
    name: "Fire Pit",
    description: "A fire pit used to cook basic recipes in game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1002.png",
    attributes: [],
  },
  Tent: {
    name: "Tent",
    description:
      "Every Bumpkin needs a tent. Adding a tent to your land supports adding more Bumpkins (coming soon) to your land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1004.png",
    attributes: [],
  },
  Workbench: {
    name: "Workbench",
    description: "A workbench used to craft tools in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1003.png",
    attributes: [],
  },
  "Goblin War Banner": {
    name: "Goblin War Banner",
    description:
      "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Goblin cause.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/921.png",
    attributes: [],
  },
  Bakery: {
    name: "Bakery",
    description: "A bakery used to cook recipes in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1007.png",
    attributes: [],
  },
  Kitchen: {
    name: "Kitchen",
    description: "A kitchen used to cook recipes in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1008.png",
    attributes: [],
  },
  "Chef Apron": {
    name: "Chef Apron",
    description: "Legacy item, do not buy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1101.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Price of cakes",
        value: 20,
      },
      { trait_type: "Purpose", value: "Boost" },
      { value: "Tradable" },
    ],
  },
  "Water Well": {
    name: "Water Well",
    description: "A water well to support more crops in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1005.png",
    attributes: [],
  },
  Deli: {
    name: "Deli",
    description: "A deli used to cook advanced recipes at Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1009.png",
    attributes: [],
  },
  "Smoothie Shack": {
    name: "Smoothie Shack",
    description:
      "A Smoothie Shack is used to prepare juices in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1010.png",
    attributes: [],
  },

  "Sunflower Amulet": {
    name: "Sunflower Amulet",
    description: "10% increased Sunflower yield",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1103.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Sunflower yield",
        value: 10,
      },
      { trait_type: "Purpose", value: "Boost" },
    ],
  },
  "Chef Hat": {
    name: "Chef Hat",
    description: "Legacy item, do not buy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1102.png",
    attributes: [],
  },
  "Carrot Amulet": {
    name: "Carrot Amulet",
    description: "Legacy item, do not buy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1104.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Carrots grow time",
        value: 20,
      },
      { trait_type: "Purpose", value: "Boost" },
    ],
  },
  "Beetroot Amulet": {
    name: "Beetroot Amulet",
    description: "Legacy item, do not buy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1105.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Beetroot yield",
        value: 20,
      },
      { trait_type: "Purpose", value: "Boost" },
    ],
  },
  "Warrior Shirt": {
    name: "Warrior Shirt",
    description: "A mark of a true warrior",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1107.png",
    attributes: [],
  },
  "Green Amulet": {
    name: "Green Amulet",
    description: "Legacy item, do not buy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1106.png",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Crop Critical Hit Multipler",
        value: 10,
      },
      { trait_type: "Purpose", value: "Boost" },
    ],
  },
  "Warrior Pants": {
    name: "Warrior Pants",
    description: "Protect your thighs",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1109.png",
    attributes: [],
  },
  "Skull Hat": {
    name: "Skull Hat",
    description: "A rare hat for your Bumpkin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1111.png",
    attributes: [],
  },
  "Sunflower Shield": {
    name: "Sunflower Shield",
    description: "A hero of Sunflower Land. Free Sunflower Seeds!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1110.png",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Sunflower Seed Cost",
        value: 0,
      },
      { trait_type: "Purpose", value: "Boost" },
    ],
  },
  "War Tombstone": {
    name: "War Tombstone",
    description: "R.I.P",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1113.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "War Skull": {
    name: "War Skull",
    description: "Decorate the land with the bones of your enemies.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1112.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Hen House": {
    name: "Hen House",
    description: "A hen house used to support chickens.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1006.png",
    attributes: [],
  },
  "Undead Rooster": {
    name: "Undead Rooster",
    description: "An unfortunate casualty of the war. 10% increased egg yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1114.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Extra egg yield",
        value: 10,
      },
      { trait_type: "Purpose", value: "Boost" },
    ],
  },
  "Warrior Helmet": {
    name: "Warrior Helmet",
    description: "Immune to arrows",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1108.png",
    attributes: [],
  },
  "Angel Bear": {
    description:
      "Time to transcend peasant farming. Harvest 1 million crops to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1207.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Apple Pie": {
    description: "Bumpkin Betty's famous recipe. Cook this at the bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/524.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Badass Bear": {
    description:
      "Nothing stands in your way. Chop 5,000 trees to unlock this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1208.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Basic Bear": {
    description: "A basic bear. Use this to craft advanced bears!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1204.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bear Trap": {
    description:
      "It's a trap! Unlock the high roller achievement to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1209.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Blueberry Jam": {
    description:
      "Goblins will do anything for this jam. You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/525.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Boiled Eggs": {
    description:
      "Boiled Eggs are great for breakfast. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/515.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Brilliant Bear": {
    description: "Pure brilliance! Reach lvl 20 to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1210.png",
    attributes: [{ trait_type: "Purpose", value: "Decoraton" }],
  },
  "Bumpkin Broth": {
    description:
      "A perfect broth for a cold day. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/516.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Bumpkin Salad": {
    description:
      "Gotta keep your Bumpkin healthy! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/517.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Cabbage Boy": {
    description: "Don't wake the baby!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Cabbage Girl": {
    description: "Don't wake the baby!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Cauliflower Burger": {
    description:
      "Calling all cauliflower lovers! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/520.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Chef Bear": {
    description:
      "Every chef needs a helping hand! Bake 13 cakes to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1205.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Christmas Bear": {
    description: "Santa's favourite.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1217.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Classy Bear": {
    description:
      "More SFL than you know what to do with it! Mine 500 gold rocks to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1211.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Construction Bear": {
    description:
      "Always build in a bear market. Build 10 buildings to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1206.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Farmer Bear": {
    description:
      "Nothing quite like a hard day's work! Harvest 10,000 crops to unlock this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1212.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Rich Bear": {
    description:
      "A prized possession. Unlock the Bumpkin Billionaire achievement to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1214.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Rainbow Artist Bear": {
    description: "The owner is a beautiful bear artist!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1218.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sunflower Bear": {
    description:
      "A Bear's cherished crop. Harvest 100,000 Sunflowers to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1213.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Club Sandwich": {
    description:
      "Filled with Carrots and Roasted Sunflower Seeds. You can cook this at the Kitchen",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/521.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Fermented Carrots": {
    description: "Got a surplus of carrots? You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Goblin's Treat": {
    description:
      "Goblins go crazy for this stuff! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/518.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Honey Cake": {
    description: "A scrumptious cake! You can cook this at the Bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/527.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Kale & Mushroom Pie": {
    description:
      "A traditional Sapphiron recipe. You can cook this at the Bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/528.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Kale Stew": {
    description:
      "A perfect Bumpkin Booster. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/529.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Mashed Potato": {
    description: "My life is potato. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/519.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Mushroom Jacket Potatoes": {
    description:
      "Cram them taters with what ya got! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/530.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Mushroom Soup": {
    description:
      "Warm your Bumpkin's soul. You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/531.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Reindeer Carrot": {
    description:
      "Rudolph can't stop eating them! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/534.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Roast Veggies": {
    description:
      "Even Goblins need to eat their veggies! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/522.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Sunflower Crunch": {
    description:
      "Crunchy goodness. Try not to burn it! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/533.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Orange Cake": {
    description:
      "Orange you glad we aren't cooking apples. You can can cook these at the Bakery.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/532.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  Pancakes: {
    description:
      "A great start to a Bumpkins day. You can can cook these at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/523.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Apple Juice": {
    description:
      "A crisp refreshing beverage. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/535.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },

  "Orange Juice": {
    description:
      "OJ matches perfectly with a Club Sandwich. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/536.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },

  "Purple Smoothie": {
    description:
      "You can hardly taste the Cabbage. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/537.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },
  "Power Smoothie": {
    description:
      "Official drink of the Bumpkin Powerlifting Society. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/538.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },

  "Bumpkin Detox": {
    description:
      "Wash away the sins of last night. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/539.png",
    attributes: [{ trait_type: "Purpose", value: "Food" }],
  },

  "Potted Potato": {
    description:
      "Potato blood runs through your Bumpkin. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1215.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Potted Pumpkin": {
    description:
      "Pumpkins for Bumpkins. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1216.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Potted Sunflower": {
    description:
      "Brighten up your land. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1202.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "White Tulips": {
    description:
      "Keep the smell of goblins away. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1201.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  Cactus: {
    description:
      "Saves water and makes your farm look stunning! You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1203.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sand Shovel": {
    description:
      "There are rumours that the Bumpkin pirares hid their treasure somewhere. These shovels can be used to dig for treasure!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/310.png",
    attributes: [{ trait_type: "Purpose", value: "Tool" }],
  },
  "Peaceful Potato": {
    description: "Coming Soon",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Colossal Crop": {
    description: "Coming Soon",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Golden Bean": {
    description: "Coming Soon",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Peeled Potato": {
    description:
      "A prized possession. Discover a bonus potato 20% of harvests.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/433.gif",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Perky Pumpkin": {
    description: "Coming Soon",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },

  "Stellar Sunflower": {
    description: "Coming Soon",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Wood Nymph Wendy": {
    description: "Coming Soon",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Shiny Bean": {
    description: "Coming Soon",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Magic Bean": {
    description:
      "Plant, wait and discover rare items, mutant crops & more surprises!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/115.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Christmas Snow Globe": {
    description:
      "Swirl the snow and watch it come to life. A Christmas collectible.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1219.gif",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Clam Shell": {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/618.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Sea Cucumber": {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/619.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  Coral: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/620.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  Crab: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/621.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  Starfish: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/622.png",
    attributes: [{ trait_type: "Purpose", value: "Resource" }],
  },
  "Immortal Pear": {
    description:
      "This long-lived pear ensures your fruit tree survives +1 bonus harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Lady Bug": {
    description:
      "An incredible bug that feeds on aphids. Improves Apple quality. +0.25 Apples each harvest",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/question_mark.png",
    attributes: [{ trait_type: "Purpose", value: "Boost" }],
  },
  "Devil Bear": {
    description: "Better the Devil you know than the Devil you don't",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image_url: "../public/erc1155/images/1220.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
};
