import { InventoryItemName } from "../src/features/game/types/game";
import { Attribute } from "./models";

type Metadata = {
  description: string;
  decimals: number;
  attributes: Attribute[];
  external_url: string;
  image: string;
  name?: string;
};

export const OPEN_SEA_ITEMS: Record<InventoryItemName, Metadata> = {
  "Sunflower Seed": {
    name: "Sunflower Seed",
    description:
      "A seed used to grow sunflowers. The most basic resource used to start your farming empire.\n\nYou can buy sunflower seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/101.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beetroot Seed": {
    name: "Beetroot Seed",
    description:
      "A seed used to grow beetroot.\n\nYou can buy beetroot seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/106.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potato Seed": {
    name: "Potato Seed",
    description:
      "A seed used to grow potatoes. All great hustlers start with a potato seed.\n\nYou can buy potato seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/102.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbage Seed": {
    name: "Cabbage Seed",
    description:
      "A seed used to grow cabbage.\n\nYou can buy cabbage seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/105.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Soybean Seed": {
    name: "Soybean Seed",
    description:
      "A seed used to grow soybean.\n\nYou can buy soybean seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/124.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pumpkin Seed": {
    name: "Pumpkin Seed",
    description:
      "A seed used to grow pumpkins. A goblin's favourite!\n\nYou can buy pumpkin seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/103.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Seed": {
    name: "Carrot Seed",
    description:
      "A seed used to grow carrots. An easy to grow and staple vegetable in all Bumpkin's diets!\n\nYou can buy carrot seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/104.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Parsnip Seed": {
    name: "Parsnip Seed",
    description:
      "A seed used to grow parsnip.\n\nYou can buy parsnip seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/108.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Eggplant Seed": {
    name: "Eggplant Seed",
    description:
      "A seed used to grow eggplant.\n\nYou can buy eggplant seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/118.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Wheat Seed": {
    name: "Wheat Seed",
    description:
      "A seed used to grow wheat.\n\nYou can buy wheat seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/110.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radish Seed": {
    name: "Radish Seed",
    description:
      "A seed used to grow radishes.\n\nYou can buy radish seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/109.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Corn Seed": {
    name: "Cord Seed",
    description:
      "A seed used to grow corn.\n\nYou can buy corn seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/119.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale Seed": {
    name: "Kale Seed",
    description:
      "A seed used to grow kale.\n\nYou can buy kale seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/111.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Apple Seed": {
    name: "Apple Seed",
    description:
      "A seed used to grow apple.\n\nYou can buy apple seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/112.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cauliflower Seed": {
    name: "Cauliflower Seed",
    description:
      "A seed used to grow cauliflower.\n\nYou can buy cauliflower seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/107.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sunflower: {
    name: "Sunflower",
    description: "A crop grown at Sunflower Land.\n\nA sunny flower.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/201.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Orange Seed": {
    name: "Orange Seed",
    description:
      "A seed used to grow orange.\n\nYou can buy orange seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/114.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blueberry Seed": {
    name: "Blueberry Seed",
    description:
      "A seed used to grow blueberry.\n\nYou can buy blueberry seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/113.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Banana Plant": {
    name: "Banana Plant",
    description:
      "A plant used to grow bananas.\n\nYou can buy banana plants in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/120.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunpetal Seed": {
    name: "Sunpetal Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Sunpetal seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/121.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Rarity", value: "Rare" },
    ],
  },
  "Bloom Seed": {
    name: "Bloom Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Bloom seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/122.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Rarity", value: "Rare" },
    ],
  },
  "Lily Seed": {
    name: "Lily Seed",
    description:
      "A seed used to grow flowers. Experiment to find all the variants.\n\nYou can buy Lily seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/123.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Rarity", value: "Rare" },
    ],
  },
  Beetroot: {
    name: "Beetroot",
    description:
      "A crop grown at Sunflower Land.\n\nApparently, they’re an aphrodisiac...",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/206.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Pumpkin: {
    name: "Pumpkin",
    description: "A crop grown at Sunflower Land.\n\nOoooh, spoookyy",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/203.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cauliflower: {
    name: "Cauliflower",
    description:
      "A crop grown at Sunflower Land.\n\nNow in 4 different colours!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/207.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Potato: {
    name: "Potato",
    description:
      "A crop grown at Sunflower Land.\n\nHealthier than you might think!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/202.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cabbage: {
    name: "Cabbage",
    description:
      "A crop grown at Sunflower Land.\n\nOnce a luxury, now a food for many.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/205.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Soybean: {
    name: "Soybean",
    description: "A crop grown at Sunflower Land.\n\nA versatile legume!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/251.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Parsnip: {
    name: "Parsnip",
    description:
      "A crop grown at Sunflower Land.\n\nNot to be mistaken for carrots.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/208.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Eggplant: {
    name: "Eggplant",
    description:
      "A crop grown at Sunflower Land.\n\nNature's edible work of art.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/215.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Wheat: {
    name: "Wheat",
    description:
      "A crop grown at Sunflower Land.\n\nTraditionally only grown by Goblins.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/210.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Kale: {
    name: "Kale",
    description: "A crop grown at Sunflower Land.\n\nA Bumpkin Power Food!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/211.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Carrot: {
    name: "Carrot",
    description:
      "A crop grown at Sunflower Land.\n\nThey’re good for your eyes!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/204.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Axe: {
    name: "Axe",
    description:
      "A tool used to chop wood. It is burnt after use.\n\nYou can craft an axe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/301.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Orange: {
    name: "Orange",
    description:
      "A fruit grown at Sunflower Land.\n\nVitamin C to keep your Bumpkin Healthy",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/214.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Blueberry: {
    name: "Blueberry",
    description: "A fruit grown at Sunflower Land.\n\nA Goblin's weakness",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/213.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Apple: {
    name: "Apple",
    description:
      "A fruit grown at Sunflower Land.\n\nPerfect for homemade Apple Pie",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/212.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Banana: {
    name: "Banana",
    description: "A fruit grown at Sunflower Land.\n\nOh banana!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/217.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Pickaxe: {
    name: "Pickaxe",
    description:
      "A tool used to mine stone. It is burnt after use.\n\nYou can craft a pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/302.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Radish: {
    name: "Radish",
    description:
      "A crop grown at Sunflower Land.\n\nLegend says these were once used in melee combat.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/209.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Corn: {
    name: "Corn",
    description:
      "A crop grown at Sunflower Land.\n\nGolden corn, a gift from celestial lands, bestowed bountiful harvests upon humankind",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/216.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Stone Pickaxe": {
    name: "Stone Pickaxe",
    description:
      "A tool used to mine iron. It is burnt after use.\n\nYou can craft a stone pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/303.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Iron Pickaxe": {
    name: "Iron Pickaxe",
    description:
      "A tool used to mine gold. It is burnt after use.\n\nYou can craft an iron pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/304.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gold Pickaxe": {
    name: "Gold Pickaxe",
    description:
      "A tool used to mine crimstones and sunstones. It is burnt after use.\n\nYou can craft a gold pickaxe at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/304.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Oil Drill": {
    name: "Oil Drill",
    description:
      "A tool used to drill for oil. It is burnt after use.\n\nYou can craft an oil drill at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/313.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Hammer: {
    name: "Hammer",
    description:
      "A tool used to upgrade buildings.\n\nYou can craft a hammer at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/305.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Rod: {
    name: "Rod",
    description:
      "A tool used to capture fish.\n\nYou can craft a rod at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/306.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Shovel: {
    name: "Shovel",
    description:
      "A tool used to remove unwanted crops.\n\nYou can craft a shovel at the Workbench in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/308.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Statue": {
    name: "Sunflower Statue",
    description:
      "A symbol of the holy Sunflower Land Token. Flex your loyalty and farming status with this rare statue.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/401.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Christmas Tree": {
    name: "Christmas Tree",
    description:
      "Place on your farm during the Festive Season to get a spot and Santa's nice list!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/403.png",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Scarecrow: {
    name: "Scarecrow",
    description:
      "Ensures your crops grow faster when placed on your farm.\n\nRumour has it that it is crafted with a Goblin head from the great war.\n\nIncludes boosts from [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/404.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -15,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Yield",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farm Dog": {
    name: "Farm Dog",
    description:
      "Sheep are no longer lazy when this farm dog is around. Increases wool production. Currently used for decoration purposes.\n\n~~You can craft a dog at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/406.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Potato Statue": {
    name: "Potato Statue",
    description:
      "A rare collectible for the potato hustlers of Sunflower Land.\n\n~~You can craft this item at the Goblin Blacksmith~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/402.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Gnome: {
    name: "Gnome",
    description:
      "A lucky gnome. Currently used for decoration purposes\n\n~~You can craft a gnome at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/407.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type:
          "Increase Medium and Advanced Crop Yield when placed between Clementine and Cobalt",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 1,
      },
    ],
  },
  "Rusty Shovel": {
    name: "Rusty Shovel",
    description:
      "Used to remove buildings and collectibles\n\nYou can craft a rusty shovel at the Workbench in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/307.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chicken Coop": {
    name: "Chicken Coop",
    description:
      "A chicken coop that can be used to raise chickens. Increase egg production with this rare coop on your farm.\n\n~~You can craft a chicken coop at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/408.png",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Egg Production",
        value: 100,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Max Chickens per Hen House",
        value: 5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Gold Egg": {
    name: "Gold Egg",
    description:
      "A golden egg. What lays inside is known to be the bearer of good fortune.\n\n\n\nFeed chickens without wheat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/409.gif",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Feed chickens without Wheat",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Tombstone": {
    name: "Sunflower Tombstone",
    description:
      "A commemorative homage to Sunflower Farmers, the prototype which birthed Sunflower Land.\n\nThis item was airdropped to anyone who maxed out their farm to level 5.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/411.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Cauliflower": {
    name: "Golden Cauliflower",
    description:
      "It is rumoured that a farmer created a golden fertiliser which produced this magical Cauliflower.\n\nFor some reason, when this Cauliflower is on your farm you receive twice the rewards from growing Cauliflowers.\n\n~~You can craft a Golden Cauliflower at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/410.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Cauliflower Yield",
        value: 100,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farm Cat": {
    name: "Farm Cat",
    description:
      "Keep the rats away with this rare item. Currently used for decoration purposes.\n\n~~You can craft a Cat at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/405.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Rock": {
    name: "Sunflower Rock",
    description:
      "Remember the time Sunflower Farmers 'broke' Polygon? Those days are gone with Sunflower Land!\n\nThis is an extremely rare decoration for your farm.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/412.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Fountain: {
    name: "Fountain",
    description:
      "A beautiful fountain that relaxes all Bumpkins.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/414.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Woody the Beaver": {
    name: "Woody the Beaver",
    description:
      "During the great wood shortage, Bumpkins created an alliance with the Beaver population.\n\nIncreases wood production.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/415.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Crown": {
    name: "Goblin Crown",
    description:
      "Summon the Goblin leader and reveal who the mastermind is behind the Goblin resistance.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/413.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Apprentice Beaver": {
    name: "Apprentice Beaver",
    description:
      "A well trained Beaver who has aspirations of creating a wood monopoly.\n\nIncreases wood replenishment rates.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**\n\nIncludes boosts from [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/416.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Recovery Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mysterious Parsnip": {
    name: "Mysterious Parsnip",
    description:
      "No one knows where this parsnip came from, but when it is on your farm Parsnips grow 50% faster.\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/418.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Parsnip Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Foreman Beaver": {
    name: "Foreman Beaver",
    description:
      "A master of construction, carving and all things wood related.\n\nChop trees without axes.\n\nIncludes boosts from [Apprentice Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/416) and [Woody the Beaver](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/415).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/417.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
        value: 20,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Recovery Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Cut trees without axe",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Nancy: {
    name: "Nancy",
    description:
      "A brave scarecrow that keeps your crops safe from crows. Ensures your crops grow faster when placed on your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/420.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -15,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farmer Bath": {
    name: "Farmer Bath",
    description:
      "A beetroot scented bath for your farmer.\n\nAfter a long day of farming potatoes and fighting off Goblins, this is the perfect relaxation device for your hard working farmer.\n\nYou can craft the Farmer Bath at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/423.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Carrot Sword": {
    name: "Carrot Sword",
    description:
      "Legend has it that only a true farmer can yield this sword.\n\nIncreases the chance of finding a mutant crop by 300%!\n\n~~You can craft this item at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/419.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_percentage",
        trait_type: "Increases chance of Mutant Crop",
        value: 300, // Means 4x the chance to get a Mutant Crop
      },
    ],
  },
  Kuebiko: {
    name: "Kuebiko",
    description:
      "An extremely rare item in Sunflower Land. This scarecrow cannot move but has in-depth knowledge of the history of the Sunflower Wars.\n\nThis scarecrow is so scary that it even frightens Bumpkins. If you have this item, all seeds are free from the market.\n\nIncludes boosts from [Scarecrow](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/404) and [Nancy](https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/420).",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/421.gif",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -15,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Yield",
        value: 20,
      },
      {
        display_type: "boost_number",
        trait_type: "Cost of Seeds",
        value: 0,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rock Golem": {
    name: "Rock Golem",
    description:
      "The Rock Golem is the protector of Stone.\n\nMining stone causes the Golem to be become enraged giving a 10% chance to get 3x stone from stone mines.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/427.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Stone Critical Hit Amount",
        value: 2, // +2 Stone when Critical Hit
      },
      {
        display_type: "boost_percentage",
        trait_type: "Stone Critical Hit Chance",
        value: 10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Nyon Statue": {
    name: "Nyon Statue",
    description:
      "A homage to Sir Nyon who died at the battle of the Goblin mines.\n\n~~You can craft the Nyon Statue at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/422.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Homeless Tent": {
    name: "Homeless Tent",
    description:
      "A nice and cozy tent.\n\n~~You can craft the Homeless Tent at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/424.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mysterious Head": {
    name: "Mysterious Head",
    description:
      "A Mysterious Head said to protect farmers.\n\nYou can craft the Mysterious Head at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/425.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Bonsai": {
    name: "Golden Bonsai",
    description:
      "The pinnacle of goblin style and sophistication. A Golden Bonsai is the perfect piece to tie your farm together.\n\n~~You can only get this item trading with the Traveling Salesman in the game. ~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/426.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tunnel Mole": {
    name: "Tunnel Mole",
    description:
      "The tunnel mole gives a 25% increase to stone mines.\n\n~~You can craft this item at the Goblin Blacksmith in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/428.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Stone Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rocky the Mole": {
    name: "Rocky the Mole",
    description:
      "\"Life's not about how much iron you can mine... it's about how much more you can mine, and still keep mining.\" - Rocky the Mole\n\nRocky the Mole gives a 25% increase to iron mines.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/429.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Victoria Sisters": {
    name: "Victoria Sisters",
    description:
      "A Halloween collectible. Increase Pumpkin yield by 20% and summon the necromancer.\n\nTo craft this item you must collect 50 Jack-o-lantern's and trade with the Traveling Salesman.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/432.gif",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Pumpkin Yield",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Nugget: {
    name: "Nugget",
    description:
      "Seldom seen above ground, this gold digger burrows day and night searching for the next gold rush.\n\nStrike gold with this little critter! Eureka!\n\nNugget gives a 25% increase to gold mines.\n\nYou can craft this item at the Goblin Blacksmith in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/430.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Gold Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Wicker Man": {
    name: "Wicker Man",
    description:
      "Join hands and make a chain, the shadow of the Wicker Man will rise up again.\n\nYou can only get this item trading with the Traveling Salesman in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/431.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Roasted Cauliflower": {
    name: "Roasted Cauliflower",
    description:
      "A Goblin’s favourite! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/502.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pumpkin Soup": {
    name: "Pumpkin Soup",
    description:
      "A creamy soup that Goblins love! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/501.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sauerkraut: {
    name: "Sauerkraut",
    description:
      "Fermented Cabbage! Owning this item unlocks fields and new seeds.\n\nYou can craft this at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/503.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Cake": {
    name: "Sunflower Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/505.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radish Pie": {
    name: "Radish Pie",
    description:
      "Despised by humans, loved by Goblins! Owning this item unlocks crop seeds.\n\nYou can craft this item at the Kitchen in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/504.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Cake": {
    name: "Carrot Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/508.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potato Cake": {
    name: "Potato Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/506.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbage Cake": {
    name: "Cabbage Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/509.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pumpkin Cake": {
    name: "Pumpkin Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/507.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beetroot Cake": {
    name: "Beetroot Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/510.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Parsnip Cake": {
    name: "Parsnip Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/512.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cauliflower Cake": {
    name: "Cauliflower Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/511.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radish Cake": {
    name: "Radish Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/513.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Wheat Cake": {
    name: "Wheat Cake",
    description:
      "A special cake that is only available during certain times of the year for the great bake off!\n\nYou can bake a cake at the in-game Kitchen using eggs, wheat and the necessary crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/514.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Stone: {
    name: "Stone",
    description:
      "A resource collected by mining stone mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/602.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  Wood: {
    name: "Wood",
    description:
      "A resource collected by chopping down trees.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/601.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Iron: {
    name: "Iron",
    description:
      "A resource collected by mining iron mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/603.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Crimstone: {
    name: "Crimstone",
    description:
      "A resource collected by mining crimstone mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/636.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Oil: {
    name: "Oil",
    description:
      "A resource collected by mining oil mines.\n\nIt is used to power machinery and boost cooking speed.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/639.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Egg: {
    name: "Egg",
    description:
      "A resource collected by taking care of chickens.\n\nIt is used in a range of different crafting recipes.\n\nAt Sunflower Land, the egg came first.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/605.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Gold: {
    name: "Gold",
    description:
      "A resource collected by mining gold mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/604.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Sunstone: {
    name: "Sunstone",
    description:
      "A resource collected by mining sunstone mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/638.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Chicken: {
    name: "Chicken",
    description:
      "A resource used to collect eggs.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/606.gif",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Speed Chicken": {
    name: "Speed Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant increases the speed of egg production by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/610.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Egg Production Time",
        value: -10,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Pig: {
    name: "Pig",
    description:
      "A resource used to collect manure.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/608.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sheep: {
    name: "Sheep",
    description:
      "A resource used to collect wool.\n\nIt can be purchased at the barn.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/609.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fat Chicken": {
    name: "Fat Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant reduces the wheat required to feed a chicken by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/611.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Amount of Wheat to Feed Chickens",
        value: -10,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rich Chicken": {
    name: "Rich Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant adds a boost of 10% higher egg yield.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/612.gif",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Rooster: {
    name: "Rooster",
    description:
      "Rooster increases the chance of getting a mutant chicken 2x.\n\nYou can craft this item at the Goblin Farmer in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/613.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Chicken Chance",
        value: 100,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Honey: {
    name: "Honey",
    description: "Used to sweeten your cooking.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/614.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Magic Mushroom": {
    name: "Magic Mushroom",
    description: "Used to cook advanced recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/616.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Wild Mushroom": {
    name: "Wild Mushroom",
    description: "Used to cook basic recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/615.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Diamond: {
    name: "Diamond",
    description:
      "A resource collected by mining diamond mines.\n\nIt is used in a range of different crafting recipes.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/617.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Green Thumb": {
    name: "Green Thumb",
    description:
      "~~A skill that can be earned when reaching level 5 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/701.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Sell Price",
        value: 5,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Crop Chance",
        value: 10,
      },
    ],
  },
  "Barn Manager": {
    name: "Barn Manager",
    description:
      "~~A skill that can be earned when reaching level 5 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/702.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Animal Yield",
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
    image: "../public/erc1155/images/607.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Seed Specialist": {
    name: "Seed Specialist",
    description:
      "~~A skill that can be earned when reaching level 10 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/703.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Crop Chance",
        value: 10,
      },
    ],
  },
  Wrangler: {
    name: "Wrangler",
    description:
      "~~A skill that can be learnt when reaching level 10 in farming.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/704.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Animal Produce Time",
        value: -10,
      },
    ],
  },
  Lumberjack: {
    name: "Lumberjack",
    description:
      "~~A skill that can be earned when reaching level 5 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/705.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
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
      "~~A skill that can be earned when reaching level 5 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/706.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
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
      "~~A skill that can be earned when reaching level 10 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/708.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Gold Drops",
        value: 50,
      },
    ],
  },
  Coder: {
    name: "Coder",
    description:
      "~~A skill that can be earned by contributing code to the game.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/710.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Crop Yield",
        value: 10,
      },
    ],
  },
  Artist: {
    name: "Artist",
    description:
      "~~A skill that can be earned by contributing art to the game.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/709.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
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
      "~~A skill that can be earned when reaching level 10 in gathering.~~\n\n~~It can be minted only through gameplay.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/707.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Axe Strength",
        value: 200,
      },
    ],
  },
  "Discord Mod": {
    name: "Discord Mod",
    description:
      "~~A skill that can be earned by moderating Discord.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/712.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Wood Drops",
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
    image: "../public/erc1155/images/713.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Beta Pass": {
    name: "Beta Pass",
    description: "Gain early access to features for testing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/715.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Liquidity Provider": {
    name: "Liquidity Provider",
    description:
      "~~A skill that can be earned by providing liquidity.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/711.png",
    attributes: [
      { trait_type: "Boost", value: "Skill" },
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
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
    image: "../public/erc1155/images/802.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Australian Flag": {
    name: "Australian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/801.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Brazilian Flag": {
    name: "Brazilian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/803.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Indonesian Flag": {
    name: "Indonesian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/808.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Warrior: {
    name: "Warrior",
    description:
      "~~A skill earned by the top 10 warriors each week.~~ **Not Available**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/714.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "French Flag": {
    name: "French Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/806.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Finnish Flag": {
    name: "Finnish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/805.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Indian Flag": {
    name: "Indian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/809.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "German Flag": {
    name: "German Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/807.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Iranian Flag": {
    name: "Iranian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/810.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Italian Flag": {
    name: "Italian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/811.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Japanese Flag": {
    name: "Japanese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/812.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Moroccan Flag": {
    name: "Moroccan Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/813.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Chinese Flag": {
    name: "Chinese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/804.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Philippine Flag": {
    name: "Philippine Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/815.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dutch Flag": {
    name: "Dutch Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/814.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Polish Flag": {
    name: "Polish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/816.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Russian Flag": {
    name: "Russian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/818.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Saudi Arabian Flag": {
    name: "Saudi Arabian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/819.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Portuguese Flag": {
    name: "Portuguese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/817.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Spanish Flag": {
    name: "Spanish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/821.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Thai Flag": {
    name: "Thai Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/823.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Turkish Flag": {
    name: "Turkish Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/824.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "South Korean Flag": {
    name: "South Korean Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/820.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Ukrainian Flag": {
    name: "Ukrainian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/825.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Vietnamese Flag": {
    name: "Vietnamese Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/827.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "American Flag": {
    name: "American Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/826.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Canadian Flag": {
    name: "Canadian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/828.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Singaporean Flag": {
    name: "Singaporean Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/829.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sierra Leone Flag": {
    name: "Sierra Leone Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/831.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "British Flag": {
    name: "British Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/830.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Romanian Flag": {
    name: "Romanian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/832.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pirate Flag": {
    name: "Pirate Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/835.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mexican Flag": {
    name: "Mexican Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/837.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rainbow Flag": {
    name: "Rainbow Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/833.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dominican Republic Flag": {
    name: "Dominican Republic Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/838.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Algerian Flag": {
    name: "Algerian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/836.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Argentinian Flag": {
    name: "Argentinian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/839.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Flag": {
    name: "Sunflower Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/822.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Colombian Flag": {
    name: "Colombian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/842.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Malaysian Flag": {
    name: "Malaysian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/841.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Egg Basket": {
    name: "Egg Basket",
    description:
      "An item that starts the Easter Egg Hunt.\n\nYou have 7 days to collect the 7 eggs. Every few hours an egg may appear on your farm to collect. Limited edition item!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/901.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  "Red Egg": {
    name: "Red Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/902.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  "Blue Egg": {
    name: "Blue Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/903.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  "Yellow Egg": {
    name: "Yellow Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/904.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  "Pink Egg": {
    name: "Pink Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/905.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  "Purple Egg": {
    name: "Purple Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/906.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  "Orange Egg": {
    name: "Orange Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/907.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  "Lithuanian Flag": {
    name: "Lithuanian Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/840.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Green Egg": {
    name: "Green Egg",
    description:
      "A limited edition easter egg that can be found on your farm during Easter.\n\nCollect the 7 special eggs to mint an Easter surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/908.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Event" },
    ],
  },
  Observatory: {
    name: "Observatory",
    description:
      "A limited edition Observatory gained from completing the mission from Million on Mars x Sunflower Land crossover event.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/911.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP",
        value: 5,
      },
      { trait_type: "Boost", value: "XP" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Engine Core": {
    name: "Engine Core",
    description:
      "An exclusive event item for Million on Mars x Sunflower Land cross-over.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/910.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ancient Goblin Sword": {
    name: "Ancient Goblin Sword",
    description: "An Ancient Goblin Sword",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/914.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ancient Human Warhammer": {
    name: "Ancient Human Warhammer",
    description: "An Ancient Human Warhammer",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/915.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "War Bond": {
    name: "War Bond",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nWill you show your support?\n\nFor a limited time, the war collectors are offering rare War Bonds in exchange for resources. You can use these to buy rare items in Goblin Village.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/917.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rapid Growth": {
    name: "Rapid Growth",
    description:
      "A rare fertiliser. ~~Apply to your crops to grow twice as fast~~ Legacy Item",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/916.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Key": {
    name: "Sunflower Key",
    description: "A Sunflower Key",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/913.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Human War Point": {
    name: "Human War Point",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Human is providing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/919.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Easter Bunny": {
    name: "Easter Bunny",
    description:
      "A limited edition bunny that can be crafted by those who collect all 7 eggs in the Easter Egg Hunt.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/909.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Increase Carrot Yield",
        value: 20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Flag": {
    name: "Goblin Flag",
    description:
      "A limited edition flag to fly proudly on your farm\n\nYou can craft this item at the Goblin Tailor in the game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/834.gif",
    attributes: [
      { trait_type: "Purpose", value: "Flag" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Key": {
    name: "Goblin Key",
    description: "A Goblin Key",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/912.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin War Point": {
    name: "Goblin War Point",
    description:
      "A war is brewing in Sunflower Land and both sides are preparing resources to crush their enemies.\n\nHere you can view the support team Goblin is providing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/918.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Human War Banner": {
    name: "Human War Banner",
    description:
      "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Human cause.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/920.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Market: {
    name: "Market",
    description: "A market used to buy seeds and sell crops in game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1001.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Jack-o-lantern": {
    name: "Jack-o-lantern",
    description: "A Halloween special event item.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/923.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Crop": {
    name: "Golden Crop",
    description: "A shiny golden crop",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/924.gif",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fire Pit": {
    name: "Fire Pit",
    description: "A fire pit used to cook basic recipes in game.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1002.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tent: {
    name: "Tent",
    description:
      "Every Bumpkin needs a tent. Adding a tent to your land supports adding more Bumpkins (coming soon) to your land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1004.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Workbench: {
    name: "Workbench",
    description: "A workbench used to craft tools in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1003.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin War Banner": {
    name: "Goblin War Banner",
    description:
      "A war is brewing in Sunflower Land.\n\nThis banner represents an allegiance to the Goblin cause.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/921.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Town Center": {
    name: "Town Center",
    description: "Gather round the town center and hear the latest news!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1013.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Bakery: {
    name: "Bakery",
    description: "A bakery used to cook recipes in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1007.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Kitchen: {
    name: "Kitchen",
    description: "A kitchen used to cook recipes in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1008.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chef Apron": {
    name: "Chef Apron",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1101.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Price of cakes",
        value: 20,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Water Well": {
    name: "Water Well",
    description: "A water well to support more crops in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1005.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Deli: {
    name: "Deli",
    description: "A deli used to cook advanced recipes at Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1009.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Smoothie Shack": {
    name: "Smoothie Shack",
    description:
      "A Smoothie Shack is used to prepare juices in Sunflower Land.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1010.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Toolshed: {
    name: "Toolshed",
    description: "A Toolshed increases your tool stocks by 50%",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1011.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Warehouse: {
    name: "Warehouse",
    description: "A Warehouse increases your seed stocks by 20%",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1012.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Sunflower Amulet": {
    name: "Sunflower Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1103.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Sunflower yield",
        value: 10,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chef Hat": {
    name: "Chef Hat",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1102.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Amulet": {
    name: "Carrot Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1104.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Carrots grow time",
        value: 20,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beetroot Amulet": {
    name: "Beetroot Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1105.png",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Beetroot yield",
        value: 20,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Warrior Shirt": {
    name: "Warrior Shirt",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1107.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Green Amulet": {
    name: "Green Amulet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1106.png",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Crop Critical Hit Multiplier",
        value: 10,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Warrior Pants": {
    name: "Warrior Pants",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1109.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Skull Hat": {
    name: "Skull Hat",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1111.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Shield": {
    name: "Sunflower Shield",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1110.png",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Sunflower Seed Cost",
        value: 0,
      },
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "War Tombstone": {
    name: "War Tombstone",
    description: "R.I.P",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1113.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "War Skull": {
    name: "War Skull",
    description: "Decorate the land with the bones of your enemies.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1112.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hen House": {
    name: "Hen House",
    description: "A hen house used to support chickens.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1006.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Undead Rooster": {
    name: "Undead Rooster",
    description: "An unfortunate casualty of the war. 10% increased egg yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1114.gif",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Warrior Helmet": {
    name: "Warrior Helmet",
    description: "Legacy item, DO NOT BUY!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1108.png",
    attributes: [
      { trait_type: "Purpose", value: "Legacy" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Angel Bear": {
    description:
      "Time to transcend peasant farming. Harvest 1 million crops to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1207.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Apple Pie": {
    description: "Bumpkin Betty's famous recipe. Cook this at the bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/524.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Badass Bear": {
    description:
      "Nothing stands in your way. Chop 5,000 trees to unlock this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1208.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Basic Bear": {
    description: "A basic bear. Use this to craft advanced bears!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1204.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bear Trap": {
    description:
      "It's a trap! Unlock the high roller achievement to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1209.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Blueberry Jam": {
    description:
      "Goblins will do anything for this jam. You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/525.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Boiled Eggs": {
    description:
      "Boiled Eggs are great for breakfast. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/515.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Brilliant Bear": {
    description: "Pure brilliance! Reach lvl 20 to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1210.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bumpkin Broth": {
    description:
      "A perfect broth for a cold day. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/516.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Salad": {
    description:
      "Gotta keep your Bumpkin healthy! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/517.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbage Boy": {
    description: "Don't wake the baby!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/434.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Cabbage Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Cabbage Yield with Cabbage Girl placed",
        value: 0.5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Cabbage Girl": {
    description: "Don't wake the baby!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/435.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Cabbage Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Cauliflower Burger": {
    description:
      "Calling all cauliflower lovers! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/520.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chef Bear": {
    description:
      "Every chef needs a helping hand! Bake 13 cakes to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1205.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Christmas Bear": {
    description: "Santa's favourite.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1217.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Classy Bear": {
    description:
      "More SFL than you know what to do with it! Mine 500 gold rocks to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1211.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Construction Bear": {
    description:
      "Always build in a bear market. Build 10 buildings to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1206.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Farmer Bear": {
    description:
      "Nothing quite like a hard day's work! Harvest 10,000 crops to unlock this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1212.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rich Bear": {
    description:
      "A prized possession. Unlock the Bumpkin Billionaire achievement to claim this bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1214.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rainbow Artist Bear": {
    description: "The owner is a beautiful bear artist!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1218.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Bear": {
    description:
      "A Bear's cherished crop. Harvest 100,000 Sunflowers to unlock this bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1213.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Club Sandwich": {
    description:
      "Filled with Carrots and Roasted Sunflower Seeds. You can cook this at the Kitchen",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/521.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fermented Carrots": {
    description: "Got a surplus of carrots? You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/526.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin's Treat": {
    description:
      "Goblins go crazy for this stuff! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/518.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Honey Cake": {
    description: "A scrumptious cake! You can cook this at the Bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/527.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale & Mushroom Pie": {
    description:
      "A traditional Sapphiron recipe. You can cook this at the Bakery",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/528.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale Stew": {
    description:
      "A perfect Bumpkin Booster. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/529.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mashed Potato": {
    description: "My life is potato. You can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/519.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mushroom Jacket Potatoes": {
    description:
      "Cram them taters with what ya got! You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/530.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mushroom Soup": {
    description:
      "Warm your Bumpkin's soul. You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/531.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Reindeer Carrot": {
    description:
      "Rudolph can't stop eating them! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/534.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Roast Veggies": {
    description:
      "Even Goblins need to eat their veggies! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/522.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflower Crunch": {
    description:
      "Crunchy goodness. Try not to burn it! You can can cook these at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/533.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Orange Cake": {
    description:
      "Orange you glad we aren't cooking apples. You can can cook these at the Bakery.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/532.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Pancakes: {
    description:
      "A great start to a Bumpkins day. You can can cook these at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/523.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Apple Juice": {
    description:
      "A crisp refreshing beverage. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/535.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Orange Juice": {
    description:
      "OJ matches perfectly with a Club Sandwich. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/536.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Purple Smoothie": {
    description:
      "You can hardly taste the Cabbage. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/537.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Power Smoothie": {
    description:
      "Official drink of the Bumpkin Powerlifting Society. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/538.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Bumpkin Detox": {
    description:
      "Wash away the sins of last night. You can can prepare these at the Smoothie Shack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/539.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Potted Potato": {
    description:
      "Potato blood runs through your Bumpkin. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1215.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Potted Pumpkin": {
    description:
      "Pumpkins for Bumpkins. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1216.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Potted Sunflower": {
    description:
      "Brighten up your land. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1202.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "White Tulips": {
    description:
      "Keep the smell of goblins away. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1201.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  Cactus: {
    description:
      "Saves water and makes your farm look stunning! You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1203.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sand Shovel": {
    description:
      "There are rumours that the Bumpkin pirates hid their treasure somewhere. These shovels can be used to dig for treasure!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/310.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radical Radish": {
    description: "Radical! Grants a 3% chance to get +10 radishes on harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/439.gif",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Radish Critical Hit Amount",
        value: 10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Potent Potato": {
    description: "Potent! Grants a 3% chance to get +10 potatoes on harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/438.gif",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Potato Critical Hit Amount",
        value: 10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Peeled Potato": {
    description:
      "A prized possession. Discover a bonus potato 20% of harvests.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/433.gif",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Potato Critical Hit Amount",
        value: 1,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Stellar Sunflower": {
    description:
      "Stellar! Grants a 3% chance to get +10 sunflowers on harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/437.gif",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Sunflower Critical Hit Amount",
        value: 10,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Wood Nymph Wendy": {
    description: "Cast an enchantment to entice the wood fairies.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/436.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Magic Bean": {
    description:
      "Plant, wait and discover rare items, mutant crops & more surprises!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/115.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Christmas Snow Globe": {
    description:
      "Swirl the snow and watch it come to life. A Christmas collectible.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1219.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Clam Shell": {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1304.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Cucumber": {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1308.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Coral: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1303.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Crab: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1309.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Starfish: {
    description: "Find at Treasure Island ???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1306.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Immortal Pear": {
    description:
      "This long-lived pear ensures your fruit tree survives +1 bonus harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/441.gif",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Purpose", value: "Decoration" },
      {
        display_type: "boost_number",
        trait_type: "Extra Fruit Harvest",
        value: 1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lady Bug": {
    description:
      "An incredible bug that feeds on aphids. Improves Apple quality. +0.25 Apples each harvest",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/442.gif",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Apple Drops",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Squirrel Monkey": {
    description:
      "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around. 1/2 Orange Tree grow time.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/443.gif",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Orange Regenaration Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Black Bearry": {
    description:
      "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful! +1 Blueberry each Harvest",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/444.gif",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Blueberry Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Devil Bear": {
    description: "Better the Devil you know than the Devil you don't.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1220.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Ayam Cemani": {
    description:
      "The rarest chicken in Sunflower Land. This mutant adds a boost of +0.2 egg yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/445.gif",
    attributes: [
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.2,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Maneki Neko": {
    description:
      "The beckoning cat. Pull its arm and good luck will come. A special event item from Lunar New Year!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/446.gif",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_number",
        trait_type: "One free food per day",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Collectible Bear": {
    description: "A prized bear, still in mint condition!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1221.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Cyborg Bear": {
    description: "Hasta la vista, bear",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1222.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Red Envelope": {
    description:
      "Wow, you are lucky! An item from Lunar New Year special event.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/716.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Abandoned Bear": {
    description: "A bear that was left behind on the island.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1223.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lunar Calendar": {
    description:
      "Crops now follow the lunar cycle! 10% reduction in growth time.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/448.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dinosaur Bone": {
    description: "A Dinosaur Bone! What kind of creature was this?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1237.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Parasaur Skull": {
    description: "A skull from a parasaur!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1231.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "T-Rex Skull": {
    description: "A skull from a T-Rex! Amazing!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1225.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Bear": {
    description: "A goblin bear. It's a bit scary.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1234.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Bear Head": {
    description: "Spooky, but cool.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1232.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" }, // Tradable once Sold out
    ],
  },
  "Human Bear": {
    description: "A human bear. Even scarier than a goblin bear.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1238.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lifeguard Bear": {
    description: "Lifeguard Bear is here to save the day!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1229.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pirate Bear": {
    description: "Argh, matey! Hug me!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1233.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pirate Bounty": {
    description: "A bounty for a pirate. It's worth a lot of money.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1301.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pirate Cake": {
    description: "Great for Pirate themed birthday parties.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/540.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Skeleton King Staff": {
    description: "All hail the Skeleton King!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1228.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Snorkel Bear": {
    description: "Snorkel Bear loves to swim.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1230.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Whale Bear": {
    description:
      "It has a round, furry body like a bear, but with the fins, tail, and blowhole of a whale.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1239.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflower Coin": {
    description: "A coin made of sunflowers.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1226.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Wooden Compass": {
    description:
      "It may not be high-tech, but it will always steer you in the right direction, wood you believe it?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/925.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Turtle Bear": {
    description: "Turtley enough for the turtle club.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1224.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tiki Totem": {
    description: "The Tiki Totem adds 0.1 wood to every tree you chop.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/447.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Heart of Davy Jones": {
    description:
      "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/450.gif",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_number",
        trait_type: "Increase daily digs",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Heart Balloons": {
    description: "Use them as decorations for romantic occasions.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/451.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Flamingo: {
    description:
      "Represents a symbol of love's beauty standing tall and confident.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/452.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Blossom Tree": {
    description:
      "Its delicate petals symbolizes the beauty and fragility of love.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/453.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Genie Lamp": {
    description:
      "A magical lamp that contains a genie who will grant you three wishes.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/460.png",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_number",
        trait_type: "Grants Wishes",
        value: 3,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Love Letter": {
    description: "Convey feelings of love",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/717.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Treasure Map": {
    description:
      "An enchanted map that leads the holder to valuable treasure. +20% profit from beach bounty items.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/449.png",
    attributes: [
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Beach Bounty profit",
        value: 20,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Foliant: {
    description: "A book of spells.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1227.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Kale Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  Galleon: {
    description: "A toy ship, still in pretty good nick.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1235.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Pearl: {
    description: "Shimmers in the sun.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1302.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Pipi: {
    description: "Plebidonax deltoides, found in the Pacific Ocean.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1305.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Seaweed: {
    description: "Seaweed.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1307.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sand Drill": {
    description: "Drill deep for uncommon or rare treasure",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/311.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Block Buck": {
    description: "A valuable token in Sunflower Land!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/718.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Valentine Bear": {
    description:
      "A bear for those who love. Awarded to people who showed some love",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1240.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Easter Bear": {
    description: "A bear with bunny ears?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1236.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Easter Bush": {
    description: "What is inside?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1243.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Giant Carrot": {
    description:
      "A giant carrot stood, casting fun shadows, as rabbits gazed in wonder.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1244.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Iron Idol": {
    description: "The Idol adds 1 iron every time you mine iron.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/454.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Drops",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Bumpkin Roast": {
    description:
      "A traditional Bumpkin dish. You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/541.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Brunch": {
    description: "A traditional Goblin dish. You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/542.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fruit Salad": {
    description: "Fruit Salad. You can cook this at the Kitchen.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/543.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kale Omelette": {
    description: "A healthy breakfast. You can can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/544.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cabbers n Mash": {
    description:
      "Cabbages and Mashed Potatoes. You can can cook this at the Fire Pit.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/545.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fancy Fries": {
    description: "Fantastic Fries. You can cook this at the Deli.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/546.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Solar Flare Ticket": {
    description: "A ticket used during the Solar Flare Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/719.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dawn Breaker Ticket": {
    description: "A ticket used during the Dawn Breaker Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/720.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crow Feather": {
    description: "A ticket used during the Witches' Eve Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/725.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mermaid Scale": {
    description: "A ticket used during the Catch the Kraken Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/731.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Tulip Bulb": {
    description: "A ticket used during the Spring Blossom",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/737.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Scroll: {
    description: "A ticket used during the Clash of Factions Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/739.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Sunflower Supporter": {
    description: "A true supporter of the project",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/721.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Palm Tree": {
    description: "Tall, beachy, shady and chic, palm trees make waves sashay.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1241.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Beach Ball": {
    description: "Bouncy ball brings beachy vibes, blows boredom away.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1242.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Karkinos: {
    description:
      "Pinchy but kind, the crabby cabbage-boosting addition to your farm!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/455.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Cabbage Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Pablo The Bunny": {
    description: "The magical bunny that increases your carrot harvests",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/926.gif",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Carrot Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Crop Plot": {
    description: "A precious piece of soil used to plant crops.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/622.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fruit Patch": {
    description: "A bountiful piece of land used to plant fruit",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/623.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Flower Bed": {
    description: "A beautiful piece of land used to plant flowers",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/634.gif",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gold Rock": {
    description: "A scarce resource that can be used to mine gold",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/621.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Iron Rock": {
    description: "Wow, a shiny iron rock. Used to mine iron ore",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/620.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Stone Rock": {
    description: "A staple mineral for your mining journey",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/619.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crimstone Rock": {
    description: "A rare resource used to mine crimstones",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/635.gif",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunstone Rock": {
    description: "A radiant gem, essential for advanced crafting.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/637.gif",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Oil Reserve": {
    description: "A valuable resource used to mine oil",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/640.gif",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Boulder: {
    description: "???",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tree: {
    description: "Nature's most precious resource. Used to collect wood",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/618.gif",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Basic Land": {
    description: "Build your farming empire with this basic piece of land",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/625.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dirt Path": {
    description: "Keep your farmer boots clean and travel on paths!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1245.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Bush: {
    description: "Keep your Bumpkins happy with these bushy bushes.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1246.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Fence: {
    description: "Those cheeky chickens won't be escaping anymore!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1247.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Shrub: {
    description:
      "It aint much, but it adds some green to your beautiful island",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1248.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Pine Tree": {
    description: "Standing tall and mighty, a needle-clad dream.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1270.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Stone Fence": {
    description: "Embrace the timeless elegance of a stone fence.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1271.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Field Maple": {
    description:
      "A petite charmer that spreads its leaves like a delicate green canopy.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1267.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Maple": {
    description: "Fiery foliage and a heart full of autumnal warmth.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1268.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Maple": {
    description: "Radiating brilliance with its shimmering golden leaves.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1269.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dawn Breaker Banner": {
    description:
      "A mysterious darkness is plaguing Sunflower Land. The mark of a participant in the Dawn Breaker Season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/723.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Solar Flare Banner": {
    description:
      "The temperature is rising in Sunflower Land. The mark of a participant in our inaugural season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/722.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Witches' Eve Banner": {
    description:
      "The season of the witch has begun. The mark of a participant in the Witches' Eve Season.\n\nGrants 2 extra crow feathers per feather delivery during Witches' Eve Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/724.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Crow Feathers from Deliveries",
        value: 2,
      },
    ],
  },
  "Catch the Kraken Banner": {
    description:
      "The Kraken is here! The mark of a participant in the Catch the Kraken Season.\n\nGrants 2 extra mermaid scales per mermaid scale delivery during Catch the Kraken Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/730.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Mermaid Scales from Deliveries",
        value: 2,
      },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Catch the Kraken Season",
        value: 10,
      },
    ],
  },
  "Spring Blossom Banner": {
    description: "",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/736.gif",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Tulip from Deliveries",
        value: 2,
      },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Spring Blossom Season",
        value: 10,
      },
    ],
  },
  "Clash of Factions Banner": {
    description: "",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/738.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Clash of Factions Season",
        value: 10,
      },
    ],
  },
  "Lifetime Farmer Banner": {
    description: "Gives lifetime access to all seasons and VIP access.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/740.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP",
        value: 10,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Luminous Lantern": {
    description: "A bright paper lantern that illuminates the way.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1249.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Radiance Lantern": {
    description: "A radiant paper lantern that shines with a powerful light.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1250.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Ocean Lantern": {
    description:
      "A wavy paper lantern that sways with the bobbing of the tide.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1265.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Aurora Lantern": {
    description:
      "A paper lantern that transforms any space into a magical wonderland.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1251.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Solar Lantern": {
    description:
      "Harnessing the vibrant essence of sunflowers, the Solar Lantern emanates a warm and radiant glow, reminiscent of a blossoming field under the golden sun.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1272.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bonnie's Tombstone": {
    description:
      "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1252.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Chestnut Fungi Stool": {
    description:
      "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1253.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crimson Cap": {
    description:
      "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1254.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Dawn Umbrella Seat": {
    description:
      "Keep those Eggplants dry during those rainy days with the Dawn Umbrella Seat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1255.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Eggplant Grill": {
    description:
      "Get cooking with the Eggplant Grill, perfect for any outdoor meal.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1256.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Giant Dawn Mushroom": {
    description:
      "The Giant Dawn Mushroom is a majestic and magical addition to any farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1257.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Grubnash's Tombstone": {
    description: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1258.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mahogany Cap": {
    description:
      "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1259.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Shroom Glow": {
    description:
      "Illuminate your farm with the enchanting glow of Shroom Glow.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1263.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Toadstool Seat": {
    description: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1260.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Clementine: {
    description:
      "The Clementine Gnome is a cheerful companion for your farming adventures.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1261.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cobalt: {
    description:
      "The Cobalt Gnome adds a pop of color to your farm with his vibrant hat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1262.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mushroom House": {
    description:
      "A whimsical, fungi-abode where the walls sprout with charm and even the furniture has a 'spore-tacular' flair!",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/456.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Mushroom Yield",
        value: 0.2,
      },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Purple Trail": {
    description:
      "Leave your opponents in a trail of envy with the mesmerizing and unique Purple Trail",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/457.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Eggplant Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Obie: {
    description: "A fierce eggplant soldier",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/458.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Eggplant Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Maximus: {
    description: "Squash the competition with plump Maximus",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/459.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Eggplant Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Hoot: {
    description: "Hoot hoot! Have you solved my riddle yet?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/461.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Radish, Wheat, Kale & Rice", // Updated to include Rice
        value: 0.5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Genie Bear": {
    description: "Exactly what I wished for!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1264.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Basic Scarecrow": {
    description: "Choosy defender of your farm's VIP (Very Important Plants)",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/462.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_percentage",
        trait_type: "Basic Crop Growth Time",
        value: -20,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 9,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Iron Compass": {
    description:
      "Iron out your path to treasure! This compass is 'attract'-ive, and not just to the magnetic North!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/927.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Emerald Turtle": {
    description:
      "The Emerald Turtle gives +0.5 to any minerals you mine within its Area of Effect.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/463.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.5,
      },
      {
        display_type: "boost_number",
        trait_type: "Minerals Affected",
        value: 8,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tin Turtle": {
    description:
      "The Tin Turtle gives +0.1 to Stones you mine within its Area of Effect.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/464.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Stone Drops",
        value: 0.1,
      },
      {
        display_type: "boost_number",
        trait_type: "Stone Affected",
        value: 8,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Old Bottle": {
    description: "Antique pirate bottle, echoing tales of high seas adventure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/928.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Beta Bear": {
    description: "A bear found during special testing events",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1266.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Bale: {
    description:
      "A poultry's favorite neighbor, providing a cozy retreat for chickens",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/465.png",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.2,
      },
      {
        display_type: "boost_number",
        trait_type: "Chickens Affected",
        value: 12,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sir Goldensnout": {
    description:
      "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/466.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.5,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 12,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Scary Mike": {
    description:
      "The veggie whisperer and champion of frightfully good harvests!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/467.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Medium Crop Yield",
        value: 0.2,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 9,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Betty Lantern": {
    description: "It looks so real! I wonder how they crafted this.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1273.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Goblin Lantern": {
    description: "A scary looking lantern",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1276.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bumpkin Lantern": {
    description: "Moving closer you hear murmurs of a living Bumpkin...creepy!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1274.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Eggplant Bear": {
    description: "The mark of a generous eggplant whale.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1275.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Dawn Flower": {
    description:
      "Embrace the radiant beauty of the Dawn Flower as its delicate petals shimmer with the first light of day.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1277.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Laurie the Chuckle Crow": {
    description:
      "With her disconcerting chuckle, she shooes peckers away from your crops!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/468.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Advanced Crop Yield",
        value: 0.2,
      },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 9,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Freya Fox": {
    description:
      "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/469.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Pumpkin Yield",
        value: 0.5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Gold Pass": {
    description:
      "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/726.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "El Pollo Veloz": {
    description: "Give me those eggs, fast! 4 hour speed boost on egg laying.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/470.gif",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Egg Production Time (hours)",
        value: -4,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Poppy: {
    description: "The mystical corn kernel. +0.1 Corn per harvest.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/471.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Corn Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Grain Grinder": {
    description:
      "Grind your grain and experience a delectable surge in Cake XP.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/472.png",
    attributes: [
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Cake XP",
        value: 20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Kernaldo: {
    description: "The magical corn whisperer.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/473.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Corn Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Queen Cornelia": {
    description:
      "Command the regal power of Queen Cornelia and experience a magnificent Area of Effect boost to your corn production. +1 Corn.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/474.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Area of Effect" },
      {
        display_type: "boost_number",
        trait_type: "Increase Corn Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Plots Affected",
        value: 10,
      },
    ],
  },
  Candles: {
    description:
      "Enchant your farm with flickering spectral flames during Witches' Eve.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1278.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Haunted Stump": {
    description: "Summon spirits and add eerie charm to your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1279.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Spooky Tree": {
    description: "A hauntingly fun addition to your farm's decor!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1280.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Observer: {
    description:
      "A perpetually roving eyeball, always vigilant and ever-watchful!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1285.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Crow Rock": {
    description: "A crow perched atop a mysterious rock.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1286.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Mini Corn Maze": {
    description:
      "A memento of the beloved maze from the 2023 Witches' Eve season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1287.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Bumpkin ganoush": {
    description: "Zesty roasted eggplant spread.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/547.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Cornbread: {
    description: "Hearty golden farm-fresh bread.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/548.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Eggplant Cake": {
    description: "Sweet farm-fresh dessert surprise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/549.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Popcorn: {
    description: "Classic homegrown crunchy snack.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/550.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Giant Cabbage": {
    description: "A giant cabbage!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1281.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Giant Potato": {
    description: "A giant potato!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1282.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Giant Pumpkin": {
    description: "A giant pumpkin!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1283.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lab Grown Carrot": {
    description: "A lab grown carrot! +0.2 Carrot Yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/475.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Carrot Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lab Grown Pumpkin": {
    description: "A lab grown pumpkin! +0.3 Pumpkin Yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/476.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Pumpkin Yield",
        value: 0.3,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lab Grown Radish": {
    description: "A lab grown radish! +0.4 Radish Yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/477.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Radish Yield",
        value: 0.4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potion Ticket": {
    description: "A Potion Ticket!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/727.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Adirondack Potato": {
    description: "A rugged spud, Adirondack style!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1405.png",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Black Magic": {
    description: "A dark and mysterious flower!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1401.png",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Helios": {
    description: "Sun-kissed grandeur!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1402.png",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Chiogga: {
    description: "A rainbow beet!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1403.png",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Cauliflower": {
    description: "A regal purple cauliflower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1404.png",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Warty Goblin Pumpkin": {
    description: "A whimsical, wart-covered pumpkin",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1406.png",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Carrot": {
    description: "A pale carrot with pale roots",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1407.png",
    attributes: [
      { trait_type: "Purpose", value: "Exotic" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Emerald Compass": {
    description:
      "Guide your way through the lush mysteries of life! This compass doesn't just point North, it points towards opulence and grandeur!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/929.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bud Ticket": {
    description:
      "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/728.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bud Seedling": {
    description: "A seedling that was exchanged for a bud NFT",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/729.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Town Sign": {
    description: "Show your farm ID with pride!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1284.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Crow": {
    description: "A mysterious and ethereal white crow.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1288.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Compost Bin": {
    description:
      "Creates a nurturing Sprout Mix compost and unearths Earthworm bait for your fishing adventures!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1014.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Turbo Composter": {
    description:
      "Produces a bountiful Fruitful Blend compost and discovers Grub bait eager to join you in fishing!", // Rapid Root has been moved here on testnet
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1015.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Premium Composter": {
    description:
      "Generates a robust Rapid Root compost mix and reveals Red Wiggler bait for the perfect fishing expedition!", // Fruitful Blend has been moved here on testnet
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1016.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Earthworm: {
    description: "A wriggly worm used to catch fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/626.png",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Grub: {
    description: "A juicy grub used to catch fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/627.png",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Wiggler": {
    description: "A red wiggler used to catch fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/628.png",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fishing Lure": {
    description: "A fishing lure! Great for catching big fish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/632.png",
    attributes: [
      { trait_type: "Purpose", value: "Bait" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sprout Mix": {
    description: "Sprout Mix increases your crop yield by +0.2",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/629.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Fertiliser" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Fruitful Blend": {
    description: "This compost boosts each fruit yield by +0.1",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/630.png",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Purpose", value: "Fertiliser" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Rapid Root": {
    description: "Rapid Root reduces crop growth time by 50%",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/631.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Purpose", value: "Fertiliser" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Anchovy: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1501.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Butterflyfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1502.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Blowfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1503.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Clownfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1504.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Bass": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1505.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Horse": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1506.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Horse Mackerel": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1507.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Squid: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1508.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Snapper": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1509.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Moray Eel": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1510.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Olive Flounder": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1511.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Napoleanfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1512.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Surgeonfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1513.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Zebra Turkeyfish": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1514.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Ray: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1515.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Hammerhead shark": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1516.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tuna: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1517.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mahi Mahi": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1518.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Marlin": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1519.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Oarfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1520.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Football fish": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1521.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sunfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1522.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Coelacanth: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1523.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Whale Shark": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1524.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Barred Knifejaw": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1525.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Saw Shark": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1526.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Shark": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1527.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Twilight Anglerfish": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1528.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Starlight Tuna": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1529.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radiant Ray": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1530.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Yield",
        value: 0.1,
      },
    ],
  },
  "Phantom Barracuda": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1531.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gilded Swordfish": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1532.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Gold Yield",
        value: 0.1,
      },
    ],
  },
  "Crimson Carp": {
    description: "A rare, vibrant jewel of the Spring waters.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1537.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone Yield",
        value: 0.05,
      },
    ],
  },
  "Battle Fish": {
    description: "The rare armored swimmer of faction season!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1538.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil Yield",
        value: 0.05,
      },
    ],
  },
  Chowder: {
    description:
      "Sailor's delight in a bowl! Dive in, there's treasure inside!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/551.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Gumbo: {
    description: "A pot full of magic! Every spoonful's a Mardi Gras parade!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/552.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fermented Fish": {
    description: "Daring delicacy! Unleash the Viking within with every bite!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/553.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lifeguard Ring": {
    description: "Stay afloat with style, your seaside savior!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1289.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Surfboard: {
    description: "Ride the waves of wonder, beach bliss on board!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1290.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hideaway Herman": {
    description: "Herman's here to hide, but always peeks for a party!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1291.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Shifty Sheldon": {
    description: "Sheldon's sly, always scuttling to the next sandy surprise!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1292.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tiki Torch": {
    description: "Light the night, tropical vibes burning bright!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1293.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Beach Umbrella": {
    description: "Shade, shelter, and seaside chic in one sunny setup!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1294.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sapo Docuras": {
    description: "A real treat this halloween!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1295.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sapo Travessuras": {
    description: "Oh oh....someone was naughty!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1296.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Walrus: {
    description:
      "With his trusty tusks and love for the deep, he'll ensure you reel in an extra fish every time",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/478.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fish Yield",
        value: 1,
      },
      { trait_type: "Boost", value: "Fish" },
    ],
  },
  Alba: {
    description:
      "With her keen instincts, she ensures you get a little extra splash in your catch. 50% chance of +1 Basic Fish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/479.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_percentage",
        trait_type: "Chance of getting an extra Basic Fish",
        value: 50,
      },
      { trait_type: "Boost", value: "Fish" },
    ],
  },
  "Knowledge Crab": {
    description:
      "The Knowledge Crab doubles your Sprout Mix effect, making your soil treasures as rich as sea plunder!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/480.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Sprout Mix Effect",
        value: 100,
      },
      { trait_type: "Boost", value: "Crop" },
    ],
  },
  Anchor: {
    description:
      "Drop anchor' with this nautical gem, making every spot seaworthy and splash-tastically stylish!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/481.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },

  "Rubber Ducky": {
    description:
      "Float on fun with this classic quacker, bringing bubbly joy to every corner!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/483.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Kraken Head": {
    description:
      "Dive into deep-sea mystery! This head teases tales of ancient ocean legends and watery wonders.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/484.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Kraken Tentacle": {
    description: "Protect the beach and catch the Kraken!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1533.png",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Banana Chicken": {
    description: "A chicken that boosts bananas. What a world we live in.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/488.png",
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Banana Drops",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Crim Peckster": {
    description: "A gem detective with a knack for unearthing Crimstones.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/494.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Knight Chicken": {
    description: "A strong and noble chicken boosting your oil yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/500.gif",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Skill Shrimpy": {
    description:
      "Shrimpy's here to help! He'll ensure you get that extra XP from fish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/485.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Fish XP",
        value: 20,
      },
    ],
  },

  "Soil Krabby": {
    description:
      "Speedy sifting with a smile! Enjoy a 10% composter speed boost with this crustaceous champ.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/486.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Composter Compost Time",
        value: -10,
      },
    ],
  },

  Nana: {
    description:
      "This rare beauty is a surefire way to boost your banana harvests.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/487.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Banana Growth Time",
        value: -10,
      },
    ],
  },

  "Banana Blast": {
    description: "The ultimate fruity fuel for those with a peel for power!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/554.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Time Warp Totem": {
    description:
      "The Time Warp Totem temporarily boosts your cooking, crops, trees & mineral time. Make the most of it!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1297.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking, Crop, Tree and Mineral Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Community Coin": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/732.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Arcade Token": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Bumpkin Nutcracker": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1298.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },
  "Festive Tree": {
    description:
      "A festive tree that can be attained each festive season. I wonder if it is big enough for santa to see?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1299.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Purpose", value: "Decoration" },
    ],
  },

  "Grinx's Hammer": {
    description:
      "The magical hammer from Grinx, the legendary Goblin Blacksmith. Halves expansion natural resource requirements.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/489.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Expansion Cost Reduction",
        value: -50,
      },
    ],
  },
  Angelfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1534.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Parrotfish: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1536.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Halibut: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1535.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Festive Fox": {
    description: "The blessing of the White Fox inhabits the generous farms.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2001.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  House: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1017.png",

    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  // TODO feat/manor
  Manor: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1017.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Crop Machine": {
    description:
      "Technology arrives at the farm! Crop Machine is here to help!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1020.png",

    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Rug: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2002.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Wardrobe: {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2003.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Farmhand Coupon": {
    description: "?",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/728.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Farmhand: {
    description: "A helpful farmhand to assist you with your farm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/735.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Beehive: {
    name: "Beehive",
    description:
      "A bustling beehive, producing honey from actively growing flowers; 10% chance upon Honey harvest to summon a bee swarm which will pollinate all growing crops with a +0.2 boost!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/633.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource Node" },
      { trait_type: "Tradable", value: "No" },
      // Bee Swarm Boost
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Critical Hit Chance",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Crop Critical Hit Amount",
        value: 0.2,
      },
    ],
  },
  "Red Pansy": {
    name: "Red Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/218.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Pansy": {
    name: "Yellow Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/219.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Pansy": {
    name: "Purple Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/220.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Pansy": {
    name: "White Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/221.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Pansy": {
    name: "Blue Pansy",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/222.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Cosmos": {
    name: "Red Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/223.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Cosmos": {
    name: "Yellow Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/224.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Cosmos": {
    name: "White Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/225.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Cosmos": {
    name: "White Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/226.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Cosmos": {
    name: "Blue Cosmos",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/227.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Balloon Flower": {
    name: "Red Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/228.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Balloon Flower": {
    name: "Yellow Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/229.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Balloon Flower": {
    name: "Purple Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/230.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Balloon Flower": {
    name: "White Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/231.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Balloon Flower": {
    name: "Blue Balloon Flower",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/232.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Carnation": {
    name: "Red Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/233.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Carnation": {
    name: "Yellow Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/234.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Carnation": {
    name: "Purple Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",

    image: "../public/erc1155/images/235.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Carnation": {
    name: "White Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/236.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Carnation": {
    name: "Blue Carnation",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/237.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Humming Bird": {
    name: "Humming Bird",
    description:
      "A tiny jewel of the sky, the Humming Bird flits with colorful grace.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/490.png",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Critical Hit Chance",
        value: 20,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Flower Amount",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Queen Bee": {
    name: "Queen Bee",
    description:
      "Majestic ruler of the hive, the Queen Bee buzzes with regal authority.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/491.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Honey Production Speed",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Flower Fox": {
    name: "Flower Fox",
    description:
      "The Flower Fox, a playful creature adorned with petals, brings joy to the garden.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/492.png",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Growth Time",
        value: -10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hungry Caterpillar": {
    name: "Hungry Caterpillar",
    description:
      "Munching through leaves, the Hungry Caterpillar is always ready for a tasty adventure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/493.png",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_number",
        trait_type: "Cost of Flower Seeds",
        value: 0,
      },
      { trait_type: "Tradable", value: "Yes" }, // Tradable Post Season
    ],
  },
  "Sunrise Bloom Rug": {
    name: "Sunrise Bloom Rug",
    description:
      "Step onto the Sunrise Bloom Rug, where petals dance around a floral sunrise.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2004.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Flower Rug": {
    name: "Flower Rug",
    description: "Add a touch of nature's elegance to your home.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2011.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Tea Rug": {
    name: "Tea Rug",
    description:
      "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2012.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Green Field Rug": {
    name: "Green Field Rug",
    description:
      "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2013.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Blossom Royale": {
    name: "Blossom Royale",
    description:
      "The Blossom Royale, a giant flower in vibrant blue and pink, stands in majestic bloom.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2005.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Rainbow: {
    name: "Rainbow",
    description:
      "A cheerful Rainbow, bridging sky and earth with its colorful arch.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2006.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Enchanted Rose": {
    name: "Enchanted Rose",
    description:
      "The Enchanted Rose, a symbol of eternal beauty, captivates with its magical allure.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2007.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Flower Cart": {
    name: "Flower Cart",
    description:
      "The Flower Cart, brimming with blooms, is a mobile garden of floral delights.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2008.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Capybara: {
    name: "Capybara",
    description:
      "The Capybara, a laid-back friend, enjoys lazy days by the water's edge.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2009.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Prism Petal": {
    name: "Prism Petal",
    description:
      "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/238.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Celestial Frostbloom": {
    name: "Celestial Frostbloom",
    description:
      "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/239.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Primula Enigma": {
    name: "Primula Enigma",
    description:
      "Wow! What a beautiful flower! I think this one is worthy of placing on your farm",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/240.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Blossombeard: {
    description:
      "The Blossombeard Gnome is a powerful companion for your farming adventures.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2010.png",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Experience",
        value: 10,
      },
    ],
  },

  "Desert Gnome": {
    description:
      "The Blossombeard Gnome is a powerful companion for your farming adventures.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2017.png",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -10,
      },
    ],
  },
  "Red Daffodil": {
    name: "Red Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/241.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Daffodil": {
    name: "Yellow Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/242.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Daffodil": {
    name: "Purple Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/243.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Daffodil": {
    name: "White Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/244.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Daffodil": {
    name: "Blue Daffodil",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/245.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Lotus": {
    name: "Red Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/246.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Yellow Lotus": {
    name: "Yellow Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/247.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Purple Lotus": {
    name: "Purple Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/248.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Lotus": {
    name: "White Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/249.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Lotus": {
    name: "Blue Lotus",
    description: "A flower",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/250.png",
    attributes: [
      { trait_type: "Purpose", value: "Flower" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Earn Alliance Banner": {
    name: "Earn Alliance Banner",
    description:
      "A special event banner. Gave a starter bonus of 2x XP in February 2024 for players on the beginner island.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/930.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Treasure Key": {
    name: "Treasure Key",
    description: "A magic key that can unlock rewards in the plaza",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/931.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Luxury Key": {
    name: "Luxury Key",
    description: "A magic key that can unlock rewards in the plaza",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/932.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Rare Key": {
    name: "Rare Key",
    description: "A magic key that can unlock rewards in the plaza",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/933.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Prize Ticket": {
    name: "Prize Ticket",
    description: "A free entry into the end of season giveaway",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/934.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Baby Panda": {
    name: "Baby Panda",
    description:
      "A baby panda earned during the Gas Hero collaboration event. Gives new players double XP during March 2024.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/935.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Baozi: {
    name: "Bazoi",
    description:
      "A delicious steamed bun. A special event item from Lunar New Year 2024.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/936.gif",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Community Egg": {
    name: "Community Egg",
    description: "Wow, you must really care about the community",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/937.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Hungry Hare": {
    name: "Hungry Hare",
    description:
      "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/938.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Fermented Carrots XP",
        value: 100,
      },
    ],
  },
  "Sunflorian Faction Banner": {
    name: "Sunflorian Faction Banner",
    description:
      "A banner that shows your allegiance to the Sunflorian Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/941.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Faction Banner": {
    name: "Goblin Faction Banner",
    description: "A banner that shows your allegiance to the Goblin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/942.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Faction Banner": {
    name: "Nightshades Faction Banner",
    description:
      "A banner that shows your allegiance to the Nightshade Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/940.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Faction Banner": {
    name: "Bumpkin Faction Banner",
    description: "A banner that shows your allegiance to the Bumpkin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/939.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Turbo Sprout": {
    name: "Turbo Sprout",
    description: "An engine that boosts the Green House's growth speed by 50%.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/495.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time in Greenhouse",
        value: -50,
      },
    ],
  },

  Soybliss: {
    name: "Soybliss",
    description: "A unique soy creature that gives +1 Soybean yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/496.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Soybean Yield",
        value: 1,
      },
    ],
  },

  "Grape Granny": {
    name: "Grape Granny",
    description: "Wise matriarch nurturing grapes to flourish with +1 yield.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/497.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Grape Yield",
        value: 1,
      },
    ],
  },

  "Royal Throne": {
    name: "Royal Throne",
    description: "A throne fit for the highest ranking farmer.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/498.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Lily Egg": {
    name: "Lily Egg",
    description: "Tiny delight, grand beauty, endless wonder.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/499.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  Goblet: {
    name: "Goblet",
    description: "A goblet that holds the finest of wines.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/482.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Fancy Rug": {
    name: "Fancy Rug",
    description: "A rug that adds a touch of elegance to any room.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2014.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Clock: {
    name: "Clock",
    description:
      "A Clock that keeps time with the gentle ticking of the seasons.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2015.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Vinny: {
    name: "Vinny",
    description: "Vinny, a friendly grapevine, is always ready for a chat.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2016.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Increase Grape Yield",
        value: +0.25,
      },
    ],
  },
  "Beetroot Blaze": {
    name: "Beetroot Blaze",
    description: "A spicy beetroot-infused magic mushroom dish",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/555.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rapid Roast": {
    name: "Rapid Roast",
    description: "When you are in a hurry",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/556.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Shroom Syrup": {
    name: "Shroom Syrup",
    description: "The essence of bees and enchanted fungi",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/557.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gaucho Rug": {
    name: "Gaucho Rug",
    description: "A commerative rug to support South Brazil.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
    image: "../public/erc1155/images/2018.png",
  },
  "Bullseye Board": {
    name: "Bullseye Board",
    description: "Hit the mark every time.!",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2019.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Chess Rug": {
    name: "Chess Rug",
    description: "Checkmate.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2020.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  Cluckapult: {
    name: "Cluckapult",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2021.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Golden Gallant": {
    name: "Golden Gallant",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2022.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Golden Garrison": {
    name: "Golden Garrison",
    description:
      "Defend your territory in style with this shimmering garrison, a true fortress of flair.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2023.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Golden Guardian": {
    name: "Golden Guardian",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2024.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Novice Knight": {
    name: "Novice Knight",
    description: "Every move is an adventure.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2025.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Regular Pawn": {
    name: "Regular Pawn",
    description:
      "Small but mighty! This pawn may just make a big move in your collection.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2026.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Rookie Rook": {
    name: "Rookie Rook",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2027.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Silver Sentinel": {
    name: "Silver Sentinel",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2028.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Silver Squire": {
    name: "Silver Squire",
    description: "Add some shine to your collection.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2029.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Silver Stallion": {
    name: "Silver Stallion",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2030.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Trainee Target": {
    name: "Trainee Target",
    description:
      "Every champion starts somewhere! Perfect your aim with the Trainee Target.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2031.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Twister Rug": {
    name: "Twister Rug",
    description:
      "Twist, turn, and tie your decor together with this playful rug.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2032.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Battlecry Drum": {
    name: "Battlecry Drum",
    description: "",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2033.png`,
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Grape Seed": {
    name: "Grape Seed",
    description: "A zesty and desired fruit.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/125.png`,
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Olive Seed": {
    name: "Olive Seed",
    description: "A luxury for advanced farmers.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/126.png`,
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Rice Seed": {
    name: "Rice Seed",
    description: "Perfect for rations...",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/127.png`,
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  Grape: {
    name: "Grape",
    description: "A zesty and desired fruit.",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/252.png`,
    attributes: [{ trait_type: "Purpose", value: "Crop" }],
  },
  Olive: {
    name: "Olive",
    description: "A luxury for advanced farmers.",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/253.png`,
    attributes: [{ trait_type: "Purpose", value: "Crop" }],
  },
  Rice: {
    name: "Rice",
    description: "Perfect for rations...",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/254.png`,
    attributes: [{ trait_type: "Purpose", value: "Seed" }],
  },
  "Carrot Juice": {
    name: "Carrot Juice",
    description: "Refreshing drink from farm-fresh carrots",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/558.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Seafood Basket": {
    name: "Seafood Basket",
    description: "A bountiful basket of fresh ocean delights",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/559.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Fish Burger": {
    name: "Fish Burger",
    description: "Succulent burger made with freshly caught fish",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/560.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Fish n Chips": {
    name: "Fish n Chips",
    description: "Crispy chips paired with tender fish fillets",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/561.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Fish Omelette": {
    name: "Fish Omelette",
    description: "Fluffy omelette with a flavorful fish filling",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/562.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Fried Calamari": {
    name: "Fried Calamari",
    description: "Crispy calamari rings, a seafood delight",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/563.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Fried Tofu": {
    name: "Fried Tofu",
    description: "Crispy tofu bites, a vegetarian favorite",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/564.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Grape Juice": {
    name: "Grape Juice",
    description: "Sweet and refreshing juice from sun-ripened grapes",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/565.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Ocean's Olive": {
    name: "Ocean's Olive",
    description: "Savor the taste of the sea with these ocean-infused olives",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/566.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Quick Juice": {
    name: "Quick Juice",
    description: "A swift and energizing juice for busy days",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/567.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Rice Bun": {
    name: "Rice Bun",
    description: "Soft buns made with rice flour, perfect for snacking",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/568.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Slow Juice": {
    name: "Slow Juice",
    description: "Slowly pressed juice for a burst of natural flavors",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/569.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Steamed Red Rice": {
    name: "Steamed Red Rice",
    description: "Nutritious red rice, steamed to perfection",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/570.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Sushi Roll": {
    name: "Sushi Roll",
    description: "Delicious sushi rolls filled with fresh ingredients",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/571.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "The Lot": {
    name: "The Lot",
    description: "A medley of fruits for the adventurous palate",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/572.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  "Tofu Scramble": {
    name: "Tofu Scramble",
    description: "Scrambled tofu with a mix of vegetables, a hearty breakfast",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/573.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  Antipasto: {
    name: "Antipasto",
    description: "A selection of savory bites to start your meal",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/574.png",
    attributes: [{ trait_type: "Purpose", value: "Consumable" }],
  },
  Greenhouse: {
    name: "Greenhouse",
    description: "A safehaven for sensitive crops",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/1019.png`,
    attributes: [{ trait_type: "Purpose", value: "Building" }],
  },
  "Rice Panda": {
    name: "Rice Panda",
    description: "A smart panda never forgets to water the rice.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2034.png",
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
      {
        display_type: "boost_number",
        trait_type: "Increase Rice Yield",
        value: 0.25,
      },
    ],
  },

  "Bumpkin Emblem": {
    name: "Bumpkin Emblem",
    description:
      "A symbol of the Bumpkin Faction. Show your support for the Bumpkin Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/742.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },

  "Goblin Emblem": {
    name: "Goblin Emblem",
    description:
      "A symbol of the Goblin Faction. Show your support for the Goblin Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/741.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },

  "Nightshade Emblem": {
    name: "Nightshade Emblem",
    description:
      "A symbol of the Nightshade Faction. Show your support for the Nightshade Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/744.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },

  "Sunflorian Emblem": {
    name: "Sunflorian Emblem",
    description:
      "A symbol of the Sunflorian Faction. Show your support for the Sunflorian Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/743.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  Mark: {
    name: "Mark",
    description: "Currency of the Factions. Use this in the Marks Shop.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/745.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Benevolence Flag": {
    name: "Benevolence Flag",
    description:
      "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2035.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Devotion Flag": {
    name: "Devotion Flag",
    description:
      "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2036.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Generosity Flag": {
    name: "Generosity Flag",
    description:
      "For players who have donated substantial resources to the Goblins.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2037.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Splendor Flag": {
    name: "Splendor Flag",
    description:
      "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2037.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Jelly Lamp": {
    name: "Jelly Lamp",
    description:
      "A decorative lamp that emits a light that emits a light that emits a light.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2039.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Paint Can": {
    name: "Paint Can",
    description: "A can of paint found during the Festival of Colors.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2040.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sunflorian Throne": {
    name: "Sunflorian Throne",
    description: "A throne fit for a Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2041.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Nightshade Throne": {
    name: "Nightshade Throne",
    description: "A throne fit for a Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2042.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Goblin Throne": {
    name: "Goblin Throne",
    description: "A throne fit for a Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2043.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bumpkin Throne": {
    name: "Bumpkin Throne",
    description: "A throne fit for a Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2044.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Golden Sunflorian Egg": {
    name: "Golden Sunflorian Egg",
    description: "A jewelled egg created by the House of Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2045.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Goblin Mischief Egg": {
    name: "Goblin Mischief Egg",
    description: "A jewelled egg created by the House of Goblin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2046.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bumpkin Charm Egg": {
    name: "Bumpkin Charm Egg",
    description: "A jewelled egg created by the House of Bumpkin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2047.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Nightshade Veil Egg": {
    name: "Nightshade Veil Egg",
    description: "A jewelled egg created by the House of Nightshade.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2048.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Emerald Goblin Goblet": {
    name: "Emerald Goblin Goblet",
    description: "An emerald encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2049.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Opal Sunflorian Goblet": {
    name: "Opal Sunflorian Goblet",
    description: "An opal encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2050.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sapphire Bumpkin Goblet": {
    name: "Sapphire Bumpkin Goblet",
    description: "A sapphire encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2051.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Amethyst Nightshade Goblet": {
    name: "Amethyst Nightshade Goblet",
    description: "An amethyst encrusted goblet",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2052.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Golden Faction Goblet": {
    name: "Golden Faction Goblet",
    description: "A golden goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2053.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Ruby Faction Goblet": {
    name: "Ruby Faction Goblet",
    description: "A ruby encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2054.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sunflorian Bunting": {
    name: "Sunflorian Bunting",
    description: "Colorful flags celebrating the Sunflorian Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2055.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Nightshade Bunting": {
    name: "Nightshade Bunting",
    description: "Colorful flags celebrating the Nightshade faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2056.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Goblin Bunting": {
    name: "Goblin Bunting",
    description: "Colorful flags celebrating the Goblin faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2057.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bumpkin Bunting": {
    name: "Bumpkin Bunting",
    description: "Colorful flags celebrating the Bumpkin faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2058.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sunflorian Candles": {
    name: "Sunflorian Candles",
    description: "Sunflorian Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2059.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Nightshade Candles": {
    name: "Nightshade Candles",
    description: "Nightshade Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2060.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Goblin Candles": {
    name: "Goblin Candles",
    description: "Goblin Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2061.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bumpkin Candles": {
    name: "Bumpkin Candles",
    description: "Bumpkin Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2062.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sunflorian Left Wall Sconce": {
    name: "Sunflorian Left Wall Sconce",
    description:
      "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2063.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Nightshade Left Wall Sconce": {
    name: "Nightshade Left Wall Sconce",
    description:
      "Illuminate your living quarters with a Nightshade Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2064.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Goblin Left Wall Sconce": {
    name: "Goblin Left Wall Sconce",
    description: "Illuminate your living quarters with a Goblin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2065.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bumpkin Left Wall Sconce": {
    name: "Bumpkin Left Wall Sconce",
    description: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2066.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sunflorian Right Wall Sconce": {
    name: "Sunflorian Right Wall Sconce",
    description:
      "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2067.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Nightshade Right Wall Sconce": {
    name: "Nightshade Right Wall Sconce",
    description:
      "Illuminate your living quarters with a Nightshade Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2068.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Goblin Right Wall Sconce": {
    name: "Goblin Right Wall Sconce",
    description: "Illuminate your living quarters with a Goblin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2069.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bumpkin Right Wall Sconce": {
    name: "Bumpkin Right Wall Sconce",
    description: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2070.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Gourmet Hourglass": {
    name: "Gourmet Hourglass",
    description: "Reduces cooking time by 50% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2071.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Harvest Hourglass": {
    name: "Harvest Hourglass",
    description: "Reduces crop growth time by 25% for 6 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2072.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Timber Hourglass": {
    name: "Timber Hourglass",
    description: "Currency of the Factions. Use this in the Marks Shop.",
    decimals: 0,
    external_url: "Reduces tree recovery time by 25% for 4 hours.",
    image: "../public/erc1155/images/2073.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Ore Hourglass": {
    name: "Ore Hourglass",
    description: "Reduces mineral replenish cooldown by 50% for 3 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2074.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Orchard Hourglass": {
    name: "Orchard Hourglass",
    description: "Reduces fruit growth time by 25% for 6 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2075.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Blossom Hourglass": {
    name: "Blossom Hourglass",
    description: "Reduces flower growth time by 25% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2076.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Fisher's Hourglass": {
    name: "Fisher's Hourglass",
    description: "Gives a 50% chance of +1 fish for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2077.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Sunflorian Faction Rug": {
    name: "Sunflorian Faction Rug",
    description:
      "A magnificent rug made by the talented Sunflorian faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2078.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Nightshade Faction Rug": {
    name: "Nightshade Faction Rug",
    description:
      "A magnificent rug made by the talented Nightshade faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2079.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Goblin Faction Rug": {
    name: "Goblin Faction Rug",
    description:
      "A magnificent rug made by the talented Goblin faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2080.png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
  "Bumpkin Faction Rug": {
    name: "Bumpkin Faction Rug",
    description:
      "A magnificent rug made by the talented Bumpkin faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2081png",
    attributes: [{ trait_type: "Purpose", value: "Decoration" }],
  },
};
