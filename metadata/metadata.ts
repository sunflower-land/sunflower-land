import { BumpkinItem } from "features/game/types/bumpkin";
import { InventoryItemName } from "../src/features/game/types/game";
import { Attribute } from "./models";
import { getKeys } from "features/game/types/craftables";
import {
  DECORATION_TEMPLATES,
  TemplateDecorationName,
} from "features/game/types/decorations";
import { KNOWN_IDS } from "features/game/types";

type Metadata = {
  description: string;
  decimals: number;
  attributes: Attribute[];
  external_url: "https://docs.sunflower-land.com/getting-started/about";
  image: string;
  name?: InventoryItemName | BumpkinItem;
};

export const OPEN_SEA_COLLECTIBLES: Record<InventoryItemName, Metadata> = {
  "Bull Run Banner": {
    name: "Bull Run Banner",
    description: "A banner that celebrates the Bull Run season.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/749.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Horseshoe: {
    name: "Horseshoe",
    description: "A valuable token to exchange for rewards!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/750.png",
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cow Skull": {
    name: "Cow Skull",
    description: "An ancient skull.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/101.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
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
    name: "Corn Seed",
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
  "Barley Seed": {
    name: "Barley Seed",
    description:
      "Barley is a nutritious cereal grain used in animal feed.\n\nYou can buy barley seeds in game at the market.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
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
  "Tomato Seed": {
    name: "Tomato Seed",
    description: "Rich in Lycopene",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/128.png",
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Lemon Seed": {
    name: "Lemon Seed",
    description: "Because sometimes, you just can't squeeze an orange!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/129.png",
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
  Hay: {
    name: "Hay",
    description: "",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Kernel Blend": {
    name: "Kernel Blend",
    description: "",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  NutriBarley: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    name: "NutriBarley",
  },
  "Mixed Grain": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    name: "Mixed Grain",
  },
  Omnifeed: {
    name: "Omnifeed",
    description: "Acts as the best feed for all animals.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Feed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Barn Delight": {
    name: "Barn Delight",
    description: "A magical elixir that cures animal sickness.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Medicine" },
      { trait_type: "Tradable", value: "No" },
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
  Barley: {
    name: "Barley",
    description: "Barley is a nutritious cereal grain used in animal feed.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
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
      { trait_type: "Purpose", value: "Fruit" },
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
      { trait_type: "Purpose", value: "Fruit" },
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
      { trait_type: "Purpose", value: "Fruit" },
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
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Tomato: {
    name: "Tomato",
    description: "Rich in Lycopene",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/255.png",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Lemon: {
    name: "Lemon",
    description: "Because sometimes, you just can't squeeze an orange!",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/256.png",
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "No" },
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
  "Petting Hand": {
    name: "Petting Hand",
    description:
      "A tool used to pet animals.\n\nYou can craft a petting hand at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/314.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Brush: {
    name: "Brush",
    description:
      "A tool used to brush animals.\n\nYou can craft a brush at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/315.png",
    attributes: [
      { trait_type: "Purpose", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Music Box": {
    name: "Music Box",
    description:
      "A tool used to play music for animals.\n\nYou can craft a music box at the Blacksmith in the game.",
    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/316.png",
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
      "Sheep are no longer lazy when this farm dog is around.\n\n~~You can craft a dog at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/406.gif",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Sheep Produce Time",
        value: -25,
      },
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
          "Increase Medium and Advanced Crop Yield when placed between Cobalt and Clementine",
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
      "A chicken coop that can be used to raise chickens. Increase egg production with this rare coop.\n\n~~You can craft a chicken coop at the Goblin Farmer in the game.~~ **Sold out!**",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/408.png",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 1,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Base Chickens",
        value: 5,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Max Chickens per Hen House Upgrade",
        value: 5,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Gold Egg": {
    name: "Gold Egg",
    description:
      "A golden egg. What lays inside is known to be the bearer of good fortune.\n\n\n\nFeed chickens for free.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/409.gif",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Feed chickens without food",
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
        trait_type: "Tree Regeneration Time",
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
        trait_type: "Tree Regeneration Time",
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
      { trait_type: "Tradable", value: "No" },
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
      { trait_type: "Tradable", value: "No" },
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
  Leather: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    name: "Leather",
  },
  Wool: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    name: "Wool",
  },
  "Merino Wool": {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    name: "Merino Wool",
  },
  Feather: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    name: "Feather",
  },
  Milk: {
    description: "",
    decimals: 18,
    attributes: [
      { trait_type: "Purpose", value: "Resource" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    name: "Milk",
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
      { trait_type: "Tradable", value: "No" },
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
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant reduces the food required to feed a chicken by 10%.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/611.gif",
    attributes: [
      {
        display_type: "boost_percentage",
        trait_type: "Chicken Feed Reduction",
        value: -10,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rich Chicken": {
    name: "Rich Chicken",
    description:
      "A mutant chicken that can be found by chance when collecting an egg.\n\nThis mutant adds a boost of +0.1 egg yield.\n\nThere is a 1/1000 chance of producing a mutant chicken.",
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
        display_type: "boost_number",
        trait_type: "Increase Animal Yield",
        value: 0.1,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Animal Chance",
        value: 10,
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
      {
        display_type: "boost_percentage",
        trait_type: "Increase Mutant Animal Chance",
        value: 10,
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
        trait_type: "Increase Wood Drops",
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
        trait_type: "Increase Stone Drops",
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
        trait_type: "Increase Gold Drops",
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
        trait_type: "Seeds and Tools discount",
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
        trait_type: "Amount of Axes to Chop Trees",
        value: -50,
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
        trait_type: "Withdrawal Fee",
        value: -50,
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Decoration" },
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
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
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Purpose", value: "Coupon" },
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
    description:
      "A workbench used to craft tools & buildings in Sunflower Land.",
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
  Barn: {
    name: "Barn",
    description: "A nice and cosy home for your four legged animals.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/question_mark.png",
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Undead Rooster": {
    name: "Undead Rooster",
    description: "An unfortunate casualty of the war. +0.1 egg yield.",
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
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potted Pumpkin": {
    description:
      "Pumpkins for Bumpkins. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1216.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Potted Sunflower": {
    description:
      "Brighten up your land. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1202.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Tulips": {
    description:
      "Keep the smell of goblins away. You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1201.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Cactus: {
    description:
      "Saves water and makes your farm look stunning! You can craft this at the Decorations shop at Helios.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1203.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
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
      { trait_type: "Tradable", value: "No" },
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
      { trait_type: "Tradable", value: "No" },
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
      { trait_type: "Boost", value: "Treasure" },
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
      { trait_type: "Boost", value: "Treasure" },
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
  Gem: {
    description: "A valuable gem in Sunflower Land!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/748.png",
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
  "Amber Fossil": {
    description: "A ticket used during the Pharaoh's Treasure Season",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/747.png",
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
  "Pharaoh's Treasure Banner": {
    description: "The mark of a participant in the Pharaoh's Treasure Season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/746.png",
    attributes: [
      { trait_type: "Purpose", value: "Banner" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "XP increase during Pharaoh's Treasure Season",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Extra Amber Fossils from Deliveries and Chores",
        value: 2,
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
      {
        display_type: "boost_number",
        trait_type: "Extra Seasonal Tickets from Deliveries and Chores",
        value: 2,
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
        trait_type: "Increase Yield of Radish, Wheat, Kale, Rice & Barley",
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
      {
        display_type: "boost_number",
        trait_type: "Increase Egg Yield",
        value: 0.1,
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
    description: "Give me those eggs, fast! Chickens sleep 2 hours shorter.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/470.gif",
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Egg Production Time (hours)",
        value: -2,
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
    description: "Sprout Mix increases your crop yield from plots by +0.2",
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
    description:
      "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
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
    description: "Rapid Root reduces crop growth time from plots by 50%",
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
    description: "The ocean's pocket-sized darting acrobat, always in a hurry!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1501.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Butterflyfish: {
    description:
      "A fish with a fashion-forward sense, flaunting its vivid, stylish stripes.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1502.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Blowfish: {
    description:
      "The round, inflated comedian of the sea, guaranteed to bring a smile.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1503.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Clownfish: {
    description:
      "The underwater jester, sporting a tangerine tuxedo and a clownish charm.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1504.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Bass": {
    description:
      "Your 'not-so-exciting' friend with silver scales – a bassic catch!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1505.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sea Horse": {
    description:
      "The ocean's slow-motion dancer, swaying gracefully in the aquatic ballet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1506.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Horse Mackerel": {
    description:
      "A speedster with a shiny coat, always racing through the waves.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1507.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Squid: {
    description: "The deep-sea enigma with tentacles to tickle your curiosity.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1508.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Red Snapper": {
    description: "A catch worth its weight in gold, dressed in fiery crimson.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1509.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Moray Eel": {
    description: "A slinky, sinister lurker in the ocean's shadowy corners.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1510.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Olive Flounder": {
    description:
      "The seabed's master of disguise, always blending in with the crowd.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1511.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Napoleanfish: {
    description: "Meet the fish with the Napoleon complex – short, but regal!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1512.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Surgeonfish: {
    description: "The ocean's neon warrior, armed with a spine-sharp attitude.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1513.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Zebra Turkeyfish": {
    description:
      "Stripes, spines, and a zesty disposition, this fish is a true showstopper!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1514.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Ray: {
    description:
      "The underwater glider, a serene winged beauty through the waves.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1515.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Hammerhead shark": {
    description:
      "Meet the shark with a head for business, and a body for adventure!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1516.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Tuna: {
    description:
      "The ocean's muscle-bound sprinter, ready for a fin-tastic race!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1517.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Mahi Mahi": {
    description:
      "A fish that believes in living life colorfully with fins of gold.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1518.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blue Marlin": {
    description:
      "An oceanic legend, the marlin with an attitude as deep as the sea.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1519.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Oarfish: {
    description: "The long and the long of it – an enigmatic ocean wanderer.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1520.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Football fish": {
    description:
      "The MVP of the deep, a bioluminescent star that's ready to play!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1521.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sunfish: {
    description:
      "The ocean's sunbather, basking in the spotlight with fins held high.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1522.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Coelacanth: {
    description:
      "A prehistoric relic, with a taste for the past and the present.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1523.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Whale Shark": {
    description:
      "The gentle giant of the deep, sifting treasures from the ocean's buffet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1524.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Barred Knifejaw": {
    description:
      "An oceanic outlaw with black-and-white stripes and a heart of gold.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1525.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Saw Shark": {
    description:
      "With a saw-like snout, it's the ocean's carpenter, always cutting edge!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1526.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "White Shark": {
    description:
      "The shark with a killer smile, ruling the seas with fin-tensity!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1527.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Twilight Anglerfish": {
    description:
      "A deep-sea angler with a built-in nightlight, guiding its way through darkness.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1528.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Starlight Tuna": {
    description:
      "A tuna that outshines the stars, ready to light up your collection.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1529.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Radiant Ray": {
    description:
      "A ray that prefers to glow in the dark, with a shimmering secret to share.",
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
    description:
      "An elusive and ghostly fish of the deep, hiding in the shadows.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1531.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gilded Swordfish": {
    description:
      "A swordfish with scales that sparkle like gold, the ultimate catch!",
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
      { trait_type: "Tradable", value: "Yes" },
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
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil Yield",
        value: 0.05,
      },
    ],
  },
  "Lemon Shark": {
    description:
      "A zesty, zippy swimmer of the Summer seas. Only available during Pharaoh's Treasure season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1539.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      // Will be automatically tradable post Pharaoh's Treasure Season
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Lemon Yield",
        value: 0.2,
      },
    ],
  },
  "Longhorn Cowfish": {
    description:
      "A peculiar boxfish with horn-like spines, swimming through the seas with bovine grace.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1540.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Milk" },
      {
        display_type: "boost_number",
        trait_type: "Increase Milk Yield",
        value: 0.2,
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
      "Drop anchor with this nautical gem, making every spot seaworthy and splash-tastically stylish!",
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
  "Alien Chicken": {
    description:
      "A peculiar chicken from another galaxy, here to boost your feather production!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2162.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Feather Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Mootant: {
    description:
      "This genetically enhanced bovine here to boost your leather production!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2163.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Leather Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Toxic Tuft": {
    description:
      "A mutated sheep whose toxic fleece produces the finest merino wool in the land!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2164.png",
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Merino Wool Yield",
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
  "Pharaoh Chicken": {
    description: "A ruling chicken, +1 Dig.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2116.png",
    attributes: [
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Increase daily digs",
        value: 1,
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
      "The Time Warp Totem temporarily boosts your cooking, crops, fruits, trees & mineral time. Make the most of it!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1297.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Other" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking, Crop, Fruit, Tree and Mineral Time",
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
    description: "A valued coin that can be exchanged for rewards",
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
    description: "A festive decoration from 2023.",
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
      { trait_type: "Tradable", value: "No" },
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
        trait_type: "Expansion Resources cost reduction",
        value: -50,
      },
    ],
  },
  Angelfish: {
    description:
      "The aquatic celestial beauty, adorned in a palette of vibrant hues.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1534.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  Parrotfish: {
    description:
      "A kaleidoscope of colors beneath the waves, this fish is nature's living artwork.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1536.png",
    attributes: [
      { trait_type: "Purpose", value: "Fish" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Halibut: {
    description:
      "The flat ocean floor dweller, a master of disguise in sandy camouflage.",
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
    description: "A coupon to exchange for a farm hand of your choice.",
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
      { trait_type: "Tradable", value: "Yes" },
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
        trait_type: "Increase XP",
        value: 10,
      },
    ],
  },

  "Desert Gnome": {
    description: "A gnome that can survive the harshest of conditions.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2017.png",
    attributes: [
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Cooking" },
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
    description: "A magic key that can unlock rewards in the beach",
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
    description:
      "A prized ticket. You can use it to enter the monthly goblin raffle.",
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
    name: "Baozi",
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
    name: "Nightshade Faction Banner",
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
    description: "An engine that reduces the Greenhouse's growth time by 50%.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/495.png",
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Growth Time in Greenhouse",
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
      { trait_type: "Boost", value: "Fruit" },
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
      { trait_type: "Boost", value: "Fruit" },
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
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    image: "../public/erc1155/images/2018.png",
  },
  "Bullseye Board": {
    name: "Bullseye Board",
    description: "Hit the mark every time!",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2019.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Chess Rug": {
    name: "Chess Rug",
    description: "Checkmate.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2020.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Cluckapult: {
    name: "Cluckapult",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2021.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Gallant": {
    name: "Golden Gallant",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2022.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Garrison": {
    name: "Golden Garrison",
    description:
      "Defend your territory in style with this shimmering garrison, a true fortress of flair.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2023.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Golden Guardian": {
    name: "Golden Guardian",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2024.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Novice Knight": {
    name: "Novice Knight",
    description: "Every move is an adventure.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2025.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Regular Pawn": {
    name: "Regular Pawn",
    description:
      "Small but mighty! This pawn may just make a big move in your collection.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2026.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Rookie Rook": {
    name: "Rookie Rook",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2027.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Silver Sentinel": {
    name: "Silver Sentinel",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2028.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Silver Squire": {
    name: "Silver Squire",
    description: "Add some shine to your collection.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2029.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Silver Stallion": {
    name: "Silver Stallion",
    description: "",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2030.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Trainee Target": {
    name: "Trainee Target",
    description:
      "Every champion starts somewhere! Perfect your aim with the Trainee Target.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2031.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Twister Rug": {
    name: "Twister Rug",
    description:
      "Twist, turn, and tie your decor together with this playful rug.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2032.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Battlecry Drum": {
    name: "Battlecry Drum",
    description: "",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/2033.png`,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Grape Seed": {
    name: "Grape Seed",
    description: "A zesty and desired fruit.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/125.png`,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Olive Seed": {
    name: "Olive Seed",
    description: "A luxury for advanced farmers.",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/126.png`,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rice Seed": {
    name: "Rice Seed",
    description: "Perfect for rations...",

    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/127.png`,
    attributes: [
      { trait_type: "Purpose", value: "Seed" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Grape: {
    name: "Grape",
    description: "A zesty and desired fruit.",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/252.png`,
    attributes: [
      { trait_type: "Purpose", value: "Fruit" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Olive: {
    name: "Olive",
    description: "A luxury for advanced farmers.",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/253.png`,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Rice: {
    name: "Rice",
    description: "Perfect for rations...",

    decimals: 18,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/254.png`,
    attributes: [
      { trait_type: "Purpose", value: "Crop" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Carrot Juice": {
    name: "Carrot Juice",
    description: "Refreshing drink from farm-fresh carrots",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/558.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Seafood Basket": {
    name: "Seafood Basket",
    description: "A bountiful basket of fresh ocean delights",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/559.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Burger": {
    name: "Fish Burger",
    description: "Succulent burger made with freshly caught fish",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/560.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish n Chips": {
    name: "Fish n Chips",
    description: "Crispy chips paired with tender fish fillets",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/561.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fish Omelette": {
    name: "Fish Omelette",
    description: "Fluffy omelette with a flavorful fish filling",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/562.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fried Calamari": {
    name: "Fried Calamari",
    description: "Crispy calamari rings, a seafood delight",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/563.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fried Tofu": {
    name: "Fried Tofu",
    description: "Crispy tofu bites, a vegetarian favorite",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/564.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Grape Juice": {
    name: "Grape Juice",
    description: "Sweet and refreshing juice from sun-ripened grapes",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/565.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ocean's Olive": {
    name: "Ocean's Olive",
    description: "Savor the taste of the sea with these ocean-infused olives",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/566.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Quick Juice": {
    name: "Quick Juice",
    description: "A swift and energizing juice for busy days",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/567.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Rice Bun": {
    name: "Rice Bun",
    description: "Soft buns made with rice flour, perfect for snacking",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/568.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Slow Juice": {
    name: "Slow Juice",
    description: "Slowly pressed juice for a burst of natural flavors",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/569.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Steamed Red Rice": {
    name: "Steamed Red Rice",
    description: "Nutritious red rice, steamed to perfection",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/570.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sushi Roll": {
    name: "Sushi Roll",
    description: "Delicious sushi rolls filled with fresh ingredients",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/571.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "The Lot": {
    name: "The Lot",
    description: "A medley of fruits for the adventurous palate",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/572.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Tofu Scramble": {
    name: "Tofu Scramble",
    description: "Scrambled tofu with a mix of vegetables, a hearty breakfast",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/573.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Antipasto: {
    name: "Antipasto",
    description: "A selection of savory bites to start your meal",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/574.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Greenhouse: {
    name: "Greenhouse",
    description: "A safehaven for sensitive crops",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: `../public/erc1155/images/1019.png`,
    attributes: [
      { trait_type: "Purpose", value: "Building" },
      { trait_type: "Tradable", value: "No" },
    ],
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
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Goblin Emblem": {
    name: "Goblin Emblem",
    description:
      "A symbol of the Goblin Faction. Show your support for the Goblin Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/741.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Nightshade Emblem": {
    name: "Nightshade Emblem",
    description:
      "A symbol of the Nightshade Faction. Show your support for the Nightshade Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/744.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  "Sunflorian Emblem": {
    name: "Sunflorian Emblem",
    description:
      "A symbol of the Sunflorian Faction. Show your support for the Sunflorian Faction with this emblem.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/743.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Mark: {
    name: "Mark",
    description: "Currency of the Factions. Use this in the Faction Shop.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/745.png",
    attributes: [
      { trait_type: "Purpose", value: "Coupon" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Benevolence Flag": {
    name: "Benevolence Flag",
    description:
      "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2035.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Devotion Flag": {
    name: "Devotion Flag",
    description:
      "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2036.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Generosity Flag": {
    name: "Generosity Flag",
    description:
      "For players who have donated substantial resources to the Goblins.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2037.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Splendor Flag": {
    name: "Splendor Flag",
    description:
      "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2037.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Jelly Lamp": {
    name: "Jelly Lamp",
    description:
      "A decorative lamp that emits a light that emits a light that emits a light.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2039.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Paint Can": {
    name: "Paint Can",
    description: "A can of paint found during the Festival of Colors.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2040.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  "Sunflorian Throne": {
    name: "Sunflorian Throne",
    description: "A throne fit for a Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2041.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Throne": {
    name: "Nightshade Throne",
    description: "A throne fit for a Nightshade.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2042.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Throne": {
    name: "Goblin Throne",
    description: "A throne fit for a Goblin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2043.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Throne": {
    name: "Bumpkin Throne",
    description: "A throne fit for a Bumpkin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2044.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Sunflorian Egg": {
    name: "Golden Sunflorian Egg",
    description: "A jewelled egg created by the House of Sunflorian.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2045.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Mischief Egg": {
    name: "Goblin Mischief Egg",
    description: "A jewelled egg created by the House of Goblin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2046.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Charm Egg": {
    name: "Bumpkin Charm Egg",
    description: "A jewelled egg created by the House of Bumpkin.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2047.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Veil Egg": {
    name: "Nightshade Veil Egg",
    description: "A jewelled egg created by the House of Nightshade.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2048.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Emerald Goblin Goblet": {
    name: "Emerald Goblin Goblet",
    description: "An emerald encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2049.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Opal Sunflorian Goblet": {
    name: "Opal Sunflorian Goblet",
    description: "An opal encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2050.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sapphire Bumpkin Goblet": {
    name: "Sapphire Bumpkin Goblet",
    description: "A sapphire encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2051.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Amethyst Nightshade Goblet": {
    name: "Amethyst Nightshade Goblet",
    description: "An amethyst encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2052.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Golden Faction Goblet": {
    name: "Golden Faction Goblet",
    description: "A golden goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2053.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ruby Faction Goblet": {
    name: "Ruby Faction Goblet",
    description: "A ruby encrusted goblet.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2054.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Bunting": {
    name: "Sunflorian Bunting",
    description: "Colorful flags celebrating the Sunflorian Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2055.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Bunting": {
    name: "Nightshade Bunting",
    description: "Colorful flags celebrating the Nightshade Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2056.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Bunting": {
    name: "Goblin Bunting",
    description: "Colorful flags celebrating the Goblin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2057.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Bunting": {
    name: "Bumpkin Bunting",
    description: "Colorful flags celebrating the Bumpkin Faction.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2058.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Candles": {
    name: "Sunflorian Candles",
    description: "Sunflorian Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2059.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Candles": {
    name: "Nightshade Candles",
    description: "Nightshade Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2060.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Candles": {
    name: "Goblin Candles",
    description: "Goblin Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2061.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Candles": {
    name: "Bumpkin Candles",
    description: "Bumpkin Faction decorative candles.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2062.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Left Wall Sconce": {
    name: "Sunflorian Left Wall Sconce",
    description:
      "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2063.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Left Wall Sconce": {
    name: "Nightshade Left Wall Sconce",
    description:
      "Illuminate your living quarters with a Nightshade Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2064.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Left Wall Sconce": {
    name: "Goblin Left Wall Sconce",
    description: "Illuminate your living quarters with a Goblin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2065.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Left Wall Sconce": {
    name: "Bumpkin Left Wall Sconce",
    description: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2066.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Right Wall Sconce": {
    name: "Sunflorian Right Wall Sconce",
    description:
      "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2067.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Right Wall Sconce": {
    name: "Nightshade Right Wall Sconce",
    description:
      "Illuminate your living quarters with a Nightshade Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2068.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Right Wall Sconce": {
    name: "Goblin Right Wall Sconce",
    description: "Illuminate your living quarters with a Goblin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2069.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Right Wall Sconce": {
    name: "Bumpkin Right Wall Sconce",
    description: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2070.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Gourmet Hourglass": {
    name: "Gourmet Hourglass",
    description: "Reduces cooking time by 50% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2071.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Cooking" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Harvest Hourglass": {
    name: "Harvest Hourglass",
    description: "Reduces crop growth time by 25% for 6 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2072.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Growth Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 6,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Timber Hourglass": {
    name: "Timber Hourglass",
    description: "Reduces tree recovery time by 25% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2073.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Tree Regeneration Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Ore Hourglass": {
    name: "Ore Hourglass",
    description: "Reduces mineral replenish cooldown by 50% for 3 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2074.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Mineral Replenish Time",
        value: -50,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 3,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Orchard Hourglass": {
    name: "Orchard Hourglass",
    description: "Reduces fruit growth time by 25% for 6 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2075.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Fruit Growth Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 6,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Blossom Hourglass": {
    name: "Blossom Hourglass",
    description: "Reduces flower growth time by 25% for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2076.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Growth Time",
        value: -25,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Fisher's Hourglass": {
    name: "Fisher's Hourglass",
    description: "Gives a 50% chance of +1 fish for 4 hours.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2077.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 50,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Hit Amount",
        value: 1,
      },
      {
        display_type: "boost_number",
        trait_type: "Boost Duration (hours)",
        value: 4,
      },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Sunflorian Faction Rug": {
    name: "Sunflorian Faction Rug",
    description:
      "A magnificent rug made by the talented Sunflorian Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2078.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Nightshade Faction Rug": {
    name: "Nightshade Faction Rug",
    description:
      "A magnificent rug made by the talented Nightshade Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2079.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Goblin Faction Rug": {
    name: "Goblin Faction Rug",
    description:
      "A magnificent rug made by the talented Goblin Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2080.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Bumpkin Faction Rug": {
    name: "Bumpkin Faction Rug",
    description:
      "A magnificent rug made by the talented Bumpkin Faction artisans.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2081.png",
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
  },

  ...getKeys(DECORATION_TEMPLATES).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        description: "A beautiful collection for your Sunflower Land farm.",
        decimals: 0,
        attributes: [
          { trait_type: "Purpose", value: "Decoration" },
          { trait_type: "Tradable", value: "No" },
        ],
        external_url: "https://docs.sunflower-land.com/getting-started/about",
        image: `../public/erc1155/images/${KNOWN_IDS[key]}.png`,
        name: key,
      },
    }),
    {} as Record<TemplateDecorationName, Metadata>,
  ),

  Caponata: {
    name: "Caponata",
    description: "A flavorful eggplant dish, perfect for sharing.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/575.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Glazed Carrots": {
    name: "Glazed Carrots",
    description: "Sweet and savory carrots, a delightful side dish.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/576.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Paella: {
    name: "Paella",
    description: "A classic Spanish dish, brimming with flavor.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/577.png",
    attributes: [
      { trait_type: "Purpose", value: "Consumable" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Desert Rose": {
    name: "Desert Rose",
    description:
      "A mutant flower that can be found during the Pharaoh's Treasure season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2100.png",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Critical Hit Chance",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Flower Amount",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },
  Chicory: {
    name: "Chicory",
    description:
      "A mutant flower that can be found during the Bull Run season.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2159.png",
    attributes: [
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Critical Hit Chance",
        value: 10,
      },
      {
        display_type: "boost_number",
        trait_type: "Critical Flower Amount",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
  },

  "Camel Bone": {
    description: "Bones of an ancient camel, rumoured to transport artefacts",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1408.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Cockle Shell": {
    description: "A beautiful shell.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1409.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Hieroglyph: {
    description: "Unlock the secrets of the hieroglyphs.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1410.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Sand: {
    description: "It gets everywhere!",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1411.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Scarab: {
    description: "Pharaoh's lost artefact.",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1412.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  Vase: {
    description: "A fragile item from ancient times",
    decimals: 0,
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1413.png",
    attributes: [
      { trait_type: "Purpose", value: "Bounty" },
      { trait_type: "Tradable", value: "No" },
    ],
  },
  "Hapy Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2101.png",
    name: "Hapy Jar",
  },
  "Imsety Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2104.png",
    name: "Imsety Jar",
  },
  Cannonball: {
    description:
      "Cannonball is ferocious being. Residing in Tomato Bombard, it's ready to strike anyone who gets in its way",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Tomato Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2105.png",
    name: "Cannonball",
  },
  Sarcophagus: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2106.png",
    name: "Sarcophagus",
  },
  "Duamutef Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2102.png",
    name: "Duamutef Jar",
  },
  "Qebehsenuef Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2103.png",
    name: "Qebehsenuef Jar",
  },
  "Clay Tablet": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2107.png",
    name: "Clay Tablet",
  },
  "Snake in Jar": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2108.png",
    name: "Snake in Jar",
  },
  "Reveling Lemon": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Lemon Yield",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2109.gif",
    name: "Reveling Lemon",
  },
  "Anubis Jackal": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2110.png",
    name: "Anubis Jackal",
  },
  Sundial: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2111.png",
    name: "Sundial",
  },
  "Sand Golem": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2112.png",
    name: "Sand Golem",
  },
  "Cactus King": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2113.png",
    name: "Cactus King",
  },
  "Lemon Frog": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Lemon Growth Time",
        value: -25,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2114.png",
    name: "Lemon Frog",
  },
  "Scarab Beetle": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2115.png",
    name: "Scarab Beetle",
  },
  "Adrift Ark": {
    description:
      "A sandcastle on the shore intricately crafted to resemble a capsized boat, complete with shell portholes and seaweed flags fluttering atop its sculpted hull.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2117.png",
    name: "Adrift Ark",
  },
  Castellan: {
    description:
      "Castellan is a charming sandcastle figure adorned with colorful accessories, symbolizing playful spirit and creativity.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2118.png",
    name: "Castellan",
  },
  "Sunlit Citadel": {
    description: "A Castle to show your pride",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2119.png",
    name: "Sunlit Citadel",
  },
  "Pharaoh Gnome": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Greenhouse Produce Yield",
        value: 2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2120.png",
    name: "Pharaoh Gnome",
  },
  "Lemon Tea Bath": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Lemon Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2121.png",
    name: "Lemon Tea Bath",
  },
  "Tomato Clown": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Tomato Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2122.gif",
    name: "Tomato Clown",
  },
  Pyramid: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2123.png",
    name: "Pyramid",
  },
  Oasis: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2124.png",
    name: "Oasis",
  },
  "Paper Reed": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2125.png",
    name: "Paper Reed",
  },
  Camel: {
    description: "A mean looking camel!",
    decimals: 0,
    attributes: [
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Increase Sand Yield",
        value: 1,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Artefact Shop Bounty Price",
        value: 30,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2127.png",
    name: "Camel",
  },
  "Baobab Tree": {
    description:
      "Guardian of the desert, the Baobab Tree stands tall and proud.",
    decimals: 0,
    attributes: [
      { trait_type: "Purpose", value: "Decoration" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2126.png",
    name: "Baobab Tree",
  },
  "Tomato Bombard": {
    description:
      "Home to Cannonball, and is ready to strike anyone who gets in its way",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Tomato Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2128.png",
    name: "Tomato Bombard",
  },
  "Stone Beetle": {
    description: "Beetle made of stone. +0.1 Stone",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Stone Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2129.png",
    name: "Stone Beetle",
  },
  "Iron Beetle": {
    description: "Beetle made of iron. +0.1 Iron",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Iron Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2130.png",
    name: "Iron Beetle",
  },
  "Gold Beetle": {
    description: "Beetle made of gold. +0.1 Gold",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Gold Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2131.png",
    name: "Gold Beetle",
  },
  "Fairy Circle": {
    description: "Circle of fairy mushrooms. +0.2 Wild Mushroom",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wild Mushroom Yield",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2132.png",
    name: "Fairy Circle",
  },
  Squirrel: {
    description: "Squirrel likes hanging out in the forest. +0.1 Wood",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2133.png",
    name: "Squirrel",
  },
  Macaw: {
    description: "Macaw loves picking fruits. +0.1 Fruit Patch Yield",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Patch Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2134.png",
    name: "Macaw",
  },
  Butterfly: {
    description:
      "Butterfly loves the scent of flowers. 20% chance of +1 Flower",
    decimals: 0,
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
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2135.png",
    name: "Butterfly",
  },
  "Crafting Box": {
    description: "A box that allows you to craft items",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/1022.png",
    name: "Crafting Box",
  },
  "Basic Bed": {
    description: "A basic bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2140.png",
    name: "Basic Bed",
  },
  "Sturdy Bed": {
    description: "A sturdy bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2141.png",
    name: "Sturdy Bed",
  },
  "Floral Bed": {
    description: "A floral bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2142.png",
    name: "Floral Bed",
  },
  "Fisher Bed": {
    description: "A fisherman's bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2143.png",
    name: "Fisher Bed",
  },
  "Pirate Bed": {
    description: "A pirate bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2144.png",
    name: "Pirate Bed",
  },
  "Cow Bed": {
    description: "A cow bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2145.png",
    name: "Cow Bed",
  },
  "Desert Bed": {
    description: "A desert bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2146.png",
    name: "Desert Bed",
  },
  "Royal Bed": {
    description: "A royal bed for your Bumpkin to rest.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2147.png",
    name: "Royal Bed",
  },
  Cushion: {
    description: "A cushion.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/651.png",
    name: "Cushion",
  },
  Timber: {
    description: "A piece of timber.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/652.png",
    name: "Timber",
  },
  "Bee Box": {
    description: "A box for bees.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/653.png",
    name: "Bee Box",
  },
  Crimsteel: {
    description: "A piece of crimsteel.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/654.png",
    name: "Crimsteel",
  },
  "Merino Cushion": {
    description: "A cushion made of merino wool.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/655.png",
    name: "Merino Cushion",
  },
  "Kelp Fibre": {
    description: "A piece of kelp fibre.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/656.png",
    name: "Kelp Fibre",
  },
  "Hardened Leather": {
    description: "A piece of hardened leather.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/657.png",
    name: "Hardened Leather",
  },
  "Synthetic Fabric": {
    description: "A piece of synthetic fabric.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/658.png",
    name: "Synthetic Fabric",
  },
  "Ocean's Treasure": {
    description: "A treasure from the ocean.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/659.png",
    name: "Ocean's Treasure",
  },
  "Royal Bedding": {
    description: "A royal bedding.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/660.png",
    name: "Royal Bedding",
  },
  "Royal Ornament": {
    description: "A royal ornament.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/661.png",
    name: "Royal Ornament",
  },
  "Cow Scratcher": {
    description:
      "A rustic yet effective tool, perfect for giving cows a satisfying scratch after a long day in the fields. Keep your cattle happy and content!",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2148.png",
    name: "Cow Scratcher",
  },
  "Spinning Wheel": {
    description:
      "An elegant piece of craftsmanship, this spinning wheel turns raw wool into fine thread, essential for crafting quality textiles.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2149.gif",
    name: "Spinning Wheel",
  },
  "Sleepy Rug": {
    description:
      "Cozy and inviting, this soft rug is perfect for an afternoon nap. It adds warmth and charm to any space.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2150.png",
    name: "Sleepy Rug",
  },
  Meteorite: {
    description:
      "A rare and mysterious fragment from the stars, the meteorite is rumored to hold cosmic power.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2151.png",
    name: "Meteorite",
  },
  "Sheaf of Plenty": {
    description:
      "A bundle of barley harvested at peak ripeness, symbolizing abundance and the hard work of the season. +2 Barley",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Barley",
        value: 2,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2152.gif",
    name: "Sheaf of Plenty",
  },
  "Mechanical Bull": {
    description:
      "A lively attraction and test of endurance! Hop on the Mechanical Bull and see if you can hold on.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2153.gif",
    name: "Mechanical Bull",
  },
  "Moo-ver": {
    description:
      "A unique contraption that keeps cows active and healthy. +0.25 Leather",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Leather",
        value: 0.25,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2155.gif",
    name: "Moo-ver",
  },
  "Swiss Whiskers": {
    description:
      "A culinary genius in miniature form, this skilled chef elevates every cheese recipe with his expert touch. +500 Cheese Recipe XP",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_number",
        trait_type: "Increase Cheese Recipe XP",
        value: 500,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2156.png",
    name: "Swiss Whiskers",
  },
  Cluckulator: {
    description:
      "This specialized scale accurately weighs each chicken, ensuring they receive the ideal feed portion for balanced growth and health, making poultry care more efficient and sustainable. -25% Feed to Chicken",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Chicken Feed Reduction",
        value: 25,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2157.gif",
    name: "Cluckulator",
  },
  "Crop Circle": {
    description:
      "A mysterious circle that appears on your farm...what could it mean?",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "Yes" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2165.png",
    name: "Crop Circle",
  },
  UFO: {
    description:
      "This extraterrestrial craft is said to emit a soft glow and hum, creating an aura of wonder and curiosity.  Keep your eyes on the skies—who knows what otherworldly secrets it might unveil!",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2158.gif",
    name: "UFO",
  },
  Wagon: {
    description: "A perfect wagon for your bears to rest and relax.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/2160.png",
    name: "Wagon",
  },
  "Black Sheep": {
    description: "A black sheep has taken up residence on your farm.",
    decimals: 0,
    attributes: [{ trait_type: "Tradable", value: "No" }],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/erc1155/images/2161.png",
    name: "Black Sheep",
  },
};

export const OPEN_SEA_WEARABLES: Record<BumpkinItem, Metadata> = {
  "Beige Farmer Potion": {
    description:
      "An ancient potion of beige goodness. Consuming this potion transforms your Bumpkin's colour.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/1.png",
    name: "Beige Farmer Potion",
  },
  "Light Brown Farmer Potion": {
    description:
      "A mixture of sunflower and gold. Consuming this potion transforms your Bumpkin's colour.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/3.png",
    name: "Light Brown Farmer Potion",
  },
  "Dark Brown Farmer Potion": {
    description:
      "A traditional recipe passed down from Bumpkin Ancestors. Consuming this potion transforms your Bumpkin's colour.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/2.png",
    name: "Dark Brown Farmer Potion",
  },
  "Goblin Potion": {
    description:
      "A recipe crafted during the Great Goblin War. Consuming this potion turns your Bumpkin into a Goblin",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/4.png",
    name: "Goblin Potion",
  },
  "Basic Hair": {
    description:
      "Nothing says Bumpkin like this Basic Hair. This mop of hair is a signal of a true Bumpkin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/5.png",
    name: "Basic Hair",
  },
  "Rancher Hair": {
    description:
      "Bright and orange! You can spot this hair piece a mile away in the fields.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/6.png",
    name: "Rancher Hair",
  },
  "Explorer Hair": {
    description:
      "This cut never goes out of style. Plenty of room to store extra seeds while farming.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/7.png",
    name: "Explorer Hair",
  },
  "Buzz Cut": {
    description: "Short, simple & easy maintenance. More time for farming!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/42.png",
    name: "Buzz Cut",
  },
  "Parlour Hair": {
    description: "There is enough hair spray in here to last a year.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/43.png",
    name: "Parlour Hair",
  },
  "Sun Spots": {
    description:
      "Long days in the field and the blaring sun. The sign of a true worker.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/51.png",
    name: "Sun Spots",
  },
  "Red Farmer Shirt": {
    description:
      "The Basic Bumpkin must-have. Nothing blends in the crowd quite like this red farmer shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/13.png",
    name: "Red Farmer Shirt",
  },
  "Yellow Farmer Shirt": {
    description:
      "The colour of happiness, warmth and sunflowers! A beloved shirt amongst all farmers.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/14.png",
    name: "Yellow Farmer Shirt",
  },
  "Blue Farmer Shirt": {
    description:
      "Getting down to business? This is a mark of a trained and focussed farmer.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/15.png",
    name: "Blue Farmer Shirt",
  },
  "Chef Apron": {
    description:
      "If you are baking cakes don't forget your Apron! The mark of a true baker.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Cake Sale Price",
        value: 20,
      },
      { trait_type: "Boost", value: "Other" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/16.png",
    name: "Chef Apron",
  },
  "Warrior Shirt": {
    description:
      "The mark of a warrior who survived the Goblin War. This shirt commands respect amongst the Sunflower community.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/17.png",
    name: "Warrior Shirt",
  },
  "Fancy Top": {
    description:
      "Oooh isn't that fancy? This short is worn in the royal kingdoms of Sunflorea.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/33.png",
    name: "Fancy Top",
  },
  "Farmer Overalls": {
    description: "Plenty of pockets to store your tools!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/18.png",
    name: "Farmer Overalls",
  },
  "Lumberjack Overalls": {
    description:
      "Chopping wood and crafting tools, what more could you want in life?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/19.png",
    name: "Lumberjack Overalls",
  },
  "Farmer Pants": {
    description: "Basic pants that get the job down at Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/20.png",
    name: "Farmer Pants",
  },
  "Warrior Pants": {
    description:
      "The mark of a warrior who survived the Goblin War. Gotta protect your thighs out on the battlefield!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/21.png",
    name: "Warrior Pants",
  },
  "Black Farmer Boots": {
    description:
      "These boots were made for walking...and exploring Sunflower Land.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/22.png",
    name: "Black Farmer Boots",
  },
  "Farmer Pitchfork": {
    description:
      "A trusty pitchfork. Don't be caught dead without one when the crops are ready",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/23.png",
    name: "Farmer Pitchfork",
  },
  Axe: {
    description: "You can't expand your empire with chopping trees!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/44.png",
    name: "Axe",
  },
  Sword: {
    description: "When tensions rise in Sunflower Land, you will be ready.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/45.png",
    name: "Sword",
  },
  "Farmer Hat": {
    description:
      "The sun is harsh in Sunflower Land. Don't forget to protect your Bumpkin",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/24.png",
    name: "Farmer Hat",
  },
  "Chef Hat": {
    description:
      "A champion in the great bake off. Goblins get hungry when they see a Bumpkin wearing a chef hat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/25.png",
    name: "Chef Hat",
  },
  "Warrior Helmet": {
    description:
      "Through blood and sweat, the wearer of this helmet was victorious in the Goblin war.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/26.png",
    name: "Warrior Helmet",
  },
  "Sunflower Amulet": {
    description:
      "The crop that fuels the Sunflower MetaVerse. Now in necklace form!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Sunflower Yield",
        value: 10,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/27.png",
    name: "Sunflower Amulet",
  },
  "Carrot Amulet": {
    description:
      "Carrots for breakfast, lunch and dinner. Rumour says that wearing this necklace improves your Bumpkin's eyesight!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Carrot Growth Time",
        value: -20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/28.png",
    name: "Carrot Amulet",
  },
  "Beetroot Amulet": {
    description: "Grandma always said to carry a beetroot wherever you go.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Beetroot Yield",
        value: 20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/29.png",
    name: "Beetroot Amulet",
  },
  "Green Amulet": {
    description: "King of the crops. Nothing can stop your farming empire now!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_percentage",
        trait_type: "Crop Critical Hit Yield",
        value: 900,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Critical Hit Chance",
        value: 10,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/30.png",
    name: "Green Amulet",
  },
  "Sunflower Shield": {
    description:
      "Fight smart, not hard. This shield offered protection during the Goblin War and is now a mark of a true warrior.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      {
        display_type: "boost_number",
        trait_type: "Cost of Sunflower Seeds",
        value: 0,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/31.png",
    name: "Sunflower Shield",
  },
  "Farm Background": {
    description:
      "There is no better place for a Bumpkin to be...out in the fields!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/32.png",
    name: "Farm Background",
  },
  "Brown Boots": {
    description: "Perfect for a hard days work, you will barely see a stain!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/34.png",
    name: "Brown Boots",
  },
  "Brown Suspenders": {
    description:
      "Are you worried about your pants falling down? These are a must have for Goblins.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/35.png",
    name: "Brown Suspenders",
  },
  "Fancy Pants": {
    description: "Ooh, well don't you look all high and mighty!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/36.png",
    name: "Fancy Pants",
  },
  "Maiden Skirt": {
    description:
      "Plowing, exploring and trading. These are a perfect choice for your Bumpkin",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/37.png",
    name: "Maiden Skirt",
  },
  "Maiden Top": {
    description:
      "A universal choice, whether you are out on the fields or trading at the markets. You will fit right in!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/38.png",
    name: "Maiden Top",
  },
  "Peasant Skirt": {
    description: "No time for rest, there are crops for harvesting!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/39.png",
    name: "Peasant Skirt",
  },
  "SFL T-Shirt": {
    description: "Official Sunflower Land merchandise!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/40.png",
    name: "SFL T-Shirt",
  },
  "Yellow Boots": {
    description: "The winner of the 2022 Goblin Fashion awards. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/41.png",
    name: "Yellow Boots",
  },
  "Blue Suspenders": {
    description: "A perfect outfit for the annual barn dance",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/46.png",
    name: "Blue Suspenders",
  },
  "Brown Long Hair": {
    description: "Well groomed hair for a day out farming potatoes.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/50.png",
    name: "Brown Long Hair",
  },
  "Forest Background": {
    description: "Some Bumpkins prefer the forest to the fields.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/47.png",
    name: "Forest Background",
  },
  "Seashore Background": {
    description:
      "Bumpkins were built to explore! Nothing excites a Bumpkin quite like a vast ocean in front of them.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/48.png",
    name: "Seashore Background",
  },
  "White Long Hair": {
    description:
      "Rumour has it the long forgotten Saphiro tribe passed down the white hair gene. These days, Bumpkins bleach their hair for fashion.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/52.png",
    name: "White Long Hair",
  },
  Blondie: {
    description: "Too much time in the sun results in a Bumpkin Blondie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/49.png",
    name: "Blondie",
  },
  "Cemetery Background": {
    description:
      "A limited edition Halloween event! Looks like a Bumpkin Bimbo summoned the necromancer again...",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/53.png",
    name: "Cemetery Background",
  },
  "Golden Spatula": {
    description:
      "Increase the quality of your cooking. A 10% increase of experience when eating food.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP",
        value: 10,
      },
      { trait_type: "Boost", value: "XP" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/58.png",
    name: "Golden Spatula",
  },
  "Jail Background": {
    description: "This Bumpkin was accused of stealing potatoes.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/57.png",
    name: "Jail Background",
  },
  "Space Background": {
    description: "Bumpkins to the moon!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/55.png",
    name: "Space Background",
  },
  "Teal Mohawk": {
    description: "Not all Bumpkins like to fit into the crowd.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/54.png",
    name: "Teal Mohawk",
  },
  Parsnip: {
    description:
      "Looks like you found the perfect parsnip! 20% increased yield when farming parsnips",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Parsnip Yield",
        value: 20,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/56.png",
    name: "Parsnip",
  },
  "Artist Scarf": {
    description:
      "Red wine, poetry and fine pixel art. A mark of a certified Sunflower Land contributors.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/59.png",
    name: "Artist Scarf",
  },
  "Bumpkin Art Competition Merch": {
    description:
      "A special event shirt for participants in the first official Bumpkin Art competition.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/60.png",
    name: "Bumpkin Art Competition Merch",
  },
  "Developer Hoodie": {
    description:
      "Coffee, comfort and coding. Time to build the Bumpkins - a mark of a certified code developer",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/62.png",
    name: "Developer Hoodie",
  },
  "Project Dignity Hoodie": {
    description:
      "Are you a frog collector? Project Dignity is a project built on top of Sunflower Land and an amazing community!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/61.png",
    name: "Project Dignity Hoodie",
  },
  "Blacksmith Hair": {
    description: "This hair is older than moon rocks!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/63.png",
    name: "Blacksmith Hair",
  },
  Hammer: {
    description: "Bumpkins were made to build!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/64.png",
    name: "Hammer",
  },
  "Bumpkin Boots": {
    description: "Trendy Bumpkin Boots",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/65.png",
    name: "Bumpkin Boots",
  },
  "Fire Shirt": {
    description: "Bad Bumpkins break the rules!!!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/66.png",
    name: "Fire Shirt",
  },
  "Red Long Hair": {
    description: "Let the fiery hair flow.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/67.png",
    name: "Red Long Hair",
  },
  "Snowman Onesie": {
    description: "Do you want to build a snowman?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/68.png",
    name: "Snowman Onesie",
  },
  "Reindeer Suit": {
    description: "Rudolph can't stop eating carrots!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/69.png",
    name: "Reindeer Suit",
  },
  "Ancient Goblin Sword": {
    description:
      "A rare artifact found from an ancient battle. The blood of enemies stain the handle.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/77.png",
    name: "Ancient Goblin Sword",
  },
  "Ancient War Hammer": {
    description:
      "This ancient weapon is rumoured to bring peace to Sunflower Land",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/76.png",
    name: "Ancient War Hammer",
  },
  "Angel Wings": {
    description: "Ascend to the heavens with these beautiful wings",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      {
        display_type: "boost_percentage",
        trait_type: "Chance of Instant Crops",
        value: 30,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/73.png",
    name: "Angel Wings",
  },
  "Devil Wings": {
    description:
      "This Bumpkin has been doing Lucifer's dirty work and using black magic on crops.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      {
        display_type: "boost_percentage",
        trait_type: "Chance of Instant Crops",
        value: 30,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/72.png",
    name: "Devil Wings",
  },
  "Christmas Background": {
    description:
      "Deck the halls with gifts for Bumpkins, fa-la-la-la-la, la-la-la-la.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/71.png",
    name: "Christmas Background",
  },
  "Fire Hair": {
    description: "Some one has been eating too many beetroots!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/74.png",
    name: "Fire Hair",
  },
  "Luscious Hair": {
    description: "The secret to Luscious Hair is eating Kale every day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/75.png",
    name: "Luscious Hair",
  },
  "Mountain View Background": {
    description:
      "Exploring beyond the reach of the mountains, what a nice place for a picnic",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/78.png",
    name: "Mountain View Background",
  },
  "Reindeer Antlers": {
    description:
      "Rumour has it if you eat too many carrots, you will grow Antlers!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/80.png",
    name: "Reindeer Antlers",
  },
  "Shark Onesie": {
    description: "Bumpkin Shark do do do do do do.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/70.png",
    name: "Shark Onesie",
  },
  "Skull Hat": {
    description:
      "The most fierce warriors from the Goblin War can be seen wearing the skulls of their enemies!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/79.png",
    name: "Skull Hat",
  },
  "Santa Hat": {
    description: "Ho ho ho! Someone found Santa's lost hat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/81.png",
    name: "Santa Hat",
  },
  "Pineapple Shirt": {
    description:
      "You feel like taking a break from farming? Get on the holiday vibes with this shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/82.png",
    name: "Pineapple Shirt",
  },
  "China Town Background": {
    description: "A perfect day for a hungry Goblin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/83.png",
    name: "China Town Background",
  },
  "Lion Dance Mask": {
    description: "Bring good luck and drive away evil spirits.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/84.png",
    name: "Lion Dance Mask",
  },
  "Fruit Bowl": {
    description: "A festive fruit hat fit for any occasion!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/87.png",
    name: "Fruit Bowl",
  },
  "Fruit Picker Apron": {
    description:
      "Whether you're a professional fruit picker or just enjoy picking fruit as a hobby, this apron is a must-have accessory.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      {
        display_type: "boost_number",
        trait_type: "Increase Apple, Blueberry, Orange and Banana Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/86.png",
    name: "Fruit Picker Apron",
  },
  "Fruit Picker Shirt": {
    description:
      "A comfortable and sturdy shirt that can withstand the elements while picking fruit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/85.png",
    name: "Fruit Picker Shirt",
  },
  "Striped Blue Shirt": {
    description:
      "Yo ho ho, the pirate with the Striped Blue Shirt has style that'll make even Davy Jones jealous!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/88.png",
    name: "Striped Blue Shirt",
  },
  "Peg Leg": {
    description: "Your jig dancing skills would make Blackbeard proud!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/89.png",
    name: "Peg Leg",
  },
  "Pirate Potion": {
    description:
      "Becoming a pirate is like trading in your suit and tie for a life of adventure on the high seas!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      {
        display_type: "boost_number",
        trait_type: "Free Gift per day in beach digging area",
        value: 1,
      },
      { trait_type: "Boost", value: "Treasure" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/90.png",
    name: "Pirate Potion",
  },
  "Pirate Hat": {
    description:
      "Arrr! A pirate hat is the cherry on top of a swashbuckling ensemble that inspires fear and respect on the seven seas.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/91.png",
    name: "Pirate Hat",
  },
  "Crab Claw": {
    description:
      "The pirate's claw-some companion was a crab with a hook for a hand, making them the terror of the seas and the king and queen of crab cakes.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/95.png",
    name: "Crab Claw",
  },
  "Pirate General Coat": {
    description: "So grand, even the seas would salute you.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/92.png",
    name: "Pirate General Coat",
  },
  "Pirate Leather Polo": {
    description: "Rough and tough, just like his sea-faring reputation.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/94.png",
    name: "Pirate Leather Polo",
  },
  "Pirate Pants": {
    description:
      "With this pirate baggy pants, you could have hidden a whole treasure trove in the pockets.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/93.png",
    name: "Pirate Pants",
  },
  "Pirate Scimitar": {
    description:
      "The Pirate's scimitar is sharp enough to slice through the seven seas and sail with ease.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/96.png",
    name: "Pirate Scimitar",
  },
  "Cupid Hair": {
    description:
      "A whimsical headpiece that resembles the iconic wings and bow of Cupid, the Roman god of love.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/97.png",
    name: "Cupid Hair",
  },
  "Cupid Dress": {
    description:
      "A stunning piece of attire that perfectly captures the essence of Cupid. The dress is made from a soft, flowing fabric that drapes gracefully over the wearer's body.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/98.png",
    name: "Cupid Dress",
  },
  "Cupid Sandals": {
    description:
      "A pair of stylish footwear that adds the finishing touch to the Cupid ensemble",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/99.png",
    name: "Cupid Sandals",
  },
  "Love Quiver": {
    description:
      "A unique item that holds all of Cupid's arrows. The Love Quiver is a symbol of Cupid's power and is a must-have for any character who wants to embody the spirit of the Roman god of love.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/100.png",
    name: "Love Quiver",
  },
  "Bear Onesie": {
    description:
      "A cozy and cute outfit that will make you feel like a cuddly and playful bear. Perfect for parties!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/105.png",
    name: "Bear Onesie",
  },
  "Bumpkin Puppet": {
    description:
      "Gather around the Puppet Master as they tell the origins of Sunflower Land.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/102.png",
    name: "Bumpkin Puppet",
  },
  "Goblin Puppet": {
    description:
      "Gather around the Puppet Master as they tell the origins of Goblins and their struggles.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/103.png",
    name: "Goblin Puppet",
  },
  "Frog Onesie": {
    description:
      "This what happens when you kiss the frog! You turn into a magical amphibian.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/106.png",
    name: "Frog Onesie",
  },
  "Hawaiian Shirt": {
    description:
      "A must have for Bumpkins with a laid-back and tropical vibe. Perfect for beach parties.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/104.png",
    name: "Hawaiian Shirt",
  },
  "SFL Office Background": {
    description:
      "Immerse yourself in the office of the game designers! Feel right at home during live streams.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/101.png",
    name: "SFL Office Background",
  },
  "Tiger Onesie": {
    description: "Rarrrrrrgh!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/107.png",
    name: "Tiger Onesie",
  },
  "Lifeguard Hat": {
    description:
      "Stay cool and protected under the scorching sun with the Lifeguard Hat!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/109.png",
    name: "Lifeguard Hat",
  },
  "Lifeguard Shirt": {
    description:
      "Stand out as a guardian of the water in our Lifeguard Shirt! The bold and recognizable 'LIFEGUARD' print on the front and back of the shirt ensures that you'll be easily spotted in an emergency situation.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/111.png",
    name: "Lifeguard Shirt",
  },
  "Lifeguard Pants": {
    description:
      "Stay agile and ready to jump into action with our Lifeguard Pants! With multiple pockets, you can easily store your lifeguarding essentials like a whistle, sunscreen, and gloves. Whether you're patrolling the beach, pool, or waterpark, our Lifeguard Pants are the perfect addition to your lifeguarding gear.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/110.png",
    name: "Lifeguard Pants",
  },
  "Beach Sarong": {
    description:
      "Perfect for a day in the sun or a sunset stroll along the beach, our Beach Sarong is an essential addition to your beach bag.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/108.png",
    name: "Beach Sarong",
  },
  "Tropical Sarong": {
    description:
      "Bring the beauty of the tropics to your beach or pool day with our Tropical Sarong!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/113.png",
    name: "Tropical Sarong",
  },
  "Sleeping Otter": {
    description:
      "This cute and cuddly otter loves nothing more than curling up on your head for a nap. A must-have for Project Dignity supporters",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/112.png",
    name: "Sleeping Otter",
  },
  "Sequence Hat": {
    description:
      "Introducing the ultimate collectible hat for all crypto enthusiasts and bumpkins alike, created in collaboration with Sequence, a leading crypto wallet provider. Available through special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/114.png",
    name: "Sequence Hat",
  },
  "Sequence Shirt": {
    description:
      "The ultimate wearable for those who want to show their love for crypto and the Sequence platform. Available through special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/115.png",
    name: "Sequence Shirt",
  },
  "St Patricks Hat": {
    description:
      "Top o' the mornin' to ya, me friend! A special event item found at Bumpkin parties during the festive season",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/116.png",
    name: "St Patricks Hat",
  },
  "Bunny Onesie": {
    description:
      "A charming and adorable ensemble that will transform you into a lovable and bouncy bunny. Ideal for gatherings and celebrations!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/117.png",
    name: "Bunny Onesie",
  },
  "Polkastarter Shirt": {
    description:
      "Show your love for gaming with this exclusive Polkastarter Shirt. Available from special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/119.png",
    name: "Polkastarter Shirt",
  },
  "Light Brown Worried Farmer Potion": {
    description: "?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/118.png",
    name: "Light Brown Worried Farmer Potion",
  },
  "Beach Trunks": {
    description:
      "Get ready to catch some rays and make a splash with these beach trunks that are perfect for a day out by the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/120.png",
    name: "Beach Trunks",
  },
  "Club Polo": {
    description:
      "Look sharp and stylish at the farmers market with this fancy club polo that's sure to turn heads and make you stand out.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/121.png",
    name: "Club Polo",
  },
  "Dawn Breaker Background": {
    description:
      "Set the mood and create an atmosphere of peace and tranquility with this stunning dawn breaker background that will transport you to a serene and beautiful place.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/122.png",
    name: "Dawn Breaker Background",
  },
  "Dawn Lamp": {
    description:
      "Light up your life and your farm with this sturdy and reliable dawn lamp that's perfect for early mornings and late nights.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/123.png",
    name: "Dawn Lamp",
  },
  "Eggplant Onesie": {
    description:
      "Keep cozy and comfortable in the eggplant fields with this cute and snuggly eggplant onesie that's perfect for lazy afternoons and chilly evenings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      {
        display_type: "boost_number",
        trait_type: "Increase Eggplant Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/124.png",
    name: "Eggplant Onesie",
  },
  "Fox Hat": {
    description:
      "Get wild and free with this furry and playful fox hat that's perfect for exploring the great outdoors and going on exciting adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/125.png",
    name: "Fox Hat",
  },
  "Grave Diggers Shovel": {
    description:
      "Dig up some spooky and exciting surprises with this creepy and cool grave diggers shovel that's perfect for Halloween and other fun events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/126.png",
    name: "Grave Diggers Shovel",
  },
  "Infected Potion": {
    description:
      "Mix things up and add a little bit of excitement to your farming routine with this strange and mysterious infected potion that's sure to surprise and delight.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/127.png",
    name: "Infected Potion",
  },
  "Mushroom Hat": {
    description:
      "Get in touch with nature and feel like a whimsical woodland creature with this adorable and charming mushroom hat that's perfect for exploring the woods and foraging for mushrooms.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      {
        display_type: "boost_number",
        trait_type: "Increase Mushroom Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Resource" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/128.png",
    name: "Mushroom Hat",
  },
  "Mushroom Lamp": {
    description:
      "Set the mood and create a magical atmosphere on your farm with this enchanting and delightful mushroom lamp that will transport you to a world of wonder and whimsy.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/129.png",
    name: "Mushroom Lamp",
  },
  "Mushroom Lights Background": {
    description:
      "Add a touch of magic and mystery to your farm with this mystical and otherworldly mushroom lights background that's perfect for creating an atmosphere of enchantment and wonder.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/130.png",
    name: "Mushroom Lights Background",
  },
  "Mushroom Pants": {
    description:
      "Keep it practical and stylish with these sturdy and reliable mushroom pants that are perfect for exploring the woods and foraging for mushrooms.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/131.png",
    name: "Mushroom Pants",
  },
  "Mushroom Shield": {
    description:
      "Protect yourself from danger and look cool doing it with this sturdy and reliable mushroom shield that's perfect for fending off pests and predators.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/132.png",
    name: "Mushroom Shield",
  },
  "Mushroom Shoes": {
    description:
      "Keep your feet dry and comfy with these adorable and charming mushroom shoes that are perfect for exploring the woods and foraging for mushrooms.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/133.png",
    name: "Mushroom Shoes",
  },
  "Mushroom Sweater": {
    description:
      "Keep warm and stylish with this cozy and comfortable mushroom sweater that's perfect for chilly nights and lazy afternoons.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/134.png",
    name: "Mushroom Sweater",
  },
  "Rash Vest": {
    description:
      "Get ready for some fun in the sun with this stylish and practical rash vest that's perfect for staying safe and comfortable while you're out on the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/135.png",
    name: "Rash Vest",
  },
  "Squid Hat": {
    description:
      "Get in touch with your inner sea creature with this fun and playful squid hat that's perfect for going on aquatic adventures and exploring the deep blue sea.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/136.png",
    name: "Squid Hat",
  },
  "Striped Red Shirt": {
    description:
      "Keep it simple and stylish with this classic and timeless striped red shirt that's perfect for any occasion.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/137.png",
    name: "Striped Red Shirt",
  },
  "Striped Yellow Shirt": {
    description:
      "Add a pop of color and excitement to your wardrobe with this vibrant and cheerful striped yellow shirt that's sure to brighten up your day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/138.png",
    name: "Striped Yellow Shirt",
  },
  "Summer Top": {
    description:
      "Keep cool and comfortable during the hot summer months with this cute and stylish summer top that's perfect for any occasion.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/139.png",
    name: "Summer Top",
  },
  "Sunburst Potion": {
    description:
      "Add a touch of magic and wonder to your farming routine with this exciting and mysterious sunburst potion that's sure to surprise and delight.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/140.png",
    name: "Sunburst Potion",
  },
  "Water Gun": {
    description:
      "Get ready for some good old-fashioned fun in the sun with this playful and exciting water gun that's perfect for splashing around with your friends and family.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/141.png",
    name: "Water Gun",
  },
  "Wavy Pants": {
    description: "Add a touch of flair and style to your farming",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/142.png",
    name: "Wavy Pants",
  },
  "White Turtle Neck": {
    description:
      "When the winter winds are blowin' cold and fierce, this here white turtle neck keeps me warm and toasty, and it looks darn good too.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/143.png",
    name: "White Turtle Neck",
  },
  "Trial Tee": {
    description: "A shirt only attained through special testing sessions.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/144.png",
    name: "Trial Tee",
  },
  "Auction Megaphone": {
    description:
      "Amp up the bidding frenzy with this booming piece of equipment. Nothing says 'sold!' quite like the Auction Megaphone.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/145.png",
    name: "Auction Megaphone",
  },
  "Auctioneer Slacks": {
    description:
      "Crafted for comfort and style, these slacks ensure you're never out of place, whether in the auction house or the cornfield.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/146.png",
    name: "Auctioneer Slacks",
  },
  "Bidder's Brocade": {
    description:
      "Elegance meets business with this blazer, your partner in turning any bid into a winning one.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/147.png",
    name: "Bidder's Brocade",
  },
  "Harry's Hat": {
    description:
      "From the sun-drenched wheat fields to the auction's spotlight, this hat's a symbol of Harry's dedication to his craft.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/148.png",
    name: "Harry's Hat",
  },
  "Leather Shoes": {
    description:
      "No auctioneer's ensemble is complete without these sturdy, yet stylish, leather shoes. They're made for walkin', and that's just what they'll do.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/149.png",
    name: "Leather Shoes",
  },
  "Tangerine Hair": {
    description:
      "Stand out from the crowd with Harry's vibrant tangerine hair, spiked to perfection and crowned with a mustache of authority.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/150.png",
    name: "Tangerine Hair",
  },
  "Witching Wardrobe": {
    description:
      "Step into the realm of style and elegance with the bewitching Witching Wardrobe wearable.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/155.png",
    name: "Witching Wardrobe",
  },
  "Witch's Broom": {
    description:
      "Take flight on the wings of magic with the Witches Broom wearable.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/156.png",
    name: "Witch's Broom",
  },
  "Infernal Bumpkin Potion": {
    description: "Unleash your infernal charm with the Infernal Bumpkin potion",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/157.png",
    name: "Infernal Bumpkin Potion",
  },
  "Infernal Goblin Potion": {
    description: "Unleash your infernal charm with the Infernal Goblin potion",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/158.png",
    name: "Infernal Goblin Potion",
  },
  "Imp Costume": {
    description:
      "Transform into a playful and charismatic imp with the Imp Costume wearable. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/159.png",
    name: "Imp Costume",
  },
  "Ox Costume": {
    description:
      "Embrace the strength and resilience of the ox with the Ox Suit wearable.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/160.png",
    name: "Ox Costume",
  },
  "Luna's Hat": {
    description:
      "Unleash your culinary prowess with Luna's Hat, a whimsical accessory that enhances your cooking speed.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -50,
      },
      { trait_type: "Boost", value: "Cooking" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/161.png",
    name: "Luna's Hat",
  },
  "Infernal Pitchfork": {
    description:
      "Embrace the power of the Infernal Pitchfork and witness the land yield a bountiful harvest. (Does not stack with criticals).",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 3,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/162.png",
    name: "Infernal Pitchfork",
  },
  "Infernal Horns": {
    description:
      "Tap into your inner infernal power with the Infernal Horns wearable. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/163.png",
    name: "Infernal Horns",
  },
  Cattlegrim: {
    description:
      "Harness the extraordinary abilities of the Cattlegrim and witness your animal produce soar to new heights.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      {
        display_type: "boost_number",
        trait_type: "Increase Animal Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Animal" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/164.png",
    name: "Cattlegrim",
  },
  "Crumple Crown": {
    description:
      "Crown yourself with the illustrious Crumple Crown, an exclusive wearable that exudes elegance and refinement.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/165.png",
    name: "Crumple Crown",
  },
  "Merch Bucket Hat": {
    description: "A stylish bucket hat featuring the Sunflower Land logo.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/166.png",
    name: "Merch Bucket Hat",
  },
  "Merch Coffee Mug": {
    description: "A Sunflower Land coffee mug to keep you caffeinated.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/167.png",
    name: "Merch Coffee Mug",
  },
  "Dawn Breaker Tee": {
    description: "Show your love for Sunflower Land with this exclusive tee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/168.png",
    name: "Dawn Breaker Tee",
  },
  "Merch Tee": {
    description: "Official Sunflower Land merchandise tee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/169.png",
    name: "Merch Tee",
  },
  "Merch Hoodie": {
    description: "Stay cozy with this Sunflower Land hoodie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/170.png",
    name: "Merch Hoodie",
  },
  "Birthday Hat": {
    description: "Celebrate with this festive birthday hat.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/171.png",
    name: "Birthday Hat",
  },
  "Double Harvest Cap": {
    description: "Double the harvest, double the fun.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/172.png",
    name: "Double Harvest Cap",
  },
  "Streamer Helmet": {
    description: "Stream your adventures with this stylish helmet.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/173.png",
    name: "Streamer Helmet",
  },
  "Corn Onesie": {
    description: "Transform into a cornstalk in this comfy onesie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      {
        display_type: "boost_number",
        trait_type: "Increase Corn Yield",
        value: 0.1,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/174.png",
    name: "Corn Onesie",
  },
  "Crow Wings": {
    description: "Fly high with these crow-like wings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/175.png",
    name: "Crow Wings",
  },
  "Witches' Eve Tee": {
    description: "Celebrate Witches' Eve with this special tee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/176.png",
    name: "Witches' Eve Tee",
  },
  "Wise Beard": {
    description: "Show your wisdom with this majestic beard.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Beard" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/177.png",
    name: "Wise Beard",
  },
  "Pumpkin Hat": {
    description: "Get into the spirit of autumn with this pumpkin hat.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/178.png",
    name: "Pumpkin Hat",
  },
  "Wise Book": {
    description: "Carry your knowledge with this ancient tome.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/179.png",
    name: "Wise Book",
  },
  "Wise Hair": {
    description: "Hair that exudes wisdom and experience.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/180.png",
    name: "Wise Hair",
  },
  "Wise Robes": {
    description: "Robes worn by the wisest of Bumpkins.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/181.png",
    name: "Wise Robes",
  },
  "Wise Slacks": {
    description: "Stylish and comfortable slacks for the wise Bumpkin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/182.png",
    name: "Wise Slacks",
  },
  "Wise Staff": {
    description: "Channel your inner wisdom with this magical staff.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/183.png",
    name: "Wise Staff",
  },
  "Greyed Glory": {
    description: "Grey hair that adds a touch of maturity.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/184.png",
    name: "Greyed Glory",
  },
  "Tattered Jacket": {
    description: "A worn-out jacket with a story to tell.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/185.png",
    name: "Tattered Jacket",
  },
  "Hoary Chin": {
    description: "A beard that shows the passage of time.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Beard" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/186.png",
    name: "Hoary Chin",
  },
  "Tattered Slacks": {
    description: "Slacks that have seen their fair share of adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/187.png",
    name: "Tattered Slacks",
  },
  "Old Shoes": {
    description: "Sturdy shoes that have stood the test of time.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/188.png",
    name: "Old Shoes",
  },
  "Bat Wings": {
    description: "Wings that evoke the spirit of the night.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/189.png",
    name: "Bat Wings",
  },
  "Gothic Twilight": {
    description: "A dress that captures the essence of twilight.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/190.png",
    name: "Gothic Twilight",
  },
  "Dark Enchantment Gown": {
    description: "A gown that exudes a mysterious enchantment.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/191.png",
    name: "Dark Enchantment Gown",
  },
  "Goth Hair": {
    description: "Hair that embraces the darkness of the night.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/192.png",
    name: "Goth Hair",
  },
  "Pale Potion": {
    description: "A potion that gives your Bumpkin a pale appearance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/193.png",
    name: "Pale Potion",
  },
  "Stretched Jeans": {
    description: "Jeans perfect for a laid-back and casual look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/194.png",
    name: "Stretched Jeans",
  },
  "Skull Shirt": {
    description: "A shirt adorned with skulls for a daring style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/195.png",
    name: "Skull Shirt",
  },
  "Victorian Hat": {
    description: "A hat inspired by the elegance of the Victorian era.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/196.png",
    name: "Victorian Hat",
  },
  "Boater Hat": {
    description: "A classic boater hat for a stylish look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/197.png",
    name: "Boater Hat",
  },
  "Antique Dress": {
    description: "A dress that embodies vintage charm.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/198.png",
    name: "Antique Dress",
  },
  "Crimson Skirt": {
    description: "A skirt in a vibrant crimson shade.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/199.png",
    name: "Crimson Skirt",
  },
  "Chic Gala Blouse": {
    description: "A blouse that's perfect for a gala event.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/200.png",
    name: "Chic Gala Blouse",
  },
  "Ash Ponytail": {
    description: "A ponytail with a subtle ash-gray hue.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/201.png",
    name: "Ash Ponytail",
  },
  "Pink Ponytail": {
    description: "A playful ponytail in a delightful pink color.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/202.png",
    name: "Pink Ponytail",
  },
  "Silver Streaks": {
    description: "Streaks of silver add a touch of sophistication.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/203.png",
    name: "Silver Streaks",
  },
  "Straw Hat": {
    description: "A classic and timeless straw hat for a sunny day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/151.png",
    name: "Straw Hat",
  },
  "Traveller's Backpack": {
    description:
      "A functional and stylish backpack for the adventurous Bumpkin.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/152.png",
    name: "Traveller's Backpack",
  },
  "Traveller's Pants": {
    description: "Comfortable pants that are essential for any journey.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/153.png",
    name: "Traveller's Pants",
  },
  "Traveller's Shirt": {
    description: "A versatile shirt that suits any traveler's wardrobe.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/154.png",
    name: "Traveller's Shirt",
  },
  "Potato Suit": {
    description:
      "A quirky and amusing potato-themed suit for those who love a good laugh.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/206.png",
    name: "Potato Suit",
  },
  "Parsnip Horns": {
    description:
      "A unique set of parsnip-shaped horns that adds a touch of whimsy to any outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/205.png",
    name: "Parsnip Horns",
  },
  "Brown Rancher Hair": {
    description:
      "A rugged and tousled hairstyle inspired by the hardworking ranchers of the countryside.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/204.png",
    name: "Brown Rancher Hair",
  },
  "Whale Hat": {
    description:
      "A fun and charming hat shaped like a friendly whale, perfect for ocean enthusiasts.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/207.png",
    name: "Whale Hat",
  },
  "Pumpkin Shirt": {
    description:
      "A cute shirt with a pumpkin design, perfect for fall festivities.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/208.png",
    name: "Pumpkin Shirt",
  },
  Halo: {
    description:
      "A glowing halo that gives a celestial aura to its wearer. A symbol of a moderator",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/209.png",
    name: "Halo",
  },
  Kama: {
    description: "A dark mysterious farming sickle.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/210.png",
    name: "Kama",
  },
  "Grey Merch Hoodie": {
    description: "Stay cozy with this Sunflower Land grey hoodie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/211.png",
    name: "Grey Merch Hoodie",
  },
  "Unicorn Horn": {
    description: "Neiiiiigh. A magestical horn from the Crypto Unicorns collab",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/212.png",
    name: "Unicorn Horn",
  },
  "Unicorn Hat": {
    description: "Is that blossom? Fit right in with this rare unicorn hat",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "no" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/213.png",
    name: "Unicorn Hat",
  },
  "Feather Hat": {
    description:
      "A beautiful rare green feather hat - a special event giveaway",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/214.png",
    name: "Feather Hat",
  },
  "Valoria Wreath": {
    description: "A wreath from Valoria!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/215.png",
    name: "Valoria Wreath",
  },
  "Earn Alliance Sombrero": {
    description: "A sombrero from the Earn Alliance!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/216.png",
    name: "Earn Alliance Sombrero",
  },
  "Fresh Catch Vest": {
    description:
      "A comfortable and practical vest for your fishing adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/217.png",
    name: "Fresh Catch Vest",
  },
  "Fish Pro Vest": {
    description: "A vest designed for professional fishermen.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/218.png",
    name: "Fish Pro Vest",
  },
  "Reel Fishing Vest": {
    description:
      "A vest equipped with pockets and style to enhance your fishing experience.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/219.png",
    name: "Reel Fishing Vest",
  },
  "Clown Shirt": {
    description:
      "A playful and colorful shirt that adds a touch of fun to your outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/220.png",
    name: "Clown Shirt",
  },
  "Luminous Anglerfish Topper": {
    description: "A unique hat featuring the luminous anglerfish.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "XP" },
      {
        display_type: "boost_percentage",
        value: 50,
        trait_type: "Increase Fish XP",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/221.png",
    name: "Luminous Anglerfish Topper",
  },
  "Abyssal Angler Hat": {
    description: "A mysterious hat inspired by the depths of the ocean.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/222.png",
    name: "Abyssal Angler Hat",
  },
  Harpoon: {
    description:
      "A versatile tool designed for spearfishing and capturing larger fish.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/223.png",
    name: "Harpoon",
  },
  "Ancient Rod": {
    description:
      "A fishing rod with a classic design, perfect for those who appreciate tradition.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Cast Fish without Rod",
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/224.png",
    name: "Ancient Rod",
  },
  "Fishing Hat": {
    description:
      "A practical and stylish hat that provides shade while fishing in the sun.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/225.png",
    name: "Fishing Hat",
  },
  "Saw Fish": {
    description:
      "A unique and formidable fishing tool for cutting through tough materials.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/238.png",
    name: "Saw Fish",
  },
  Trident: {
    description: "A mythical fishing tool.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        value: 20,
        trait_type: "Fish Critical Hit Chance",
      },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Fish Critical Hit Amount",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/226.png",
    name: "Trident",
  },
  "Bucket O' Worms": {
    description:
      "An essential secondary tool for bait, ensuring you're well-prepared for fishing.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Boost", value: "Bait" },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Increase Worm Yield",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/228.png",
    name: "Bucket O' Worms",
  },
  "Coconut Mask": {
    description: "A fun and tropical-themed mask.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/229.png",
    name: "Coconut Mask",
  },
  "Crab Trap": {
    description:
      "A handcrafted trap, designed for those who desire to catch an additional crab when digging or drilling.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "+1 Crab when digging or drilling",
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/230.png",
    name: "Crab Trap",
  },
  "Seaside Tank Top": {
    description:
      "A comfortable and casual tank top, ideal for a day by the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/231.png",
    name: "Seaside Tank Top",
  },
  "Fish Trap": {
    description: "An decorative trap for catching fish.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/232.png",
    name: "Fish Trap",
  },
  "Fishing Pants": {
    description:
      "Durable and comfortable pants designed for a full day of fishing.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/233.png",
    name: "Fishing Pants",
  },
  "Angler Waders": {
    description:
      "Waders that keep you dry and comfortable while fishing in water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_number",
        value: 10,
        trait_type: "Increase Daily Fishing Attempts",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/234.png",
    name: "Angler Waders",
  },
  "Fishing Spear": {
    description:
      "A specialized tool for spearfishing, adding excitement to your fishing adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/235.png",
    name: "Fishing Spear",
  },
  "Flip Flops": {
    description:
      "Lightweight and easy-to-wear shoes for a relaxed day at the beach.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/236.png",
    name: "Flip Flops",
  },
  Wellies: {
    description:
      "Waterproof and practical shoes for everyday greenhouse gardening adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/237.png",
    name: "Wellies",
  },
  "Skinning Knife": {
    description:
      "A sharp and precise tool for cleaning and preparing your catch.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/239.png",
    name: "Skinning Knife",
  },
  "Sunflower Rod": {
    description:
      "A rod with a cheerful sunflower energy, perfect for sunny days by the water.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        value: 10,
        trait_type: "Fish Critical Hit Chance",
      },
      {
        display_type: "boost_number",
        value: 1,
        trait_type: "Fish Critical Hit Amount",
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/240.png",
    name: "Sunflower Rod",
  },
  "Tackle Box": {
    description:
      "An organized and spacious container for storing your fishing gear.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/241.png",
    name: "Tackle Box",
  },
  "Infernal Rod": {
    description: "A fiery and eye-catching fishing rod with a unique design.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/227.png",
    name: "Infernal Rod",
  },
  "Mermaid Potion": {
    description: "?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/242.png",
    name: "Mermaid Potion",
  },
  "Squirrel Monkey Potion": {
    description: "?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/243.png",
    name: "Squirrel Monkey Potion",
  },
  "Koi Fish Hat": {
    description:
      "A hat inspired by the graceful and colorful koi fish, adding an elegant touch to your outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/244.png",
    name: "Koi Fish Hat",
  },
  "Normal Fish Hat": {
    description: "A classic fish-themed hat, perfect for fishing enthusiasts.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/245.png",
    name: "Normal Fish Hat",
  },
  "Stockeye Salmon Onesie": {
    description:
      "A cozy and fun onesie featuring the Stockeye Salmon, ideal for cold fishing trips.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/246.png",
    name: "Stockeye Salmon Onesie",
  },
  "Tiki Armor": {
    description:
      "A set of stylish and protective armor with a island inspired design.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/247.png",
    name: "Tiki Armor",
  },
  "Tiki Mask": {
    description:
      "A unique mask that adds a touch of mystery and style to your outfit.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/248.png",
    name: "Tiki Mask",
  },
  "Tiki Pants": {
    description:
      "Comfortable and fashionable island themed pants, perfect for a tropical adventure.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/249.png",
    name: "Tiki Pants",
  },
  "Banana Amulet": {
    description:
      "Go bananas for this amulet! Legends whisper it grants its wearer a-peel-ing charm and a slip-free day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      {
        display_type: "boost_number",
        trait_type: "Increase Banana Yield",
        value: 0.5,
      },
      { trait_type: "Boost", value: "Fruit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/250.png",
    name: "Banana Amulet",
  },
  "Banana Onesie": {
    description:
      "Cute and cozy, embrace the essence of a banana in this adorable onesie.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_percentage",
        trait_type: "Banana Growth Time",
        value: -20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/251.png",
    name: "Banana Onesie",
  },
  "Basic Dumbo": {
    description:
      "A simple and classic hat featuring the iconic tentacles of a lovable octopus.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/252.png",
    name: "Basic Dumbo",
  },
  "Companion Cap": {
    description:
      "A trusty cap that keeps you company on your virtual adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/253.png",
    name: "Companion Cap",
  },
  "Dazzling Dumbo": {
    description:
      "Stand out with this dazzling hat that adds a touch of sparkle to your style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/254.png",
    name: "Dazzling Dumbo",
  },
  "Deep Sea Helm": {
    description:
      "Dive into the depths with this nautical-inspired helm, perfect for underwater explorations.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Fish" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Chance of Marine Marvels",
        value: 200,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/255.png",
    name: "Deep Sea Helm",
  },
  "Gloomy Dumbo": {
    description:
      "Express your emotions with this somber hat, featuring the iconic tentacles of a certain melancholy octopus.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/256.png",
    name: "Gloomy Dumbo",
  },
  "Pickaxe Shark": {
    description:
      "Equip yourself with this trusty pickaxe fashioned like a shark, ready for farming adventures.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/257.png",
    name: "Pickaxe Shark",
  },
  "Seedling Hat": {
    description:
      "Embrace the spirit of agriculture with this charming hat adorned with sprouting seedlings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/258.png",
    name: "Seedling Hat",
  },
  "Stormy Dumbo": {
    description:
      "Weather the storm in style with this hat featuring the turbulent tentacles of an octopus caught in a tempest.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/259.png",
    name: "Stormy Dumbo",
  },
  "Ugly Christmas Sweater": {
    description: "A whimsical holiday wearable from Earn Alliance",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/260.png",
    name: "Ugly Christmas Sweater",
  },
  "Candy Cane": {
    description: "A festive tool for spreading sweet holiday cheer.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/261.png",
    name: "Candy Cane",
  },
  "Elf Hat": {
    description: "Get into the holiday spirit with this whimsical elf hat.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/262.png",
    name: "Elf Hat",
  },
  "Elf Potion": {
    description: "Magical elixir to bring out your inner elf.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Body" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/263.png",
    name: "Elf Potion",
  },
  "Elf Shoes": {
    description: "Stylish footwear to complete your elfin look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/264.png",
    name: "Elf Shoes",
  },
  "Elf Suit": {
    description: "A complete elf outfit for festive occasions.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/265.png",
    name: "Elf Suit",
  },
  "Santa Beard": {
    description: "Classic white beard to transform into the jolly old elf.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Beard" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/266.png",
    name: "Santa Beard",
  },
  "Santa Suit": {
    description: "The iconic red suit for spreading joy as Santa Claus.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/267.png",
    name: "Santa Suit",
  },
  "Butterfly Wings": {
    description: "Delicate and colorful wings to add a touch of enchantment.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/268.png",
    name: "Butterfly Wings",
  },
  "Cozy Hoodie": {
    description:
      "Warm and comfortable hoodie for a snug and stylish winter look.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/269.png",
    name: "Cozy Hoodie",
  },
  "New Years Tiara": {
    description:
      "Elegant tiara to sparkle and shine as you welcome the new year.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/270.png",
    name: "New Years Tiara",
  },
  "Northern Lights Background": {
    description:
      "Mesmerizing background capturing the beauty of the northern lights.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/271.png",
    name: "Northern Lights Background",
  },
  "Short Shorts": {
    description: "Cool and trendy shorts for a casual and fashionable vibe.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/272.png",
    name: "Short Shorts",
  },
  "Winter Jacket": {
    description:
      "Insulated jacket to keep you warm and fashionable during winter.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/273.png",
    name: "Winter Jacket",
  },
  "Beehive Staff": {
    description: "A staff that harnesses the power of bees.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/274.png",
    name: "Beehive Staff",
  },
  "Bee Smoker": {
    description: "A tool that calms bees.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/275.png",
    name: "Bee Smoker",
  },
  "Bee Suit": {
    description: "Bee the best you can bee.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Honey Yield per full beehive",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/276.png",
    name: "Bee Suit",
  },
  "Bee Wings": {
    description: "Wings that shimmer with the iridescence of blooming flowers",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/277.png",
    name: "Bee Wings",
  },
  "Beekeeper Hat": {
    description: "A hat that protects you from bee stings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Honey Production Speed",
        value: 0.2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/278.png",
    name: "Beekeeper Hat",
  },
  "Beekeeper Suit": {
    description: "A suit that protects you from bee stings.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/279.png",
    name: "Beekeeper Suit",
  },
  "Crimstone Boots": {
    description: "Leave a trail vibrant red hues with each step.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/280.png",
    name: "Crimstone Boots",
  },
  "Crimstone Pants": {
    description: "Exude wealth and power with these rare gem pants.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/281.png",
    name: "Crimstone Pants",
  },
  "Crimstone Armor": {
    description: "A set of prestigious and protective armor.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/282.png",
    name: "Crimstone Armor",
  },
  "Gardening Overalls": {
    description: "Live and breathe the cottage core life.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/283.png",
    name: "Gardening Overalls",
  },
  "Crimstone Hammer": {
    description: "Behold the mega Crimstone.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Crimstone Yield on 5th Mine",
        value: 2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/284.png",
    name: "Crimstone Hammer",
  },
  "Crimstone Amulet": {
    description: "Regenerate Crimstone with amazing speed.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Crimstone Cooldown Time",
        value: -20,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/285.png",
    name: "Crimstone Amulet",
  },
  "Full Bloom Shirt": {
    description: "A floral masterpiece bursting with color and charm.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/286.png",
    name: "Full Bloom Shirt",
  },
  "Blue Blossom Shirt": {
    description:
      "Adorn yourself in soothing hues and delicate floral patterns.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/287.png",
    name: "Blue Blossom Shirt",
  },
  "Fairy Sandals": {
    description: "Ethereal footwear that adds a touch of magic to every step.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/288.png",
    name: "Fairy Sandals",
  },
  "Daisy Tee": {
    description:
      "A simple tee perfect for a day filled with sunshine and smiles.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/289.png",
    name: "Daisy Tee",
  },
  "Propeller Hat": {
    description:
      "A whimsical accessory that adds a playful touch to your style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/290.png",
    name: "Propeller Hat",
  },
  "Honeycomb Shield": {
    description: "A golden symphony of protection and style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Honey Yield per full beehive",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/291.png",
    name: "Honeycomb Shield",
  },
  "Hornet Mask": {
    description:
      "A bold accessory that captures the fierce yet fashionable spirit of the hornet.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Chance of Bee Swarm",
        value: 100,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/292.png",
    name: "Hornet Mask",
  },
  "Flower Crown": {
    description: "Crown yourself in petals, reign as the garden's royalty!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Flower" },
      {
        display_type: "boost_percentage",
        trait_type: "Flower Growth Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/293.png",
    name: "Flower Crown",
  },
  "Blue Monarch Dress": {
    description: "Flutter into style with the Blue Monarch Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/294.png",
    name: "Blue Monarch Dress",
  },
  "Green Monarch Dress": {
    description:
      "Transform into a forest butterfly with the Green Monarch Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/295.png",
    name: "Green Monarch Dress",
  },
  "Orange Monarch Dress": {
    description: "Blaze with elegance in the Orange Monarch Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/296.png",
    name: "Orange Monarch Dress",
  },
  "Blue Monarch Shirt": {
    description: "Dress casually royal in the Blue Monarch Shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/297.png",
    name: "Blue Monarch Shirt",
  },
  "Green Monarch Shirt": {
    description: "Channel leafy monarch vibes with the Green Monarch Shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/298.png",
    name: "Green Monarch Shirt",
  },
  "Orange Monarch Shirt": {
    description: "Paint the town red in the Orange Monarch Shirt.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/299.png",
    name: "Orange Monarch Shirt",
  },
  "Queen Bee Crown": {
    description: "Rule the hive with the Queen Bee Crown – majestic buzz!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/300.png",
    name: "Queen Bee Crown",
  },
  "Rose Dress": {
    description: "Bloom into beauty with the Rose Dress.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/301.png",
    name: "Rose Dress",
  },
  "Blue Rose Dress": {
    description:
      "A blue bloom of elegance – the Blue Rose Dress whispers enchantment!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/302.png",
    name: "Blue Rose Dress",
  },
  "Chicken Hat": {
    description: "What can a Bumpkin do with a lazy chicken?",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/303.png",
    name: "Chicken Hat",
  },
  "Lucky Red Hat": {
    description: "A hat that captures the magic of the moon and stars.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/304.png",
    name: "Lucky Red Hat",
  },
  "Lucky Red Suit": {
    description:
      "A suit that exudes the celestial energy of the moon and stars.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/305.png",
    name: "Lucky Red Suit",
  },
  "Love's Topper": {
    description: "A hat that captures the essence of love and romance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/307.png",
    name: "Love's Topper",
  },
  "Valentine's Field Background": {
    description: "A background that captures the spirit of love and romance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/306.png",
    name: "Valentine's Field Background",
  },
  "Non La Hat": {
    description: "A traditional hat that adds a touch of elegance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Rice Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/309.png",
    name: "Non La Hat",
  },
  "Oil Can": {
    description: "A tool for maintaining and repairing machinery.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil Yield",
        value: 2,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/308.png",
    name: "Oil Can",
  },
  "Olive Shield": {
    description: "A shield that provides protection and style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Olive Yield",
        value: 1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/310.png",
    name: "Olive Shield",
  },
  "Paw Shield": {
    description: "A shield that embodies the spirit of the wild.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Faction Pet Satiation",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 25,
      },
      { trait_type: "Boost", value: "Faction" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/311.png",
    name: "Paw Shield",
  },
  "Royal Robe": {
    description: "A majestic cape that exudes regal elegance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/312.png",
    name: "Royal Robe",
  },
  Crown: {
    description: "A crown that symbolizes power and authority.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/313.png",
    name: "Crown",
  },
  Pan: {
    description: "A versatile tool for cooking and baking.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase XP gains",
        value: 25,
      },
      { trait_type: "Boost", value: "XP" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/314.png",
    name: "Pan",
  },
  "Gift Giver": {
    description: "Wow, what a generous Bumpkin!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/316.png",
    name: "Gift Giver",
  },
  "Soybean Onesie": {
    description: "Soy soy soy!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/315.png",
    name: "Soybean Onesie",
  },
  "Olive Royalty Shirt": {
    description: "A royal olive, the food of the rich.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Olive Yield",
        value: 0.25,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/317.png",
    name: "Olive Royalty Shirt",
  },
  "Royal Scepter": {
    description: "The scepter of the ruling family.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/318.png",
    name: "Royal Scepter",
  },
  "Tofu Mask": {
    description: "The vegan warrior",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Crop" },
      {
        display_type: "boost_number",
        trait_type: "Increase Soybean Yield",
        value: 0.1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/319.png",
    name: "Tofu Mask",
  },
  "Cap n Bells": {
    description: "The fool's cap",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/340.png",
    name: "Cap n Bells",
  },
  "Pixel Perfect Hoodie": {
    description: "The beautification of Sunflower Land.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/342.png",
    name: "Pixel Perfect Hoodie",
  },
  "Queen's Crown": {
    description: "A symbol of hope and prosperity",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/343.png",
    name: "Queen's Crown",
  },
  "Royal Dress": {
    description: "A dress fit for a queen.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/344.png",
    name: "Royal Dress",
  },
  Motley: {
    description: "The traditional costume of a court room jester.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/345.png",
    name: "Motley",
  },
  "Goblin Armor": {
    description:
      "Rugged and rowdy, Goblin-approved protection. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/320.png",
    name: "Goblin Armor",
  },
  "Goblin Helmet": {
    description:
      "Strong and sturdy, crafted for fearless adventures in untamed lands. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/321.png",
    name: "Goblin Helmet",
  },
  "Goblin Pants": {
    description:
      "These pants blend agility with Goblin craftsmanship for swift maneuvers. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/322.png",
    name: "Goblin Pants",
  },
  "Goblin Sabatons": {
    description:
      "Designed to outpace and outlast any foe. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/323.png",
    name: "Goblin Sabatons",
  },
  "Goblin Axe": {
    description:
      "This axe is a testament to Goblin strength and unmatched battle prowess. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/324.png",
    name: "Goblin Axe",
  },
  "Nightshade Armor": {
    description:
      "An Armor, crafted for stealth and resilience in the shadows. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/325.png",
    name: "Nightshade Armor",
  },
  "Nightshade Helmet": {
    description:
      "A strong helmet of secrecy and silent strength. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/326.png",
    name: "Nightshade Helmet",
  },
  "Nightshade Pants": {
    description:
      "These pants are blending agility with the mystery of the night. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/327.png",
    name: "Nightshade Pants",
  },
  "Nightshade Sabatons": {
    description:
      "Perfect design where every step is a whisper in the dark. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/328.png",
    name: "Nightshade Sabatons",
  },
  "Nightshade Sword": {
    description:
      "A blade that strikes with the precision of moonlit steel. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/329.png",
    name: "Nightshade Sword",
  },
  "Bumpkin Armor": {
    description:
      "A sturdy protection that honors tradition and strength. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/330.png",
    name: "Bumpkin Armor",
  },
  "Bumpkin Helmet": {
    description:
      "Adorn your head with a symbol of rustic fortitude and unwavering resolve. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/331.png",
    name: "Bumpkin Helmet",
  },
  "Bumpkin Sword": {
    description:
      "A weapon forged in fields and forests, ready for any challenge. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/332.png",
    name: "Bumpkin Sword",
  },
  "Bumpkin Pants": {
    description:
      "Navigate countryside and city alike blending comfort with the spirit of adventure. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/333.png",
    name: "Bumpkin Pants",
  },
  "Bumpkin Sabatons": {
    description:
      "Stampede through fields in this sturdy footwear echoing the resilience of rural life. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/334.png",
    name: "Bumpkin Sabatons",
  },
  "Sunflorian Armor": {
    description:
      "A shimmering protection that mirrors the sun's strength. Earn +20% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 20,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/335.png",
    name: "Sunflorian Armor",
  },
  "Sunflorian Sword": {
    description:
      "A blade ablaze with the courage and brilliance of the sun. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/336.png",
    name: "Sunflorian Sword",
  },
  "Sunflorian Helmet": {
    description:
      "This helmet is a beacon of light and guardian against shadows. Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/337.png",
    name: "Sunflorian Helmet",
  },
  "Sunflorian Pants": {
    description:
      "Stride confidently in attire that captures the warmth and energy of all Sunflorians. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/338.png",
    name: "Sunflorian Pants",
  },
  "Sunflorian Sabatons": {
    description:
      "Each step taken in these shoes resonating with the power and vitality. Earn +5% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Faction" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/339.png",
    name: "Sunflorian Sabatons",
  },
  "Knight Gambit": {
    description:
      "Don this hat and be ready to charge into adventure with a playful twist of strategy and style.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/341.png",
    name: "Knight Gambit",
  },
  "Royal Braids": {
    description: "A hairstyle fit for a royal.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hair" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/346.png",
    name: "Royal Braids",
  },
  "Painter's Cap": {
    description: "A hat fit for a painter",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/347.png",
    name: "Painter's Cap",
  },
  "Festival of Colors Background": {
    description: "A background fit for a painter",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/348.png",
    name: "Festival of Colors Background",
  },
  "Pharaoh Headdress": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/349.png",
    name: "Pharaoh Headdress",
  },
  "Camel Onesie": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Patch Yield",
        value: 0.1,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/350.png",
    name: "Camel Onesie",
  },
  "Amber Amulet": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/351.png",
    name: "Amber Amulet",
  },
  "Desert Background": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/352.png",
    name: "Desert Background",
  },
  "Explorer Shirt": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/353.png",
    name: "Explorer Shirt",
  },
  "Dev Wrench": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_percentage",
        trait_type: "Oil Cooldown Reduction Time",
        value: -50,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/354.png",
    name: "Dev Wrench",
  },
  "Rock Hammer": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/355.png",
    name: "Rock Hammer",
  },
  "Sun Scarab Amulet": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/356.png",
    name: "Sun Scarab Amulet",
  },
  "Explorer Hat": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/357.png",
    name: "Explorer Hat",
  },
  "Oil Protection Hat": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/358.png",
    name: "Oil Protection Hat",
  },
  "Explorer Shorts": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/359.png",
    name: "Explorer Shorts",
  },
  "Oil Overalls": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Increase Oil Yield",
        value: 10,
      },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/360.png",
    name: "Oil Overalls",
  },
  "Desert Merchant Turban": {
    description: "A turban to stay safe from the fierce desert and sand.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/361.png",
    name: "Desert Merchant Turban",
  },
  "Desert Merchant Shoes": {
    description: "Protect your feet from the scorching heat of the desert.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/362.png",
    name: "Desert Merchant Shoes",
  },
  "Desert Merchant Suit": {
    description: "A light-weight attire worned by desert merchants.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Dress" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/363.png",
    name: "Desert Merchant Suit",
  },
  "Desert Camel Background": {
    description:
      "The Desert Camel accompanies you in the sand full of discovery.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/364.png",
    name: "Desert Camel Background",
  },
  "Water Gourd": {
    description: "Quench your thirst while exploring the desert.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/365.png",
    name: "Water Gourd",
  },
  "Rocket Onesie": {
    description:
      "Ready to blast off into imagination, it's a miniature marvel of cosmic adventure!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/366.png",
    name: "Rocket Onesie",
  },
  "Coin Aura": {
    description:
      "Its elegant dance captivates the eye, embodying the essence of prosperity and luxury before gracefully vanishing. ",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Aura" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/367.png",
    name: "Coin Aura",
  },
  "Ankh Shirt": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/368.png",
    name: "Ankh Shirt",
  },
  "Ancient Shovel": {
    description:
      "Ancient Shovel is a mystical tool that allows holders of this shovel to dig for treasure without needing a traditional sand shovel.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Dig treasure without Sand Shovel",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/369.png",
    name: "Ancient Shovel",
  },
  "Infernal Drill": {
    description:
      "Infernal Drill is a potent device that enables holders of drill to extract oil directly without the need for a traditional oil drill.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Resource" },
      {
        display_type: "boost_number",
        trait_type: "Drill Oil without Oil Drill",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/370.png",
    name: "Infernal Drill",
  },
  "Lemon Shield": {
    description:
      "Lemon Shield is a boost that enhances lemon production by increasing the yield of each harvest by 1.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "Yes" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Lemon Yield",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/371.png",
    name: "Lemon Shield",
  },
  "Scarab Wings": {
    description:
      "Scarab Wings is a vibrant and decorative accessory featuring intricate, winged designs that evoke ancient mysticism and elegance.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/372.png",
    name: "Scarab Wings",
  },
  "Grape Pants": {
    description: "Stylist pants for the grape farmer.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Boost", value: "Fruit" },
      {
        display_type: "boost_number",
        trait_type: "Increase Grape Yield",
        value: 0.2,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/373.png",
    name: "Grape Pants",
  },
  "Bionic Drill": {
    description:
      "The Bionic Drill is a state-of-the-art wearable designed for the modern desert explorer. Enjoy +5 desert digs per day.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      { trait_type: "Boost", value: "Treasure" },
      {
        display_type: "boost_number",
        trait_type: "Increase daily digs",
        value: 5,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/374.png",
    name: "Bionic Drill",
  },
  "Fossil Head": {
    description:
      "The Fossil Head is an artefact that was discovered by an ancient digger, it's said to be a rare find!",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "Yes" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/375.png",
    name: "Fossil Head",
  },
  "Bumpkin Crown": {
    description:
      "A magestic crown with intricate design and eerie glowing games, fit for a Bumpkin Leader. Earn 25% more in SFL and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase SFL gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/376.png",
    name: "Bumpkin Crown",
  },
  "Goblin Crown": {
    description:
      "A dark, jagged crown with glowing gems, ideal for the Goblin King. Earn 25% more in SFL and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase SFL gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/377.png",
    name: "Goblin Crown",
  },
  "Nightshade Crown": {
    description:
      "A midnight-black crown with deep purple and silver details, fitting for a leader whose presence commands respect and mystery. Earn 25% more in SFL and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase SFL gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/378.png",
    name: "Nightshade Crown",
  },
  "Sunflorian Crown": {
    description:
      "A majestic crown, adorned with a radiant ruby centerpiece and golden embellishments, it evokes the grandeur and authority of a leader. Earn 25% more in SFL and Coin deliveries, and Earn +10% marks when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Increase SFL gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Coins gained from deliveries",
        value: 25,
      },
      {
        display_type: "boost_percentage",
        trait_type: "Increase Marks gained",
        value: 10,
      },
      { trait_type: "Boost", value: "Other" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/379.png",
    name: "Sunflorian Crown",
  },
  "Bumpkin Shield": {
    description:
      "This shield radiates with a divine blue light, symbolizing protection and justice. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/380.png",
    name: "Bumpkin Shield",
  },
  "Goblin Shield": {
    description:
      "This shield is built for Goblin warriors who thrive in the heat of battle. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/381.png",
    name: "Goblin Shield",
  },
  "Nightshade Shield": {
    description:
      "The shield’s surface is a deep, shadowy black feathers with intricate violet accents that pulse with ominous energy. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/382.png",
    name: "Nightshade Shield",
  },
  "Sunflorian Shield": {
    description:
      "A symbol of divine authority, the Sunflorian Shield is reserved for only the most noble of kings and queens. Wood and mineral drops increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "SecondaryTool" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Wood Drops",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Mineral Drops",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Resource" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/383.png",
    name: "Sunflorian Shield",
  },
  "Bumpkin Quiver": {
    description:
      "The Bumpkin Quiver features vibrant red and blue fabrics, reinforced with iron accents that speak to the strength and resilience of the Bumpkin. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/384.png",
    name: "Bumpkin Quiver",
  },
  "Goblin Quiver": {
    description:
      "Crafted from the parts of horned-beasts and stitched with Goblin ingenuity, this quiver is as rugged as it is practical. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/385.png",
    name: "Goblin Quiver",
  },
  "Nightshade Quiver": {
    description:
      "Enigmatic and sleek, the Nightshade Quiver is bound in dark, supple leather, designed for those who harvest under the cover of darkness. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/386.png",
    name: "Nightshade Quiver",
  },
  "Sunflorian Quiver": {
    description:
      "The Sunflorian Quiver, crafted from luxurious cream-colored fabric and adorned with gleaming gold accents, is a symbol of royal grace and divine blessing. Crops and fruit yield increases by 0.25 when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Increase Fruit Yield",
        value: 0.25,
      },
      {
        display_type: "boost_number",
        trait_type: "Increase Crop Yield",
        value: 0.25,
      },
      { trait_type: "Boost", value: "Crop" },
      { trait_type: "Boost", value: "Fruit" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/387.png",
    name: "Sunflorian Quiver",
  },
  "Bumpkin Medallion": {
    description:
      "This sturdy medallion, crafted from iron and adorned with blue gem, is beloved by Bumpkins. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/388.png",
    name: "Bumpkin Medallion",
  },
  "Goblin Medallion": {
    description:
      "Favored by Goblins for its efficiency, it helps you prepare meals at lightning speed, just like their ingenious contraptions and creations. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/389.png",
    name: "Goblin Medallion",
  },
  "Nightshade Medallion": {
    description:
      "This medallion channels the Nightshade's secretive allure and their skill in crafting refined and exotic dishes swiftly. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/390.png",
    name: "Nightshade Medallion",
  },
  "Sunflorian Medallion": {
    description:
      "This medallion embodies the Sunflorians' blend of warmth and efficiency, ensuring your culinary creations are prepared with grace and swiftness. Enhances cooking speed by 25% when pledged to this faction. Multiples of this item do not stack.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_percentage",
        trait_type: "Cooking Time",
        value: -25,
      },
      { trait_type: "Boost", value: "Cooking" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/391.png",
    name: "Sunflorian Medallion",
  },
  "Pumpkin Plaza Background": {
    description:
      " A place where the air is filled with the scent of fresh pumpkins and the sound of a creaking windmill. The place is alive with unique Bumpkins, each with their own stories and quirks. Whether you're tending to the vibrant plaza or chatting with the locals, Pumpkin Plaza offers a warm, welcoming atmosphere that feels like home.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/392.png",
    name: "Pumpkin Plaza Background",
  },
  "Goblin Retreat Background": {
    description:
      "This lively enclave is where Goblins gather to trade rare resources and share tales of adventure. The Retreat is a bustling hub of activity, where Bumpkins can meet friends, engage in bartering, and uncover the secrets of the Goblin's mischievous ways.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/393.png",
    name: "Goblin Retreat Background",
  },
  "Kingdom Background": {
    description:
      "The majestic heart of the realm, where the queen presides over the land. The Kingdom is divided among four powerful factions — Bumpkins, Goblins, Nightshades, and Sunflorians — each vying for influence and favor.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Background" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/394.png",
    name: "Kingdom Background",
  },
  "Gam3s Cap": {
    description:
      "This stylish cap not only shows off your in-game style but also serves as a badge of honor for supporting your favourite in Web3 gaming in GAM3S.GG, a web3 gaming platform that acts as a hub for web3 gamers. Available through special events.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/395.png",
    name: "Gam3s Cap",
  },
  "Cowboy Hat": {
    description:
      "A classic wide-brimmed hat with a rugged charm, perfect for life on the open plains. Protects from the sun while adding a touch of cowboy style. +1 Horseshoe from Deliveries, Chores & Bounties during Bull Run Season.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Hat" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Horseshoe from Deliveries",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/396.png",
    name: "Cowboy Hat",
  },
  "Cowboy Shirt": {
    description:
      "This durable, checked shirt is made for the hardworking cowpoke. +1 Horseshoe from Deliveries, Chores & Bounties during Bull Run Season.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Horseshoe from Bounties",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/397.png",
    name: "Cowboy Shirt",
  },
  "Cowboy Trouser": {
    description:
      "These sturdy trousers are built to withstand the wear and tear of ranch life, complete with a touch of style fit for a true cowboy.  +1 Horseshoe from Deliveries, Chores & Bounties during Bull Run Season.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
      {
        display_type: "boost_number",
        trait_type: "Extra Horseshoe from Chores",
        value: 1,
      },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/398.png",
    name: "Cowboy Trouser",
  },
  "Cowboy Boots": {
    description:
      "A tough, stylish pair of leather boots, complete with spurs. Ideal for long days in the saddle and showing off your cowboy flair.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/399.png",
    name: "Cowboy Boots",
  },
  "Infernal Bullwhip": {
    description:
      "This menacing bullwhip is imbued with fiery power, making it as intimidating as it is effective. -50% Feed to Barn Animal",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Barn Animal Feed Reduction",
        value: 50,
      },
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/400.png",
    name: "Infernal Bullwhip",
  },
  "White Sheep Onesie": {
    description:
      "Cozy up in this fluffy, woolly onesie—perfect for a snug night in or a playful day in the plaza! With its irresistible charm, you will be the cutest sheep in the herd. 0.25+ Wool",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Wool",
        value: 0.25,
      },
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/401.png",
    name: "White Sheep Onesie",
  },
  "Black Sheep Onesie": {
    description:
      "Stand out in the flock with this soft, warm onesie. This charming black sheep outfit adds a fun twist to cozy wear. +2 Wool",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Wool",
        value: 2,
      },
      { trait_type: "Part", value: "Onesie" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/402.png",
    name: "Black Sheep Onesie",
  },
  "Chicken Suit": {
    description:
      "Cluck your way into any gathering with this playful Chicken Suit! +1 Feather",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Feather",
        value: 1,
      },
      { trait_type: "Part", value: "Suit" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/403.png",
    name: "Chicken Suit",
  },
  "Cowgirl Skirt": {
    description:
      "A stylish skirt with a Cowboy twist, perfect for those days spent in the sun or dancing around the bonfire.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/404.png",
    name: "Cowgirl Skirt",
  },
  "Merino Jumper": {
    description:
      "Crafted from the finest wool, this cozy jumper provides unparalleled warmth and comfort. +1 Merino Wool",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Merino Wool",
        value: 1,
      },
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/405.png",
    name: "Merino Jumper",
  },
  "Dream Scarf": {
    description:
      "A soft, ethereal scarf that feels like a whisper in the wind. Wrap yourself in comfort and style with this dreamy accessory. 20% reduction in Sheep sleep time.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_percentage",
        trait_type: "Sheep Produce Time",
        value: -20,
      },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/406.png",
    name: "Dream Scarf",
  },
  "Cowbell Necklace": {
    description:
      "A charming necklace for any dairy enthusiast featuring a tiny, jingling cowbell that cows can’t resist! +2 Milk",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Milk",
        value: 2,
      },
      { trait_type: "Part", value: "Necklace" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/407.png",
    name: "Cowbell Necklace",
  },
  "Milk Apron": {
    description:
      "A sturdy, practical apron designed for those working with dairy. Handy, comfortable, and perfect for any farmhouse chores. +0.5 Milk",
    decimals: 0,
    attributes: [
      { trait_type: "Boost", value: "Animal" },
      {
        display_type: "boost_number",
        trait_type: "Increase Yield of Milk",
        value: 0.5,
      },
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/408.png",
    name: "Milk Apron",
  },
  "Shepherd Staff": {
    description:
      "A tall, rustic staff crafted for herding. It’s both a trusty tool and a symbol of a watchful, caring shepherd.",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/409.png",
    name: "Shepherd Staff",
  },
  "Sol & Luna": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Wings" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/410.png",
    name: "Sol & Luna",
  },
  "Fossil Armor": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/411.png",
    name: "Fossil Armor",
  },
  "Fossil Pants": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Pants" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/412.png",
    name: "Fossil Pants",
  },
  "Rice Shirt": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shirt" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/413.png",
    name: "Rice Shirt",
  },
  Sickle: {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Tool" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/414.png",
    name: "Sickle",
  },
  "Speed Boots": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Shoes" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/415.png",
    name: "Speed Boots",
  },
  "Tomato Apron": {
    description: "",
    decimals: 0,
    attributes: [
      { trait_type: "Part", value: "Coat" },
      { trait_type: "Tradable", value: "No" },
    ],
    external_url: "https://docs.sunflower-land.com/getting-started/about",
    image: "../public/wearables/images/416.png",
    name: "Tomato Apron",
  },
};
