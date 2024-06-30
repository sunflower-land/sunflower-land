import fs from "fs";
// import i18n from "lib/i18n";

// // import { getKeys } from "../src/features/game/types/decorations";
// import { ITEM_DETAILS } from "../src/features/game/types/images";
// import { LanguageCode } from "../src/lib/i18n/dictionaries/dictionary";
// import { getKeys } from "features/game/types/decorations";
// // import { InventoryItemName } from "../src/features/game/types/game";
// // import { translate } from "lib/i18n/translate";

// interface ItemDetails {
//   description: Partial<Record<LanguageCode, string>>;
//   image: any;
//   secondaryImage?: any;
//   howToGetItem?: string[];
// }

// const obj = getKeys(ITEM_DETAILS).reduce((acc, itemName) => {
//   const item = ITEM_DETAILS[itemName as InventoryItemName];
//   i18n.changeLanguage("en");
//   const en = translate(item.description as any);

//   i18n.changeLanguage("pt");

//   const pt = translate(item.description as any);

//   i18n.changeLanguage("fr");

//   const fr = translate(item.description as any);

//   i18n.changeLanguage("tk");

//   const tk = translate(item.description as any);

//   i18n.changeLanguage("zh-CN");

//   const ch = translate(item.description as any);

//   return {
//     ...acc,
//     [itemName]: {
//       boostedDescriptions: item.boostedDescriptions,
//       image: item.image,
//       secondaryImage: item.secondaryImage,
//       section: item.secondaryImage,
//       howToGetItem: item.howToGetItem?.map((string) => {
//         i18n.changeLanguage("en");
//         const en = translate(string as any);
//         i18n.changeLanguage("pt");
//         const pt = translate(string as any);
//         i18n.changeLanguage("fr");
//         const fr = translate(string as any);
//         i18n.changeLanguage("tk");
//         const tk = translate(string as any);
//         i18n.changeLanguage("zh-CN");

//         const ch = translate(string as any);
//         return { en, pt, fr, tk, ["zh-CN"]: ch };
//       }),
//       itemType: item.itemType,
//       description: {
//         en,
//         pt,
//         ["zh-CN"]: ch,
//         ["fr"]: fr,
//         ["tk"]: tk,
//       },
//     },
//   };
// }, {});

const opensea = {
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

const items = {
  Sunflower: {
    image: "CROP_LIFECYCLE.Sunflower.crop",
    description: {
      en: "A sunny flower",
      pt: "A sunny flower",
      "zh-CN": "A sunny flower",
      fr: "A sunny flower",
      tk: "A sunny flower",
    },
  },
  Potato: {
    image: "CROP_LIFECYCLE.Potato.crop",
    description: {
      en: "Healthier than you might think.",
      pt: "Healthier than you might think.",
      "zh-CN": "Healthier than you might think.",
      fr: "Healthier than you might think.",
      tk: "Healthier than you might think.",
    },
  },
  Pumpkin: {
    image: "CROP_LIFECYCLE.Pumpkin.crop",
    description: {
      en: "There's more to pumpkin than pie.",
      pt: "There's more to pumpkin than pie.",
      "zh-CN": "There's more to pumpkin than pie.",
      fr: "There's more to pumpkin than pie.",
      tk: "There's more to pumpkin than pie.",
    },
  },
  Carrot: {
    image: "CROP_LIFECYCLE.Carrot.crop",
    description: {
      en: "They're good for your eyes!",
      pt: "They're good for your eyes!",
      "zh-CN": "They're good for your eyes!",
      fr: "They're good for your eyes!",
      tk: "They're good for your eyes!",
    },
  },
  Cabbage: {
    image: "CROP_LIFECYCLE.Cabbage.crop",
    description: {
      en: "Once a luxury, now a food for many.",
      pt: "Once a luxury, now a food for many.",
      "zh-CN": "Once a luxury, now a food for many.",
      fr: "Once a luxury, now a food for many.",
      tk: "Once a luxury, now a food for many.",
    },
  },
  Beetroot: {
    image: "CROP_LIFECYCLE.Beetroot.crop",
    description: {
      en: "Good for hangovers!",
      pt: "Good for hangovers!",
      "zh-CN": "Good for hangovers!",
      fr: "Good for hangovers!",
      tk: "Good for hangovers!",
    },
  },
  Cauliflower: {
    image: "CROP_LIFECYCLE.Cauliflower.crop",
    description: {
      en: "Excellent rice substitute!",
      pt: "Excellent rice substitute!",
      "zh-CN": "Excellent rice substitute!",
      fr: "Excellent rice substitute!",
      tk: "Excellent rice substitute!",
    },
  },
  Parsnip: {
    image: "CROP_LIFECYCLE.Parsnip.crop",
    description: {
      en: "Not to be mistaken for carrots.",
      pt: "Not to be mistaken for carrots.",
      "zh-CN": "Not to be mistaken for carrots.",
      fr: "Not to be mistaken for carrots.",
      tk: "Not to be mistaken for carrots.",
    },
  },
  Eggplant: {
    image: "CROP_LIFECYCLE.Eggplant.crop",
    description: {
      en: "Nature's edible work of art.",
      pt: "Nature's edible work of art.",
      "zh-CN": "Nature's edible work of art.",
      fr: "Nature's edible work of art.",
      tk: "Nature's edible work of art.",
    },
  },
  Corn: {
    image: "CROP_LIFECYCLE.Corn.crop",
    description: {
      en: "Sun-kissed kernels of delight, nature's summer treasure.",
      pt: "Sun-kissed kernels of delight, nature's summer treasure.",
      "zh-CN": "Sun-kissed kernels of delight, nature's summer treasure.",
      fr: "Sun-kissed kernels of delight, nature's summer treasure.",
      tk: "Sun-kissed kernels of delight, nature's summer treasure.",
    },
  },
  Radish: {
    image: "CROP_LIFECYCLE.Radish.crop",
    description: {
      en: "Takes time but is worth the wait!",
      pt: "Takes time but is worth the wait!",
      "zh-CN": "Takes time but is worth the wait!",
      fr: "Takes time but is worth the wait!",
      tk: "Takes time but is worth the wait!",
    },
  },
  Wheat: {
    image: "CROP_LIFECYCLE.Wheat.crop",
    description: {
      en: "The most harvested crop in the world.",
      pt: "The most harvested crop in the world.",
      "zh-CN": "The most harvested crop in the world.",
      fr: "The most harvested crop in the world.",
      tk: "The most harvested crop in the world.",
    },
  },
  Kale: {
    image: "CROP_LIFECYCLE.Kale.crop",
    description: {
      en: "A Bumpkin Power Food!",
      pt: "A Bumpkin Power Food!",
      "zh-CN": "A Bumpkin Power Food!",
      fr: "A Bumpkin Power Food!",
      tk: "A Bumpkin Power Food!",
    },
  },
  Soybean: {
    image: "CROP_LIFECYCLE.Soybean.crop",
    description: {
      en: "A versatile legume!",
      pt: "A versatile legume!",
      "zh-CN": "A versatile legume!",
      fr: "A versatile legume!",
      tk: "A versatile legume!",
    },
  },
  "Sunflower Seed": {
    image: "CROP_LIFECYCLE.Sunflower.seed",
    secondaryImage: "CROP_LIFECYCLE.Sunflower.crop",
    description: {
      en: "A sunny flower",
      pt: "A sunny flower",
      "zh-CN": "A sunny flower",
      fr: "A sunny flower",
      tk: "A sunny flower",
    },
  },
  "Potato Seed": {
    image: "CROP_LIFECYCLE.Potato.seed",
    secondaryImage: "CROP_LIFECYCLE.Potato.crop",
    description: {
      en: "Healthier than you might think.",
      pt: "Healthier than you might think.",
      "zh-CN": "Healthier than you might think.",
      fr: "Healthier than you might think.",
      tk: "Healthier than you might think.",
    },
  },
  "Pumpkin Seed": {
    image: "CROP_LIFECYCLE.Pumpkin.seed",
    secondaryImage: "CROP_LIFECYCLE.Pumpkin.crop",
    description: {
      en: "There's more to pumpkin than pie.",
      pt: "There's more to pumpkin than pie.",
      "zh-CN": "There's more to pumpkin than pie.",
      fr: "There's more to pumpkin than pie.",
      tk: "There's more to pumpkin than pie.",
    },
  },
  "Carrot Seed": {
    image: "CROP_LIFECYCLE.Carrot.seed",
    secondaryImage: "CROP_LIFECYCLE.Carrot.crop",
    description: {
      en: "They're good for your eyes!",
      pt: "They're good for your eyes!",
      "zh-CN": "They're good for your eyes!",
      fr: "They're good for your eyes!",
      tk: "They're good for your eyes!",
    },
  },
  "Cabbage Seed": {
    image: "CROP_LIFECYCLE.Cabbage.seed",
    secondaryImage: "CROP_LIFECYCLE.Cabbage.crop",
    description: {
      en: "Once a luxury, now a food for many.",
      pt: "Once a luxury, now a food for many.",
      "zh-CN": "Once a luxury, now a food for many.",
      fr: "Once a luxury, now a food for many.",
      tk: "Once a luxury, now a food for many.",
    },
  },
  "Beetroot Seed": {
    image: "CROP_LIFECYCLE.Beetroot.seed",
    secondaryImage: "CROP_LIFECYCLE.Beetroot.crop",
    description: {
      en: "Good for hangovers!",
      pt: "Good for hangovers!",
      "zh-CN": "Good for hangovers!",
      fr: "Good for hangovers!",
      tk: "Good for hangovers!",
    },
  },
  "Cauliflower Seed": {
    image: "CROP_LIFECYCLE.Cauliflower.seed",
    secondaryImage: "CROP_LIFECYCLE.Cauliflower.crop",
    description: {
      en: "Excellent rice substitute!",
      pt: "Excellent rice substitute!",
      "zh-CN": "Excellent rice substitute!",
      fr: "Excellent rice substitute!",
      tk: "Excellent rice substitute!",
    },
  },
  "Parsnip Seed": {
    image: "CROP_LIFECYCLE.Parsnip.seed",
    secondaryImage: "CROP_LIFECYCLE.Parsnip.crop",
    description: {
      en: "Not to be mistaken for carrots.",
      pt: "Not to be mistaken for carrots.",
      "zh-CN": "Not to be mistaken for carrots.",
      fr: "Not to be mistaken for carrots.",
      tk: "Not to be mistaken for carrots.",
    },
  },
  "Eggplant Seed": {
    image: "CROP_LIFECYCLE.Eggplant.seed",
    secondaryImage: "CROP_LIFECYCLE.Eggplant.crop",
    description: {
      en: "Nature's edible work of art.",
      pt: "Nature's edible work of art.",
      "zh-CN": "Nature's edible work of art.",
      fr: "Nature's edible work of art.",
      tk: "Nature's edible work of art.",
    },
  },
  "Corn Seed": {
    image: "CROP_LIFECYCLE.Corn.seed",
    secondaryImage: "CROP_LIFECYCLE.Corn.crop",
    description: {
      en: "Sun-kissed kernels of delight, nature's summer treasure.",
      pt: "Sun-kissed kernels of delight, nature's summer treasure.",
      "zh-CN": "Sun-kissed kernels of delight, nature's summer treasure.",
      fr: "Sun-kissed kernels of delight, nature's summer treasure.",
      tk: "Sun-kissed kernels of delight, nature's summer treasure.",
    },
  },
  "Radish Seed": {
    image: "CROP_LIFECYCLE.Radish.seed",
    secondaryImage: "CROP_LIFECYCLE.Radish.crop",
    description: {
      en: "Takes time but is worth the wait!",
      pt: "Takes time but is worth the wait!",
      "zh-CN": "Takes time but is worth the wait!",
      fr: "Takes time but is worth the wait!",
      tk: "Takes time but is worth the wait!",
    },
  },
  "Wheat Seed": {
    image: "CROP_LIFECYCLE.Wheat.seed",
    secondaryImage: "CROP_LIFECYCLE.Wheat.crop",
    description: {
      en: "The most harvested crop in the world.",
      pt: "The most harvested crop in the world.",
      "zh-CN": "The most harvested crop in the world.",
      fr: "The most harvested crop in the world.",
      tk: "The most harvested crop in the world.",
    },
  },
  "Magic Bean": {
    image: "assets/crops/magic_bean.png",
    description: {
      en: "What will grow?",
      pt: "What will grow?",
      "zh-CN": "What will grow?",
      fr: "What will grow?",
      tk: "What will grow?",
    },
  },
  "Kale Seed": {
    image: "CROP_LIFECYCLE.Kale.seed",
    description: {
      en: "A Bumpkin Power Food!",
      pt: "A Bumpkin Power Food!",
      "zh-CN": "A Bumpkin Power Food!",
      fr: "A Bumpkin Power Food!",
      tk: "A Bumpkin Power Food!",
    },
  },
  "Soybean Seed": {
    image: "CROP_LIFECYCLE.Soybean.seed",
    description: {
      en: "A versatile legume!",
      pt: "A versatile legume!",
      "zh-CN": "A versatile legume!",
      fr: "A versatile legume!",
      tk: "A versatile legume!",
    },
  },
  "Apple Seed": {
    image: "assets/fruit/apple/apple_seed.png",
    description: {
      en: "Perfect for homemade Apple Pie",
      pt: "Perfect for homemade Apple Pie",
      "zh-CN": "Perfect for homemade Apple Pie",
      fr: "Perfect for homemade Apple Pie",
      tk: "Perfect for homemade Apple Pie",
    },
  },
  "Blueberry Seed": {
    image: "assets/fruit/blueberry/blueberry_seed.png",
    description: {
      en: "A Goblin's weakness",
      pt: "A Goblin's weakness",
      "zh-CN": "A Goblin's weakness",
      fr: "A Goblin's weakness",
      tk: "A Goblin's weakness",
    },
  },
  "Orange Seed": {
    image: "assets/fruit/orange/orange_seed.png",
    description: {
      en: "Vitamin C to keep your Bumpkin Healthy",
      pt: "Vitamin C to keep your Bumpkin Healthy",
      "zh-CN": "Vitamin C to keep your Bumpkin Healthy",
      fr: "Vitamin C to keep your Bumpkin Healthy",
      tk: "Vitamin C to keep your Bumpkin Healthy",
    },
  },
  "Banana Plant": {
    image: "assets/fruit/banana/banana_plant.png",
    description: {
      en: "Oh banana!",
      pt: "Oh banana!",
      "zh-CN": "Oh banana!",
      fr: "Oh banana!",
      tk: "Oh banana!",
    },
  },
  "Sunpetal Seed": {
    image: "assets/flowers/sunpetal_seed.webp",
    description: {
      en: "A sunpetal seed",
      pt: "A sunpetal seed",
      "zh-CN": "A sunpetal seed",
      fr: "A sunpetal seed",
      tk: "A sunpetal seed",
    },
  },
  "Bloom Seed": {
    image: "assets/flowers/bloom_seed.webp",
    description: {
      en: "A bloom seed",
      pt: "A bloom seed",
      "zh-CN": "A bloom seed",
      fr: "A bloom seed",
      tk: "A bloom seed",
    },
  },
  "Lily Seed": {
    image: "assets/flowers/lily_seed.webp",
    description: {
      en: "A lily seed",
      pt: "A lily seed",
      "zh-CN": "A lily seed",
      fr: "A lily seed",
      tk: "A lily seed",
    },
  },
  "Apple Pie": {
    image: "assets/food/apple_pie.png",
    description: {
      en: "Bumpkin Betty's famous recipe",
      pt: "Bumpkin Betty's famous recipe",
      "zh-CN": "Bumpkin Betty's famous recipe",
      fr: "Bumpkin Betty's famous recipe",
      tk: "Bumpkin Betty's famous recipe",
    },
  },
  "Blueberry Jam": {
    image: "assets/food/blueberry_jam.png",
    description: {
      en: "Goblins will do anything for this jam",
      pt: "Goblins will do anything for this jam",
      "zh-CN": "Goblins will do anything for this jam",
      fr: "Goblins will do anything for this jam",
      tk: "Goblins will do anything for this jam",
    },
  },
  "Honey Cake": {
    image: "assets/food/cakes/honey_cake.png",
    description: {
      en: "A scrumptious cake!",
      pt: "A scrumptious cake!",
      "zh-CN": "A scrumptious cake!",
      fr: "A scrumptious cake!",
      tk: "A scrumptious cake!",
    },
  },
  "Kale & Mushroom Pie": {
    image: "assets/food/mushroom_kale_pie.png",
    description: {
      en: "A traditional Sapphiron recipe",
      pt: "A traditional Sapphiron recipe",
      "zh-CN": "A traditional Sapphiron recipe",
      fr: "A traditional Sapphiron recipe",
      tk: "A traditional Sapphiron recipe",
    },
  },
  "Kale Stew": {
    image: "assets/food/kale_stew.png",
    description: {
      en: "A perfect Bumpkin Booster!",
      pt: "A perfect Bumpkin Booster!",
      "zh-CN": "A perfect Bumpkin Booster!",
      fr: "A perfect Bumpkin Booster!",
      tk: "A perfect Bumpkin Booster!",
    },
  },
  "Mushroom Jacket Potatoes": {
    image: "assets/food/mushroom_jacket_potato.png",
    description: {
      en: "Cram them taters with what ya got!",
      pt: "Cram them taters with what ya got!",
      "zh-CN": "Cram them taters with what ya got!",
      fr: "Cram them taters with what ya got!",
      tk: "Cram them taters with what ya got!",
    },
  },
  "Mushroom Soup": {
    image: "assets/food/mushroom_soup.png",
    description: {
      en: "Warm your Bumpkin's soul.",
      pt: "Warm your Bumpkin's soul.",
      "zh-CN": "Warm your Bumpkin's soul.",
      fr: "Warm your Bumpkin's soul.",
      tk: "Warm your Bumpkin's soul.",
    },
  },
  "Orange Cake": {
    image: "assets/food/cakes/orange_cake.png",
    description: {
      en: "Orange you glad we aren't cooking apples",
      pt: "Orange you glad we aren't cooking apples",
      "zh-CN": "Orange you glad we aren't cooking apples",
      fr: "Orange you glad we aren't cooking apples",
      tk: "Orange you glad we aren't cooking apples",
    },
  },
  "Sunflower Crunch": {
    image: "assets/food/sunflower_crunch.png",
    description: {
      en: "Crunchy goodness. Try not to burn it.",
      pt: "Crunchy goodness. Try not to burn it.",
      "zh-CN": "Crunchy goodness. Try not to burn it.",
      fr: "Crunchy goodness. Try not to burn it.",
      tk: "Crunchy goodness. Try not to burn it.",
    },
  },
  "Magic Mushroom": {
    image: "SUNNYSIDE.resource.magic_mushroom",
    description: {
      en: "Used to cook advanced recipes",
      pt: "Used to cook advanced recipes",
      "zh-CN": "Used to cook advanced recipes",
      fr: "Used to cook advanced recipes",
      tk: "Used to cook advanced recipes",
    },
  },
  "Wild Mushroom": {
    image: "SUNNYSIDE.resource.wild_mushroom",
    description: {
      en: "Used to cook basic recipes",
      pt: "Used to cook basic recipes",
      "zh-CN": "Used to cook basic recipes",
      fr: "Used to cook basic recipes",
      tk: "Used to cook basic recipes",
    },
  },
  Apple: {
    image: "assets/resources/apple.png",
    description: {
      en: "Perfect for homemade Apple Pie",
      pt: "Perfect for homemade Apple Pie",
      "zh-CN": "Perfect for homemade Apple Pie",
      fr: "Perfect for homemade Apple Pie",
      tk: "Perfect for homemade Apple Pie",
    },
  },
  Blueberry: {
    image: "assets/resources/blueberry.png",
    description: {
      en: "A Goblin's weakness",
      pt: "A Goblin's weakness",
      "zh-CN": "A Goblin's weakness",
      fr: "A Goblin's weakness",
      tk: "A Goblin's weakness",
    },
  },
  Orange: {
    image: "assets/resources/orange.png",
    description: {
      en: "Vitamin C to keep your Bumpkin Healthy",
      pt: "Vitamin C to keep your Bumpkin Healthy",
      "zh-CN": "Vitamin C to keep your Bumpkin Healthy",
      fr: "Vitamin C to keep your Bumpkin Healthy",
      tk: "Vitamin C to keep your Bumpkin Healthy",
    },
  },
  Banana: {
    image: "assets/resources/banana.png",
    description: {
      en: "Oh banana!",
      pt: "Oh banana!",
      "zh-CN": "Oh banana!",
      fr: "Oh banana!",
      tk: "Oh banana!",
    },
  },
  Honey: {
    image: "assets/resources/honey.png",
    description: {
      en: "Used to sweeten your cooking",
      pt: "Used to sweeten your cooking",
      "zh-CN": "Used to sweeten your cooking",
      fr: "Used to sweeten your cooking",
      tk: "Used to sweeten your cooking",
    },
  },
  "Apple Juice": {
    image: "assets/food/apple_juice.png",
    description: {
      en: "A crisp refreshing beverage",
      pt: "A crisp refreshing beverage",
      "zh-CN": "A crisp refreshing beverage",
      fr: "A crisp refreshing beverage",
      tk: "A crisp refreshing beverage",
    },
  },
  "Orange Juice": {
    image: "assets/food/orange_juice.png",
    description: {
      en: "OJ matches perfectly with a Club Sandwich",
      pt: "OJ matches perfectly with a Club Sandwich",
      "zh-CN": "OJ matches perfectly with a Club Sandwich",
      fr: "OJ matches perfectly with a Club Sandwich",
      tk: "OJ matches perfectly with a Club Sandwich",
    },
  },
  "Purple Smoothie": {
    image: "assets/food/purple_smoothie.png",
    description: {
      en: "You can hardly taste the Cabbage",
      pt: "You can hardly taste the Cabbage",
      "zh-CN": "You can hardly taste the Cabbage",
      fr: "You can hardly taste the Cabbage",
      tk: "You can hardly taste the Cabbage",
    },
  },
  "Bumpkin Detox": {
    image: "assets/food/bumpkin_detox.png",
    description: {
      en: "Wash away the sins of last night",
      pt: "Wash away the sins of last night",
      "zh-CN": "Wash away the sins of last night",
      fr: "Wash away the sins of last night",
      tk: "Wash away the sins of last night",
    },
  },
  "Power Smoothie": {
    image: "assets/food/power_smoothie.png",
    description: {
      en: "Official drink of the Bumpkin Powerlifting Society",
      pt: "Official drink of the Bumpkin Powerlifting Society",
      "zh-CN": "Official drink of the Bumpkin Powerlifting Society",
      fr: "Official drink of the Bumpkin Powerlifting Society",
      tk: "Official drink of the Bumpkin Powerlifting Society",
    },
  },
  "Bumpkin Roast": {
    image: "assets/food/bumpkin_roast.png",
    description: {
      en: "A traditional Bumpkin dish",
      pt: "A traditional Bumpkin dish",
      "zh-CN": "A traditional Bumpkin dish",
      fr: "A traditional Bumpkin dish",
      tk: "A traditional Bumpkin dish",
    },
  },
  "Goblin Brunch": {
    image: "assets/food/goblin_brunch.png",
    description: {
      en: "A traditional Goblin dish",
      pt: "A traditional Goblin dish",
      "zh-CN": "A traditional Goblin dish",
      fr: "A traditional Goblin dish",
      tk: "A traditional Goblin dish",
    },
  },
  "Fruit Salad": {
    image: "assets/food/fruit_salad.png",
    description: {
      en: "Fruit Salad, Yummy Yummy",
      pt: "Fruit Salad, Yummy Yummy",
      "zh-CN": "Fruit Salad, Yummy Yummy",
      fr: "Fruit Salad, Yummy Yummy",
      tk: "Fruit Salad, Yummy Yummy",
    },
  },
  "Kale Omelette": {
    image: "assets/food/kale_omelette.png",
    description: {
      en: "A healthy breakfast",
      pt: "A healthy breakfast",
      "zh-CN": "A healthy breakfast",
      fr: "A healthy breakfast",
      tk: "A healthy breakfast",
    },
  },
  "Cabbers n Mash": {
    image: "assets/food/cabbers_n_mash.png",
    description: {
      en: "Cabbages and Mashed Potatoes",
      pt: "Cabbages and Mashed Potatoes",
      "zh-CN": "Cabbages and Mashed Potatoes",
      fr: "Cabbages and Mashed Potatoes",
      tk: "Cabbages and Mashed Potatoes",
    },
  },
  "Fancy Fries": {
    image: "assets/food/fancy_fries.png",
    description: {
      en: "Fantastic Fries",
      pt: "Fantastic Fries",
      "zh-CN": "Fantastic Fries",
      fr: "Fantastic Fries",
      tk: "Fantastic Fries",
    },
  },
  "Banana Blast": {
    image: "assets/food/banana_blast.png",
    description: {
      en: "The ultimate fruity fuel for those with a peel for power!",
      pt: "The ultimate fruity fuel for those with a peel for power!",
      "zh-CN": "The ultimate fruity fuel for those with a peel for power!",
      fr: "The ultimate fruity fuel for those with a peel for power!",
      tk: "The ultimate fruity fuel for those with a peel for power!",
    },
  },
  Wood: {
    image: "SUNNYSIDE.resource.wood",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Stone: {
    image: "SUNNYSIDE.resource.stone",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Iron: {
    image: "assets/resources/iron_ore.png",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Crimstone: {
    image: "assets/resources/crimstone.png",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Gold: {
    image: "assets/resources/gold_ore.png",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Diamond: {
    image: "SUNNYSIDE.resource.diamond",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Sunstone: {
    image: "assets/resources/sunstone/sunstone.png",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Oil: {
    image: "assets/resources/oil.webp",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Egg: {
    image: "SUNNYSIDE.resource.egg",
    description: {
      en: "Used to craft items",
      pt: "Used to craft items",
      "zh-CN": "Used to craft items",
      fr: "Used to craft items",
      tk: "Used to craft items",
    },
  },
  Chicken: {
    image: "SUNNYSIDE.resource.chicken",
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
  },
  Cow: {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
  },
  Sheep: {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
  },
  Pig: {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Used to lay eggs",
      pt: "Used to lay eggs",
      "zh-CN": "Used to lay eggs",
      fr: "Used to lay eggs",
      tk: "Used to lay eggs",
    },
  },
  Axe: {
    image: "SUNNYSIDE.tools.axe",
    description: {
      en: "Used to chop wood",
      pt: "Used to chop wood",
      "zh-CN": "Used to chop wood",
      fr: "Used to chop wood",
      tk: "Used to chop wood",
    },
  },
  Pickaxe: {
    image: "SUNNYSIDE.tools.wood_pickaxe",
    description: {
      en: "Used to mine stone",
      pt: "Used to mine stone",
      "zh-CN": "Used to mine stone",
      fr: "Used to mine stone",
      tk: "Used to mine stone",
    },
  },
  "Stone Pickaxe": {
    image: "SUNNYSIDE.tools.stone_pickaxe",
    description: {
      en: "Used to mine iron",
      pt: "Used to mine iron",
      "zh-CN": "Used to mine iron",
      fr: "Used to mine iron",
      tk: "Used to mine iron",
    },
  },
  "Iron Pickaxe": {
    image: "SUNNYSIDE.tools.iron_pickaxe",
    description: {
      en: "Used to mine gold",
      pt: "Used to mine gold",
      "zh-CN": "Used to mine gold",
      fr: "Used to mine gold",
      tk: "Used to mine gold",
    },
  },
  "Gold Pickaxe": {
    image: "SUNNYSIDE.tools.gold_pickaxe",
    description: {
      en: "Used to mine crimstone and sunstone",
      pt: "Used to mine crimstone and sunstone",
      "zh-CN": "Used to mine crimstone and sunstone",
      fr: "Used to mine crimstone and sunstone",
      tk: "Used to mine crimstone and sunstone",
    },
  },
  Hammer: {
    image: "SUNNYSIDE.tools.hammer",
    description: {
      en: "Coming soon",
      pt: "Coming soon",
      "zh-CN": "Coming soon",
      fr: "Coming soon",
      tk: "Coming soon",
    },
  },
  Rod: {
    image: "SUNNYSIDE.tools.fishing_rod",
    description: {
      en: "Used to catch fish",
      pt: "Used to catch fish",
      "zh-CN": "Used to catch fish",
      fr: "Used to catch fish",
      tk: "Used to catch fish",
    },
  },
  "Rusty Shovel": {
    image: "SUNNYSIDE.tools.rusty_shovel",
    description: {
      en: "Used to remove buildings and collectibles",
      pt: "Used to remove buildings and collectibles",
      "zh-CN": "Used to remove buildings and collectibles",
      fr: "Used to remove buildings and collectibles",
      tk: "Used to remove buildings and collectibles",
    },
  },
  Shovel: {
    image: "SUNNYSIDE.tools.shovel",
    description: {
      en: "Plant and harvest crops.",
      pt: "Plant and harvest crops.",
      "zh-CN": "Plant and harvest crops.",
      fr: "Plant and harvest crops.",
      tk: "Plant and harvest crops.",
    },
  },
  "Sand Shovel": {
    image: "SUNNYSIDE.tools.sand_shovel",
    description: {
      en: "Used for digging treasure",
      pt: "Usado para escavar tesouros",
      "zh-CN": "用来挖宝藏",
      fr: "Utilisé pour creuser des trésors",
      tk: "Hazine kazmak için kullanılır",
    },
  },
  "Sand Drill": {
    image: "assets/icons/drill.png",
    description: {
      en: "Drill deep for uncommon or rare treasure",
      pt: "Perfurar profundamente por tesouros incomuns ou raros",
      "zh-CN": "深入挖掘不寻常或稀有的宝藏",
      fr: "Creusez profondément pour trouver des trésors peu communs ou rares",
      tk: "Sıra dışı veya nadir hazineler için derinlere inin",
    },
  },
  "Oil Drill": {
    image: "assets/icons/oil_drill.webp",
    description: {
      en: "Drill for oil",
      pt: "Drill for oil",
      "zh-CN": "石油钻探",
      fr: "Drill for oil",
      tk: "Drill for oil",
    },
  },
  "Block Buck": {
    image: "assets/icons/block_buck.png",
    description: {
      en: "A valuable token in Sunflower Land!",
      pt: "Um token valioso em Sunflower Land!",
      "zh-CN": "A valuable token in Sunflower Land!",
      fr: "Un jeton précieux dans Sunflower Land!",
      tk: "Ayçiçeği Ülkesinde değerli bir jeton!",
    },
  },
  "Sunflower Statue": {
    image: "assets/sfts/sunflower_statue.png",
    description: {
      en: "A symbol of the holy token",
      pt: "A symbol of the holy token",
      "zh-CN": "A symbol of the holy token",
      fr: "A symbol of the holy token",
      tk: "A symbol of the holy token",
    },
  },
  "Potato Statue": {
    image: "assets/sfts/potato_statue.png",
    description: {
      en: "The OG potato hustler flex",
      pt: "The OG potato hustler flex",
      "zh-CN": "The OG potato hustler flex",
      fr: "The OG potato hustler flex",
      tk: "The OG potato hustler flex",
    },
  },
  Nancy: {
    image: "assets/sfts/nancy.png",
    description: {
      en: "Keeps a few crows away. Crops grow 15% faster",
      pt: "Keeps a few crows away. Crops grow 15% faster",
      "zh-CN": "Keeps a few crows away. Crops grow 15% faster",
      fr: "Keeps a few crows away. Crops grow 15% faster",
      tk: "Keeps a few crows away. Crops grow 15% faster",
    },
  },
  Scarecrow: {
    image: "assets/sfts/scarecrow.png",
    description: {
      en: "A goblin scarecrow. Yield 20% more crops",
      pt: "A goblin scarecrow. Yield 20% more crops",
      "zh-CN": "A goblin scarecrow. Yield 20% more crops",
      fr: "A goblin scarecrow. Yield 20% more crops",
      tk: "A goblin scarecrow. Yield 20% more crops",
    },
  },
  Kuebiko: {
    image: "assets/sfts/kuebiko.gif",
    description: {
      en: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      pt: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      "zh-CN":
        "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      fr: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
      tk: "Even the shopkeeper is scared of this scarecrow. Seeds are free",
    },
  },
  "Christmas Tree": {
    image: "assets/sfts/christmas_tree.png",
    description: {
      en: "Receive a Santa Airdrop on Christmas day",
      pt: "Receive a Santa Airdrop on Christmas day",
      "zh-CN": "Receive a Santa Airdrop on Christmas day",
      fr: "Receive a Santa Airdrop on Christmas day",
      tk: "Receive a Santa Airdrop on Christmas day",
    },
  },
  Gnome: {
    image: "assets/decorations/scarlet.png",
    description: {
      en: "A lucky gnome",
      pt: "A lucky gnome",
      "zh-CN": "A lucky gnome",
      fr: "A lucky gnome",
      tk: "A lucky gnome",
    },
  },
  "Gold Egg": {
    image: "assets/sfts/gold_egg.png",
    description: {
      en: "Feed chickens without needing wheat",
      pt: "Feed chickens without needing wheat",
      "zh-CN": "Feed chickens without needing wheat",
      fr: "Feed chickens without needing wheat",
      tk: "Feed chickens without needing wheat",
    },
  },
  "Farm Cat": {
    image: "assets/sfts/farm_cat.gif",
    description: {
      en: "Keep the rats away",
      pt: "Keep the rats away",
      "zh-CN": "Keep the rats away",
      fr: "Keep the rats away",
      tk: "Keep the rats away",
    },
  },
  "Farm Dog": {
    image: "assets/sfts/farm_dog.gif",
    description: {
      en: "Herd sheep with your farm dog",
      pt: "Herd sheep with your farm dog",
      "zh-CN": "Herd sheep with your farm dog",
      fr: "Herd sheep with your farm dog",
      tk: "Herd sheep with your farm dog",
    },
  },
  "Chicken Coop": {
    image: "assets/sfts/chicken_coop.png",
    description: {
      en: "Collect 2x the amount of eggs",
      pt: "Collect 2x the amount of eggs",
      "zh-CN": "Collect 2x the amount of eggs",
      fr: "Collect 2x the amount of eggs",
      tk: "Collect 2x the amount of eggs",
    },
  },
  "Golden Cauliflower": {
    image: "assets/sfts/golden_cauliflower.webp",
    description: {
      en: "Doubles cauliflower yield",
      pt: "Doubles cauliflower yield",
      "zh-CN": "Doubles cauliflower yield",
      fr: "Doubles cauliflower yield",
      tk: "Doubles cauliflower yield",
    },
  },
  "Sunflower Rock": {
    image: "assets/sfts/sunflower_rock.png",
    description: {
      en: "The game that broke Polygon",
      pt: "The game that broke Polygon",
      "zh-CN": "The game that broke Polygon",
      fr: "The game that broke Polygon",
      tk: "The game that broke Polygon",
    },
  },
  "Sunflower Tombstone": {
    image: "assets/sfts/sunflower_tombstone.png",
    description: {
      en: "In memory of Sunflower Farmers",
      pt: "In memory of Sunflower Farmers",
      "zh-CN": "In memory of Sunflower Farmers",
      fr: "In memory of Sunflower Farmers",
      tk: "In memory of Sunflower Farmers",
    },
  },
  "Goblin Crown": {
    image: "assets/sfts/goblin_crown.png",
    description: {
      en: "Summon the leader of the Goblins",
      pt: "Summon the leader of the Goblins",
      "zh-CN": "Summon the leader of the Goblins",
      fr: "Summon the leader of the Goblins",
      tk: "Summon the leader of the Goblins",
    },
  },
  Fountain: {
    image: "assets/sfts/fountain.gif",
    description: {
      en: "A relaxing fountain for your farm",
      pt: "A relaxing fountain for your farm",
      "zh-CN": "A relaxing fountain for your farm",
      fr: "A relaxing fountain for your farm",
      tk: "A relaxing fountain for your farm",
    },
  },
  "Woody the Beaver": {
    image: "assets/sfts/beaver.gif",
    description: {
      en: "Increase wood drops by 20%",
      pt: "Increase wood drops by 20%",
      "zh-CN": "Increase wood drops by 20%",
      fr: "Increase wood drops by 20%",
      tk: "Increase wood drops by 20%",
    },
  },
  "Apprentice Beaver": {
    image: "assets/sfts/apprentice_beaver.gif",
    description: {
      en: "Trees recover 50% faster",
      pt: "Trees recover 50% faster",
      "zh-CN": "Trees recover 50% faster",
      fr: "Trees recover 50% faster",
      tk: "Trees recover 50% faster",
    },
  },
  "Foreman Beaver": {
    image: "assets/sfts/construction_beaver.gif",
    description: {
      en: "Cut trees without axes",
      pt: "Cut trees without axes",
      "zh-CN": "Cut trees without axes",
      fr: "Cut trees without axes",
      tk: "Cut trees without axes",
    },
  },
  "Mysterious Parsnip": {
    image: "assets/sfts/mysterious_parsnip.png",
    description: {
      en: "Parsnips grow 50% faster",
      pt: "Parsnips grow 50% faster",
      "zh-CN": "Parsnips grow 50% faster",
      fr: "Parsnips grow 50% faster",
      tk: "Parsnips grow 50% faster",
    },
  },
  "Carrot Sword": {
    image: "assets/sfts/carrot_sword.png",
    description: {
      en: "Increase chance of a mutant crop appearing",
      pt: "Increase chance of a mutant crop appearing",
      "zh-CN": "Increase chance of a mutant crop appearing",
      fr: "Increase chance of a mutant crop appearing",
      tk: "Increase chance of a mutant crop appearing",
    },
  },
  "Golden Bonsai": {
    image: "assets/sfts/golden_bonsai.png",
    description: {
      en: "Goblins love bonsai too",
      pt: "Goblins love bonsai too",
      "zh-CN": "Goblins love bonsai too",
      fr: "Goblins love bonsai too",
      tk: "Goblins love bonsai too",
    },
  },
  "Nyon Statue": {
    image: "assets/sfts/nyon_statue.png",
    description: {
      en: "In memory of Nyon Lann",
      pt: "In memory of Nyon Lann",
      "zh-CN": "In memory of Nyon Lann",
      fr: "In memory of Nyon Lann",
      tk: "In memory of Nyon Lann",
    },
  },
  "Homeless Tent": {
    image: "assets/sfts/homeless_tent.png",
    description: {
      en: "A nice and cozy tent",
      pt: "A nice and cozy tent",
      "zh-CN": "A nice and cozy tent",
      fr: "A nice and cozy tent",
      tk: "A nice and cozy tent",
    },
  },
  "Farmer Bath": {
    image: "assets/sfts/farmer_bath.png",
    description: {
      en: "A beetroot scented bath for the farmers",
      pt: "A beetroot scented bath for the farmers",
      "zh-CN": "A beetroot scented bath for the farmers",
      fr: "A beetroot scented bath for the farmers",
      tk: "A beetroot scented bath for the farmers",
    },
  },
  "Mysterious Head": {
    image: "assets/sfts/mysterious_head.png",
    description: {
      en: "A statue thought to protect farmers",
      pt: "A statue thought to protect farmers",
      "zh-CN": "A statue thought to protect farmers",
      fr: "A statue thought to protect farmers",
      tk: "A statue thought to protect farmers",
    },
  },
  "Tunnel Mole": {
    image: "assets/sfts/tunnel_mole.gif",
    description: {
      en: "Gives a 25% increase to stone mines",
      pt: "Gives a 25% increase to stone mines",
      "zh-CN": "Gives a 25% increase to stone mines",
      fr: "Gives a 25% increase to stone mines",
      tk: "Gives a 25% increase to stone mines",
    },
  },
  "Rocky the Mole": {
    image: "assets/sfts/rocky_mole.gif",
    description: {
      en: "Gives a 25% increase to iron mines",
      pt: "Gives a 25% increase to iron mines",
      "zh-CN": "Gives a 25% increase to iron mines",
      fr: "Gives a 25% increase to iron mines",
      tk: "Gives a 25% increase to iron mines",
    },
  },
  Nugget: {
    image: "assets/sfts/nugget.gif",
    description: {
      en: "Gives a 25% increase to gold mines",
      pt: "Gives a 25% increase to gold mines",
      "zh-CN": "Gives a 25% increase to gold mines",
      fr: "Gives a 25% increase to gold mines",
      tk: "Gives a 25% increase to gold mines",
    },
  },
  "Rock Golem": {
    image: "assets/sfts/rock_golem.gif",
    description: {
      en: "Gives a 10% chance to get 3x stone",
      pt: "Gives a 10% chance to get 3x stone",
      "zh-CN": "Gives a 10% chance to get 3x stone",
      fr: "Gives a 10% chance to get 3x stone",
      tk: "Gives a 10% chance to get 3x stone",
    },
  },
  Rooster: {
    image: "assets/animals/chickens/rooster.gif",
    description: {
      en: "Doubles the chance of dropping a mutant chicken",
      pt: "Doubles the chance of dropping a mutant chicken",
      "zh-CN": "Doubles the chance of dropping a mutant chicken",
      fr: "Doubles the chance of dropping a mutant chicken",
      tk: "Doubles the chance of dropping a mutant chicken",
    },
  },
  "Wicker Man": {
    image: "assets/sfts/wicker_man.png",
    description: {
      en: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      pt: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      "zh-CN":
        "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      fr: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
      tk: "Join hands and make a chain, the shadow of the Wicker Man will rise up again",
    },
  },
  "Pumpkin Soup": {
    image: "assets/food/pumpkin_soup.png",
    description: {
      en: "A creamy soup that goblins love",
      pt: "A creamy soup that goblins love",
      "zh-CN": "A creamy soup that goblins love",
      fr: "A creamy soup that goblins love",
      tk: "A creamy soup that goblins love",
    },
  },
  "Roasted Cauliflower": {
    image: "assets/food/roasted_cauliflower.png",
    description: {
      en: "A Goblin's favourite",
      pt: "A Goblin's favourite",
      "zh-CN": "A Goblin's favourite",
      fr: "A Goblin's favourite",
      tk: "A Goblin's favourite",
    },
  },
  "Radish Pie": {
    image: "assets/food/radish_pie.png",
    description: {
      en: "Despised by humans, loved by goblins",
      pt: "Despised by humans, loved by goblins",
      "zh-CN": "Despised by humans, loved by goblins",
      fr: "Despised by humans, loved by goblins",
      tk: "Despised by humans, loved by goblins",
    },
  },
  "Beetroot Cake": {
    image: "assets/food/cakes/beetroot_cake.png",
    description: {
      en: "Beetroot Cake",
      pt: "Beetroot Cake",
      "zh-CN": "Beetroot Cake",
      fr: "Beetroot Cake",
      tk: "Beetroot Cake",
    },
  },
  "Cabbage Cake": {
    image: "assets/food/cakes/cabbage_cake.png",
    description: {
      en: "Cabbage Cake",
      pt: "Cabbage Cake",
      "zh-CN": "Cabbage Cake",
      fr: "Cabbage Cake",
      tk: "Cabbage Cake",
    },
  },
  "Carrot Cake": {
    image: "assets/food/cakes/carrot_cake.png",
    description: {
      en: "Carrot Cake",
      pt: "Carrot Cake",
      "zh-CN": "Carrot Cake",
      fr: "Carrot Cake",
      tk: "Carrot Cake",
    },
  },
  "Cauliflower Cake": {
    image: "assets/food/cakes/cauliflower_cake.png",
    description: {
      en: "Cauliflower Cake",
      pt: "Cauliflower Cake",
      "zh-CN": "Cauliflower Cake",
      fr: "Cauliflower Cake",
      tk: "Cauliflower Cake",
    },
  },
  "Parsnip Cake": {
    image: "assets/food/cakes/parsnip_cake.png",
    description: {
      en: "Parsnip Cake",
      pt: "Parsnip Cake",
      "zh-CN": "Parsnip Cake",
      fr: "Parsnip Cake",
      tk: "Parsnip Cake",
    },
  },
  "Potato Cake": {
    image: "assets/food/cakes/potato_cake.png",
    description: {
      en: "Potato Cake",
      pt: "Potato Cake",
      "zh-CN": "Potato Cake",
      fr: "Potato Cake",
      tk: "Potato Cake",
    },
  },
  "Pumpkin Cake": {
    image: "assets/food/cakes/pumpkin_cake.png",
    description: {
      en: "Pumpkin Cake",
      pt: "Pumpkin Cake",
      "zh-CN": "Pumpkin Cake",
      fr: "Pumpkin Cake",
      tk: "Pumpkin Cake",
    },
  },
  "Radish Cake": {
    image: "assets/food/cakes/radish_cake.png",
    description: {
      en: "Radish Cake",
      pt: "Radish Cake",
      "zh-CN": "Radish Cake",
      fr: "Radish Cake",
      tk: "Radish Cake",
    },
  },
  "Sunflower Cake": {
    image: "assets/food/cakes/sunflower_cake.png",
    description: {
      en: "Sunflower Cake",
      pt: "Sunflower Cake",
      "zh-CN": "Sunflower Cake",
      fr: "Sunflower Cake",
      tk: "Sunflower Cake",
    },
  },
  "Wheat Cake": {
    image: "assets/food/cakes/wheat_cake.png",
    description: {
      en: "Wheat Cake",
      pt: "Wheat Cake",
      "zh-CN": "Wheat Cake",
      fr: "Wheat Cake",
      tk: "Wheat Cake",
    },
  },
  "Green Thumb": {
    image: "assets/skills/green_thumb.png",
    description: {
      en: "Crops are worth 5% more",
      pt: "Crops are worth 5% more",
      "zh-CN": "Crops are worth 5% more",
      fr: "Crops are worth 5% more",
      tk: "Crops are worth 5% more",
    },
  },
  "Barn Manager": {
    image: "assets/skills/barn_manager.png",
    description: {
      en: "Animals yield 10% more goods",
      pt: "Animals yield 10% more goods",
      "zh-CN": "Animals yield 10% more goods",
      fr: "Animals yield 10% more goods",
      tk: "Animals yield 10% more goods",
    },
  },
  "Seed Specialist": {
    image: "assets/skills/seed_specialist.png",
    description: {
      en: "Crops grow 10% faster",
      pt: "Crops grow 10% faster",
      "zh-CN": "Crops grow 10% faster",
      fr: "Crops grow 10% faster",
      tk: "Crops grow 10% faster",
    },
  },
  Wrangler: {
    image: "assets/skills/wrangler.png",
    description: {
      en: "Animals produce goods 10% faster",
      pt: "Animals produce goods 10% faster",
      "zh-CN": "Animals produce goods 10% faster",
      fr: "Animals produce goods 10% faster",
      tk: "Animals produce goods 10% faster",
    },
  },
  Lumberjack: {
    image: "assets/skills/lumberjack.png",
    description: {
      en: "Increase wood drops by 10%",
      pt: "Increase wood drops by 10%",
      "zh-CN": "Increase wood drops by 10%",
      fr: "Increase wood drops by 10%",
      tk: "Increase wood drops by 10%",
    },
  },
  Prospector: {
    image: "assets/skills/prospector.png",
    description: {
      en: "Increase stone drops by 20%",
      pt: "Increase stone drops by 20%",
      "zh-CN": "Increase stone drops by 20%",
      fr: "Increase stone drops by 20%",
      tk: "Increase stone drops by 20%",
    },
  },
  Logger: {
    image: "assets/skills/logger.png",
    description: {
      en: "Axes last 50% longer",
      pt: "Axes last 50% longer",
      "zh-CN": "Axes last 50% longer",
      fr: "Axes last 50% longer",
      tk: "Axes last 50% longer",
    },
  },
  "Gold Rush": {
    image: "assets/skills/gold_rush.png",
    description: {
      en: "Increase gold drops by 50%",
      pt: "Increase gold drops by 50%",
      "zh-CN": "Increase gold drops by 50%",
      fr: "Increase gold drops by 50%",
      tk: "Increase gold drops by 50%",
    },
  },
  Artist: {
    image: "assets/skills/artist.png",
    description: {
      en: "Save 10% on shop & blacksmith tools",
      pt: "Save 10% on shop & blacksmith tools",
      "zh-CN": "Save 10% on shop & blacksmith tools",
      fr: "Save 10% on shop & blacksmith tools",
      tk: "Save 10% on shop & blacksmith tools",
    },
  },
  Coder: {
    image: "assets/skills/coder.png",
    description: {
      en: "Crops yield 20% more",
      pt: "Crops yield 20% more",
      "zh-CN": "Crops yield 20% more",
      fr: "Crops yield 20% more",
      tk: "Crops yield 20% more",
    },
  },
  "Liquidity Provider": {
    image: "assets/skills/liquidity_provider.png",
    description: {
      en: "50% reduced SFL withdrawal fee",
      pt: "50% reduced SFL withdrawal fee",
      "zh-CN": "50% reduced SFL withdrawal fee",
      fr: "50% reduced SFL withdrawal fee",
      tk: "50% reduced SFL withdrawal fee",
    },
  },
  "Discord Mod": {
    image: "assets/skills/discord.png",
    description: {
      en: "Yield 35% more wood",
      pt: "Yield 35% more wood",
      "zh-CN": "Yield 35% more wood",
      fr: "Yield 35% more wood",
      tk: "Yield 35% more wood",
    },
  },
  Warrior: {
    image: "assets/skills/warrior.png",
    description: {
      en: "Early access to land expansion",
      pt: "Early access to land expansion",
      "zh-CN": "Early access to land expansion",
      fr: "Early access to land expansion",
      tk: "Early access to land expansion",
    },
  },
  "Trading Ticket": {
    image: "assets/icons/ticket.png",
    description: {
      en: "Free Trades! Woohoo!",
      pt: "Negociações grátis! Uhu!",
      "zh-CN": "Free Trades! Woohoo!",
      fr: "Échanges gratuits ! Hourra!",
      tk: "Serbest Ticaret! Vay be!",
    },
  },
  "Beta Pass": {
    image: "assets/icons/beta_pass.png",
    description: {
      en: "Gain early access to features for testing.",
      pt: "Acesso antecipado a recursos para teste.",
      "zh-CN": "Gain early access to features for testing.",
      fr: "Accédez en avant-première à des fonctionnalités pour les tester.",
      tk: "Test amaçlı özelliklere erken erişim sağlayın.",
    },
  },
  "War Bond": {
    image: "assets/icons/warBond.png",
    description: {
      en: "A mark of a true warrior",
      pt: "Uma marca de um verdadeiro guerreiro",
      "zh-CN": "A mark of a true warrior",
      fr: "La marque d'un vrai guerrier",
      tk: "Gerçek bir savaşçının işareti",
    },
  },
  "Goblin War Point": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "A display of allegiance",
      pt: "Uma exibição de lealdade",
      "zh-CN": "A display of allegiance",
      fr: "Une déclaration d'allégeance",
      tk: "Bir bağlılık gösterisi",
    },
  },
  "Human War Point": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "A display of allegiance",
      pt: "Uma exibição de lealdade",
      "zh-CN": "A display of allegiance",
      fr: "Une déclaration d'allégeance",
      tk: "Bir bağlılık gösterisi",
    },
  },
  "Human War Banner": {
    image: "assets/decorations/banners/human_banner.png",
    description: {
      en: "A display of allegiance to the Human cause",
      pt: "Uma exibição de lealdade à causa humana",
      "zh-CN": "彰显为人类伟业献身的盟约",
      fr: "Un affichage d'allégeance à la cause des Humains.",
      tk: "İnsan davasına bağlılığın bir göstergesi",
    },
  },
  "Goblin War Banner": {
    image: "assets/decorations/banners/goblin_banner.png",
    description: {
      en: "A display of allegiance to the Goblin cause",
      pt: "Uma exibição de lealdade à causa dos Goblins",
      "zh-CN": "彰显为哥布林伟业献身的盟约",
      fr: "Un affichage d'allégeance à la cause des Gobelins.",
      tk: "Goblin davasına bağlılığın bir göstergesi",
    },
  },
  "Sunflorian Faction Banner": {
    image: "assets/decorations/banners/factions/sunflorians_banner.webp",
    description: {
      en: "A display of allegiance to the Sunflorian Faction",
      pt: "A display of allegiance to the Sunflorian Faction",
      "zh-CN": "彰显对 Sunflorian 派系的忠心",
      fr: "A display of allegiance to the Sunflorian Faction",
      tk: "A display of allegiance to the Sunflorian Faction",
    },
  },
  "Nightshade Faction Banner": {
    image: "assets/decorations/banners/factions/nightshades_banner.webp",
    description: {
      en: "A display of allegiance to the Nightshade Faction",
      pt: "A display of allegiance to the Nightshade Faction",
      "zh-CN": "彰显对 Nightshade 派系的忠心",
      fr: "A display of allegiance to the Nightshade Faction",
      tk: "A display of allegiance to the Nightshade Faction",
    },
  },
  "Bumpkin Faction Banner": {
    image: "assets/decorations/banners/factions/bumpkins_banner.webp",
    description: {
      en: "A display of allegiance to the Bumpkin Faction",
      pt: "A display of allegiance to the Bumpkin Faction",
      "zh-CN": "彰显对 Bumpkin 派系的忠心",
      fr: "A display of allegiance to the Bumpkin Faction",
      tk: "A display of allegiance to the Bumpkin Faction",
    },
  },
  "Goblin Faction Banner": {
    image: "assets/decorations/banners/factions/goblins_banner.webp",
    description: {
      en: "A display of allegiance to the Goblin Faction",
      pt: "A display of allegiance to the Goblin Faction",
      "zh-CN": "彰显对 Goblin 派系的忠心",
      fr: "A display of allegiance to the Goblin Faction",
      tk: "A display of allegiance to the Goblin Faction",
    },
  },
  "Australian Flag": {
    image: "assets/sfts/flags/australia_flag.gif",
    description: {
      en: "Australian flag",
      pt: "Australian flag",
      "zh-CN": "Australian flag",
      fr: "Australian flag",
      tk: "Australian flag",
    },
  },
  "Belgian Flag": {
    image: "assets/sfts/flags/belgium_flag.gif",
    description: {
      en: "Belgian flag",
      pt: "Belgian flag",
      "zh-CN": "Belgian flag",
      fr: "Belgian flag",
      tk: "Belgian flag",
    },
  },
  "Brazilian Flag": {
    image: "assets/sfts/flags/brazil_flag.gif",
    description: {
      en: "Brazilian flag",
      pt: "Brazilian flag",
      "zh-CN": "Brazilian flag",
      fr: "Brazilian flag",
      tk: "Brazilian flag",
    },
  },
  "Chinese Flag": {
    image: "assets/sfts/flags/china_flag.gif",
    description: {
      en: "Chinese flag",
      pt: "Chinese flag",
      "zh-CN": "Chinese flag",
      fr: "Chinese flag",
      tk: "Chinese flag",
    },
  },
  "Finnish Flag": {
    image: "assets/sfts/flags/finland_flag.gif",
    description: {
      en: "Finnish flag",
      pt: "Finnish flag",
      "zh-CN": "Finnish flag",
      fr: "Finnish flag",
      tk: "Finnish flag",
    },
  },
  "French Flag": {
    image: "assets/sfts/flags/france_flag.gif",
    description: {
      en: "French flag",
      pt: "French flag",
      "zh-CN": "French flag",
      fr: "French flag",
      tk: "French flag",
    },
  },
  "German Flag": {
    image: "assets/sfts/flags/germany_flag.gif",
    description: {
      en: "German flag",
      pt: "German flag",
      "zh-CN": "German flag",
      fr: "German flag",
      tk: "German flag",
    },
  },
  "Indonesian Flag": {
    image: "assets/sfts/flags/indonesia_flag.gif",
    description: {
      en: "Indonesian flag",
      pt: "Indonesian flag",
      "zh-CN": "Indonesian flag",
      fr: "Indonesian flag",
      tk: "Indonesian flag",
    },
  },
  "Indian Flag": {
    image: "assets/sfts/flags/india_flag.gif",
    description: {
      en: "Indian flag",
      pt: "Indian flag",
      "zh-CN": "Indian flag",
      fr: "Indian flag",
      tk: "Indian flag",
    },
  },
  "Iranian Flag": {
    image: "assets/sfts/flags/iran_flag.gif",
    description: {
      en: "Iranian flag",
      pt: "Iranian flag",
      "zh-CN": "Iranian flag",
      fr: "Iranian flag",
      tk: "Iranian flag",
    },
  },
  "Italian Flag": {
    image: "assets/sfts/flags/italy_flag.gif",
    description: {
      en: "Italian flag",
      pt: "Italian flag",
      "zh-CN": "Italian flag",
      fr: "Italian flag",
      tk: "Italian flag",
    },
  },
  "Japanese Flag": {
    image: "assets/sfts/flags/japan_flag.gif",
    description: {
      en: "Japanese flag",
      pt: "Japanese flag",
      "zh-CN": "Japanese flag",
      fr: "Japanese flag",
      tk: "Japanese flag",
    },
  },
  "Moroccan Flag": {
    image: "assets/sfts/flags/morocco_flag.gif",
    description: {
      en: "Moroccan flag",
      pt: "Moroccan flag",
      "zh-CN": "Moroccan flag",
      fr: "Moroccan flag",
      tk: "Moroccan flag",
    },
  },
  "Dutch Flag": {
    image: "assets/sfts/flags/netherlands_flag.gif",
    description: {
      en: "Dutch flag",
      pt: "Dutch flag",
      "zh-CN": "Dutch flag",
      fr: "Dutch flag",
      tk: "Dutch flag",
    },
  },
  "Philippine Flag": {
    image: "assets/sfts/flags/philippines_flag.gif",
    description: {
      en: "Philippine flag",
      pt: "Philippine flag",
      "zh-CN": "Philippine flag",
      fr: "Philippine flag",
      tk: "Philippine flag",
    },
  },
  "Polish Flag": {
    image: "assets/sfts/flags/poland_flag.gif",
    description: {
      en: "Polish flag",
      pt: "Polish flag",
      "zh-CN": "Polish flag",
      fr: "Polish flag",
      tk: "Polish flag",
    },
  },
  "Portuguese Flag": {
    image: "assets/sfts/flags/portugal_flag.gif",
    description: {
      en: "Portuguese flag",
      pt: "Portuguese flag",
      "zh-CN": "Portuguese flag",
      fr: "Portuguese flag",
      tk: "Portuguese flag",
    },
  },
  "Russian Flag": {
    image: "assets/sfts/flags/russia_flag.gif",
    description: {
      en: "Russian flag",
      pt: "Russian flag",
      "zh-CN": "Russian flag",
      fr: "Russian flag",
      tk: "Russian flag",
    },
  },
  "Saudi Arabian Flag": {
    image: "assets/sfts/flags/saudi_arabia_flag.gif",
    description: {
      en: "Saudi Arabian flag",
      pt: "Saudi Arabian flag",
      "zh-CN": "Saudi Arabian flag",
      fr: "Saudi Arabian flag",
      tk: "Saudi Arabian flag",
    },
  },
  "South Korean Flag": {
    image: "assets/sfts/flags/south_korea_flag.gif",
    description: {
      en: "South Korean flag",
      pt: "South Korean flag",
      "zh-CN": "South Korean flag",
      fr: "South Korean flag",
      tk: "South Korean flag",
    },
  },
  "Spanish Flag": {
    image: "assets/sfts/flags/spain_flag.gif",
    description: {
      en: "Spanish flag",
      pt: "Spanish flag",
      "zh-CN": "Spanish flag",
      fr: "Spanish flag",
      tk: "Spanish flag",
    },
  },
  "Sunflower Flag": {
    image: "assets/sfts/flags/sunflower_flag.gif",
    description: {
      en: "Sunflower flag",
      pt: "Sunflower flag",
      "zh-CN": "Sunflower flag",
      fr: "Sunflower flag",
      tk: "Sunflower flag",
    },
  },
  "Thai Flag": {
    image: "assets/sfts/flags/thailand_flag.gif",
    description: {
      en: "Thai flag",
      pt: "Thai flag",
      "zh-CN": "Thai flag",
      fr: "Thai flag",
      tk: "Thai flag",
    },
  },
  "Turkish Flag": {
    image: "assets/sfts/flags/turkey_flag.gif",
    description: {
      en: "Turkish flag",
      pt: "Turkish flag",
      "zh-CN": "Turkish flag",
      fr: "Turkish flag",
      tk: "Turkish flag",
    },
  },
  "Ukrainian Flag": {
    image: "assets/sfts/flags/ukraine_flag.gif",
    description: {
      en: "Ukrainian flag",
      pt: "Ukrainian flag",
      "zh-CN": "Ukrainian flag",
      fr: "Ukrainian flag",
      tk: "Ukrainian flag",
    },
  },
  "American Flag": {
    image: "assets/sfts/flags/usa_flag.gif",
    description: {
      en: "American flag",
      pt: "American flag",
      "zh-CN": "American flag",
      fr: "American flag",
      tk: "American flag",
    },
  },
  "Vietnamese Flag": {
    image: "assets/sfts/flags/vietnam_flag.gif",
    description: {
      en: "Vietnamese flag",
      pt: "Vietnamese flag",
      "zh-CN": "Vietnamese flag",
      fr: "Vietnamese flag",
      tk: "Vietnamese flag",
    },
  },
  "Canadian Flag": {
    image: "assets/sfts/flags/canadian_flag.gif",
    description: {
      en: "Canadian flag",
      pt: "Canadian flag",
      "zh-CN": "Canadian flag",
      fr: "Canadian flag",
      tk: "Canadian flag",
    },
  },
  "Singaporean Flag": {
    image: "assets/sfts/flags/singaporean_flag.gif",
    description: {
      en: "Singaporean flag",
      pt: "Singaporean flag",
      "zh-CN": "Singaporean flag",
      fr: "Singaporean flag",
      tk: "Singaporean flag",
    },
  },
  "British Flag": {
    image: "assets/sfts/flags/british_flag.gif",
    description: {
      en: "British flag",
      pt: "British flag",
      "zh-CN": "British flag",
      fr: "British flag",
      tk: "British flag",
    },
  },
  "Sierra Leone Flag": {
    image: "assets/sfts/flags/sierra_leone_flag.gif",
    description: {
      en: "Sierra Leone flag",
      pt: "Sierra Leone flag",
      "zh-CN": "Sierra Leone flag",
      fr: "Sierra Leone flag",
      tk: "Sierra Leone flag",
    },
  },
  "Romanian Flag": {
    image: "assets/sfts/flags/romanian_flag.gif",
    description: {
      en: "Romanian flag",
      pt: "Romanian flag",
      "zh-CN": "Romanian flag",
      fr: "Romanian flag",
      tk: "Romanian flag",
    },
  },
  "Rainbow Flag": {
    image: "assets/sfts/flags/rainbow_flag.gif",
    description: {
      en: "Rainbow flag",
      pt: "Rainbow flag",
      "zh-CN": "Rainbow flag",
      fr: "Rainbow flag",
      tk: "Rainbow flag",
    },
  },
  "Goblin Flag": {
    image: "assets/sfts/flags/goblin_flag.gif",
    description: {
      en: "Goblin flag",
      pt: "Goblin flag",
      "zh-CN": "Goblin flag",
      fr: "Goblin flag",
      tk: "Goblin flag",
    },
  },
  "Pirate Flag": {
    image: "assets/sfts/flags/pirate_flag.gif",
    description: {
      en: "Pirate flag",
      pt: "Pirate flag",
      "zh-CN": "Pirate flag",
      fr: "Pirate flag",
      tk: "Pirate flag",
    },
  },
  "Algerian Flag": {
    image: "assets/sfts/flags/algerian_flag.gif",
    description: {
      en: "Algerian flag",
      pt: "Algerian flag",
      "zh-CN": "Algerian flag",
      fr: "Algerian flag",
      tk: "Algerian flag",
    },
  },
  "Mexican Flag": {
    image: "assets/sfts/flags/mexican_flag.gif",
    description: {
      en: "Mexican flag",
      pt: "Mexican flag",
      "zh-CN": "Mexican flag",
      fr: "Mexican flag",
      tk: "Mexican flag",
    },
  },
  "Dominican Republic Flag": {
    image: "assets/sfts/flags/dominican_republic_flag.gif",
    description: {
      en: "Dominican Republic flag",
      pt: "Dominican Republic flag",
      "zh-CN": "Dominican Republic flag",
      fr: "Dominican Republic flag",
      tk: "Dominican Republic flag",
    },
  },
  "Argentinian Flag": {
    image: "assets/sfts/flags/argentinian_flag.gif",
    description: {
      en: "Argentinian flag",
      pt: "Argentinian flag",
      "zh-CN": "Argentinian flag",
      fr: "Argentinian flag",
      tk: "Argentinian flag",
    },
  },
  "Lithuanian Flag": {
    image: "assets/sfts/flags/lithuanian_flag.gif",
    description: {
      en: "Lithuanian flag",
      pt: "Lithuanian flag",
      "zh-CN": "Lithuanian flag",
      fr: "Lithuanian flag",
      tk: "Lithuanian flag",
    },
  },
  "Malaysian Flag": {
    image: "assets/sfts/flags/malaysian_flag.gif",
    description: {
      en: "Malaysian flag",
      pt: "Malaysian flag",
      "zh-CN": "Malaysian flag",
      fr: "Malaysian flag",
      tk: "Malaysian flag",
    },
  },
  "Colombian Flag": {
    image: "assets/sfts/flags/colombian_flag.gif",
    description: {
      en: "Colombian flag",
      pt: "Colombian flag",
      "zh-CN": "Colombian flag",
      fr: "Colombian flag",
      tk: "Colombian flag",
    },
  },
  "Egg Basket": {
    image: "assets/sfts/easter/basket.png",
    description: {
      en: "Easter Event",
      pt: "Evento de Páscoa",
      "zh-CN": "复活节活动",
      fr: "Événement de Pâques",
      tk: "Paskalya Etkinliği",
    },
  },
  "Easter Bunny": {
    image: "assets/sfts/easter/easter_bunny.gif",
    description: {
      en: "Earn 20% more Carrots",
      pt: "Ganhe 20% mais cenouras",
      "zh-CN": "增加 20 % 胡萝卜产出",
      fr: "Gagnez 20 % de carottes supplémentaires.",
      tk: "%20 daha fazla Havuç kazanın",
    },
  },
  "Pablo The Bunny": {
    image: "assets/sfts/pablo_bunny.gif",
    description: {
      en: "A magical Easter bunny",
      pt: "Um coelho mágico de Páscoa",
      "zh-CN": "一只神奇的复活节兔子",
      fr: "Un lapin de Pâques magique",
      tk: "Büyülü bir paskalya tavşanı",
    },
  },
  "Blue Egg": {
    image: "assets/sfts/easter/blue_egg.png",
    description: {
      en: "A blue easter egg",
      pt: "Um ovo de Páscoa azul",
      "zh-CN": "一个蓝色的复活节彩蛋",
      fr: "Un œuf de Pâques bleu",
      tk: "Mavi bir Paskalya yumurtası",
    },
  },
  "Orange Egg": {
    image: "assets/sfts/easter/orange_egg.png",
    description: {
      en: "An orange easter egg",
      pt: "Um ovo de Páscoa laranja",
      "zh-CN": "一个橙色的复活节彩蛋",
      fr: "Un œuf de Pâques orange",
      tk: "Turuncu bir Paskalya yumurtası",
    },
  },
  "Green Egg": {
    image: "assets/sfts/easter/green_egg.png",
    description: {
      en: "A green easter egg",
      pt: "Um ovo de Páscoa verde",
      "zh-CN": "一个绿色的复活节彩蛋",
      fr: "Un œuf de Pâques vert",
      tk: "Yeşil bir Paskalya yumurtası",
    },
  },
  "Yellow Egg": {
    image: "assets/sfts/easter/yellow_egg.png",
    description: {
      en: "A yellow easter egg",
      pt: "Um ovo de Páscoa amarelo",
      "zh-CN": "一个黄色的复活节彩蛋",
      fr: "Un œuf de Pâques jaune",
      tk: "Sarı bir Paskalya yumurtası",
    },
  },
  "Red Egg": {
    image: "assets/sfts/easter/red_egg.png",
    description: {
      en: "A red easter egg",
      pt: "Um ovo de Páscoa vermelho",
      "zh-CN": "一个红色的复活节彩蛋",
      fr: "Un œuf de Pâques rouge",
      tk: "Kırmızı bir Paskalya yumurtası",
    },
  },
  "Pink Egg": {
    image: "assets/sfts/easter/pink_egg.png",
    description: {
      en: "A pink easter egg",
      pt: "Um ovo de Páscoa rosa",
      "zh-CN": "一个粉色的复活节彩蛋",
      fr: "Un œuf de Pâques rose",
      tk: "Pembe bir Paskalya yumurtası",
    },
  },
  "Purple Egg": {
    image: "assets/sfts/easter/purple_egg.png",
    description: {
      en: "A purple easter egg",
      pt: "Um ovo de Páscoa roxo",
      "zh-CN": "一个紫色的复活节彩蛋",
      fr: "Un œuf de Pâques violet",
      tk: "Mor bir Paskalya yumurtası",
    },
  },
  "Engine Core": {
    image: "assets/sfts/mom/engine_core.png",
    description: {
      en: "The power of the sunflower",
      pt: "The power of the sunflower",
      "zh-CN": "The power of the sunflower",
      fr: "The power of the sunflower",
      tk: "The power of the sunflower",
    },
  },
  Observatory: {
    image: "assets/sfts/mom/observatory.gif",
    description: {
      en: "Explore the stars and improve scientific development",
      pt: "Explore the stars and improve scientific development",
      "zh-CN": "Explore the stars and improve scientific development",
      fr: "Explore the stars and improve scientific development",
      tk: "Explore the stars and improve scientific development",
    },
  },
  "Goblin Key": {
    image: "assets/sfts/quest/goblin_key.png",
    description: {
      en: "The Goblin Key",
      pt: "A Chave do Goblin",
      "zh-CN": "The Goblin Key",
      fr: "La Clé des Gobelins",
      tk: "Goblin Anahtarı",
    },
  },
  "Sunflower Key": {
    image: "assets/sfts/quest/sunflower_key.png",
    description: {
      en: "The Sunflower Key",
      pt: "A Chave do Girassol",
      "zh-CN": "The Sunflower Key",
      fr: "La Clé du Tournesol",
      tk: "Ayçiçeği Anahtarı",
    },
  },
  "Ancient Goblin Sword": {
    image: "assets/sfts/quest/ancient_goblin_sword.png",
    description: {
      en: "An Ancient Goblin Sword",
      pt: "Uma Antiga Espada de Goblin",
      "zh-CN": "An Ancient Goblin Sword",
      fr: "Une Ancienne Épée des Gobelins",
      tk: "Kadim Bir Goblin Kılıcı",
    },
  },
  "Ancient Human Warhammer": {
    image: "assets/sfts/quest/ancient_human_warhammer.png",
    description: {
      en: "An Ancient Human Warhammer",
      pt: "Um Antigo Martelo de Guerra Humano",
      "zh-CN": "An Ancient Human Warhammer",
      fr: "Un Ancien Marteau de Guerre Humain",
      tk: "Kadim Bir İnsan Savaş Çekici",
    },
  },
  "Speed Chicken": {
    image: "assets/animals/chickens/speed_chicken.gif",
    description: {
      en: "Produces eggs 10% faster",
      pt: "Produces eggs 10% faster",
      "zh-CN": "Produces eggs 10% faster",
      fr: "Produces eggs 10% faster",
      tk: "Produces eggs 10% faster",
    },
  },
  "Fat Chicken": {
    image: "assets/animals/chickens/fat_chicken.gif",
    description: {
      en: "10% less wheat needed to feed a chicken",
      pt: "10% less wheat needed to feed a chicken",
      "zh-CN": "10% less wheat needed to feed a chicken",
      fr: "10% less wheat needed to feed a chicken",
      tk: "10% less wheat needed to feed a chicken",
    },
  },
  "Rich Chicken": {
    image: "assets/animals/chickens/rich_chicken.webp",
    description: {
      en: "Yields 10% more eggs",
      pt: "Yields 10% more eggs",
      "zh-CN": "Yields 10% more eggs",
      fr: "Yields 10% more eggs",
      tk: "Yields 10% more eggs",
    },
  },
  "Chef Apron": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Gives 20% extra SFL selling cakes",
      pt: "Dá 20% a mais na venda de bolos SFL",
      "zh-CN": "给予额外 20 % 蛋糕销售 SFL 利润",
      fr: "Donne 20 % de revenus SFL supplémentaires en vendant des gâteaux.",
      tk: "Pasta satışında %20 ekstra SFL verir",
    },
  },
  "Chef Hat": {
    image: "assets/icons/chef_hat.png",
    description: {
      en: "La couronne d'un boulanger légendaire !",
      pt: "A coroa de um padeiro lendário!",
      "zh-CN": "传奇面包师的桂冠！",
      fr: "La couronne d'un boulanger légendaire!",
      tk: "Efsanevi fırıncının tacı!",
    },
  },
  "Rapid Growth": {
    image: "assets/fertilisers/rapidGrowth.png",
    description: {
      en: "Apply to a crop to grow twice as fast",
      pt: "Apply to a crop to grow twice as fast",
      "zh-CN": "Apply to a crop to grow twice as fast",
      fr: "Apply to a crop to grow twice as fast",
      tk: "Apply to a crop to grow twice as fast",
    },
  },
  "Fire Pit": {
    image: "assets/buildings/fire_pit.png",
    description: {
      en: "Roast your Sunflowers, feed and level up your Bumpkin",
      pt: "Faça comidas, alimente e evolua seu Bumpkin",
      "zh-CN": "火堆。烤你的向日葵，喂食并升级你的乡包佬",
      fr: "Faites griller vos Sunflowers, nourrissez et améliorez votre Bumpkin",
      tk: "Ayçiçeği kavurun, Bumpkininizi besleyin ve seviye atlatın.",
    },
  },
  Market: {
    image: "assets/buildings/bettys_market.png",
    description: {
      en: "Buy and sell at the Farmer's Market",
      pt: "Compre e venda no Mercado dos Agricultores",
      "zh-CN": "市场。在农贸市场购买和出售",
      fr: "Achetez et vendez au marché des fermiers",
      tk: "Çiftçi pazarında alım ve satım yapın.",
    },
  },
  "Town Center": {
    image: "assets/buildings/town_center.png",
    description: {
      en: "Gather around the town center for the latest news",
      pt: "Reúna-se ao redor do centro da cidade para as últimas notícias",
      "zh-CN": "镇中心。聚集到 Town Center 获取最新消息",
      fr: "Rassemblez-vous autour du centre-ville pour les dernières nouvelles",
      tk: "En son haberler için şehir merkezinde toplanın.",
    },
  },
  House: {
    image: "assets/buildings/house.png",
    description: {
      en: "A place to rest your head",
      pt: "Um lugar para descansar a cabeça",
      "zh-CN": "房屋。一个让你休息的地方",
      fr: "Un endroit où reposer votre tête",
      tk: "Kafanı dinleyebileceğin bir yer.",
    },
  },
  Manor: {
    image: "assets/buildings/manor.png",
    description: {
      en: "A place to rest your head",
      pt: "Um lugar para descansar a cabeça",
      "zh-CN": "房屋。一个让你休息的地方",
      fr: "Un endroit où reposer votre tête",
      tk: "Kafanı dinleyebileceğin bir yer.",
    },
  },
  "Crop Machine": {
    image: "assets/buildings/crop_machine.wep.webp",
    description: {
      en: "Automate your crop production",
      pt: "Automatize suas plantações",
      "zh-CN": "基础庄稼生产自动化（消耗石油运转）",
      fr: "Automate your crop production",
      tk: "Automate your crop production",
    },
  },
  Kitchen: {
    image: "assets/buildings/kitchen.png",
    description: {
      en: "Step up your cooking game",
      pt: "Melhore sua habilidade culinária",
      "zh-CN": "厨房。升级您的烹饪游戏",
      fr: "Améliorez vos compétences en cuisine",
      tk: "Aşçılığınızı geliştirin",
    },
  },
  Bakery: {
    image: "assets/buildings/bakery.png",
    description: {
      en: "Bake your favourite cakes",
      pt: "Asse seus bolos favoritos",
      "zh-CN": "面包房。烤你最喜欢的蛋糕",
      fr: "Préparez vos gâteaux préférés",
      tk: "Favori pastalarınızı pişirin",
    },
  },
  Workbench: {
    image: "assets/buildings/workbench.png",
    description: {
      en: "Craft tools to collect resources",
      pt: "Faça ferramentas para coletar recursos",
      "zh-CN": "工作台。锻造收集资源的工具",
      fr: "Fabriquez des outils pour collecter des ressources",
      tk: "Kaynak toplamak için alet üretin",
    },
  },
  "Water Well": {
    image: "assets/buildings/well1.png",
    description: {
      en: "Crops need water!",
      pt: "As plantações precisam de água!",
      "zh-CN": "水井。庄稼需要水！",
      fr: "Les cultures ont besoin d'eau!",
      tk: "Mahsullerin suya ihtiyacı var!",
    },
  },
  Tent: {
    image: "assets/buildings/tent.png",
    description: {
      en: "(Discontinued)",
      pt: "(Descontinuado)",
      "zh-CN": "帐篷。（已绝版）",
      fr: "(Arrêté)",
      tk: "(Artık üretilmiyor)",
    },
  },
  "Hen House": {
    image: "assets/buildings/hen_house.png",
    description: {
      en: "Grow your chicken empire",
      pt: "Expanda seu império de galinhas",
      "zh-CN": "鸡窝。发展您的养鸡帝国。",
      fr: "Développez votre empire de poulets",
      tk: "Tavuk imparatorluğunuzu kurun",
    },
  },
  Deli: {
    image: "assets/buildings/deli.png",
    description: {
      en: "Satisfy your appetite with these delicatessen foods!",
      pt: "Satisfaça seu apetite com esses alimentos delicatessen!",
      "zh-CN": "熟食店。这些熟食满足你的口腹之欲！",
      fr: "Satisfaites votre appétit avec ces mets délicats!",
      tk: "Mezelerle iştahınızı tatmin edin!",
    },
  },
  "Smoothie Shack": {
    image: "assets/buildings/smoothie_shack.webp",
    description: {
      en: "Freshly squeezed!",
      pt: "Produz sucos e batidas espremidos na hora!",
      "zh-CN": "沙冰屋。鲜榨！",
      fr: "Pressé à froid!",
      tk: "Taze sıkılmış!",
    },
  },
  Toolshed: {
    image: "assets/buildings/toolshed.png",
    description: {
      en: "Increase your workbench tool stock by 50%",
      pt: "Aumente seu estoque de ferramentas em 50%",
      "zh-CN": "工具棚。Workbench 工具库存增加 50 %",
      fr: "Augmentez votre stock d'outils d'établi de 50 %",
      tk: "Çalışma tezgahı aletlerinizi %50 arttırın",
    },
  },
  Warehouse: {
    image: "assets/buildings/warehouse.png",
    description: {
      en: "Increase your seed stocks by 20%",
      pt: "Aumente seu estoque de sementes em 20%",
      "zh-CN": "仓库。种子库存增加 20 %",
      fr: "Augmentez vos stocks de graines de 20 %",
      tk: "Tohum stoğunuzu %20 arttırın",
    },
  },
  "Sunflower Amulet": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "10% increased Sunflower yield.",
      pt: "Aumenta o rendimento do Girassol em 10%.",
      "zh-CN": "增加 10 % 向日葵产出",
      fr: "Augmentation de 10 % du rendement en Sunflowers.",
      tk: "Ayçiçeği veriminde %10 artış.",
    },
  },
  "Carrot Amulet": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Carrots grow 20% faster.",
      pt: "As cenouras crescem 20% mais rápido.",
      "zh-CN": "增加 20 % 胡萝卜生长速度",
      fr: "Les carottes poussent 20 % plus vite.",
      tk: "Havuçlar %20 daha hızlı büyür.",
    },
  },
  "Beetroot Amulet": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "20% increased Beetroot yield.",
      pt: "Aumento de 20% na produção de Beterraba.",
      "zh-CN": "增加 20 % 甜菜根产出",
      fr: "Augmentation de 20 % du rendement en betteraves.",
      tk: "Pancar veriminde %20 artış.",
    },
  },
  "Green Amulet": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Chance for 10x crop yield.",
      pt: "Chance de colheita 10 vezes maior.",
      "zh-CN": "有几率收获 10 倍庄稼产出",
      fr: "Chance d'obtenir un rendement de culture 10 fois supérieur.",
      tk: "10x mahsul verimi şansı.",
    },
  },
  "Warrior Shirt": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "A mark of a true warrior.",
      pt: "Marca de um verdadeiro guerreiro.",
      "zh-CN": "真正战士的标志",
      fr: "Marque d'un véritable guerrier.",
      tk: "Gerçek bir savaşçının işareti.",
    },
  },
  "Warrior Pants": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Protect your thighs.",
      pt: "Proteja suas coxas.",
      "zh-CN": "保驾你的腿部",
      fr: "Protégez vos cuisses.",
      tk: "Kalçalarınızı koruyun.",
    },
  },
  "Warrior Helmet": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "Immune to arrows.",
      pt: "Imune a flechas.",
      "zh-CN": "免疫箭矢",
      fr: "Immunité aux flèches.",
      tk: "Oklara karşı bağışıklı.",
    },
  },
  "Sunflower Shield": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "A hero of Sunflower Land. Free Sunflower Seeds!",
      pt: "Um herói da Terra do Girassol. Sementes de girassol grátis!",
      "zh-CN": "Sunflower Land 的英雄。免费向日葵种子！",
      fr: "Un héros de Sunflower Land. Des graines de tournesol gratuites!",
      tk: "Ayçiçeği Diyarı'nın bir kahramanı. Ücretsiz Ayçiçeği Tohumları!",
    },
  },
  "Skull Hat": {
    image: "SUNNYSIDE.icons.expression_confused",
    description: {
      en: "A rare hat for your Bumpkin.",
      pt: "Um chapéu raro para o seu Bumpkin.",
      "zh-CN": "乡包佬的稀有帽子",
      fr: "Un chapeau rare pour votre Bumpkin.",
      tk: "Bumpkin'iniz için nadir bir şapka.",
    },
  },
  "War Skull": {
    image: "assets/decorations/war_skulls.png",
    description: {
      en: "Decorate the land with the bones of your enemies.",
      pt: "Decore a terra com os ossos de seus inimigos.",
      "zh-CN": "用敌人的骨颅装点您的地盘",
      fr: "Décorez l'île avec les os de vos ennemis.",
      tk: "Ülkeyi düşmanlarınızın kemikleriyle süsleyin.",
    },
  },
  "War Tombstone": {
    image: "assets/decorations/war_tombstone.png",
    description: {
      en: "R.I.P",
      pt: "R.I.P",
      "zh-CN": "愿您安息",
      fr: "R.I.P",
      tk: "HUZUR İÇİNDE YATSIN",
    },
  },
  "Undead Rooster": {
    image: "assets/animals/chickens/undead_chicken.gif",
    description: {
      en: "An unfortunate casualty of the war. 10% increased egg yield.",
      pt: "Uma casualidade da guerra. 10% de aumento na produção de ovos.",
      "zh-CN": "战争的不幸亡者。提升 10 % 鸡蛋产量。",
      fr: "Une victime malheureuse de la guerre. 10% de rendement en œufs supplémentaire.",
      tk: "Savaşın talihsiz bir kaybı. Yumurta veriminde 10% artış.",
    },
  },
  "Boiled Eggs": {
    image: "assets/food/boiled_eggs.png",
    description: {
      en: "Boiled Eggs are great for breakfast",
      pt: "Ovos cozidos são ótimos para o café da manhã",
      "zh-CN": "煮鸡蛋非常适合早餐。",
      fr: "Les œufs durs sont parfaits pour le petit-déjeuner",
      tk: "Haşlanmış Yumurta kahvaltıda harikadır",
    },
  },
  "Bumpkin Broth": {
    image: "assets/food/bumpkin_broth.png",
    description: {
      en: "A nutritious broth to replenish your Bumpkin",
      pt: "Um caldo nutritivo para repor seu Bumpkin",
      "zh-CN": "营养丰富的肉汤，可以补充你的乡巴佬。",
      fr: "Un bouillon nutritif pour recharger votre Bumpkin",
      tk: "Bumpkin'inizi yenilemek için besleyici bir et suyu",
    },
  },
  "Mashed Potato": {
    image: "assets/food/mashed_potato.png",
    description: {
      en: "My life is potato.",
      pt: "Minha vida é batata.",
      "zh-CN": "我的生活就是土豆。",
      fr: "Ma vie, c'est la potato.",
      tk: "Benim hayatım patates.",
    },
  },
  "Bumpkin Salad": {
    image: "assets/food/bumpkin_salad.png",
    description: {
      en: "Gotta keep your Bumpkin healthy!",
      pt: "Você precisa manter seu Bumpkin saudável!",
      "zh-CN": "Gotta keep your Bumpkin healthy!",
      fr: "Il faut garder votre Bumpkin en bonne santé!",
      tk: "Bumpkin'inizi sağlıklı tutmalısınız!",
    },
  },
  "Goblin's Treat": {
    image: "assets/food/goblins_treat.png",
    description: {
      en: "Goblins go crazy for this stuff!",
      pt: "Goblins ficam loucos por isso!",
      "zh-CN": "Goblins go crazy for this stuff!",
      fr: "Les gobelins raffolent de ce truc!",
      tk: "Goblinler bu şeylere deli oluyor!",
    },
  },
  "Cauliflower Burger": {
    image: "assets/food/cauliflower_burger.png",
    description: {
      en: "Calling all cauliflower lovers!",
      pt: "Chamando todos os amantes de couve-flor!",
      "zh-CN": "Calling all cauliflower lovers!",
      fr: "Appel à tous les amateurs de Cauliflower!",
      tk: "Tüm karnabahar severleri çağırıyoruz!",
    },
  },
  "Club Sandwich": {
    image: "assets/food/club_sandwich.png",
    description: {
      en: "Filled with Carrots and Roasted Sunflower Seeds",
      pt: "Recheado com cenouras e sementes de girassol torradas",
      "zh-CN": "Filled with Carrots and Roasted Sunflower Seeds",
      fr: "Rempli de carottes et de graines de tournesol rôties",
      tk: "Havuç ve Kavrulmuş Ay Çekirdeği Dolgulu",
    },
  },
  "Roast Veggies": {
    image: "assets/food/roast_veggies.png",
    description: {
      en: "Even Goblins need to eat their veggies!",
      pt: "Até os Goblins precisam comer seus vegetais!",
      "zh-CN": "Even Goblins need to eat their veggies!",
      fr: "Même les gobelins ont besoin de manger leurs légumes!",
      tk: "Goblinlerin bile sebzelerini yemesi gerekiyor!",
    },
  },
  Pancakes: {
    image: "assets/food/pancakes.png",
    description: {
      en: "A great start to a Bumpkins day",
      pt: "Um ótimo começo para o dia de um Bumpkin",
      "zh-CN": "A great start to a Bumpkins day",
      fr: "Un excellent début de journée pour un Bumpkin",
      tk: "Bumpkins gününe harika bir başlangıç",
    },
  },
  "Fermented Carrots": {
    image: "assets/food/fermented_carrots.png",
    description: {
      en: "Got a surplus of carrots?",
      pt: "Tem um excedente de cenouras?",
      "zh-CN": "有多剩余的胡萝卜吗？",
      fr: "Vous avez un surplus de carottes?",
      tk: "Fazla havuç var mı?",
    },
  },
  Sauerkraut: {
    image: "assets/food/sauerkraut.png",
    description: {
      en: "No more boring Cabbage!",
      pt: "Não mais repolho chato!",
      "zh-CN": "再也不是无聊的卷心菜了！",
      fr: "Fini le Cabbage ennuyeux!",
      tk: "Artık sıkıcı Lahana yok!",
    },
  },
  "Reindeer Carrot": {
    image: "assets/food/reindeer_carrot.png",
    description: {
      en: "Rudolph can't stop eating them!",
      pt: "Rudolph não consegue parar de comê-los!",
      "zh-CN": "鲁道夫无法停止吃它们！",
      fr: "Rudolph ne peut pas s'arrêter de les manger!",
      tk: "Rudolph onları yemeyi bırakamıyor!",
    },
  },
  "Bumpkin ganoush": {
    image: "assets/food/bumpkin_ganoush.png",
    description: {
      en: "Zesty roasted eggplant spread.",
      pt: "Espalhe berinjela assada com zeste.",
      "zh-CN": "Zesty roasted eggplant spread.",
      fr: "Sauce d'aubergine rôtie relevée.",
      tk: "Lezzetli közlenmiş patlıcan yayıldı.",
    },
  },
  "Eggplant Cake": {
    image: "assets/food/cakes/eggplant_cake.png",
    description: {
      en: "Sweet farm-fresh dessert surprise.",
      pt: "Surpresa de sobremesa fresca da fazenda.",
      "zh-CN": "甜美的新鲜甜点惊喜。",
      fr: "Douceur sucrée tout droit de la ferme.",
      tk: "Taze tatlı sürpriz.",
    },
  },
  Cornbread: {
    image: "assets/food/corn_bread.png",
    description: {
      en: "Hearty golden farm-fresh bread.",
      pt: "Pão de fazenda dourado e saudável.",
      "zh-CN": "丰盛的金色农家面包。",
      fr: "Un pain rustique doré et frais de la ferme.",
      tk: "Doyurucu altın çiftlik taze ekmeği.",
    },
  },
  Popcorn: {
    image: "assets/food/popcorn.png",
    description: {
      en: "Classic homegrown crunchy snack.",
      pt: "Lanche crocante caseiro clássico.",
      "zh-CN": "经典的自制脆脆小吃。",
      fr: "Une collation croustillante classique cultivée à la maison.",
      tk: "Klasik evde yetiştirilen çıtır atıştırmalık.",
    },
  },
  Chowder: {
    image: "assets/food/chowder.png",
    description: {
      en: "Sailor's delight in a bowl! Dive in, there's treasure inside!",
      pt: "Delícia de marinheiro em uma tigela! Mergulhe, há tesouro dentro!",
      "zh-CN": "Sailor's delight in a bowl! Dive in, there's treasure inside!",
      fr: "Le délice d'un marin dans un bol ! Plongez-y, il y a un trésor à l'intérieur!",
      tk: "Denizcinin kasedeki lokumu! Dalın, içeride hazine var!",
    },
  },
  Gumbo: {
    image: "assets/food/gumbo.png",
    description: {
      en: "A pot full of magic! Every spoonful's a Mardi Gras parade!",
      pt: "Uma panela cheia de magia! Cada colherada é um desfile de Mardi Gras!",
      "zh-CN": "一锅充满魔力！ 每一勺都是狂欢节游行！",
      fr: "Une marmite pleine de magie ! Chaque cuillerée est une parade de Mardi Gras!",
      tk: "Büyü dolu bir kap! Her kaşık dolusu bir Mardi Gras geçit törenidir!",
    },
  },
  "Fermented Fish": {
    image: "assets/food/fermented_fish.png",
    description: {
      en: "Daring delicacy! Unleash the Viking within with every bite!",
      pt: "Delicadeza audaciosa! Liberte o Viking que há dentro com cada mordida!",
      "zh-CN": "大胆的美食！每一口都能释放内心的维京战士！",
      fr: "Délice audacieux ! Libérez le Viking qui est en vous à chaque bouchée!",
      tk: "Cesur bir lezzet! Her lokmada içinizdeki Viking'i serbest bırakın!",
    },
  },
  Explorer: {
    image: "assets/achievements/explorer.png",
    description: {
      en: "Expand your Land",
      pt: "Expand your Land",
      "zh-CN": "Expand your Land",
      fr: "Expand your Land",
      tk: "Expand your Land",
    },
  },
  "Busy Bumpkin": {
    image: "assets/achievements/busy_bumpkin.png",
    description: {
      en: "Reach level 2",
      pt: "Reach level 2",
      "zh-CN": "Reach level 2",
      fr: "Reach level 2",
      tk: "Reach level 2",
    },
  },
  "Brilliant Bumpkin": {
    image: "assets/achievements/brilliant_bumpkin.png",
    description: {
      en: "Reach level 20",
      pt: "Reach level 20",
      "zh-CN": "Reach level 20",
      fr: "Reach level 20",
      tk: "Reach level 20",
    },
  },
  "Sun Seeker": {
    image: "assets/achievements/sun_seeker.png",
    description: {
      en: "Harvest Sunflower 100 times",
      pt: "Harvest Sunflower 100 times",
      "zh-CN": "Harvest Sunflower 100 times",
      fr: "Harvest Sunflower 100 times",
      tk: "Harvest Sunflower 100 times",
    },
  },
  "Sunflower Superstar": {
    image: "assets/achievements/sunflower_superstar.png",
    description: {
      en: "Harvest Sunflower 100,000 times",
      pt: "Harvest Sunflower 100,000 times",
      "zh-CN": "Harvest Sunflower 100,000 times",
      fr: "Harvest Sunflower 100,000 times",
      tk: "Harvest Sunflower 100,000 times",
    },
  },
  "My life is potato": {
    image: "assets/achievements/my_life_is_potato.png",
    description: {
      en: "Harvest Potato 5,000 times",
      pt: "Harvest Potato 5,000 times",
      "zh-CN": "Harvest Potato 5,000 times",
      fr: "Harvest Potato 5,000 times",
      tk: "Harvest Potato 5,000 times",
    },
  },
  "Jack O'Latern": {
    image: "assets/achievements/jack_o_lantern.png",
    description: {
      en: "Harvest Pumpkin 500 times",
      pt: "Harvest Pumpkin 500 times",
      "zh-CN": "Harvest Pumpkin 500 times",
      fr: "Harvest Pumpkin 500 times",
      tk: "Harvest Pumpkin 500 times",
    },
  },
  "20/20 Vision": {
    image: "assets/achievements/20-20-vision.png",
    description: {
      en: "Harvest Carrot 10,000 times",
      pt: "Harvest Carrot 10,000 times",
      "zh-CN": "Harvest Carrot 10,000 times",
      fr: "Harvest Carrot 10,000 times",
      tk: "Harvest Carrot 10,000 times",
    },
  },
  "Cabbage King": {
    image: "assets/achievements/cabbage_king.png",
    description: {
      en: "Harvest Cabbage 200 times",
      pt: "Harvest Cabbage 200 times",
      "zh-CN": "Harvest Cabbage 200 times",
      fr: "Harvest Cabbage 200 times",
      tk: "Harvest Cabbage 200 times",
    },
  },
  "Beetroot Beast": {
    image: "assets/achievements/beetrootBeast.png",
    description: {
      en: "Harvest Beetroot 2,000 times",
      pt: "Harvest Beetroot 2,000 times",
      "zh-CN": "Harvest Beetroot 2,000 times",
      fr: "Harvest Beetroot 2,000 times",
      tk: "Harvest Beetroot 2,000 times",
    },
  },
  "Cool Flower": {
    image: "assets/achievements/cool_cauliflower.png",
    description: {
      en: "Harvest Cauliflower 100 times",
      pt: "Harvest Cauliflower 100 times",
      "zh-CN": "Harvest Cauliflower 100 times",
      fr: "Harvest Cauliflower 100 times",
      tk: "Harvest Cauliflower 100 times",
    },
  },
  "Patient Parsnips": {
    image: "assets/achievements/patient_parsnip.png",
    description: {
      en: "Harvest Parsnip 5,000 times",
      pt: "Harvest Parsnip 5,000 times",
      "zh-CN": "Harvest Parsnip 5,000 times",
      fr: "Harvest Parsnip 5,000 times",
      tk: "Harvest Parsnip 5,000 times",
    },
  },
  "Rapid Radish": {
    image: "assets/achievements/rapidRadish.png",
    description: {
      en: "Harvest Radish 200 times",
      pt: "Harvest Radish 200 times",
      "zh-CN": "Harvest Radish 200 times",
      fr: "Harvest Radish 200 times",
      tk: "Harvest Radish 200 times",
    },
  },
  "Staple Crop": {
    image: "assets/achievements/staple_crop.png",
    description: {
      en: "Harvest Wheat 10,000 times",
      pt: "Harvest Wheat 10,000 times",
      "zh-CN": "Harvest Wheat 10,000 times",
      fr: "Harvest Wheat 10,000 times",
      tk: "Harvest Wheat 10,000 times",
    },
  },
  "Farm Hand": {
    image: "assets/achievements/farm_hand.png",
    description: {
      en: "Harvest crops 10,000 times",
      pt: "Harvest crops 10,000 times",
      "zh-CN": "Harvest crops 10,000 times",
      fr: "Harvest crops 10,000 times",
      tk: "Harvest crops 10,000 times",
    },
  },
  "Crop Champion": {
    image: "assets/achievements/crop_champion.png",
    description: {
      en: "Harvest 1 million crops",
      pt: "Harvest 1 million crops",
      "zh-CN": "Harvest 1 million crops",
      fr: "Harvest 1 million crops",
      tk: "Harvest 1 million crops",
    },
  },
  "Bread Winner": {
    image: "assets/achievements/bread_winner.png",
    description: {
      en: "Earn 0.001 SFL",
      pt: "Earn 0.001 SFL",
      "zh-CN": "Earn 0.001 SFL",
      fr: "Earn 0.001 SFL",
      tk: "Earn 0.001 SFL",
    },
  },
  "Bumpkin Billionaire": {
    image: "assets/achievements/bumpkin_billionaire.png",
    description: {
      en: "Earn 5,000 SFL",
      pt: "Earn 5,000 SFL",
      "zh-CN": "Earn 5,000 SFL",
      fr: "Earn 5,000 SFL",
      tk: "Earn 5,000 SFL",
    },
  },
  "Big Spender": {
    image: "assets/achievements/big_spender.png",
    description: {
      en: "Spend 10 SFL",
      pt: "Spend 10 SFL",
      "zh-CN": "Spend 10 SFL",
      fr: "Spend 10 SFL",
      tk: "Spend 10 SFL",
    },
  },
  "High Roller": {
    image: "assets/achievements/high_roller.png",
    description: {
      en: "Spend 7,500 SFL",
      pt: "Spend 7,500 SFL",
      "zh-CN": "Spend 7,500 SFL",
      fr: "Spend 7,500 SFL",
      tk: "Spend 7,500 SFL",
    },
  },
  Timbeerrr: {
    image: "assets/achievements/timber.png",
    description: {
      en: "Chop 150 trees",
      pt: "Chop 150 trees",
      "zh-CN": "Chop 150 trees",
      fr: "Chop 150 trees",
      tk: "Chop 150 trees",
    },
  },
  "Bumpkin Chainsaw Amateur": {
    image: "assets/achievements/bumpkin_chainsaw_amateur.png",
    description: {
      en: "Chop 5,000 trees",
      pt: "Chop 5,000 trees",
      "zh-CN": "Chop 5,000 trees",
      fr: "Chop 5,000 trees",
      tk: "Chop 5,000 trees",
    },
  },
  Driller: {
    image: "assets/achievements/driller.png",
    description: {
      en: "Mine 50 stone rocks",
      pt: "Mine 50 stone rocks",
      "zh-CN": "Mine 50 stone rocks",
      fr: "Mine 50 stone rocks",
      tk: "Mine 50 stone rocks",
    },
  },
  Canary: {
    image: "assets/achievements/canary.png",
    description: {
      en: "Mine 1,000 stone rocks",
      pt: "Mine 1,000 stone rocks",
      "zh-CN": "Mine 1,000 stone rocks",
      fr: "Mine 1,000 stone rocks",
      tk: "Mine 1,000 stone rocks",
    },
  },
  "Iron Eyes": {
    image: "assets/achievements/iron_eyes.png",
    description: {
      en: "Mine 50 iron rocks",
      pt: "Mine 50 iron rocks",
      "zh-CN": "Mine 50 iron rocks",
      fr: "Mine 50 iron rocks",
      tk: "Mine 50 iron rocks",
    },
  },
  "Something Shiny": {
    image: "assets/achievements/something_shiny.png",
    description: {
      en: "Mine 500 iron rocks",
      pt: "Mine 500 iron rocks",
      "zh-CN": "Mine 500 iron rocks",
      fr: "Mine 500 iron rocks",
      tk: "Mine 500 iron rocks",
    },
  },
  "El Dorado": {
    image: "assets/achievements/el-dorado.png",
    description: {
      en: "Mine 50 gold rocks",
      pt: "Mine 50 gold rocks",
      "zh-CN": "Mine 50 gold rocks",
      fr: "Mine 50 gold rocks",
      tk: "Mine 50 gold rocks",
    },
  },
  "Gold Fever": {
    image: "assets/achievements/gold_fever.png",
    description: {
      en: "Mine 500 gold rocks",
      pt: "Mine 500 gold rocks",
      "zh-CN": "Mine 500 gold rocks",
      fr: "Mine 500 gold rocks",
      tk: "Mine 500 gold rocks",
    },
  },
  "Kiss the Cook": {
    image: "assets/achievements/kiss_the_cook.png",
    description: {
      en: "Cook 20 meals",
      pt: "Cook 20 meals",
      "zh-CN": "Cook 20 meals",
      fr: "Cook 20 meals",
      tk: "Cook 20 meals",
    },
  },
  "Bakers Dozen": {
    image: "assets/achievements/bakers_dozen.png",
    description: {
      en: "Bake 13 cakes",
      pt: "Bake 13 cakes",
      "zh-CN": "Bake 13 cakes",
      fr: "Bake 13 cakes",
      tk: "Bake 13 cakes",
    },
  },
  "Chef de Cuisine": {
    image: "assets/achievements/chef_de_cuisine.png",
    description: {
      en: "Cook 5,000 meals",
      pt: "Cook 5,000 meals",
      "zh-CN": "Cook 5,000 meals",
      fr: "Cook 5,000 meals",
      tk: "Cook 5,000 meals",
    },
  },
  Craftmanship: {
    image: "assets/achievements/craftmanship.png",
    description: {
      en: "Craft 100 tools",
      pt: "Craft 100 tools",
      "zh-CN": "Craft 100 tools",
      fr: "Craft 100 tools",
      tk: "Craft 100 tools",
    },
  },
  "Time to chop": {
    image: "assets/achievements/time_to_chop.png",
    description: {
      en: "Craft 500 axes",
      pt: "Craft 500 axes",
      "zh-CN": "Craft 500 axes",
      fr: "Craft 500 axes",
      tk: "Craft 500 axes",
    },
  },
  Contractor: {
    image: "assets/achievements/contractor.png",
    description: {
      en: "Have 10 buildings constructed on your land",
      pt: "Have 10 buildings constructed on your land",
      "zh-CN": "Have 10 buildings constructed on your land",
      fr: "Have 10 buildings constructed on your land",
      tk: "Have 10 buildings constructed on your land",
    },
  },
  Museum: {
    image: "assets/achievements/museum.png",
    description: {
      en: "Have 10 different kinds of rare items placed on your land",
      pt: "Have 10 different kinds of rare items placed on your land",
      "zh-CN": "Have 10 different kinds of rare items placed on your land",
      fr: "Have 10 different kinds of rare items placed on your land",
      tk: "Have 10 different kinds of rare items placed on your land",
    },
  },
  "Crowd Favourite": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Delivery Dynamo": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Egg-cellent Collection": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Fruit Aficionado": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Land Baron": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Land Expansion Enthusiast": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Land Expansion Extraordinaire": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Scarecrow Maestro": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Seasoned Farmer": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Treasure Hunter": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Well of Prosperity": {
    image: null,
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "White Tulips": {
    image: "assets/decorations/white_tulips.png",
    description: {
      en: "Keep the smell of goblins away.",
      pt: "Mantenha o cheiro dos goblins afastado.",
      "zh-CN": "远离哥布林的嗅味",
      fr: "Éloignez l'odeur des Gobelins.",
      tk: "Goblinlerin kokusunu uzak tutun.",
    },
  },
  "Potted Sunflower": {
    image: "assets/decorations/potted_sunflower.png",
    description: {
      en: "Brighten up your land.",
      pt: "Ilumine sua terra.",
      "zh-CN": "为你的岛上增添阳光",
      fr: "Illuminez votre île.",
      tk: "Toprağınızı aydınlatın.",
    },
  },
  Cactus: {
    image: "assets/decorations/cactus.png",
    description: {
      en: "Saves water and makes your farm look stunning!",
      pt: "Economiza água e deixa sua fazenda deslumbrante!",
      "zh-CN": "节约用水并让您的农场美丽惊人！",
      fr: "Économise de l'eau et rend votre ferme magnifique!",
      tk: "Su tasarrufu sağlar ve çiftliğinizin muhteşem görünmesini sağlar!",
    },
  },
  "Jack-o-lantern": {
    image: "assets/sfts/jack_o_lantern.png",
    description: {
      en: "A Halloween special event item",
      pt: "Um item especial de evento de Halloween",
      "zh-CN": "A Halloween special event item",
      fr: "Un objet spécial d'événement d'Halloween",
      tk: "Cadılar Bayramı özel etkinlik öğesi",
    },
  },
  "Victoria Sisters": {
    image: "assets/sfts/victoria_sisters.gif",
    description: {
      en: "The pumpkin loving sisters",
      pt: "As irmãs amantes de abóbora",
      "zh-CN": "热爱南瓜的姐妹们",
      fr: "Les sœurs amatrices de pumpkins",
      tk: "Balkabağı seven kız kardeşler",
    },
  },
  "Basic Bear": {
    image: "assets/sfts/bears/basic_bear.png",
    description: {
      en: "A basic bear. Use this at Goblin Retreat to build a bear!",
      pt: "A basic bear. Use this at Goblin Retreat to build a bear!",
      "zh-CN": "A basic bear. Use this at Goblin Retreat to build a bear!",
      fr: "A basic bear. Use this at Goblin Retreat to build a bear!",
      tk: "A basic bear. Use this at Goblin Retreat to build a bear!",
    },
  },
  "Chef Bear": {
    image: "assets/sfts/bears/chef_bear.png",
    description: {
      en: "Every chef needs a helping hand",
      pt: "Todo chef precisa de uma mãozinha",
      "zh-CN": "每个厨师都需要个帮手",
      fr: "Chaque chef a besoin d'une aide précieuse.",
      tk: "Her şefin bir yardım eline ihtiyacı vardır",
    },
  },
  "Construction Bear": {
    image: "assets/sfts/bears/construction_bear.png",
    description: {
      en: "Always build in a bear market",
      pt: "Sempre construa em um mercado em baixa",
      "zh-CN": "熊市里就是要建设投入",
      fr: "Toujours construire en période de marché baissier.",
      tk: "Her zaman bir ayı piyasasında inşa edin",
    },
  },
  "Angel Bear": {
    image: "assets/sfts/bears/angel_bear.png",
    description: {
      en: "Time to transcend peasant farming",
      pt: "Hora de transcender a agricultura camponesa",
      "zh-CN": "是时候升华耕地生活了",
      fr: "Le moment de transcender l'agriculture paysanne.",
      tk: "Köylü çiftçiliğini aşmanın zamanı geldi",
    },
  },
  "Badass Bear": {
    image: "assets/sfts/bears/badass_bear.png",
    description: {
      en: "Nothing stands in your way.",
      pt: "Nada fica no seu caminho.",
      "zh-CN": "没人能挡着你的道",
      fr: "Rien ne se dresse sur votre chemin.",
      tk: "Hiçbir şey yolunuza çıkamaz.",
    },
  },
  "Bear Trap": {
    image: "assets/sfts/bears/bear_trap.png",
    description: {
      en: "It's a trap!",
      pt: "É uma armadilha!",
      "zh-CN": "是个陷阱！",
      fr: "C'est un piège!",
      tk: "Bu bir tuzak!",
    },
  },
  "Brilliant Bear": {
    image: "assets/sfts/bears/brilliant_bear.png",
    description: {
      en: "Pure brilliance!",
      pt: "Pura genialidade!",
      "zh-CN": "纯然聪耀！",
      fr: "Pure brillance!",
      tk: "Saf parlaklık!",
    },
  },
  "Classy Bear": {
    image: "assets/sfts/bears/classy_bear.png",
    description: {
      en: "More SFL than you know what to do with it!",
      pt: "Mais SFL do que você sabe o que fazer com isso!",
      "zh-CN": "SFL 多到你都不知道怎么花！",
      fr: "Plus SFL que vous ne savez quoi en faire!",
      tk: "Bununla ne yapacağınızı bildiğinizden daha fazla SFL!",
    },
  },
  "Farmer Bear": {
    image: "assets/sfts/bears/farmer_bear.png",
    description: {
      en: "Nothing quite like a hard day's work!",
      pt: "Nada como um dia de trabalho árduo!",
      "zh-CN": "辛勤劳作的一天，无可比拟！",
      fr: "Rien de tel qu'une dure journée de travail!",
      tk: "Hiçbir şey zorlu bir günlük çalışma gibisi yoktur!",
    },
  },
  "Rich Bear": {
    image: "assets/sfts/bears/rich_bear.png",
    description: {
      en: "A prized possession",
      pt: "Uma posse valorizada",
      "zh-CN": "好一个珍贵的财物",
      fr: "Une possession précieuse.",
      tk: "Değerli bir sahiplik",
    },
  },
  "Sunflower Bear": {
    image: "assets/sfts/bears/sunflower_bear.png",
    description: {
      en: "A Bear's cherished crop",
      pt: "Uma colheita apreciada pelo urso",
      "zh-CN": "这庄稼，小熊视如珍宝",
      fr: "Une culture chérie par un ours.",
      tk: "Bir Ayının değerli mahsulü",
    },
  },
  "Christmas Bear": {
    image: "assets/sfts/bears/christmas_bear.png",
    description: {
      en: "Santa's favorite",
      pt: "Santa's favorite",
      "zh-CN": "Santa's favorite",
      fr: "Santa's favorite",
      tk: "Santa's favorite",
    },
  },
  "Beta Bear": {
    image: "assets/sfts/bears/sfl_bear.png",
    description: {
      en: "A bear found through special testing events",
      pt: "Um urso encontrado através de eventos de teste especiais",
      "zh-CN": "特殊测试活动找到的小熊",
      fr: "Un ours trouvé lors d'événements de test spéciaux.",
      tk: "Özel test etkinlikleriyle bulunan bir ayı",
    },
  },
  "Rainbow Artist Bear": {
    image: "assets/sfts/bears/rainbow_artist_bear.png",
    description: {
      en: "The owner is a beautiful bear artist!",
      pt: "O proprietário é um belo artista urso!",
      "zh-CN": "主人可是个美丽小熊艺术家！",
      fr: "Le propriétaire est un bel artiste de l'ours!",
      tk: "Sahibi güzel bir ayı sanatçısı!",
    },
  },
  "Cabbage Boy": {
    image: "assets/sfts/cabbage_boy.gif",
    description: {
      en: "Don't wake the baby!",
      pt: "Não acorde o bebê!",
      "zh-CN": "不要吵醒宝宝！",
      fr: "Ne réveillez pas le bébé!",
      tk: "Bebeği uyandırma!",
    },
  },
  "Cabbage Girl": {
    image: "assets/sfts/cabbage_girl.gif",
    description: {
      en: "Shhh it's sleeping",
      pt: "Shhh, está dormindo",
      "zh-CN": "嘘，它正在睡觉",
      fr: "Chut, il dort",
      tk: "Şşş.. Uyuyor",
    },
  },
  "Wood Nymph Wendy": {
    image: "assets/sfts/wood_nymph_wendy.gif",
    description: {
      en: "Cast an enchantment to entice the wood fairies.",
      pt: "Lance um encantamento para atrair as fadas da madeira.",
      "zh-CN": "施放一个魔法来吸引林中仙子",
      fr: "Lancez un enchantement pour attirer les fées de la forêt.",
      tk: "Orman perilerini baştan çıkarmak için bir büyü yap.",
    },
  },
  "Peeled Potato": {
    image: "assets/sfts/peeled_potato.gif",
    description: {
      en: "A precious potato, encourages bonus potatoes on harvest.",
      pt: "Uma batata preciosa, incentiva batatas extras na colheita.",
      "zh-CN": "一颗珍贵的土豆，能在收获时带来额外土豆",
      fr: "Une précieuse potato, encourage les potato bonus à la récolte.",
      tk: "Değerli bir patates, hasat sırasında bonus patatesleri teşvik eder.",
    },
  },
  "Potent Potato": {
    image: "assets/sfts/potato_mutant.gif",
    description: {
      en: "Potent! Grants a 3% chance to get +10 potatoes on harvest.",
      pt: "Potente! Concede 3% de chance de obter +10 batatas na colheita.",
      "zh-CN": "强效！在收获时有 3 % 的机会 +10 土豆",
      fr: "Puissant ! Donne une chance de 3% d'obtenir +10 potato à la récolte.",
      tk: "Etkili! Hasatta 3% şans ile +10 patates verir.",
    },
  },
  "Radical Radish": {
    image: "assets/sfts/radish_mutant.gif",
    description: {
      en: "Radical! Grants a 3% chance to get +10 radishes on harvest.",
      pt: "Radical! Concede 3% de chance de obter +10 rabanetes na colheita.",
      "zh-CN": "激进！在收获时有 3 % 的机会 +10 小萝卜",
      fr: "Radical ! Donne une chance de 3% d'obtenir +10 Radish à la récolte.",
      tk: "Radikal! Hasatta 3% şans ile +10 turp verir.",
    },
  },
  "Stellar Sunflower": {
    image: "assets/sfts/sunflower_mutant.gif",
    description: {
      en: "Stellar! Grants a 3% chance to get +10 sunflowers on harvest.",
      pt: "Estelar! Concede 3% de chance de obter +10 girassóis na colheita.",
      "zh-CN": "卓越！在收获时有 3 % 的机会 +10 向日葵",
      fr: "Stellaire ! Donne une chance de 3% d'obtenir +10 Sunflowers à la récolte.",
      tk: "Yıldız! Hasatta 3% şans ile +10 ayçiçeği verir.",
    },
  },
  "Potted Potato": {
    image: "assets/decorations/potted_potato.png",
    description: {
      en: "Potato blood runs through your Bumpkin.",
      pt: "O sangue da batata corre pelo seu Bumpkin.",
      "zh-CN": "土豆血在你的乡包佬体内流淌。",
      fr: "Le sang de la potato coule dans votre Bumpkin.",
      tk: "Bumpkin'in içinden patates kanı akıyor.",
    },
  },
  "Potted Pumpkin": {
    image: "assets/decorations/potted_pumpkin.webp",
    description: {
      en: "Pumpkins for Bumpkins",
      pt: "Pumpkins for Bumpkins",
      "zh-CN": "Pumpkins for Bumpkins",
      fr: "Pumpkins for Bumpkins",
      tk: "Pumpkins for Bumpkins",
    },
  },
  "Golden Crop": {
    image: "assets/events/golden_crop/golden_crop.gif",
    description: {
      en: "A shiny golden crop",
      pt: "Uma safra dourada brilhante",
      "zh-CN": "A shiny golden crop",
      fr: "Une culture dorée étincelante",
      tk: "Parlak altın bir mahsul",
    },
  },
  "Christmas Snow Globe": {
    image: "assets/decorations/snowglobe.gif",
    description: {
      en: "Swirl the snow and watch it come to life",
      pt: "Gire a neve e veja-a ganhar vida",
      "zh-CN": "摇一摇，看雪再活生机",
      fr: "Remuez la neige et regardez-la prendre vie.",
      tk: "Karları döndürün ve canlanmasını izleyin",
    },
  },
  "Immortal Pear": {
    image: "assets/sfts/immortal_pear.webp",
    description: {
      en: "Increase the survival of your fruit patches.",
      pt: "Increase the survival of your fruit patches.",
      "zh-CN": "一种能使果树寿命变长的长寿梨",
      fr: "Increase the survival of your fruit patches.",
      tk: "Increase the survival of your fruit patches.",
    },
  },
  "Lady Bug": {
    image: "assets/sfts/ladybug.gif",
    description: {
      en: "An incredible bug that feeds on aphids. Improves Apple quality.",
      pt: "Um inseto incrível que se alimenta de pulgões. Melhora a qualidade da maçã.",
      "zh-CN": "一种令人啧啧称奇的虫子，以蚜虫为食。 能够提升苹果品质",
      fr: "Un incroyable insecte qui se nourrit de pucerons. Améliore la qualité des pommes.",
      tk: "Yaprak bitleriyle beslenen inanılmaz bir böcek. Elma kalitesini artırır.",
    },
  },
  "Squirrel Monkey": {
    image: "assets/sfts/squirrel_monkey.gif",
    description: {
      en: "A natural orange predator. Orange Trees are scared when a Squirrel Monkey is around.",
      pt: "Um predador natural de laranjas. As árvores de laranja ficam assustadas quando um Macaco-Esquilo está por perto.",
      "zh-CN": "天然的香橙捕食客。有 Squirrel Monkey 在附近时，橙树都感到害怕",
      fr: "Un prédateur naturel des oranges. Les arbres d'orange ont peur quand un Singe Écureuil est dans les parages.",
      tk: "Doğal turuncu bir yırtıcı hayvan. Portakal ağaçları Squirrel Monkey etraftayken korkar.",
    },
  },
  "Black Bearry": {
    image: "assets/sfts/black_bear.gif",
    description: {
      en: "His favorite treat - plump, juicy blueberries. Gobbles them up by the handful!",
      pt: "Seu deleite favorito - Mirtilos suculentos e rechonchudos. Devora-os a punhados!",
      "zh-CN": "他最喜欢的零食——丰满多汁的蓝莓。他一把把地狼吞虎咽！",
      fr: "Sa gourmandise préférée - des myrtilles dodues et juteuses. Il les engloutit par poignées!",
      tk: "En sevdiği ikram; dolgun,sulu yaban mersini. Onları avuç avuç yutar!",
    },
  },
  "Devil Bear": {
    image: "assets/sfts/bears/devil_bear.png",
    description: {
      en: "Better the Devil you know than the Devil you don't",
      pt: "Melhor o Diabo que você conhece do que o Diabo que você não conhece",
      "zh-CN": "知根知底的恶魔总比不知的好",
      fr: "Mieux vaut le Diable que vous connaissez que le Diable que vous ne connaissez pas.",
      tk: "Tanıdığın Şeytan tanımadığın Şeytandan iyidir",
    },
  },
  "Orange Squeeze": {
    image: "assets/achievements/orange_squeeze.png",
    description: {
      en: "Harvest Orange 100 times",
      pt: "Harvest Orange 100 times",
      "zh-CN": "Harvest Orange 100 times",
      fr: "Harvest Orange 100 times",
      tk: "Harvest Orange 100 times",
    },
  },
  "Apple of my Eye": {
    image: "assets/achievements/apple_of_my_eye.png",
    description: {
      en: "Harvest Apple 500 times",
      pt: "Harvest Apple 500 times",
      "zh-CN": "Harvest Apple 500 times",
      fr: "Harvest Apple 500 times",
      tk: "Harvest Apple 500 times",
    },
  },
  "Blue Chip": {
    image: "assets/achievements/blue_chip.png",
    description: {
      en: "Harvest Blueberry 5,000 times",
      pt: "Harvest Blueberry 5,000 times",
      "zh-CN": "Harvest Blueberry 5,000 times",
      fr: "Harvest Blueberry 5,000 times",
      tk: "Harvest Blueberry 5,000 times",
    },
  },
  "Fruit Platter": {
    image: "assets/achievements/fruit_platter.png",
    description: {
      en: "Harvest 50,000 fruits",
      pt: "Harvest 50,000 fruits",
      "zh-CN": "Harvest 50,000 fruits",
      fr: "Harvest 50,000 fruits",
      tk: "Harvest 50,000 fruits",
    },
  },
  "Ayam Cemani": {
    image: "assets/animals/chickens/ayam_cemani.gif",
    description: {
      en: "The rarest chicken in existence!",
      pt: "O frango mais raro que existe!",
      "zh-CN": "世上最稀有的鸡！",
      fr: "La poule la plus rare qui existe!",
      tk: "Var olan en nadir tavuk!",
    },
  },
  "Collectible Bear": {
    image: "assets/sfts/bears/collectible_bear.png",
    description: {
      en: "A prized bear, still in mint condition!",
      pt: "Um urso valioso, ainda em condição de menta!",
      "zh-CN": "小熊奖品，全新无损！",
      fr: "Un ours précieux, toujours en parfait état!",
      tk: "Değerli bir ayı, hala mükemmel durumda!",
    },
  },
  "Cyborg Bear": {
    image: "assets/sfts/bears/cyborg_bear.png",
    description: {
      en: "Hasta la vista, bear",
      pt: "Hasta la vista, urso",
      "zh-CN": "后会有期，熊儿",
      fr: "Hasta la vista, l'ours.",
      tk: "Görüşürüz, ayı",
    },
  },
  "Maneki Neko": {
    image: "assets/sfts/maneki_neko.gif",
    description: {
      en: "The beckoning cat. Pull its arm and good luck will come",
      pt: "O gato da sorte. Puxe o braço e a boa sorte virá",
      "zh-CN": "招财猫。拉动手臂，好运来临",
      fr: "Le chat qui fait signe. Tirez sur son bras et la bonne chance viendra",
      tk: "Şanslı kedi. Kolunu çek ve güzel şanslar gelecek",
    },
  },
  "Red Envelope": {
    image: "assets/icons/red_envelope.png",
    description: {
      en: "Wow, you are lucky!",
      pt: "Uau, você tem sorte!",
      "zh-CN": "Wow, you are lucky!",
      fr: "Wow, vous avez de la chance!",
      tk: "Vay, şanslısın!",
    },
  },
  "Love Letter": {
    image: "assets/icons/love_letter.png",
    description: {
      en: "Convey feelings of love",
      pt: "Expressar sentimentos de amor",
      "zh-CN": "Convey feelings of love",
      fr: "Transmettez des sentiments d'amour",
      tk: "Sevgi duygularını aktarın",
    },
  },
  "Clam Shell": {
    image: "assets/sfts/treasure/clam_shell.webp",
    description: {
      en: "A clam shell.",
      pt: "Uma concha de marisco.",
      "zh-CN": "蛤壳。一块蛤壳。",
      fr: "Une coquille de palourde.",
      tk: "Bir İstiridye kabuğu.",
    },
  },
  "Sea Cucumber": {
    image: "SUNNYSIDE.resource.sea_cucumber",
    description: {
      en: "A sea cucumber.",
      pt: "Um pepino-do-mar.",
      "zh-CN": "海参。一根海参。",
      fr: "Un concombre de mer.",
      tk: "Bir Deniz hıyarı.",
    },
  },
  Coral: {
    image: "SUNNYSIDE.resource.coral",
    description: {
      en: "A piece of coral, it's pretty",
      pt: "Um pedaço de coral, é bonito",
      "zh-CN": "珊瑚。一块珊瑚，很漂亮",
      fr: "Un morceau de corail, c'est joli",
      tk: "Bir parça mercan, çok tatlı.",
    },
  },
  Crab: {
    image: "SUNNYSIDE.resource.crab",
    description: {
      en: "A crab, watch out for its claws!",
      pt: "Um caranguejo, cuidado com suas garras!",
      "zh-CN": "螃蟹。小心它的爪子！",
      fr: "Un crabe, attention à ses pinces!",
      tk: "Bir yengeç, kıskaçlarına dikkat et!!",
    },
  },
  Starfish: {
    image: "SUNNYSIDE.resource.starfish",
    description: {
      en: "The star of the sea.",
      pt: "A estrela do mar.",
      "zh-CN": "海星。海中之星。",
      fr: "L'étoile de la mer.",
      tk: "Denizin yıldızı.",
    },
  },
  "Pirate Bounty": {
    image: "SUNNYSIDE.resource.pirate_bounty",
    description: {
      en: "A bounty for a pirate. It's worth a lot of money.",
      pt: "Uma recompensa por um pirata. Vale muito dinheiro.",
      "zh-CN": "海盗赏金。给海盗的赏金，值很多钱。",
      fr: "Une prime pour un pirate. Elle vaut beaucoup d'argent.",
      tk: "Korsan için bir ganimet. Çok para ediyor.",
    },
  },
  "Pirate Cake": {
    image: "assets/food/cakes/pirate_cake.webp",
    description: {
      en: "Great for Pirate themed birthday parties.",
      pt: "Great for Pirate themed birthday parties.",
      "zh-CN": "Great for Pirate themed birthday parties.",
      fr: "Great for Pirate themed birthday parties.",
      tk: "Great for Pirate themed birthday parties.",
    },
  },
  "Abandoned Bear": {
    image: "assets/sfts/bears/abandoned_bear.png",
    description: {
      en: "A bear that was left behind on the island.",
      pt: "Um urso que foi deixado para trás na ilha.",
      "zh-CN": "一只被落在岛上的小熊",
      fr: "Un ours qui a été laissé derrière sur l'île.",
      tk: "Adada geride bırakılan bir ayı.",
    },
  },
  "Turtle Bear": {
    image: "assets/sfts/bears/turtle_bear.webp",
    description: {
      en: "Turtley enough for the turtle club.",
      pt: "Suficientemente tartarugoso para o clube da tartaruga.",
      "zh-CN": "够龟样去参加龟龟俱乐部了",
      fr: "Assez pour le club des tortues.",
      tk: "Kaplumbağa kulübü için yeterince kaplumbağa var.",
    },
  },
  "T-Rex Skull": {
    image: "assets/sfts/t_rex_skull.webp",
    description: {
      en: "A skull from a T-Rex! Amazing!",
      pt: "Um crânio de um T-Rex! Incrível!",
      "zh-CN": "暴龙头骨！棒极了！",
      fr: "Un crâne de T-Rex ! Incroyable!",
      tk: "T-Rex'ten bir kafatası! İnanılmaz!",
    },
  },
  "Sunflower Coin": {
    image: "assets/sfts/sunflower_coin.webp",
    description: {
      en: "A coin made of sunflowers.",
      pt: "Uma moeda feita de girassóis.",
      "zh-CN": "一颗向日葵做的硬币",
      fr: "Une pièce faite de Sunflowers.",
      tk: "Ayçiçeklerinden yapılmış bir madeni para.",
    },
  },
  Foliant: {
    image: "assets/sfts/foliant.webp",
    description: {
      en: "A book of spells.",
      pt: "Um livro de feitiços.",
      "zh-CN": "一本咒法书",
      fr: "Un livre de sorts.",
      tk: "Bir büyü kitabı.",
    },
  },
  "Skeleton King Staff": {
    image: "assets/sfts/skeleton_king_staff.webp",
    description: {
      en: "All hail the Skeleton King!",
      pt: "Toda a glória ao Rei Esquelético!",
      "zh-CN": "骷髅王万岁！",
      fr: "Tous saluent le Roi Squelette!",
      tk: "Hepiniz İskelet Kral'ı selamlayın!",
    },
  },
  "Lifeguard Bear": {
    image: "assets/sfts/bears/lifeguard_bear.webp",
    description: {
      en: "Lifeguard Bear is here to save the day!",
      pt: "O Urso Salva-vidas está aqui para salvar o dia!",
      "zh-CN": "救生熊来拯救世界了！",
      fr: "L'ours sauveteur est là pour sauver la journée!",
      tk: "Cankurtaran Ayı günü kurtarmak için burada!",
    },
  },
  "Snorkel Bear": {
    image: "assets/sfts/bears/snorkel_bear.webp",
    description: {
      en: "Snorkel Bear loves to swim.",
      pt: "O Urso Snorkel adora nadar.",
      "zh-CN": "呼吸管熊热爱游泳",
      fr: "L'ours tuba aime nager.",
      tk: "Şnorkel Ayı yüzmeyi çok seviyor.",
    },
  },
  "Parasaur Skull": {
    image: "assets/sfts/parasaur_skull.webp",
    description: {
      en: "A skull from a parasaur!",
      pt: "Um crânio de um parasaur!",
      "zh-CN": "一个副栉龙头骨！",
      fr: "Un crâne de parasaur!",
      tk: "Parasaur'dan bir kafatası!",
    },
  },
  "Goblin Bear": {
    image: "assets/sfts/bears/goblin_bear.webp",
    description: {
      en: "A goblin bear. It's a bit scary.",
      pt: "Um urso goblin. É um pouco assustador.",
      "zh-CN": "一只哥布林熊。有点吓人",
      fr: "Un ours gobelin. C'est un peu effrayant.",
      tk: "Bir goblin ayı. Biraz korkutucu.",
    },
  },
  "Golden Bear Head": {
    image: "assets/sfts/golden_bear_head.webp",
    description: {
      en: "Spooky, but cool.",
      pt: "Assustador, mas legal.",
      "zh-CN": "诡异，但很酷",
      fr: "Effrayant, mais cool.",
      tk: "Ürkütücü ama harika.",
    },
  },
  "Pirate Bear": {
    image: "assets/sfts/bears/pirate_bear.webp",
    description: {
      en: "Argh, matey! Hug me!",
      pt: "Argh, pirata! Abraço!",
      "zh-CN": "呀啊，伙计！抱我！",
      fr: "Argh, matelot ! Serre-moi dans tes bras!",
      tk: "Ah, dostum! Sarıl bana!",
    },
  },
  Galleon: {
    image: "assets/sfts/galleon.webp",
    description: {
      en: "A toy ship, still in pretty good nick.",
      pt: "Um navio de brinquedo, ainda em muito bom estado.",
      "zh-CN": "玩具船，但完好无损",
      fr: "Un navire jouet, toujours en très bon état.",
      tk: "Oyuncak bir gemi, hala oldukça iyi durumda.",
    },
  },
  "Dinosaur Bone": {
    image: "assets/sfts/dinosaur_bone.webp",
    description: {
      en: "A Dinosaur Bone! What kind of creature was this?",
      pt: "Um Osso de Dinossauro! Que tipo de criatura era esta?",
      "zh-CN": "恐龙骨头！这真是怎么一种生物？",
      fr: "Un os de dinosaure ! De quelle créature s'agit-il?",
      tk: "Bir Dinozor Kemiği! Bu nasıl bir yaratıktı?",
    },
  },
  "Human Bear": {
    image: "assets/sfts/bears/human_bear.webp",
    description: {
      en: "A human bear. Even scarier than a goblin bear.",
      pt: "Um urso humano. Ainda mais assustador do que um urso goblin.",
      "zh-CN": "人型熊。甚至比哥布林熊还要吓人",
      fr: "Un ours humain. Encore plus effrayant qu'un ours gobelin.",
      tk: "Bir insan ayı. Bir goblin ayıdan bile daha korkutucu.",
    },
  },
  "Wooden Compass": {
    image: "assets/sfts/treasure/wooden_compass.webp",
    description: {
      en: "It may not be high-tech, but it will always steer you in the right direction, wood you believe it?",
      pt: "Pode não ser alta tecnologia, mas sempre vai te guiar na direção certa, você acreditaria nisso?",
      "zh-CN":
        "木指南针。它可能不是高科技，但它总会引导你走向正确的方向，你信不？",
      fr: "Il n'est peut-être pas high-tech, mais il vous orientera toujours dans la bonne direction, vous le croyez en bois?",
      tk: "Yüksek teknoloji olmayabilir ama seni her zaman doğru istikamete yönlendirecek, buna inanabiliyo musun?",
    },
  },
  "Iron Compass": {
    image: "assets/sfts/treasure/iron_compass.webp",
    description: {
      en: "Iron out your path to treasure! This compass is 'attract'-ive, and not just to the magnetic North!",
      pt: "Endireite seu caminho para o tesouro! Esta bússola é 'atrativa', e não apenas para o Norte magnético!",
      "zh-CN":
        "铁指南针。开辟你的宝藏之路！这个指南针很有吸引力，而且不仅仅是对磁极！",
      fr: "Redressez votre chemin vers le trésor ! Ce compas est 'attirant', et pas seulement vers le Nord magnétique!",
      tk: "Yolunu hazineye doğru çiz! Bu pusula çok ‘çekici’, ve sadece manyetik kuzey kutbuna değil!",
    },
  },
  "Emerald Compass": {
    image: "assets/sfts/treasure/emerald_compass.webp",
    description: {
      en: "Guide your way through the lush mysteries of life! This compass doesn't just point North, it points towards opulence and grandeur!",
      pt: "Guie seu caminho através dos mistérios exuberantes da vida! Esta bússola aponta para a opulência e grandiosidade!",
      "zh-CN":
        "玉指南针。引导你探索生命的繁茂奥秘！这个指南针不仅指向北方，还指向富贵伟业！",
      fr: "Guidez votre chemin à travers les mystères luxuriants de la vie ! Ce compas ne pointe pas seulement vers le Nord, il pointe vers l'opulence et la grandeur!",
      tk: "Yolunuzu hayatın bereketli gizemlerine çevirin! Bu pusula sadece kuzeyi göstermiyor, aynı zamanda zenginliği ve ihtişamı işaret ediyor!",
    },
  },
  "Old Bottle": {
    image: "assets/sfts/treasure/old_bottle.png",
    description: {
      en: "Antique pirate bottle, echoing tales of high seas adventure.",
      pt: "Garrafa de pirata antiga, ecoando contos de aventura em alto mar.",
      "zh-CN": "老旧漂流瓶。古董海盗瓶，印照着公海冒险传说。",
      fr: "Bouteille de pirate antique, évoquant des récits d'aventures en haute mer.",
      tk: "Antik korsan şişesi, açık deniz maceralarının hikayelerini yankılıyor.",
    },
  },
  "Tiki Totem": {
    image: "assets/sfts/tiki_totem.webp",
    description: {
      en: "The Tiki Totem adds 0.1 wood to every tree you chop.",
      pt: "O Totem Tiki adiciona 0,1 madeira a cada árvore que você corta.",
      "zh-CN": "Tiki Totem 会在你每次砍树时额外增加 0.1 个木头",
      fr: "Le Totem Tiki ajoute 0,1 de Wood à chaque arbre que vous coupez.",
      tk: "Tiki Totem kestiğiniz her ağaca 0.1 odun ekler.",
    },
  },
  "Lunar Calendar": {
    image: "assets/sfts/lunar_calendar.webp",
    description: {
      en: "Crops now follow the lunar cycle! 10% increase to crop growth speed.",
      pt: "Os cultivos agora seguem o ciclo lunar! Aumento de 10% na velocidade de crescimento das plantações.",
      "zh-CN": "庄稼现在遵循满月周期！庄稼生长速度提高 10 %",
      fr: "Les cultures suivent désormais le cycle lunaire ! Augmentation de 10% de la vitesse de croissance des cultures.",
      tk: "Mahsuller artık ay döngüsünü takip ediyor! Mahsullerin büyüme hızında 10% artış.",
    },
  },
  "Heart of Davy Jones": {
    image: "assets/sfts/heart_of_davy_jones.gif",
    description: {
      en: "Whoever possesses it holds immense power over the seven seas, can dig for treasure without tiring.",
      pt: "Quem o possui detém um poder imenso sobre os sete mares, pode cavar tesouros sem se cansar.",
      "zh-CN": "谁拥有它，谁就拥有掌控七大洋的浩瀚力量，可以挖掘财宝不知疲倦",
      fr: "Celui qui le possède détient un immense pouvoir sur les sept mers, peut creuser des trésors sans se fatiguer.",
      tk: "Ona sahip olan kişi yedi deniz üzerinde muazzam bir güce sahip olur,yorulmadan hazine kazabilir.",
    },
  },
  "Treasure Map": {
    image: "assets/sfts/treasure/treasure_map.webp",
    description: {
      en: "An enchanted map that leads the holder to valuable treasure. +20% profit from beach bounty items.",
      pt: "Um mapa encantado que leva o portador a tesouros valiosos. +20% de lucro com a venda de itens de recompensa da praia.",
      "zh-CN": "一张魔法地图，能引领持有者找到珍贵的财宝。沙岸财宝的利润 +20 %",
      fr: "Une carte enchantée qui guide son détenteur vers un trésor précieux. +20% de profit sur les objets de la chasse à la plage.",
      tk: "Sahibini değerli bir hazineye götüren gizemli bir harita. Plaj ödül eşyalarından +20% kar.",
    },
  },
  "Heart Balloons": {
    image: "assets/events/valentine/sfts/heart_balloons.png",
    description: {
      en: "Use them as decorations for romantic occasions.",
      pt: "Use-os como decoração para ocasiões românticas.",
      "zh-CN": "用作浪漫场合的装饰吧",
      fr: "Utilisez-les comme décoration pour des occasions romantiques.",
      tk: "Bunları romantik günler için dekorasyon olarak kullanın.",
    },
  },
  Flamingo: {
    image: "assets/events/valentine/sfts/flamingo.webp",
    description: {
      en: "Represents a symbol of love's beauty standing tall and confident.",
      pt: "Representa um símbolo da beleza do amor, alto e confiante.",
      "zh-CN": "爱的标志挺立高岸",
      fr: "Représente un symbole de la beauté de l'amour, debout grand et confiant.",
      tk: "Dikenli ve kendinden emin duran aşkın güzelliğinin simgesidir.",
    },
  },
  "Blossom Tree": {
    image: "assets/events/valentine/sfts/blossom_tree.png",
    description: {
      en: "Its delicate petals symbolizes the beauty and fragility of love.",
      pt: "Suas delicadas pétalas simbolizam a beleza e fragilidade do amor.",
      "zh-CN": "精致的花瓣象征着美丽而脆弱的爱",
      fr: "Ses pétales délicats symbolisent la beauté et la fragilité de l'amour.",
      tk: "Narin yaprakları aşkın güzelliğini ve kırılganlığını simgelemektedir.",
    },
  },
  Pearl: {
    image: "assets/sfts/treasure/pearl.webp",
    description: {
      en: "Shimmers in the sun.",
      pt: "Brilha ao sol.",
      "zh-CN": "珍珠。阳光之下闪闪发光。",
      fr: "Brille au soleil.",
      tk: "Güneşte parlıyor.",
    },
  },
  Pipi: {
    image: "assets/sfts/treasure/pipi.webp",
    description: {
      en: "Plebidonax deltoides, found in the Pacific Ocean.",
      pt: "Plebidonax deltoides, encontrado no Oceano Pacífico.",
      "zh-CN": "三角斧蛤。发现于太平洋。",
      fr: "Plebidonax deltoides, trouvé dans l'océan Pacifique.",
      tk: "Plebidonax deltoides, Pasifik okyanusunda bulundu.",
    },
  },
  Seaweed: {
    image: "assets/sfts/treasure/seaweed.webp",
    description: {
      en: "Seaweed.",
      pt: "Algas marinhas.",
      "zh-CN": "海藻。",
      fr: "Des algues marines.",
      tk: "Deniz yosunu.",
    },
  },
  "Whale Bear": {
    image: "assets/sfts/bears/whale_bear.webp",
    description: {
      en: "It has a round, furry body like a bear, but with the fins, tail, and blowhole of a whale.",
      pt: "Tem um corpo redondo e peludo como um urso, mas com as barbatanas, cauda e sopro de uma baleia.",
      "zh-CN": "圆润毛绒的身体恰似小熊，但有着鲸鱼的鱼鳍、鱼尾和气孔",
      fr: "Il a un corps rond et poilu comme un ours, mais avec les nageoires, la queue et le blowhole d'une baleine.",
      tk: "Bir ayı gibi yuvarlak, tüylü bir vücudu vardır, ancak yüzgeçleri, kuyruğu ve bir balinanın hava deliği vardır.",
    },
  },
  "Valentine Bear": {
    image: "assets/sfts/bears/love_bear.png",
    description: {
      en: "For those who love.",
      pt: "Para aqueles que amam.",
      "zh-CN": "为愿爱之人",
      fr: "Pour ceux qui aiment.",
      tk: "Sevenler için.",
    },
  },
  "Easter Bear": {
    image: "assets/sfts/bears/easter_bear.png",
    description: {
      en: "How can a Bunny lay eggs?",
      pt: "Como um coelho pode botar ovos?",
      "zh-CN": "兔子怎么下蛋？",
      fr: "Comment un lapin peut-il pondre des œufs?",
      tk: "Bir Tavşan nasıl yumurtlayabilir?",
    },
  },
  "Easter Bush": {
    image: "assets/sfts/easter_bush.gif",
    description: {
      en: "What is inside?",
      pt: "O que tem dentro?",
      "zh-CN": "里头是什么？",
      fr: "Qu'y a-t-il à l'intérieur?",
      tk: "İçerideki ne?",
    },
  },
  "Giant Carrot": {
    image: "assets/sfts/giant_carrot.png",
    description: {
      en: "A giant carrot stood, casting fun shadows, as rabbits gazed in wonder.",
      pt: "Uma cenoura gigante ficou, lançando sombras divertidas, enquanto coelhos observavam maravilhados.",
      "zh-CN": "巨大的胡萝卜直立着，奇趣的影子投下着，注视的兔子惊讶着",
      fr: "Une grosse carotte debout, projetant des ombres amusantes, alors que les lapins contemplent avec émerveillement.",
      tk: "Tavşanlar merakla bakarken dev bir havuç eğlenceli gölgeler yaratarak duruyordu.",
    },
  },
  "Iron Idol": {
    image: "assets/sfts/iron_idol.webp",
    description: {
      en: "The Idol adds 1 iron every time you mine iron.",
      pt: "O Ídolo adiciona 1 ferro toda vez que você minera ferro.",
      "zh-CN": "每次开采铁矿，偶像都会额外赐你 1 块铁矿",
      fr: "L'Idole ajoute 1 fer à chaque fois que vous minez du fer.",
      tk: "Idol, demir kazdığında +1 demir ekler.",
    },
  },
  "Genie Lamp": {
    image: "assets/sfts/genie_lamp.png",
    description: {
      en: "A magical lamp that contains a genie who will grant you three wishes.",
      pt: "Uma lâmpada mágica que contém um gênio que concederá três desejos.",
      "zh-CN": "一盏有魔力的灯，里面有一个能帮你实现三个愿望的精灵",
      fr: "Une lampe magique contenant un génie qui vous accordera trois vœux.",
      tk: "İçinde sana 3 dilek hakkı verecek bir cin içeren sihirli bir lamba.",
    },
  },
  "Emerald Turtle": {
    image: "assets/sfts/aoe/emerald_turtle.webp",
    description: {
      en: "The Emerald Turtle gives +0.5 to any minerals you mine within its Area of Effect.",
      pt: "A Tartaruga Esmeralda dá +0,5 a quaisquer minerais que você minera dentro de sua Área de Efeito.",
      "zh-CN":
        "Emerald Turtle 会为你在其作用范围内开采的任何基矿带来 +0.5 增益",
      fr: "La Tortue d'Émeraude ajoute +0,5 à tous les minéraux que vous minez dans sa zone d'effet.",
      tk: "Zümrüt Kaplumbağa etki alanı içinde kazdığın tüm minerallere +0.5 verir.",
    },
  },
  "Tin Turtle": {
    image: "assets/sfts/aoe/tin_turtle.webp",
    description: {
      en: "The Tin Turtle gives +0.1 to Stones you mine within its Area of Effect.",
      pt: "A Tartaruga de Estanho dá +0,1 a Pedras que você minera dentro de sua Área de Efeito.",
      "zh-CN": "Tin Turtle 会为你在其作用范围内开采的石头带来 +0.1 增益",
      fr: "La Tortue d'Étain ajoute +0,1 aux pierres que vous minez dans sa zone d'effet.",
      tk: "Küçük Kaplumbağa etki alanı içinde kazdığın taşlara +0.1 verir.",
    },
  },
  "Basic Scarecrow": {
    image: "assets/sfts/aoe/basic_scarecrow.png",
    description: {
      en: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      pt: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      "zh-CN": "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      fr: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
      tk: "Boost nearby Sunflowers, Potatoes and Pumpkins.",
    },
  },
  Bale: {
    image: "assets/sfts/aoe/bale.png",
    description: {
      en: "Boost nearby chickens.",
      pt: "Vizinho favorito das aves, fornece um retiro aconchegante para as galinhas",
      "zh-CN": "家禽们最喜欢的邻居，为鸡们提供一个舒适的休息地",
      fr: "Le voisin préféré de la volaille, offrant une retraite confortable aux poules",
      tk: "Tavuklar için konforlu bir sığınak sağlayan,kümes hayvanlarının en sevdiği komşusu.",
    },
  },
  "Sir Goldensnout": {
    image: "assets/sfts/aoe/sir_goldensnout.png",
    description: {
      en: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      pt: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      "zh-CN":
        "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      fr: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
      tk: "A royal member, Sir GoldenSnout infuses your farm with sovereign prosperity through its golden manure.",
    },
  },
  "Scary Mike": {
    image: "assets/sfts/aoe/scary_mike.png",
    description: {
      en: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      pt: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      "zh-CN":
        "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      fr: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
      tk: "Boost nearby Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers and Parsnips",
    },
  },
  "Laurie the Chuckle Crow": {
    image: "assets/sfts/aoe/laurie.png",
    description: {
      en: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      pt: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      "zh-CN": "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      fr: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
      tk: "Boost nearby Eggplant, Corn, Radish, Wheat and Kale",
    },
  },
  "Freya Fox": {
    image: "assets/sfts/freya_fox.png",
    description: {
      en: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      pt: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      "zh-CN":
        "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      fr: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
      tk: "Enchanting guardian, boosts pumpkin growth with her mystical charm. Harvest abundant pumpkins under her watchful gaze.",
    },
  },
  "Queen Cornelia": {
    image: "assets/sfts/aoe/queen_cornelia.png",
    description: {
      en: "Command the regal power of Queen Cornelia and experience a magnificent Area of Effect boost to your corn production. +1 Corn.",
      pt: "Comande o poder régio da Rainha Cornelia e experimente um magnífico impulso de Área de Efeito para a produção de milho. +1 Milho.",
      "zh-CN":
        "掌控Queen Cornelia的威严力量，并体验大块区域内玉米产量的显著提升。+1 玉米",
      fr: "Commandez le pouvoir royal de la Reine Cornelia et bénéficiez d'un magnifique boost de zone d'effet pour votre production de Corn. +1 de Corn.",
      tk: "Queen Cornelia’nın muhteşem gücünü kontrol edin ve mısır üretiminde müthiş bir etki alanı artışını deneyimleyin.+1 mısır.",
    },
  },
  "Compost Bin": {
    image: "assets/composters/composter_basic.png",
    description: {
      en: "Produces bait & fertiliser on a regular basis.",
      pt: "Produz iscas e fertilizantes regularmente.",
      "zh-CN": "箱式堆肥器。定期生产鱼饵和肥料",
      fr: "Produit régulièrement de l'appât et de l'engrais.",
      tk: "Düzenli olarak yem ve gübre üretir.",
    },
  },
  "Turbo Composter": {
    image: "assets/composters/composter_advanced.png",
    description: {
      en: "Produces advanced bait & fertiliser on a regular basis.",
      pt: "Produz iscas e fertilizantes avançados regularmente.",
      "zh-CN": "涡轮堆肥器。定期生产高级鱼饵和肥料",
      fr: "Produit régulièrement de l'appât et de l'engrais avancés.",
      tk: "Düzenli olarak gelişmiş yem ve gübre üretir.",
    },
  },
  "Premium Composter": {
    image: "assets/composters/composter_expert.png",
    description: {
      en: "Produces expert bait & fertiliser on a regular basis.",
      pt: "Produz iscas e fertilizantes especialistas regularmente.",
      "zh-CN": "旗舰堆肥器。定期生产专业鱼饵和肥料",
      fr: "Produit régulièrement de l'appât et de l'engrais experts.",
      tk: "Düzenli olarak uzman yem ve gübre üretir.",
    },
  },
  "Solar Flare Ticket": {
    image: "assets/icons/solar_flare_ticket.png",
    description: {
      en: "A ticket used during the Solar Flare Season",
      pt: "Um ticket usado durante a Temporada de Solar Flare",
      "zh-CN": "A ticket used during the Solar Flare Season",
      fr: "Un billet utilisé pendant la saison des Éruptions Solaires",
      tk: "Güneş Patlaması Sezonunda kullanılan bir bilet",
    },
  },
  "Dawn Breaker Ticket": {
    image: "assets/icons/dawn_breaker_ticket.png",
    description: {
      en: "A ticket used during the Dawn Breaker Season",
      pt: "Um ticket usado durante a Temporada Danw Breaker",
      "zh-CN": "A ticket used during the Dawn Breaker Season",
      fr: "Un billet utilisé pendant la saison de l'Éclaireur de l'Aube",
      tk: "Şafak Kıran Sezonunda kullanılan bir bilet",
    },
  },
  "Crow Feather": {
    image: "assets/icons/crow_feather.webp",
    description: {
      en: "A ticket used during the Witches' Eve Ticket Season",
      pt: "Um ticket usado durante Whiches' Eve",
      "zh-CN": "A ticket used during the Witches' Eve Ticket Season",
      fr: "Un billet utilisé pendant la saison des Billets de la Veille des Sorcières",
      tk: "Cadılar Bayramı Bilet Sezonunda kullanılan bir bilet",
    },
  },
  "Mermaid Scale": {
    image: "assets/icons/mermaid_scale.webp",
    description: {
      en: "A ticket used during the Catch the Kraken Season",
      pt: "Um ticket usado durante a Temporada de Catch the Kraken",
      "zh-CN": "A ticket used during the Catch the Kraken Season",
      fr: "Un billet utilisé pendant la saison de la Chasse au Kraken",
      tk: "Kraken'i Yakala Sezonunda kullanılan bir bilet",
    },
  },
  "Tulip Bulb": {
    image: "assets/icons/tulip_bulb.png",
    description: {
      en: "A ticket used during the Spring Blossom",
      pt: "Um ticket usado durante a ",
      "zh-CN": "A ticket used during the Spring Blossom",
      fr: "Un billet utilisé pendant la Floraison du Printemps.",
      tk: "Bahar Çiçeği sırasında kullanılan bir bilet",
    },
  },
  Scroll: {
    image: "assets/icons/scroll.webp",
    description: {
      en: "A ticket used during the Clash of Factions Season",
      pt: "Um ticket usado durante a temporada Clash of Factions",
      "zh-CN": "A ticket used during the Clash of Factions Season",
      fr: "A ticket used during the Clash of Factions Season",
      tk: "A ticket used during the Clash of Factions Season",
    },
  },
  "Bumpkin Emblem": {
    image: "assets/icons/bumpkin_emblem.webp",
    description: {
      en: "Show your allegiance to the Bumpkins",
      pt: "Show your allegiance to the Bumpkins",
      "zh-CN": "Show your allegiance to the Bumpkins",
      fr: "Show your allegiance to the Bumpkins",
      tk: "Show your allegiance to the Bumpkins",
    },
  },
  "Goblin Emblem": {
    image: "assets/icons/goblin_emblem.webp",
    description: {
      en: "Show your allegiance to the Goblins",
      pt: "Show your allegiance to the Goblins",
      "zh-CN": "Show your allegiance to the Goblins",
      fr: "Show your allegiance to the Goblins",
      tk: "Show your allegiance to the Goblins",
    },
  },
  "Nightshade Emblem": {
    image: "assets/icons/nightshade_emblem.webp",
    description: {
      en: "Show your allegiance to the Nightshades",
      pt: "Show your allegiance to the Nightshades",
      "zh-CN": "Show your allegiance to the Nightshades",
      fr: "Show your allegiance to the Nightshades",
      tk: "Show your allegiance to the Nightshades",
    },
  },
  "Sunflorian Emblem": {
    image: "assets/icons/sunflorian_emblem.webp",
    description: {
      en: "Show your allegiance to the Sunflorians",
      pt: "Show your allegiance to the Sunflorians",
      "zh-CN": "Show your allegiance to the Sunflorians",
      fr: "Show your allegiance to the Sunflorians",
      tk: "Show your allegiance to the Sunflorians",
    },
  },
  Mark: {
    image: "assets/icons/faction_mark.webp",
    description: {
      en: "Use these in the faction shop",
      pt: "Use these in the faction shop",
      "zh-CN": "Use these in the faction shop",
      fr: "Use these in the faction shop",
      tk: "Use these in the faction shop",
    },
  },
  "Sunflower Supporter": {
    image: "assets/icons/supporter_ticket.png",
    description: {
      en: "The mark of a true supporter of the game!",
      pt: "A marca de um verdadeiro apoiador do jogo!",
      "zh-CN": "The mark of a true supporter of the game!",
      fr: "La marque d'un véritable supporter du jeu!",
      tk: "Oyunun gerçek bir destekçisinin işareti!",
    },
  },
  "Treasure Key": {
    image: "assets/sfts/quest/sunflower_key.png",
    description: {
      en: "Visit the plaza to unlock your reward",
      pt: "Visite o Plaza para desbloquear sua recompensa",
      "zh-CN": "Visit the plaza to unlock your reward",
      fr: "Visitez la place pour débloquer votre récompense",
      tk: "Ödülünüzün kilidini açmak için Plazayı ziyaret edin",
    },
  },
  "Beach Ball": {
    image: "assets/seasons/solar-flare/beach_ball.webp",
    description: {
      en: "Bouncy ball brings beachy vibes, blows boredom away.",
      pt: "A bola saltitante traz vibrações de praia, afasta o tédio.",
      "zh-CN": "弹跳的小球跃动着海滩气息，赶走所有无聊",
      fr: "La balle rebondissante apporte des vibrations de plage, chasse l'ennui.",
      tk: "Zıplayan top, plaj havası verir ve can sıkıntısını giderir.",
    },
  },
  "Palm Tree": {
    image: "assets/seasons/solar-flare/palm_tree.webp",
    description: {
      en: "Tall, beachy, shady and chic, palm trees make waves sashay.",
      pt: "Alto, de praia, sombreado e chique, as palmeiras fazem as ondas gingarem.",
      "zh-CN": "高大、滩岸、阴凉、别致，棕榈树摇曳着海浪",
      fr: "Haut, branché, ombragé et chic, les palmiers font des vagues.",
      tk: "Uzun, kumsal, gölgeli ve şık palmiye ağaçları dalgaları dalgalandırıyor.",
    },
  },
  Karkinos: {
    image: "assets/seasons/solar-flare/karkinos.png",
    description: {
      en: "Pinchy but kind, the crabby cabbage-boosting addition to your farm!",
      pt: "Afiado mas gentil, adição de repolho “caranguejo” à sua fazenda!",
      "zh-CN": "咔叽诺斯。掐得也温柔，卷心好帮手！",
      fr: "Pincé mais gentil, l'ajout crabe-Cabbage à votre ferme qui améliore la production de choux!",
      tk: "Çimdik sever ama kibar, çiftliğine lahana artırıcı bir yengeç!",
    },
  },
  "Mushroom House": {
    image: "assets/seasons/dawn-breaker/mushroom_house.png",
    description: {
      en: "A whimsical, fungi-abode where the walls sprout with charm and even the furniture has a 'spore-tacular' flair!",
      pt: "Uma morada fungosa e caprichosa onde as paredes brotam com charme e até os móveis têm um toque 'esporacular'!",
      "zh-CN": "好一个真上老菌的奇趣妙妙屋，四壁散发迷人魅力，家具孢含惊奇！",
      fr: "Une demeure fantasque pleine de champignons où les murs poussent avec charme et même les meubles ont un flair 'spore-taculaire'!",
      tk: "Duvarların cazibesiyle filizlendiği ve eşyaların bile mantarşem bir zarafete sahip olduğu tuhaf mantar meskeni!",
    },
  },
  "Basic Land": {
    image: "SUNNYSIDE.resource.land",
    description: {
      en: "A basic piece of land",
      pt: "Um pedaço básico de terra",
      "zh-CN": "一片基础岛地",
      fr: "Un morceau d'île basique.",
      tk: "Temel bir toprak parçası",
    },
  },
  "Crop Plot": {
    image: "SUNNYSIDE.resource.plot",
    description: {
      en: "An empty plot to plant crops on",
      pt: "Um espaço vazio para plantar",
      "zh-CN": "一块空田以种庄稼",
      fr: "Une parcelle vide pour planter des cultures.",
      tk: "Bitki yetiştirmek için boş bir arsa",
    },
  },
  "Sunstone Rock": {
    image: "assets/resources/sunstone/sunstone_rock_1.webp",
    description: {
      en: "A mineable rock to collect sunstone",
      pt: "A mineable rock to collect sunstone",
      "zh-CN": "A mineable rock to collect sunstone",
      fr: "A mineable rock to collect sunstone",
      tk: "A mineable rock to collect sunstone",
    },
  },
  "Gold Rock": {
    image: "assets/resources/gold_small.png",
    description: {
      en: "A mineable rock to collect gold",
      pt: "Uma rocha minerável para coletar ouro",
      "zh-CN": "一片矿脉以收集黄金",
      fr: "Une roche exploitable pour collecter de l'or.",
      tk: "Altın toplamak için kazılabilen bir kaya",
    },
  },
  "Iron Rock": {
    image: "assets/resources/iron_small.png",
    description: {
      en: "A mineable rock to collect iron",
      pt: "Uma rocha minerável para coletar ferro",
      "zh-CN": "一片矿脉以收集铁矿",
      fr: "Une roche exploitable pour collecter du fer.",
      tk: "Demir toplamak için kazılabilen bir kaya",
    },
  },
  "Stone Rock": {
    image: "assets/resources/stone_small.png",
    description: {
      en: "A mineable rock to collect stone",
      pt: "Uma rocha minerável para coletar pedra",
      "zh-CN": "一片矿脉以收集石头",
      fr: "Une roche exploitable pour collecter de la pierre.",
      tk: "Taş toplamak için kazılabilen bir kaya",
    },
  },
  "Crimstone Rock": {
    image: "assets/resources/crimstone/crimstone_rock_1.webp",
    description: {
      en: "A mineable rock to collect crimstone",
      pt: "Uma rocha minerável para coletar Crimstone",
      "zh-CN": "一片矿脉以收集红宝石",
      fr: "Une roche exploitable pour collecter du crimstone.",
      tk: "Kızıltaş toplamak için kazılabilen bir kaya",
    },
  },
  "Oil Reserve": {
    image: "assets/resources/oil/oil_reserve_full.webp",
    description: {
      en: "A source of oil",
      pt: "Uma reserva para coletar petróleo",
      "zh-CN": "石油之源",
      fr: "A source of oil",
      tk: "A source of oil",
    },
  },
  Tree: {
    image: "SUNNYSIDE.resource.tree",
    description: {
      en: "A choppable tree to collect wood",
      pt: "Uma árvore cortável para coletar madeira",
      "zh-CN": "一棵树木以收集木头",
      fr: "Un arbre que vous pouvez abattre pour collecter du Wood.",
      tk: "Odun toplamak için kesilebilir bir ağaç",
    },
  },
  "Fruit Patch": {
    image: "SUNNYSIDE.resource.fruitPatch",
    description: {
      en: "An empty plot to plant fruit on",
      pt: "Um terreno vazio para plantar frutas",
      "zh-CN": "一块空田以种水果",
      fr: "Une parcelle vide pour planter des fruits.",
      tk: "Meyve dikmek için boş bir arsa",
    },
  },
  "Flower Bed": {
    image: "assets/flowers/empty.webp",
    description: {
      en: "An empty plot to plant flowers on",
      pt: "Um terreno vazio para plantar flores",
      "zh-CN": "一块空田以种花卉",
      fr: "Une parcelle vide pour planter des fleurs.",
      tk: "Çiçek dikmek için boş bir arsa",
    },
  },
  Boulder: {
    image: "SUNNYSIDE.resource.boulder",
    description: {
      en: "A mythical rock that can drop rare minerals",
      pt: "Uma rocha mítica que pode liberar minerais raros",
      "zh-CN": "一片神秘矿脉可掉落稀有矿物",
      fr: "Une roche mythique qui peut laisser tomber des minéraux rares.",
      tk: "Nadir mineralleri düşürebilen efsanevi bir kaya",
    },
  },
  "Dirt Path": {
    image: "assets/sfts/dirt_path.png",
    description: {
      en: "Keep your farmer boots clean with a well trodden path.",
      pt: "Mantenha suas botas de fazendeiro limpas com um caminho bem pisado.",
      "zh-CN": "千足踏过的小径总不脏鞋",
      fr: "Gardez vos bottes de fermier propres avec un chemin bien foulé.",
      tk: "Çiftçi botlarınızı iyi işlenmiş bir yolla temiz tutun.",
    },
  },
  Bush: {
    image: "assets/decorations/bush.png",
    description: {
      en: "What's lurking in the bushes?",
      pt: "O que está espreitando nas moitas?",
      "zh-CN": "草丛里都躲着什么？",
      fr: "Que se cache-t-il dans les buissons?",
      tk: "Çalıların arasında ne gizleniyor?",
    },
  },
  Fence: {
    image: "assets/decorations/fence.png",
    description: {
      en: "Add a touch of rustic charm to your farm.",
      pt: "Adicione um toque de charme rústico à sua fazenda.",
      "zh-CN": "给你的农场来点乡村魅力",
      fr: "Ajoutez une touche de charme rustique à votre ferme.",
      tk: "Çiftliğinize rustik bir çekicilik katın.",
    },
  },
  "Stone Fence": {
    image: "assets/decorations/stone_fence.png",
    description: {
      en: "Embrace the timeless elegance of a stone fence.",
      pt: "Abrace a elegância atemporal de uma cerca de pedra.",
      "zh-CN": "拥抱石栏的永恒优雅",
      fr: "Adoptez l'élégance intemporelle d'une clôture en pierre.",
      tk: "Taş çitin zamansız zarafetini kucaklayın.",
    },
  },
  Shrub: {
    image: "assets/decorations/shrub.png",
    description: {
      en: "Enhance your in-game landscaping with a beautiful shrub",
      pt: "Melhore seu paisagismo no jogo com um arbusto bonito",
      "zh-CN": "一簇美妙灌木倍增您的游乐景象",
      fr: "Améliorez votre aménagement paysager en jeu avec un bel arbuste.",
      tk: "Güzel bir çalıyla oyun içi peyzajınızı geliştirin",
    },
  },
  "Pine Tree": {
    image: "assets/decorations/pine_tree.png",
    description: {
      en: "Standing tall and mighty, a needle-clad dream.",
      pt: "De pé alto e poderoso.",
      "zh-CN": "高岸雄伟，一趟层层针叶梦",
      fr: "Debout haut et puissant, un rêve habillé d'aiguilles.",
      tk: "Dik ve kudretli durmak, iğnelerle kaplı bir rüya.",
    },
  },
  "Field Maple": {
    image: "assets/decorations/field_maple.webp",
    description: {
      en: "A petite charmer that spreads its leaves like a delicate green canopy.",
      pt: "Um charme pequeno que espalha suas folhas como um dossel verde delicado.",
      "zh-CN": "娇枝嫩叶展开翠绿天蓬",
      fr: "Un charmeur petit qui étend ses feuilles comme une délicate canopée verte.",
      tk: "Yapraklarını narin yeşil bir gölgelik gibi yayan küçük bir büyücü.",
    },
  },
  "Red Maple": {
    image: "assets/decorations/red_maple.webp",
    description: {
      en: "Fiery foliage and a heart full of autumnal warmth.",
      pt: "Folhagem ardente e um coração cheio de calor outonal.",
      "zh-CN": "火热红叶有一颗秋日暖心",
      fr: "Foliage enflammé et un cœur plein de chaleur automnale.",
      tk: "Ateşli yapraklar ve sonbahar sıcaklığıyla dolu bir kalp.",
    },
  },
  "Golden Maple": {
    image: "assets/decorations/golden_maple.webp",
    description: {
      en: "Radiating brilliance with its shimmering golden leaves.",
      pt: "Irradiando brilho com suas folhas douradas cintilantes.",
      "zh-CN": "金光枫叶四绽光芒",
      fr: "Illuminant de sa brillance avec ses feuilles dorées scintillantes.",
      tk: "Parıldayan altın yapraklarıyla parlaklık saçıyor.",
    },
  },
  "Solar Flare Banner": {
    image: "assets/decorations/banners/solar_flare_banner.png",
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
  },
  "Dawn Breaker Banner": {
    image: "assets/decorations/banners/dawn_breaker_banner.png",
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
  },
  "Witches' Eve Banner": {
    image: "assets/decorations/banners/witches_eve_banner.webp",
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
  },
  "Catch the Kraken Banner": {
    image: "assets/decorations/banners/catch_the_kraken_banner.webp",
    description: {
      en: "The Kraken is here! The mark of a participant in the Catch the Kraken Season.",
      pt: "O Kraken está aqui! O símbolo de um participante na Temporada de Pegar o Kraken.",
      "zh-CN": "海怪浮现！追捕海怪时季参与者的标志",
      fr: "Le Kraken est là ! La marque d'un participant à la saison Catch the Kraken.",
      tk: "Kraken burada! Kraken Yakalama Sezonu katılımcısının işareti.",
    },
  },
  "Spring Blossom Banner": {
    image: "assets/decorations/banners/spring_banner.gif",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Clash of Factions Banner": {
    image: "assets/decorations/banners/clash_of_factions_banner.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Lifetime Farmer Banner": {
    image: "assets/decorations/banners/lifetime_farmer_banner.png",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Luminous Lantern": {
    image: "assets/decorations/lanterns/luminous_lantern.webp",
    description: {
      en: "A bright paper lantern that illuminates the way.",
      pt: "Uma lanterna de papel brilhante que ilumina o caminho.",
      "zh-CN": "明亮纸灯笼照亮前方道路",
      fr: "Une lanterne en papier lumineuse qui éclaire le chemin.",
      tk: "Yolu aydınlatan parlak bir kağıt fener.",
    },
  },
  "Radiance Lantern": {
    image: "assets/decorations/lanterns/radiance_lantern.webp",
    description: {
      en: "A radiant paper lantern that shines with a powerful light.",
      pt: "Uma lanterna de papel radiante que brilha com uma luz poderosa.",
      "zh-CN": "光亮纸灯笼射出强光闪耀",
      fr: "Une lanterne en papier radieuse qui brille d'une lumière puissante.",
      tk: "Güçlü bir ışıkla parlayan parlak bir kağıt fener.",
    },
  },
  "Ocean Lantern": {
    image: "assets/decorations/lanterns/ocean_lantern.png",
    description: {
      en: "A wavy paper lantern that sways with the bobbing of the tide.",
      pt: "Uma lanterna de papel ondulante que balança com o movimento da maré.",
      "zh-CN": "海浪纸灯笼随着波涛摇曳",
      fr: "Une lanterne en papier ondulée qui flotte avec la marée.",
      tk: "Gelgitin sallanmasıyla sallanan dalgalı bir kağıt fener.",
    },
  },
  "Solar Lantern": {
    image: "assets/decorations/lanterns/solar_lantern.png",
    description: {
      en: "Harnessing the vibrant essence of sunflowers, the Solar Lantern emanates a warm and radiant glow.",
      pt: "Aproveitando a essência vibrante dos girassóis, a Lanterna Solar emana um brilho quente e radiante.",
      "zh-CN": "掌持向日葵的跃动精粹，向日灯笼散发着温暖又耀眼的荧光",
      fr: "Utilisant l'essence vibrante des Sunflowers, la lanterne solaire émet une lueur chaude et radieuse.",
      tk: "Ayçiçeklerinin canlı özünü kullanan Solar Fener, sıcak ve ışıltılı bir ışıltı yayıyor.",
    },
  },
  "Aurora Lantern": {
    image: "assets/decorations/lanterns/aurora_lantern.webp",
    description: {
      en: "A paper lantern that transforms any space into a magical wonderland.",
      pt: "Uma lanterna de papel que transforma qualquer espaço em um mundo mágico.",
      "zh-CN": "极光纸灯笼晕染魔法幻境",
      fr: "Une lanterne en papier qui transforme tout espace en un pays des merveilles magique.",
      tk: "Herhangi bir alanı büyülü bir harikalar diyarına dönüştüren bir kağıt fener.",
    },
  },
  "Bonnie's Tombstone": {
    image: "assets/decorations/bonnies_tombstone.png",
    description: {
      en: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      pt: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      "zh-CN":
        "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      fr: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
      tk: "A spooky addition to any farm, Bonnie's Human Tombstone will send shivers down your spine.",
    },
  },
  "Chestnut Fungi Stool": {
    image: "assets/decorations/chestnut_fungi_stool.png",
    description: {
      en: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      pt: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      "zh-CN":
        "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      fr: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
      tk: "The Chestnut Fungi Stool is a sturdy and rustic addition to any farm.",
    },
  },
  "Crimson Cap": {
    image: "assets/decorations/crimson_cap.png",
    description: {
      en: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      pt: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      "zh-CN":
        "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      fr: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
      tk: "A towering and vibrant mushroom, the Crimson Cap Giant Mushroom will bring life to your farm.",
    },
  },
  "Dawn Umbrella Seat": {
    image: "assets/decorations/dawn_umbrella_seat.png",
    description: {
      en: "Keep those Eggplants dry during those rainy days with the Dawn Umbrella Seat.",
      pt: "Mantenha essas Berinjelas secas durante os dias chuvosos com o Guarda-chuva Assento da Aurora.",
      "zh-CN": "有了晨曦伞座，叫茄子在阴雨云天也保持干爽",
      fr: "Gardez ces Eggplants au sec lors des journées pluvieuses avec le siège-parapluie Dawn.",
      tk: "Şafak Şemsiye Koltuğu ile bu yağmurlu günlerde patlıcanları kuru tutun.",
    },
  },
  "Eggplant Grill": {
    image: "assets/decorations/eggplant_grill.png",
    description: {
      en: "Get cooking with the Eggplant Grill, perfect for any outdoor meal.",
      pt: "Comece a cozinhar com a Churrasqueira de Berinjela, perfeita para qualquer refeição ao ar livre.",
      "zh-CN": "用上茄子烤架做饭，户外就餐完美精选",
      fr: "Préparez vos repas en plein air avec le Eggplant Grill, parfait pour tout repas en plein air.",
      tk: "Her türlü açık hava yemeği için mükemmel olan Patlıcan Izgara ile yemek pişirin.",
    },
  },
  "Giant Dawn Mushroom": {
    image: "assets/decorations/giant_dawn_mushroom.png",
    description: {
      en: "The Giant Dawn Mushroom is a majestic and magical addition to any farm.",
      pt: "O Cogumelo Gigante da Aurora é uma adição majestosa e mágica para qualquer fazenda.",
      "zh-CN": "巨型晨曦蘑菇在任何农场都显得雄伟又魔幻",
      fr: "Le champignon géant Dawn est un ajout majestueux et magique à toute ferme.",
      tk: "Dev Şafak Mantarı her çiftliğe görkemli ve büyülü bir katkıdır.",
    },
  },
  "Grubnash's Tombstone": {
    image: "assets/decorations/grubnash_tombstone.png",
    description: {
      en: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      pt: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      "zh-CN": "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      fr: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
      tk: "Add some mischievous charm with Grubnash's Goblin Tombstone.",
    },
  },
  "Mahogany Cap": {
    image: "assets/decorations/mahogony_cap.png",
    description: {
      en: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      pt: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      "zh-CN":
        "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      fr: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
      tk: "Add a touch of sophistication with the Mahogany Cap Giant Mushroom.",
    },
  },
  "Shroom Glow": {
    image: "assets/decorations/shroom_glow.png",
    description: {
      en: "Illuminate your farm with the enchanting glow of Shroom Glow.",
      pt: "Ilumine sua fazenda com o brilho encantador do Brilho dos Cogumelos.",
      "zh-CN": "蘑菇灯的魔力荧光照亮您的农场",
      fr: "Illuminez votre ferme avec la lueur enchanteresse de Shroom Glow.",
      tk: "Çiftliğinizi Shroom Glow'un büyüleyici ışıltısıyla aydınlatın.",
    },
  },
  "Toadstool Seat": {
    image: "assets/decorations/toadstool_seat.png",
    description: {
      en: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      pt: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      "zh-CN": "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      fr: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
      tk: "Sit back and relax on the whimsical Toadstool Mushroom Seat.",
    },
  },
  Clementine: {
    image: "assets/decorations/clementine.png",
    description: {
      en: "The Clementine Gnome is a cheerful companion for your farming adventures.",
      pt: "O Gnomo Clementine é um companheiro alegre para suas aventuras na fazenda.",
      "zh-CN": "小橙侏儒是你耕作冒险的欢乐伙伴",
      fr: "Le gnome Clementine est un compagnon joyeux pour vos aventures agricoles.",
      tk: "Clementine Gnome, çiftçilik maceralarınız için neşeli bir yol arkadaşıdır.",
    },
  },
  Blossombeard: {
    image: "assets/sfts/blossom_beard.webp",
    description: {
      en: "The Blossombeard Gnome is a powerful companion for your farming adventures.",
      pt: "O Gnomo Blossombeard é um companheiro poderoso para suas aventuras na fazenda.",
      "zh-CN": "开花胡茬侏儒是你耕作冒险的强力帮手",
      fr: "Le gnome Blossombeard est un compagnon puissant pour vos aventures agricoles.",
      tk: "Çiçek Sakallı Gnome, çiftçilik maceralarınız için güçlü bir yol arkadaşıdır.",
    },
  },
  "Desert Gnome": {
    image: "assets/sfts/desert_gnome.webp",
    description: {
      en: "A gnome that can survive the harshest of conditions.",
      pt: "A gnome that can survive the harshest of conditions.",
      "zh-CN": "能够在最恶劣的条件下生存的侏儒。",
      fr: "A gnome that can survive the harshest of conditions.",
      tk: "A gnome that can survive the harshest of conditions.",
    },
  },
  Cobalt: {
    image: "assets/decorations/cobalt.png",
    description: {
      en: "The Cobalt Gnome adds a pop of color to your farm with his vibrant hat.",
      pt: "O Gnomo Cobalt adiciona um toque de cor à sua fazenda com seu chapéu vibrante.",
      "zh-CN": "钴侏儒用他的鲜艳帽子为你的农场另添时兴增色",
      fr: "Le gnome Cobalt ajoute une touche de couleur à votre ferme avec son chapeau vibrant.",
      tk: "Kobalt Gnome, canlı şapkasıyla çiftliğinize renk katar.",
    },
  },
  "Purple Trail": {
    image: "assets/sfts/purple_trail.png",
    description: {
      en: "Leave your opponents in a trail of envy with the mesmerizing and unique Purple Trail",
      pt: "Deixe seus oponentes com inveja com a trilha roxa única e fascinante",
      "zh-CN": "有了这迷人独特的 Purple Trail，让你的对手垂涎食尘吧",
      fr: "Laissez vos adversaires derrière vous dans un sillage d'envie avec le sentier violet captivant et unique",
      tk: "Büyüleyici ve eşsiz Purple Trail ile rakiplerini kıskançlık içinde bırak.",
    },
  },
  Maximus: {
    image: "assets/sfts/maximus.png",
    description: {
      en: "Squash the competition with plump Maximus",
      pt: "Esmague a competição com o robusto Maximus",
      "zh-CN": "用丰满的 Maximus 碾压全场",
      fr: "Écrasez la concurrence avec le joufflu Maximus",
      tk: "Tombul Maximus ile rekabeti ezip geç!",
    },
  },
  Obie: {
    image: "assets/sfts/obie.png",
    description: {
      en: "A fierce eggplant soldier",
      pt: "Um feroz soldado de Berinjela",
      "zh-CN": "凶悍的长茄兵。",
      fr: "Un vaillant soldat Eggplant",
      tk: "Azılı bir patlıcan askeri",
    },
  },
  Hoot: {
    image: "assets/sfts/hoot.png",
    description: {
      en: "Hoot hoot! Have you solved my riddle yet?",
      pt: "Hoot hoot! Você já resolveu meu enigma?",
      "zh-CN": "呼呜！呼呜！解开我的谜语没？",
      fr: "Hibou hibou ! Avez-vous résolu mon énigme?",
      tk: "Vay vay! Bilmecemi hâlâ çözmedin mi?",
    },
  },
  "Genie Bear": {
    image: "assets/sfts/bears/genie_bear.png",
    description: {
      en: "Exactly what I wished for!",
      pt: "Exatamente o que eu desejei!",
      "zh-CN": "正是我想要的！",
      fr: "Exactement ce que je souhaitais!",
      tk: "Tam olarak istediğim şey!",
    },
  },
  "Betty Lantern": {
    image: "assets/decorations/lanterns/betty_lantern.png",
    description: {
      en: "It looks so real! I wonder how they crafted this.",
      pt: "Parece tão real! Eu me pergunto como eles fizeram isso.",
      "zh-CN": "看起来栩栩如生！好奇他们是怎么打造这出来的",
      fr: "Elle a l'air tellement réelle ! Je me demande comment ils l'ont fabriquée.",
      tk: "O kadar gerçek görünüyor ki! Bunu nasıl hazırladıklarını merak ediyorum.",
    },
  },
  "Bumpkin Lantern": {
    image: "assets/decorations/lanterns/bumpkin_lantern.png",
    description: {
      en: "Moving closer you hear murmurs of a living Bumpkin...creepy!",
      pt: "Aproximando-se, você ouve murmúrios de um Bumpkin vivo... assustador!",
      "zh-CN": "凑近听，能听到乡包佬的呢喃低语……可怕！",
      fr: "En vous approchant, vous entendez des murmures d'un Bumpkin vivant... effrayant!",
      tk: "Yaklaştığınızda yaşayan bir Bumpkin'in mırıltılarını duyarsınız... tüyler ürpertici!",
    },
  },
  "Eggplant Bear": {
    image: "assets/sfts/bears/eggplant_bear.png",
    description: {
      en: "The mark of a generous eggplant whale.",
      pt: "O símbolo de uma baleia berinjela generosa.",
      "zh-CN": "茄子大亨慷慨的标志",
      fr: "La marque généreuse Eggplant balaine.",
      tk: "Cömert bir patlıcan balinasının işareti.",
    },
  },
  "Goblin Lantern": {
    image: "assets/decorations/lanterns/goblin_lantern.png",
    description: {
      en: "A scary looking lantern",
      pt: "Uma lanterna com uma aparência assustadora",
      "zh-CN": "看着吓人的灯笼",
      fr: "Une lanterne au look effrayant.",
      tk: "Korkunç görünümlü bir fener",
    },
  },
  "Dawn Flower": {
    image: "assets/sfts/dawn_flower.png",
    description: {
      en: "Embrace the radiant beauty of the Dawn Flower as its delicate petals shimmer with the first light of day",
      pt: "Abraçe a beleza radiante da Flor da Aurora enquanto suas pétalas delicadas brilham com a primeira luz do dia",
      "zh-CN": "拥吻 Dawn Flower 的夺目美丽，她精致的花瓣闪烁着第一缕晨光",
      fr: "Embrassez la beauté radieuse de la Dawn Flower alors que ses pétales délicats scintillent avec les premières lueurs du jour.",
      tk: "Günün ilk ışıklarında narin yaprakları parıldayan Şafak Çiçeğinin ışıltılı güzelliğini kucaklayın",
    },
  },
  "Gold Pass": {
    image: "assets/icons/gold-pass.png",
    description: {
      en: "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
      pt: "Um passe exclusivo que permite ao portador criar NFTs raros, negociar, sacar e acessar conteúdo bônus.",
      "zh-CN":
        "An exclusive pass that enables the holder to craft rare NFTs, trade, withdraw and access bonus content.",
      fr: "Un laissez-passer exclusif permettant au détenteur de fabriquer des NFT rares, de commercer, de retirer et d'accéder à du contenu bonus.",
      tk: "Sahibinin nadir NFT'ler oluşturmasına, ticaret yapmasına, para çekmesine ve bonus içeriğe erişmesine olanak tanıyan özel bir geçiş kartı.",
    },
  },
  Poppy: {
    image: "assets/sfts/poppy.png",
    description: {
      en: "The mystical corn kernel. +0.1 Corn per harvest,",
      pt: "O grão de milho místico. +0,1 Milho por colheita,",
      "zh-CN": "神秘的玉米粒。玉米产量 +0.1",
      fr: "Le noyau de maïs mystique. +0,1 de Corn par récolte,",
      tk: "Mistik mısır çekirdeği.Mısır hasatında hasat başı +0.1 ekler,",
    },
  },
  "El Pollo Veloz": {
    image: "assets/animals/chickens/el_pollo_veloz.gif",
    description: {
      en: "Give me those eggs, fast! 4 hour speed boost on egg laying.",
      pt: "Dê-me esses ovos rápido! Aumento de velocidade de 4 horas na postura de ovos.",
      "zh-CN": "交出那些蛋，快！鸡的下蛋速度加快 4 小时。",
      fr: "Donnez-moi ces œufs, vite ! Boost de vitesse de 4 heures sur la ponte des œufs.",
      tk: "Şu yumurtaları bana ver,çabuk! Yumurtlamada 4 saatlik hız artışı.",
    },
  },
  "Grain Grinder": {
    image: "assets/sfts/grain_grinder.png",
    description: {
      en: "Grind your grain and experience a delectable surge in Cake XP.",
      pt: "Moa seu grão e experimente um aumento delicioso no XP do bolo.",
      "zh-CN": "磨碎你的谷物，享受美味蛋糕，增加你获得的 XP",
      fr: "Moulez votre grain et ressentez une montée délectable de l'XP du gâteau.",
      tk: "Tahılını öğüt ve pasta XP’sinde nefis bir artışın tadını çıkar.",
    },
  },
  Kernaldo: {
    image: "assets/sfts/kernaldo.png",
    description: {
      en: "The magical corn whisperer. +25% Corn Growth Speed.",
      pt: "O sussurro de milho mágico. +25% de Velocidade de Crescimento de Milho.",
      "zh-CN": "神奇的玉米语者让玉米达 25 % 更快高长大",
      fr: "Le chuchoteur de maïs magique. +25% de vitesse de croissance du Corn.",
      tk: "Büyülü mısır fısıldayan. Mısırlar için 25% büyüme hızı.",
    },
  },
  Candles: {
    image: "assets/decorations/candles.png",
    description: {
      en: "Enchant your farm with flickering spectral flames during Witches' Eve.",
      pt: "Encante sua fazenda com chamas espectrais cintilantes durante a Véspera das Bruxas.",
      "zh-CN": "在女巫之夜借跳跃的火焰为您的农场附上魔力",
      fr: "Enchantez votre ferme avec des flammes spectrales vacillantes pendant la Veille des Sorcières.",
      tk: "Cadılar Bayramı sırasında çiftliğinizi titreyen hayalet alevlerle büyüleyin.",
    },
  },
  "Haunted Stump": {
    image: "assets/decorations/haunted_stump.png",
    description: {
      en: "Summon spirits and add eerie charm to your farm.",
      pt: "Chame espíritos e adicione charme sinistro à sua fazenda.",
      "zh-CN": "召来通灵让你的农场萦绕鬼魅",
      fr: "Invoquez des esprits et ajoutez un charme étrange à votre ferme.",
      tk: "Ruhları çağırın ve çiftliğinize ürkütücü bir çekicilik katın.",
    },
  },
  "Spooky Tree": {
    image: "assets/decorations/spooky_tree.png",
    description: {
      en: "A hauntingly fun addition to your farm's decor!",
      pt: "Uma adição assustadoramente divertida à decoração da sua fazenda!",
      "zh-CN": "增添农场上的闹鬼奇趣！",
      fr: "Un ajout amusant et hanté à la décoration de votre ferme!",
      tk: "Çiftliğinizin dekoruna akıl almaz derecede eğlenceli bir katkı!",
    },
  },
  Observer: {
    image: "assets/decorations/observer.webp",
    description: {
      en: "A perpetually roving eyeball, always vigilant and ever-watchful!",
      pt: "Um globo ocular em movimento perpétuo, sempre vigilante e sempre atento!",
      "zh-CN": "永不停转的眼珠，永存戒心、永不松眼！",
      fr: "Un œil perpétuellement en mouvement, toujours vigilant et attentif!",
      tk: "Sürekli gezinen bir göz küresi, her zaman tetikte ve her zaman tetikte!",
    },
  },
  "Crow Rock": {
    image: "assets/decorations/crow_rock.webp",
    description: {
      en: "A crow perched atop a mysterious rock.",
      pt: "Um corvo empoleirado em uma rocha misteriosa.",
      "zh-CN": "乌鸦栖息的神秘石块",
      fr: "Un corbeau perché sur un rocher mystérieux.",
      tk: "Gizemli bir kayanın tepesine tünemiş bir karga.",
    },
  },
  "Mini Corn Maze": {
    image: "assets/decorations/mini_corn_maze.webp",
    description: {
      en: "A memento of the beloved maze from the 2023 Witches' Eve season.",
      pt: "Uma lembrança do adorado labirinto da temporada Witches' Eve de 2023.",
      "zh-CN": "2023 年女巫之夜时季广受喜爱迷宫的纪念品",
      fr: "Un souvenir du labyrinthe bien-aimé de la saison de la Veille des Sorcières 2023.",
      tk: "2023 Cadılar Bayramı sezonundan sevilen labirentten bir hatıra.",
    },
  },
  "Giant Cabbage": {
    image: "assets/sfts/giant_cabbage.png",
    description: {
      en: "A giant cabbage.",
      pt: "A giant cabbage.",
      "zh-CN": "A giant cabbage.",
      fr: "A giant cabbage.",
      tk: "A giant cabbage.",
    },
  },
  "Giant Potato": {
    image: "assets/sfts/giant_potato.png",
    description: {
      en: "A giant potato.",
      pt: "A giant potato.",
      "zh-CN": "A giant potato.",
      fr: "A giant potato.",
      tk: "A giant potato.",
    },
  },
  "Giant Pumpkin": {
    image: "assets/sfts/giant_pumpkin.png",
    description: {
      en: "A giant pumpkin.",
      pt: "A giant pumpkin.",
      "zh-CN": "A giant pumpkin.",
      fr: "A giant pumpkin.",
      tk: "A giant pumpkin.",
    },
  },
  "Potion Ticket": {
    image: "assets/icons/potion_point.png",
    description: {
      en: "A reward from the Potion House. Use this to buy items from Garth.",
      pt: "A reward from the Potion House. Use this to buy items from Garth.",
      "zh-CN":
        "A reward from the Potion House. Use this to buy items from Garth.",
      fr: "A reward from the Potion House. Use this to buy items from Garth.",
      tk: "A reward from the Potion House. Use this to buy items from Garth.",
    },
  },
  "Lab Grown Carrot": {
    image: "assets/sfts/lab_grown_carrot.gif",
    description: {
      en: "+0.2 Carrot Yield",
      pt: "+0.2 Carrot Yield",
      "zh-CN": "+0.2 Carrot Yield",
      fr: "+0.2 Carrot Yield",
      tk: "+0.2 Carrot Yield",
    },
  },
  "Lab Grown Pumpkin": {
    image: "assets/sfts/lab_grown_pumpkin.gif",
    description: {
      en: "+0.3 Pumpkin Yield",
      pt: "+0.3 Pumpkin Yield",
      "zh-CN": "+0.3 Pumpkin Yield",
      fr: "+0.3 Pumpkin Yield",
      tk: "+0.3 Pumpkin Yield",
    },
  },
  "Lab Grown Radish": {
    image: "assets/sfts/lab_grown_radish.gif",
    description: {
      en: "+0.4 Radish Yield",
      pt: "+0.4 Radish Yield",
      "zh-CN": "+0.4 Radish Yield",
      fr: "+0.4 Radish Yield",
      tk: "+0.4 Radish Yield",
    },
  },
  "Adirondack Potato": {
    image: "assets/potion_house/adirondack_potato.png",
    description: {
      en: "A rugged spud, Adirondack style!",
      pt: "A rugged spud, Adirondack style!",
      "zh-CN": "A rugged spud, Adirondack style!",
      fr: "A rugged spud, Adirondack style!",
      tk: "A rugged spud, Adirondack style!",
    },
  },
  "Black Magic": {
    image: "assets/potion_house/black_magic.png",
    description: {
      en: "A dark and mysterious flower!",
      pt: "A dark and mysterious flower!",
      "zh-CN": "A dark and mysterious flower!",
      fr: "A dark and mysterious flower!",
      tk: "A dark and mysterious flower!",
    },
  },
  Chiogga: {
    image: "assets/potion_house/chiogga.png",
    description: {
      en: "A rainbow beet!",
      pt: "A rainbow beet!",
      "zh-CN": "A rainbow beet!",
      fr: "A rainbow beet!",
      tk: "A rainbow beet!",
    },
  },
  "Golden Helios": {
    image: "assets/potion_house/golden_helios.png",
    description: {
      en: "Sun-kissed grandeur!",
      pt: "Sun-kissed grandeur!",
      "zh-CN": "Sun-kissed grandeur!",
      fr: "Sun-kissed grandeur!",
      tk: "Sun-kissed grandeur!",
    },
  },
  "Purple Cauliflower": {
    image: "assets/potion_house/purple_cauliflower.png",
    description: {
      en: "A regal purple cauliflowser",
      pt: "A regal purple cauliflowser",
      "zh-CN": "A regal purple cauliflowser",
      fr: "A regal purple cauliflowser",
      tk: "A regal purple cauliflowser",
    },
  },
  "Warty Goblin Pumpkin": {
    image: "assets/potion_house/warty_goblin_pumpkin.png",
    description: {
      en: "A whimsical, wart-covered pumpkin",
      pt: "A whimsical, wart-covered pumpkin",
      "zh-CN": "A whimsical, wart-covered pumpkin",
      fr: "A whimsical, wart-covered pumpkin",
      tk: "A whimsical, wart-covered pumpkin",
    },
  },
  "White Carrot": {
    image: "assets/potion_house/white_carrot.png",
    description: {
      en: "A pale carrot with pale roots",
      pt: "A pale carrot with pale roots",
      "zh-CN": "A pale carrot with pale roots",
      fr: "A pale carrot with pale roots",
      tk: "A pale carrot with pale roots",
    },
  },
  "Bud Ticket": {
    image: "assets/icons/bud_ticket.png",
    description: {
      en: "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
      pt: "Um lugar garantido para mintar um Bud no lançamento de NFTs do Sunflower Land Buds.",
      "zh-CN":
        "A guaranteed spot to mint a Bud at the Sunflower Land Buds NFT drop.",
      fr: "Une place garantie pour frapper un Bud lors de la distribution des NFT Sunflower Land Buds.",
      tk: "Sunflower Land Buds NFT düşüşünde Bud basmak için garantili bir yer.",
    },
  },
  "Bud Seedling": {
    image: "assets/icons/bud_seedling.png",
    description: {
      en: "A seedling to be exchanged for a free Bud NFT",
      pt: "Uma muda a ser trocada por um Bud NFT gratuito",
      "zh-CN": "A seedling to be exchanged for a free Bud NFT",
      fr: "Une jeune pousse à échanger contre un NFT Bud gratuit",
      tk: "Ücretsiz Bud NFT ile değiştirilecek bir fide",
    },
  },
  "Town Sign": {
    image: "assets/decorations/woodsign.png",
    description: {
      en: "Show your farm ID with pride!",
      pt: "Mostre sua identificação da fazenda com orgulho!",
      "zh-CN": "骄傲地炫耀您的农场号码吧！",
      fr: "Montrez fièrement votre ID de ferme!",
      tk: "Çiftlik kimliğinizi gururla gösterin!",
    },
  },
  "White Crow": {
    image: "assets/decorations/white_crow.webp",
    description: {
      en: "A mysterious and ethereal white crow",
      pt: "Um corvo branco misterioso e etéreo",
      "zh-CN": "神秘空灵的白乌鸦",
      fr: "Un corbeau blanc mystérieux et éthéré.",
      tk: "Gizemli ve ruhani bir beyaz karga",
    },
  },
  Earthworm: {
    image: "assets/composters/earthworm.png",
    description: {
      en: "A wriggly worm that attracts small fish.",
      pt: "A wriggly worm that attracts small fish.",
      "zh-CN": "A wriggly worm that attracts small fish.",
      fr: "A wriggly worm that attracts small fish.",
      tk: "A wriggly worm that attracts small fish.",
    },
  },
  Grub: {
    image: "assets/composters/grub.png",
    description: {
      en: "A juicy grub - perfect for advanced fish.",
      pt: "A juicy grub - perfect for advanced fish.",
      "zh-CN": "A juicy grub - perfect for advanced fish.",
      fr: "A juicy grub - perfect for advanced fish.",
      tk: "A juicy grub - perfect for advanced fish.",
    },
  },
  "Red Wiggler": {
    image: "assets/composters/red_wiggler.png",
    description: {
      en: "An exotic worm that entices rare fish.",
      pt: "An exotic worm that entices rare fish.",
      "zh-CN": "An exotic worm that entices rare fish.",
      fr: "An exotic worm that entices rare fish.",
      tk: "An exotic worm that entices rare fish.",
    },
  },
  "Fishing Lure": {
    image: "assets/composters/fishing_lure.png",
    description: {
      en: "Great for catching rare fish ! ",
      pt: "Great for catching rare fish ! ",
      "zh-CN": "Great for catching rare fish ! ",
      fr: "Great for catching rare fish ! ",
      tk: "Great for catching rare fish ! ",
    },
  },
  "Sprout Mix": {
    boostedDescriptions: [
      {
        name: "Knowledge Crab",
        description: "Sprout Mix increases your crop yield from plots by +0.4",
      },
    ],
    image: "assets/composters/sprout_mix.png",
    description: {
      en: "Sprout Mix increases your crop yield from plots by +0.2",
      pt: "Sprout Mix increases your crop yield from plots by +0.2",
      "zh-CN": "Sprout Mix increases your crop yield from plots by +0.2",
      fr: "Sprout Mix increases your crop yield from plots by +0.2",
      tk: "Sprout Mix increases your crop yield from plots by +0.2",
    },
  },
  "Fruitful Blend": {
    image: "assets/composters/fruitful_blend.png",
    description: {
      en: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      pt: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      "zh-CN":
        "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      fr: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
      tk: "Fruitful Blend boosts the yield of each fruit growing on fruit patches by +0.1",
    },
  },
  "Rapid Root": {
    image: "assets/composters/rapid_root.png",
    description: {
      en: "Rapid Root reduces crop growth time from plots by 50%",
      pt: "Rapid Root reduces crop growth time from plots by 50%",
      "zh-CN": "Rapid Root reduces crop growth time from plots by 50%",
      fr: "Rapid Root reduces crop growth time from plots by 50%",
      tk: "Rapid Root reduces crop growth time from plots by 50%",
    },
  },
  Anchovy: {
    image: "assets/fish/anchovy.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's pocket-sized darting acrobat, always in a hurry!",
      pt: "O acrobata saltitante do oceano, sempre com pressa!",
      "zh-CN": "海洋里的袖珍飞镖，总是匆匆忙忙！",
      fr: "L'acrobate miniature des océans, toujours pressé!",
      tk: "Okyanusun cep boyutunda dart akrobatı, her zaman acelesi var!",
    },
  },
  Butterflyfish: {
    image: "assets/fish/butterfly_fish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A fish with a fashion-forward sense, flaunting its vivid, stylish stripes.",
      pt: "Um peixe com um senso de moda avançado, exibindo suas listras vívidas e estilosas.",
      "zh-CN": "时尚前卫的鱼，显摆其鲜艳、时髦的条纹。",
      fr: "Un poisson à la mode, arborant ses rayures vives et élégantes.",
      tk: "Canlı, şık çizgileriyle gösteriş yapan, ileri moda anlayışına sahip bir balık.",
    },
  },
  Blowfish: {
    image: "assets/fish/blowfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The round, inflated comedian of the sea, guaranteed to bring a smile.",
      pt: "O comediante redondo e inflado do mar, garantido para trazer um sorriso.",
      "zh-CN": "海中的圆润喜剧演员，保证让你笑容满面。",
      fr: "Le comique rond et gonflé de la mer, garanti pour vous faire sourire.",
      tk: "Denizin yuvarlak, şişirilmiş komedyeni, bir gülümseme getirmeyi garanti ediyor.",
    },
  },
  Clownfish: {
    image: "assets/fish/clownfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The underwater jester, sporting a tangerine tuxedo and a clownish charm.",
      pt: "O bobo da corte subaquático, vestindo um terno tangerina e um charme de palhaço.",
      "zh-CN": "水下的小丑，身着橘色礼服，充满小丑般的魅力。",
      fr: "Le bouffon sous-marin, portant un smoking mandarine et un charme clownesque.",
      tk: "Mandalina rengi bir smokini ve palyaço çekiciliğiyle su altı soytarısı.",
    },
  },
  "Sea Bass": {
    image: "assets/fish/sea_bass.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Your 'not-so-exciting' friend with silver scales – a bassic catch!",
      pt: "Seu amigo 'não-tão-exciting' com escamas prateadas - uma captura básica!",
      "zh-CN": "你的“不那么令人兴奋的”朋友，银色的鳞片——一个基础的捕获！",
      fr: "Votre ami 'pas très excitant' aux écailles argentées - une prise basique!",
      tk: "Gümüş pullu 'o kadar da heyecan verici olmayan' arkadaşınız – basit bir yakalama!",
    },
  },
  "Sea Horse": {
    image: "assets/fish/seahorse.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's slow-motion dancer, swaying gracefully in the aquatic ballet.",
      pt: "O dançarino em câmera lenta do oceano, balançando gracioso no balé aquático.",
      "zh-CN": "海洋中的慢动作舞者，在水下芭蕾中优雅地摇摆。",
      fr: "La danseuse au ralenti de l'océan, se balançant gracieusement dans le ballet aquatique.",
      tk: "Okyanusun ağır çekim dansçısı, su balesinde zarif bir şekilde sallanıyor.",
    },
  },
  "Horse Mackerel": {
    image: "assets/fish/horse_mackerel.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A speedster with a shiny coat, always racing through the waves.",
      pt: "Um velocista com um casaco brilhante, sempre correndo pelas ondas.",
      "zh-CN": "一位身披闪亮外衣的速度选手，总是在波浪中穿梭。",
      fr: "Un sprinter à la brillante robe, toujours en course à travers les vagues.",
      tk: "Daima dalgaların arasında yarışan, parlak paltolu bir hızcı.",
    },
  },
  Squid: {
    image: "assets/fish/squid.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The deep-sea enigma with tentacles to tickle your curiosity.",
      pt: "O enigma das profundezas com tentáculos para despertar sua curiosidade.",
      "zh-CN": "深海之谜，用其触须勾起你的好奇心。",
      fr: "L'énigme des profondeurs avec des tentacules pour titiller votre curiosité.",
      tk: "Merakınızı gıdıklayacak dokunaçlara sahip derin deniz gizemi.",
    },
  },
  "Red Snapper": {
    image: "assets/fish/red_snapper.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A catch worth its weight in gold, dressed in fiery crimson.",
      pt: "Uma captura que vale seu peso em ouro, vestida de carmesim ardente.",
      "zh-CN": "价值连城的捕获，身披火红色。",
      fr: "Une prise qui vaut son pesant d'or, vêtue de rouge ardent.",
      tk: "Ağır kırmızıya bürünmüş, ağırlığınca altın değerinde bir av.",
    },
  },
  "Moray Eel": {
    image: "assets/fish/moray_eel.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A slinky, sinister lurker in the ocean's shadowy corners.",
      pt: "Um espreitador sinistro e sinuoso nos cantos sombrios do oceano.",
      "zh-CN": "海洋中阴暗角落里的狡猾潜伏者。",
      fr: "Un habitant sinistre et insaisissable des coins sombres de l'océan.",
      tk: "Okyanusun gölgeli köşelerinde sinsi, uğursuz bir pusuya yatmış.",
    },
  },
  "Olive Flounder": {
    image: "assets/fish/olive_flounder.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The seabed's master of disguise, always blending in with the crowd.",
      pt: "O mestre do disfarce do leito marinho, sempre se misturando com a multidão.",
      "zh-CN": "海床上的伪装大师，总是与众不同。",
      fr: "Le maître du déguisement du fond marin, toujours en train de se fondre dans la foule.",
      tk: "Deniz yatağının kılık değiştirme ustası, her zaman kalabalığa karışıyor.",
    },
  },
  Napoleanfish: {
    image: "assets/fish/napoleonfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Meet the fish with the Napoleon complex – short, but regal!",
      pt: "Conheça o peixe com o complexo de Napoleão - curto, mas real!",
      "zh-CN": "认识一下患有拿破仑情结的鱼——短小，但雍容华贵！",
      fr: "Rencontrez le poisson au complexe de Napoléon - petit, mais royal!",
      tk: "Balıklarla Napolyon kompleksiyle tanışın – kısa ama muhteşem!",
    },
  },
  Surgeonfish: {
    image: "assets/fish/surgeonfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's neon warrior, armed with a spine-sharp attitude.",
      pt: "O guerreiro neon do oceano, armado com uma atitude afiada de espinha.",
      "zh-CN": "海洋中的霓虹战士，武装着锋利的态度。",
      fr: "Le guerrier néon de l'océan, armé d'une attitude pointue.",
      tk: "Okyanusun neon savaşçısı, keskin bir tavırla donanmış.",
    },
  },
  "Zebra Turkeyfish": {
    image: "assets/fish/zebra_turkeyfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Stripes, spines, and a zesty disposition, this fish is a true showstopper!",
      pt: "Listras, espinhos e uma disposição, este peixe é um verdadeiro espetáculo!",
      "zh-CN": "条纹、刺和充满活力的性格，这条鱼是真正的焦点！",
      fr: "Des rayures, des épines et une disposition zestée, ce poisson est vraiment sensationnel!",
      tk: "Çizgileri, dikenleri ve neşeli yapısıyla bu balık gerçek bir gösterişçidir!",
    },
  },
  Ray: {
    image: "assets/fish/ray.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The underwater glider, a serene winged beauty through the waves.",
      pt: "O planejador subaquático, uma beleza alada serena através das ondas.",
      "zh-CN": "水下的滑翔者，通过波浪中的宁静翅膀展现出的优雅。",
      fr: "Le planeur sous-marin, une belle aile sereine à travers les vagues.",
      tk: "Su altı planörü, dalgaların arasından geçen sakin kanatlı bir güzellik.",
    },
  },
  "Hammerhead shark": {
    image: "assets/fish/hammerhead_shark.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "Meet the shark with a head for business, and a body for adventure!",
      pt: "Conheça o tubarão com cabeça para negócios e corpo para aventura!",
      "zh-CN": "这是一只头脑灵活、身体追求冒险的鲨鱼！",
      fr: "Rencontrez le requin à la tête d'affiche, prêt pour une collision de tête avec la saveur!",
      tk: "İş için kafası ve macera için vücudu olan köpekbalığıyla tanışın!",
    },
  },
  Tuna: {
    image: "assets/fish/tuna.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's muscle-bound sprinter, ready for a fin-tastic race!",
      pt: "O velocista musculoso do oceano, pronto para uma corrida fantástica!",
      "zh-CN": "海洋中肌肉发达的短跑运动员，准备好进行一场鳍部的精彩比赛！",
      fr: "Le sprinter musclé de l'océan, prêt pour une course fantastique!",
      tk: "Okyanusun kaslı sprinteri, muhteşem bir yarışa hazır!",
    },
  },
  "Mahi Mahi": {
    image: "assets/fish/mahi_mahi.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A fish that believes in living life colorfully with fins of gold.",
      pt: "Um peixe que acredita em viver a vida coloridamente com barbatanas de ouro.",
      "zh-CN": "一条相信生活要多姿多彩的鱼，金色的鳍片。",
      fr: "Un poisson qui croit en une vie colorée avec des nageoires dorées.",
      tk: "Altın yüzgeçlerle hayatı rengarenk yaşamaya inanan bir balık.",
    },
  },
  "Blue Marlin": {
    image: "assets/fish/blue_marlin.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "An oceanic legend, the marlin with an attitude as deep as the sea.",
      pt: "Uma lenda oceânica, o marlim com uma atitude tão profunda quanto o mar.",
      "zh-CN": "海洋的传奇，马林鱼，拥有深海一样的态度。",
      fr: "Une légende océanique, le marlin avec une attitude aussi profonde que la mer.",
      tk: "Okyanus efsanesi, tavrı deniz kadar derin olan marlin.",
    },
  },
  Oarfish: {
    image: "assets/fish/oarfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The long and the long of it – an enigmatic ocean wanderer.",
      pt: "O longo e o longo disso - um errante enigmático do oceano.",
      "zh-CN": "长而漫长——一位神秘的海洋流浪者。",
      fr: "Le long et le long de lui - un voyageur océanique énigmatique.",
      tk: "Uzun lafın kısası esrarengiz bir okyanus gezgini.",
    },
  },
  "Football fish": {
    image: "assets/fish/football_fish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The MVP of the deep, a bioluminescent star that's ready to play!",
      pt: "O MVP do fundo do mar, uma estrela bioluminescente pronta para jogar!",
      "zh-CN": "深海的MVP，一颗准备参与比赛的生物发光之星！",
      fr: "Le MVP des profondeurs, une star bioluminescente prête à jouer!",
      tk: "Derinlerin MVP'si, oynamaya hazır biyolüminesan bir yıldız!",
    },
  },
  Sunfish: {
    image: "assets/fish/sunfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The ocean's sunbather, basking in the spotlight with fins held high.",
      pt: "O banhista do oceano, banhando-se no holofote com barbatanas erguidas.",
      "zh-CN": "海洋中的晒太阳者，高举鳍片，享受着聚光灯下的时刻。",
      fr: "Le preneur de soleil de l'océan, se prélassant sous les projecteurs avec des nageoires bien dressées.",
      tk: "Okyanusta güneşlenen, yüzgeçlerini yüksekte tutarak spot ışıklarının tadını çıkarıyor.",
    },
  },
  Coelacanth: {
    image: "assets/fish/coelacanth.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "A prehistoric relic, with a taste for the past and the present.",
      pt: "Um relicário pré-histórico, com um gosto pelo passado e pelo presente.",
      "zh-CN": "一个古老的遗迹，对过去和现在都有一种品味。",
      fr: "Un vestige préhistorique, avec un goût pour le passé et le présent.",
      tk: "Geçmişe ve bugüne dair bir tada sahip, tarih öncesi bir kalıntı.",
    },
  },
  "Whale Shark": {
    image: "assets/fish/whale_shark.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The gentle giant of the deep, sifting treasures from the ocean's buffet.",
      pt: "O gigante gentil das profundezas, peneirando tesouros no buffet do oceano.",
      "zh-CN": "深海的温柔巨人，从海洋的自助餐中筛选珍宝。",
      fr: "Le doux géant des profondeurs, filtrant les trésors du buffet océanique.",
      tk: "Derinlerin nazik devi, okyanusun büfesinden hazineleri ayıklıyor.",
    },
  },
  "Barred Knifejaw": {
    image: "assets/fish/barred_knifejaw.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "An oceanic outlaw with black-and-white stripes and a heart of gold.",
      pt: "Um fora da lei oceânico com listras em preto e branco e um coração de ouro.",
      "zh-CN": "一位带有黑白条纹和黄金心的海洋流氓。",
      fr: "Un hors-la-loi océanique aux rayures noires et blanches et au cœur d'or.",
      tk: "Siyah-beyaz çizgili ve altın kalpli bir okyanus kanun kaçağı.",
    },
  },
  "Saw Shark": {
    image: "assets/fish/saw_shark.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "With a saw-like snout, it's the ocean's carpenter, always cutting edge!",
      pt: "Com um focinho em forma de serra, é o carpinteiro do oceano, sempre à frente!",
      "zh-CN": "以锯齿状的吻，它是海洋的木工，总是走在潮流的前沿！",
      fr: "Avec un museau en forme de scie, c'est le charpentier de l'océan, toujours à la pointe!",
      tk: "Testere benzeri burnuyla okyanusun marangozudur, her zaman son teknolojiye sahiptir!",
    },
  },
  "White Shark": {
    image: "assets/fish/white_shark.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    description: {
      en: "The shark with a killer smile, ruling the seas with fin-tensity!",
      pt: "O tubarão com um sorriso assassino, dominando os mares com intensidade de barbatana!",
      "zh-CN": "带着杀手般的笑容统治海洋的鲨鱼，以鳍的强度为傲！",
      fr: "Le requin au sourire meurtrier, régnant sur les mers avec une fin-tensité!",
      tk: "Denizleri son derece güçlü bir şekilde yöneten, öldürücü gülümsemeye sahip köpekbalığı!",
    },
  },
  "Twilight Anglerfish": {
    image: "assets/fish/twilight_anglerfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A deep-sea angler with a built-in nightlight, guiding its way through darkness.",
      pt: "Um pescador de águas profundas com uma luz noturna embutida, guiando seu caminho através da escuridão.",
      "zh-CN": "一种深海琵琶鱼，内置夜灯，引领其穿越黑暗。",
      fr: "Un poisson-pêcheur des profondeurs avec une lumière intégrée, guidant son chemin à travers les ténèbres.",
      tk: "Dahili gece lambasına sahip, karanlıkta yolunu gösteren bir derin deniz balıkçısı.",
    },
  },
  "Starlight Tuna": {
    image: "assets/fish/starlight_tuna.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A tuna that outshines the stars, ready to light up your collection.",
      pt: "Um atum que supera as estrelas, pronto para iluminar sua coleção.",
      "zh-CN": "一条比星星还要耀眼的金枪鱼，准备照亮你的收藏。",
      fr: "Un thon qui brille plus que les étoiles, prêt à illuminer votre collection.",
      tk: "Koleksiyonunuzu aydınlatmaya hazır, yıldızları gölgede bırakan bir ton balığı.",
    },
  },
  "Radiant Ray": {
    image: "assets/fish/radiant_ray.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A ray that prefers to glow in the dark, with a shimmering secret to share.",
      pt: "Um raio que prefere brilhar no escuro, com um segredo cintilante para compartilhar.",
      "zh-CN": "一种在黑暗中发光的鳐鱼，有着闪亮的秘密要分享。",
      fr: "Une raie qui préfère briller dans l'obscurité, avec un secret scintillant à partager.",
      tk: "Paylaşacak parıldayan bir sırrı olan, karanlıkta parlamayı tercih eden bir ışın.",
    },
  },
  "Phantom Barracuda": {
    image: "assets/fish/phantom_barracuda.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "An elusive and ghostly fish of the deep, hiding in the shadows.",
      pt: "Um peixe fantasmagórico e elusivo das profundezas, escondido nas sombras.",
      "zh-CN": "一种深海中难以捉摸且幽灵般的鱼，隐藏在阴影中。",
      fr: "Un barracuda insaisissable et fantomatique des profondeurs, se cachant dans les ombres.",
      tk: "Derinlerin, gölgelerde saklanan, bulunması zor ve hayaletimsi bir balığı.",
    },
  },
  "Gilded Swordfish": {
    image: "assets/fish/gilded_swordfish.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A swordfish with scales that sparkle like gold, the ultimate catch!",
      pt: "Um peixe-espada com escamas que brilham como ouro, a captura definitiva!",
      "zh-CN": "一条鳞片闪耀如金的剑鱼，终极的捕获！",
      fr: "Un espadon aux écailles qui scintillent comme de l'or, la capture ultime!",
      tk: "Altın gibi parıldayan pullara sahip bir kılıç balığı, en iyi av!",
    },
  },
  "Crimson Carp": {
    image: "assets/fish/crimson_carp.png",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "A rare, vibrant jewel of the Spring waters.",
      pt: "Uma joia rara e vibrante das águas da primavera.",
      "zh-CN": "春天水域中稀有、充满活力的宝石。",
      fr: "Un joyau rare et vibrant des eaux du printemps.",
      tk: "Kaynak sularının nadir, canlı bir mücevheri.",
    },
  },
  "Battle Fish": {
    image: "assets/fish/battle_fish.webp",
    howToGetItem: [
      {
        en: "Ocean fishing",
        pt: "Pesca no mar",
        fr: "Pêche en mer",
        tk: "Okyanus balıkçılığı",
        "zh-CN": "海上垂钓",
      },
    ],
    itemType: "collectible",
    description: {
      en: "The rare armored swimmer of faction season!",
      pt: "The rare armored swimmer of faction season!",
      "zh-CN": "派系赛季稀有的装甲游泳者！",
      fr: "The rare armored swimmer of faction season!",
      tk: "The rare armored swimmer of faction season!",
    },
  },
  "Kraken Tentacle": {
    image: "assets/sfts/kraken_tentacle.webp",
    description: {
      en: "Dive into deep-sea mystery! This tentacle teases tales of ancient ocean legends and watery wonders.",
      pt: "Mergulhe no mistério do mar profundo! Este tentáculo provoca contos de lendas oceânicas antigas e maravilhas aquáticas.",
      "zh-CN": "挖掘深海奥秘！这触手戏说着古老海洋传说与水底奇世的故事",
      fr: "Plongez dans le mystère des profondeurs ! Cette tentacule évoque des contes anciens de légendes marines et de merveilles aquatiques.",
      tk: "Derin deniz gizemine dalın! Bu dokunaç, antik okyanus efsaneleri ve su harikaları hakkındaki hikayeleri anlatıyor.",
    },
  },
  "Sapo Docuras": {
    image: "assets/sfts/sapo_docuras.gif",
    description: {
      en: "A real treat!",
      pt: "Um verdadeiro agrado!",
      "zh-CN": "真正的享受！",
      fr: "Un vrai régal!",
      tk: "Gerçek bir tehdit!",
    },
  },
  "Sapo Travessuras": {
    image: "assets/sfts/sapo_travessura.gif",
    description: {
      en: "Oh oh...someone was naughty",
      pt: "Oh oh... alguém foi travesso",
      "zh-CN": "噢噢……有人调皮了",
      fr: "Oh oh... quelqu'un a été méchant.",
      tk: "Oh oh... birisi yaramazlık yapmış",
    },
  },
  "Lifeguard Ring": {
    image: "assets/decorations/lifeguard_ring.webp",
    description: {
      en: "Stay afloat with style, your seaside savior!",
      pt: "Mantenha-se à tona com estilo, seu salvador à beira-mar!",
      "zh-CN": "漂浮你的风尚，你的海岸救星！",
      fr: "Restez à flot avec style, votre sauveur en bord de mer!",
      tk: "Deniz kenarındaki kurtarıcınız, stilinizle ayakta kalın!",
    },
  },
  "Beach Umbrella": {
    image: "assets/decorations/beach_umbrella.webp",
    description: {
      en: "Shade, shelter, and seaside chic in one sunny setup!",
      pt: "Sombra, abrigo e elegância à beira-mar em um único conjunto ensolarado!",
      "zh-CN": "遮阳、歇息，一撑架起海滨风尚！",
      fr: "Ombre, abri et élégance en bord de mer en un seul arrangement ensoleillé!",
      tk: "Güneşli bir ortamda gölge, barınak ve deniz kenarı şıklığı!",
    },
  },
  "Hideaway Herman": {
    image: "assets/decorations/hideaway_herman.webp",
    description: {
      en: "Herman's here to hide, but always peeks for a party!",
      pt: "Herman está aqui para se esconder, mas sempre dá uma espiada em uma festa!",
      "zh-CN": "Herman 在这躲着，但总是瞄着等派对！",
      fr: "Herman est là pour se cacher, mais regarde toujours pour une fête!",
      tk: "Herman saklanmak için burada ama her zaman bir parti arıyor!",
    },
  },
  "Shifty Sheldon": {
    image: "assets/decorations/shifty_sheldon.webp",
    description: {
      en: "Sheldon's sly, always scuttling to the next sandy surprise!",
      pt: "Sheldon é astuto, sempre se movendo para a próxima surpresa arenosa!",
      "zh-CN": "狡猾的 Sheldon，总是匆忙凿着下一个沙岸惊喜！",
      fr: "Sheldon est sournois, toujours en train de se faufiler vers la prochaine surprise sableuse!",
      tk: "Sheldon kurnazdır, her zaman bir sonraki sürprize koşar!",
    },
  },
  "Tiki Torch": {
    image: "assets/decorations/tiki_torch.webp",
    description: {
      en: "Light the night, tropical vibes burning bright!",
      pt: "Ilumine a noite, vibrações tropicais brilhando intensamente!",
      "zh-CN": "照亮黑夜，热带风味点燃一切！",
      fr: "Illuminez la nuit, des vibrations tropicales brûlant brillamment!",
      tk: "Geceyi aydınlatın, tropik titreşimler parlak bir şekilde yanıyor!",
    },
  },
  Surfboard: {
    image: "assets/decorations/surfboard.webp",
    description: {
      en: "Ride the waves of wonder, beach bliss on board!",
      pt: "Surfe nas ondas da maravilha, bliss de praia a bordo!",
      "zh-CN": "驾驭你的惊涛骇浪，愿沙滩祝福你的浪板！",
      fr: "Ridez les vagues de l'émerveillement, béatitude de plage à bord!",
      tk: "Harika dalgalarda gezin, teknede plaj mutluluğu!",
    },
  },
  Walrus: {
    image: "assets/sfts/walrus.webp",
    description: {
      en: "With his trusty tusks and love for the deep, he'll ensure you reel in an extra fish every time",
      pt: "Com suas presas confiáveis e amor pelo fundo do mar, ele garantirá que você pesque um peixe extra toda vez",
      "zh-CN":
        "凭借他可靠的獠牙和对深海的热爱，他会确保你每次都能钓上额外一条鱼",
      fr: "Avec ses défenses fiables et son amour pour les profondeurs, il s'assurera que vous pêchiez un poisson de plus à chaque fois.",
      tk: "Güvenilir dişleri ve derinlere olan sevgisiyle, her seferinde ekstra bir balık yakalamanızı sağlayacaktır.",
    },
  },
  Alba: {
    image: "assets/sfts/alba.webp",
    description: {
      en: "With her keen instincts, she ensures you get a little extra splash in your catch. 50% chance of +1 Basic Fish!",
      pt: "Com seus instintos afiados, ela garante que você receba um pouco de splash extra em sua pesca. 50% de chance de +1 Peixe Básico!",
      "zh-CN":
        "凭借她的敏锐直觉，她会确保你上钩的会有额外水花。50% 的几率 +1 基础鱼！",
      fr: "Avec ses instincts aiguisés, elle s'assure que vous avez un peu plus de plaisir dans votre pêche. 50 % de chances d'obtenir +1 poisson de base!",
      tk: "Keskin içgüdüleri sayesinde avınıza biraz daha fazla katkı sağlamanızı sağlar. %50 ihtimalle +1 Temel Balık!",
    },
  },
  "Knowledge Crab": {
    image: "assets/sfts/knowledge_crab.webp",
    description: {
      en: "The Knowledge Crab doubles your Sprout Mix effect, making your soil treasures as rich as sea plunder!",
      pt: "O Caranguejo do Conhecimento duplica o efeito da sua Mistura de Broto, tornando seus tesouros de solo tão ricos quanto pilhagem do mar!",
      "zh-CN":
        "Knowledge Crab 让你的 Sprout Mix 效果翻倍，让你的田地财宝跟海上劫掠一样滋润！",
      fr: "Le crabe de la connaissance double l'effet de votre mélange de graines, rendant vos trésors de sol aussi riches que les pillages marins!",
      tk: "Bilgi Yengeç, Filiz Karışımı etkinizi ikiye katlayarak toprak hazinelerinizi deniz yağmacılığı kadar zengin hale getirir!",
    },
  },
  Anchor: {
    image: "assets/sfts/anchor.webp",
    description: {
      en: "Drop anchor with this nautical gem, making every spot seaworthy and splash-tastically stylish!",
      pt: "Ancore com esta joia náutica, tornando cada local próprio para navegação e estilisticamente espirituoso!",
      "zh-CN": "用这颗航海明珠抛锚，让每一块地方都风生水起又流行时锚！",
      fr: "Jetez l'ancre avec cette gemme nautique, rendant chaque endroit navigable et d'une élégance éclaboussante!",
      tk: "Bu deniz mücevheriyle demir atın, her noktayı denize uygun hale getirin ve su sıçramasına son derece şık bir hale getirin!",
    },
  },
  "Rubber Ducky": {
    image: "assets/sfts/rubber_ducky.webp",
    description: {
      en: "Float on fun with this classic quacker, bringing bubbly joy to every corner!",
      pt: "Flutue na diversão com este patinho clássico, trazendo alegria borbulhante para todos os cantos!",
      "zh-CN": "伴着这经典叫叫玩具漂浮，传颂胶胶奇趣到每一角落！",
      fr: "Flottez dans le plaisir avec ce canard classique, apportant une joie pétillante à chaque coin!",
      tk: "Her köşeye neşeli bir neşe getiren bu klasik şarlatanla eğlencenin tadını çıkarın!",
    },
  },
  "Kraken Head": {
    image: "assets/sfts/kraken_head.webp",
    description: {
      en: "Dive into deep-sea mystery! This head teases tales of ancient ocean legends and watery wonders.",
      pt: "Mergulhe no mistério do mar profundo! Esta cabeça provoca contos de lendas oceânicas antigas e maravilhas aquáticas.",
      "zh-CN": "挖掘深海奥秘！这大脑戏说着古老海洋传说与水底奇世的故事",
      fr: "Plongez dans le mystère des profondeurs ! Cette tête évoque des contes anciens de légendes marines et de merveilles aquatiques.",
      tk: "Derin deniz gizemine dalın! Bu kafa, eski okyanus efsaneleri ve su harikaları hakkındaki hikayeleri anlatıyor.",
    },
  },
  "Banana Chicken": {
    image: "assets/animals/chickens/banana_chicken.png",
    description: {
      en: "A chicken that boosts bananas. What a world we live in.",
      pt: "Um frango que impulsiona bananas. Em que mundo vivemos?!",
      "zh-CN": "一只能让香蕉增加产量的鸡。我们这世界可真奇妙。",
      fr: "Une poule qui booste les bananes. Quel monde nous vivons.",
      tk: "Muzları artıran bir tavuk. Nasıl bir dünyada yaşıyoruz.",
    },
  },
  "Crim Peckster": {
    image: "assets/animals/chickens/crim_peckster.png",
    description: {
      en: "A gem detective with a knack for unearthing Crimstones.",
      pt: "Um detetive de gemas com habilidade para desenterrar Crimstones.",
      "zh-CN": "一位精通揪出红宝石的宝石侦探",
      fr: "Un détective de gemmes avec un talent pour déterrer des Crimstones.",
      tk: "Kızıltaşları gün yüzüne çıkarma yeteneğine sahip bir mücevher dedektifi.",
    },
  },
  "Knight Chicken": {
    image: "assets/animals/chickens/knight_chicken.webp",
    description: {
      en: "A strong and noble chicken boosting your oil yield.",
      pt: "A strong and noble chicken boosting your oil yield.",
      "zh-CN": "一只强大而高贵的鸡为您的油田增强产出",
      fr: "A strong and noble chicken boosting your oil yield.",
      tk: "A strong and noble chicken boosting your oil yield.",
    },
  },
  "Skill Shrimpy": {
    image: "assets/sfts/skill_shrimpy.png",
    description: {
      en: "Shrimpy's here to help! He'll ensure you get that extra XP from fish.",
      pt: "Shrimpy está aqui para ajudar! Ele garantirá que você obtenha XP extra de peixes.",
      "zh-CN": "Shrimpy 来帮忙了！他来保你从鱼身上获取额外 XP",
      fr: "Shrimpy est là pour vous aider ! Il s'assurera que vous obteniez de l'XP supplémentaire des poissons.",
      tk: "Shrimpy yardım etmek için burada! Balıklardan ekstra XP elde etmeni sağlayacaktır.",
    },
  },
  "Soil Krabby": {
    image: "assets/sfts/soil_krabby.webp",
    description: {
      en: "Speedy sifting with a smile! Enjoy a 10% composter speed boost with this crustaceous champ.",
      pt: "Peneira rápida com um sorriso! Desfrute de um aumento de velocidade de 10% no composto com este campeão crustáceo.",
      "zh-CN": "微笑面对挑拣！有这位坚壳硬汉超人相伴，享受更快 10 % 的堆肥时间",
      fr: "Tamisage rapide avec le sourire ! Profitez d'une augmentation de vitesse de 10% de la compostière avec ce champion crustacé.",
      tk: "Bir gülümseme ile hızlan! Bu kabuklu şampiyon ile 10% gübre üretme hızı artışının tadını çıkar.",
    },
  },
  Nana: {
    image: "assets/sfts/nana.webp",
    description: {
      en: "This rare beauty is a surefire way to boost your banana harvests.",
      pt: "Esta beleza rara é uma maneira infalível de impulsionar suas colheitas de banana.",
      "zh-CN": "这个稀有品种的香蕉美人保你香蕉收成有所增进",
      fr: "Cette beauté rare est un moyen sûr d'augmenter votre récolte de bananes.",
      tk: "Bu nadir güzellik, muz hasadını artırmanın kesin bir yoludur.",
    },
  },
  "Time Warp Totem": {
    image: "assets/sfts/time_warp_totem.webp",
    description: {
      en: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
      pt: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
      "zh-CN":
        "庄稼、树木、水果、烹饪和基矿的速度加倍。仅持续2小时（请在开始计时/收获资源前放置）",
      fr: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
      tk: "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 2 hours",
    },
  },
  "Community Coin": {
    image: "assets/icons/community_coin.png",
    description: {
      en: "A valued coin that can be exchanged for rewards",
      pt: "Uma moeda valiosa que pode ser trocada por recompensas",
      "zh-CN": "A valued coin that can be exchanged for rewards",
      fr: "Une pièce de valeur pouvant être échangée contre des récompenses",
      tk: "Ödüllerle takas edilebilecek değerli bir para",
    },
  },
  "Arcade Token": {
    image: "assets/icons/community_coin.png",
    description: {
      en: "A token earned from mini-games and adventures. Can be exchanged for rewards.",
      pt: "Um token ganho de minijogos e aventuras. Pode ser trocado por recompensas.",
      "zh-CN": "从小游戏与冒险挣来的代币。可以换取奖赏。",
      fr: "Un jeton gagné grâce à des mini-jeux et des aventures. Peut être échangé contre des récompenses.",
      tk: "Mini oyunlardan ve maceralardan kazanılan bir jeton. Ödüllerle takas edilebilir.",
    },
  },
  "Bumpkin Nutcracker": {
    image: "assets/sfts/bumpkin_nutcracker.png",
    description: {
      en: "A festive decoration from 2023.",
      pt: "Uma decoração festiva de 2023.",
      "zh-CN": "2023 年的节日装饰",
      fr: "Une décoration festive de 2023.",
      tk: "2023'ten kalma şenlikli bir dekorasyon.",
    },
  },
  "Festive Tree": {
    image: "assets/sfts/festive_tree.png",
    description: {
      en: "A festive tree available each holiday season. I wonder if it is big enough for santa to see?",
      pt: "Uma árvore festiva disponível em cada temporada de festas. Eu me pergunto se é grande o suficiente para o Papai Noel ver?",
      "zh-CN": "每到佳节搬上台面的节庆树。好奇够不够大让圣诞老人看见呢？",
      fr: "Un arbre festif disponible chaque saison des fêtes. Je me demande s'il est assez grand pour que le Père Noël le voie?",
      tk: "Her tatil sezonunda şenlikli bir ağaç mevcuttur. Acaba Noel Baba'nın görebileceği kadar büyük mü?",
    },
  },
  "White Festive Fox": {
    image: "assets/sfts/white-xmas-fox.png",
    description: {
      en: "The blessing of the White Fox inhabits the generous farms",
      pt: "A bênção da Raposa Branca habita as fazendas generosas",
      "zh-CN": "白狐的赐福安居在慷慨的农场",
      fr: "La bénédiction du Renard Blanc habite les fermes généreuses.",
      tk: "Beyaz Tilki'nin kutsaması cömert çiftliklerde yaşıyor",
    },
  },
  "Grinx's Hammer": {
    image: "assets/sfts/grinx_hammer.png",
    description: {
      en: "The magical hammer from Grinx, the legendary Goblin Blacksmith.",
      pt: "O martelo mágico de Grinx, o lendário Ferreiro Goblin.",
      "zh-CN": "出自传奇哥布林铁匠 Grinx 之手的魔法锤子",
      fr: "Le marteau magique de Grinx, le légendaire forgeron gobelin.",
      tk: "Efsanevi Goblin Demircisi Grinx'in sihirli çekici.",
    },
  },
  Angelfish: {
    image: "assets/fish/angel_fish.png",
    howToGetItem: [
      {
        en: "Beach fishing",
        pt: "Beach fishing",
        fr: "Beach fishing",
        tk: "Beach fishing",
        "zh-CN": "Beach fishing",
      },
    ],
    description: {
      en: "The aquatic celestial beauty, adorned in a palette of vibrant hues.",
      pt: "A beleza celestial aquática, adornada com uma paleta de cores vibrantes.",
      "zh-CN": "海洋的天蓝之美，点缀着缤纷跃动弧光",
      fr: "La beauté céleste aquatique, ornée d'une palette de couleurs vibrantes.",
      tk: "Canlı tonlardan oluşan bir paletle süslenmiş sudaki göksel güzellik.",
    },
  },
  Halibut: {
    image: "assets/fish/halibut.png",
    howToGetItem: [
      {
        en: "Beach fishing",
        pt: "Beach fishing",
        fr: "Beach fishing",
        tk: "Beach fishing",
        "zh-CN": "Beach fishing",
      },
    ],
    description: {
      en: "The flat ocean floor dweller, a master of disguise in sandy camouflage.",
      pt: "O habitante plano do fundo do oceano, um mestre do disfarce em camuflagem arenosa.",
      "zh-CN": "海底平地的潜居者，披着沙色迷彩的伪装大师",
      fr: "Le habitant plat du fond de l'océan, un maître du déguisement en camouflage sableux.",
      tk: "Düz okyanus tabanı sakini, kumlu kamuflajda kılık değiştirme ustası.",
    },
  },
  Parrotfish: {
    image: "assets/fish/parrot_fish.png",
    howToGetItem: [
      {
        en: "Beach fishing",
        pt: "Beach fishing",
        fr: "Beach fishing",
        tk: "Beach fishing",
        "zh-CN": "Beach fishing",
      },
    ],
    description: {
      en: "A kaleidoscope of colors beneath the waves, this fish is nature's living artwork.",
      pt: "Um caleidoscópio de cores sob as ondas, este peixe é a obra de arte viva da natureza.",
      "zh-CN": "海浪下的七彩万花筒，这鱼就是大自然的鲜活艺术造物",
      fr: "Un kaléidoscope de couleurs sous les vagues, ce poisson est une œuvre d'art vivante de la nature.",
      tk: "Dalgaların altındaki renklerden oluşan bir kaleydoskop olan bu balık, doğanın yaşayan sanat eseridir.",
    },
  },
  Rug: {
    image: "SUNNYSIDE.decorations.rug",
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
  },
  Wardrobe: {
    image: "SUNNYSIDE.decorations.wardrobe",
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
  },
  "Farmhand Coupon": {
    image: "assets/icons/bud_ticket.png",
    description: {
      en: "?",
      pt: "?",
      "zh-CN": "?",
      fr: "?",
      tk: "?",
    },
  },
  Farmhand: {
    image: "SUNNYSIDE.icons.player",
    description: {
      en: "A helpful farmhand",
      pt: "Um ajudante de fazenda útil",
      "zh-CN": "热心的雇农",
      fr: "Un ouvrier agricole utile.",
      tk: "Yardımsever bir çiftçi",
    },
  },
  Beehive: {
    image: "assets/sfts/beehive.webp",
    description: {
      en: "A bustling beehive, producing honey from actively growing flowers; 10% chance upon Honey harvest to summon a bee swarm which will pollinate all growing crops with a +0.2 boost!",
      pt: "Uma colmeia agitada, produzindo mel a partir de flores em crescimento ativo; 10% de chance ao colher Mel de invocar um enxame de abelhas que polinizará todas as plantações em crescimento com um impulso de +0.2!",
      "zh-CN":
        "熙熙攘攘的蜂巢，从生长的花卉采来产出蜂蜜；收获满溢的蜂蜜有 10 % 的概率召来蜂群，为生长的庄稼授粉增加 0.2 的产出！",
      fr: "Une ruche animée, produisant du Honey à partir de fleurs en croissance active ; 10 % de chance lors de la récolte du Honey d'invoquer un essaim d'abeilles qui pollinisera toutes les cultures en croissance avec un bonus de +0.2!",
      tk: "Aktif olarak büyüyen çiçeklerden bal üreten hareketli bir arı kovanı; Bal hasadında, büyüyen tüm mahsulleri +0,2 artışla tozlaştıracak bir arı sürüsü çağırma şansı %10!",
    },
  },
  "Red Pansy": {
    image: "assets/flowers/red_pansy.webp",
    description: {
      en: "A red pansy.",
      pt: "Uma pansy vermelha.",
      "zh-CN": "红三色堇。一朵红三色堇。",
      fr: "Une red pansy.",
      tk: "Kırmızı bir menekşe.",
    },
  },
  "Yellow Pansy": {
    image: "assets/flowers/yellow_pansy.webp",
    description: {
      en: "A yellow pansy.",
      pt: "Uma pansy amarela.",
      "zh-CN": "黄三色堇。一朵黄三色堇。",
      fr: "Une yellow pansy.",
      tk: "Sarı bir menekşe.",
    },
  },
  "Purple Pansy": {
    image: "assets/flowers/purple_pansy.webp",
    description: {
      en: "A purple pansy.",
      pt: "Uma pansy roxa.",
      "zh-CN": "紫三色堇。一朵紫三色堇。",
      fr: "Une purple pansy.",
      tk: "Mor bir menekşe.",
    },
  },
  "White Pansy": {
    image: "assets/flowers/white_pansy.webp",
    description: {
      en: "A white pansy.",
      pt: "Uma pansy branca.",
      "zh-CN": "白三色堇。一朵白三色堇。",
      fr: "Une white panssy.",
      tk: "Beyaz bir menekşe.",
    },
  },
  "Blue Pansy": {
    image: "assets/flowers/blue_pansy.webp",
    description: {
      en: "A blue pansy.",
      pt: "Uma pansy azul.",
      "zh-CN": "蓝三色堇。一朵蓝三色堇。",
      fr: "Une blue pansy.",
      tk: "Mavi bir menekşe.",
    },
  },
  "Red Cosmos": {
    image: "assets/flowers/red_cosmos.webp",
    description: {
      en: "A red cosmos.",
      pt: "Um cosmos vermelho.",
      "zh-CN": "红波斯菊。一朵红波斯菊。",
      fr: "Un red cosmos.",
      tk: "Kırmızı bir Cosmos.",
    },
  },
  "Yellow Cosmos": {
    image: "assets/flowers/yellow_cosmos.webp",
    description: {
      en: "A yellow cosmos.",
      pt: "Um cosmos amarelo.",
      "zh-CN": "黄波斯菊。一朵黄色波斯菊。",
      fr: "Un yellow cosmos.",
      tk: "Sarı bir Cosmos.",
    },
  },
  "Purple Cosmos": {
    image: "assets/flowers/purple_cosmos.webp",
    description: {
      en: "A purple cosmos.",
      pt: "Um cosmos roxo.",
      "zh-CN": "紫波斯菊。一朵紫波斯菊。",
      fr: "Un purple cosmos.",
      tk: "Mor bir Cosmos.",
    },
  },
  "White Cosmos": {
    image: "assets/flowers/white_cosmos.webp",
    description: {
      en: "A white cosmos.",
      pt: "Um cosmos branco.",
      "zh-CN": "白波斯菊。一朵白波斯菊。",
      fr: "Un white cosmos.",
      tk: "Beyaz bir Cosmos.",
    },
  },
  "Blue Cosmos": {
    image: "assets/flowers/blue_cosmos.webp",
    description: {
      en: "A blue cosmos.",
      pt: "Um cosmos azul.",
      "zh-CN": "蓝波斯菊。一朵蓝波斯菊。",
      fr: "Un blue cosmos.",
      tk: "Mavi bir Cosmos.",
    },
  },
  "Red Balloon Flower": {
    image: "assets/flowers/red_balloon_flower.webp",
    description: {
      en: "A red balloon flower.",
      pt: "Uma flor de balão vermelho.",
      "zh-CN": "红桔梗。一朵红桔梗。",
      fr: "Une red balloon flower.",
      tk: "Kırmızı balon çiçeği.",
    },
  },
  "Yellow Balloon Flower": {
    image: "assets/flowers/yellow_balloon_flower.webp",
    description: {
      en: "A yellow balloon flower.",
      pt: "Uma flor de balão amarelo.",
      "zh-CN": "黄桔梗。一朵黄桔梗。",
      fr: "Une yellow balloon flower.",
      tk: "Sarı balon çiçeği.",
    },
  },
  "Purple Balloon Flower": {
    image: "assets/flowers/purple_balloon_flower.webp",
    description: {
      en: "A purple balloon flower.",
      pt: "Uma flor de balão roxo.",
      "zh-CN": "紫桔梗。一朵紫桔梗。",
      fr: "Une purple balloon flower.",
      tk: "Mor bir balon çiçeği.",
    },
  },
  "White Balloon Flower": {
    image: "assets/flowers/white_balloon_flower.webp",
    description: {
      en: "A white balloon flower.",
      pt: "Uma flor de balão branca.",
      "zh-CN": "白桔梗。一朵白桔梗。",
      fr: "Une white balloon flower.",
      tk: "Beyaz bir balon çiçeği.",
    },
  },
  "Blue Balloon Flower": {
    image: "assets/flowers/blue_balloon_flower.webp",
    description: {
      en: "A blue balloon flower.",
      pt: "Uma flor de balão azul.",
      "zh-CN": "蓝桔梗。一朵蓝桔梗。",
      fr: "Une blue balloon flower.",
      tk: "Mavi balon çiçeği.",
    },
  },
  "Red Carnation": {
    image: "assets/flowers/red_carnation.png",
    description: {
      en: "A red carnation.",
      pt: "Um cravo vermelho.",
      "zh-CN": "红康乃馨。一朵红康乃馨。",
      fr: "Une red carnation.",
      tk: "Kırmızı bir karanfil.",
    },
  },
  "Yellow Carnation": {
    image: "assets/flowers/yellow_carnation.png",
    description: {
      en: "A yellow carnation.",
      pt: "Um cravo amarelo.",
      "zh-CN": "黄康乃馨。一朵黄康乃馨。",
      fr: "Une yellow carnation.",
      tk: "Sarı bir karanfil.",
    },
  },
  "Purple Carnation": {
    image: "assets/flowers/purple_carnation.png",
    description: {
      en: "A purple carnation.",
      pt: "Um cravo roxo.",
      "zh-CN": "紫康乃馨。一朵紫康乃馨。",
      fr: "Une purple carnation.",
      tk: "Mor bir karanfil.",
    },
  },
  "White Carnation": {
    image: "assets/flowers/white_carnation.png",
    description: {
      en: "A white carnation.",
      pt: "Um cravo branco.",
      "zh-CN": "白康乃馨。一朵白康乃馨。",
      fr: "Unewhite carnation.",
      tk: "Beyaz bir karanfil.",
    },
  },
  "Blue Carnation": {
    image: "assets/flowers/blue_carnation.png",
    description: {
      en: "A blue carnation.",
      pt: "Um cravo azul.",
      "zh-CN": "蓝康乃馨。一朵蓝康乃馨。",
      fr: "Une blue carnation.",
      tk: "Mavi bir karanfil.",
    },
  },
  "Humming Bird": {
    image: "assets/sfts/hummingbird.webp",
    description: {
      en: "A tiny jewel of the sky, the Humming Bird flits with colorful grace.",
      pt: "Um joia minúscula do céu, o Beija-flor flutua com graça colorida.",
      "zh-CN": "小小天上明珠，Humming Bird 捧七彩的优雅飞掠而过",
      fr: "Un joyau du ciel, le Colibri virevolte avec grâce et couleur.",
      tk: "Gökyüzünün minik bir mücevheri olan Sinek Kuşu, rengarenk bir zarafetle uçuyor.",
    },
  },
  "Queen Bee": {
    image: "assets/sfts/queen_bee.webp",
    description: {
      en: "Majestic ruler of the hive, the Queen Bee buzzes with regal authority.",
      pt: "Régia majestosa da colmeia, a Abelha Rainha zumbindo com autoridade régia.",
      "zh-CN": "蜂巢的威严统领，Queen Bee 以至高君权嗡嗡号令",
      fr: "Majestueuse reine de la ruche, l'Abeille Reine bourdonne avec autorité royale.",
      tk: "Kovanın görkemli hükümdarı Kraliçe Arı, kraliyet otoritesiyle vızıldıyor.",
    },
  },
  "Flower Fox": {
    image: "assets/sfts/flower_fox.webp",
    description: {
      en: "The Flower Fox, a playful creature adorned with petals, brings joy to the garden.",
      pt: "A Raposa Flor, uma criatura lúdica adornada com pétalas, traz alegria ao jardim.",
      "zh-CN": "Flower Fox，花瓣簇拥的欢欣生灵，为花园带来雀跃",
      fr: "Le Renard des Fleurs, une créature espiègle ornée de pétales, apporte de la joie au jardin.",
      tk: "Yapraklarla süslenmiş oyuncu bir yaratık olan Çiçek Tilki, bahçeye neşe katıyor.",
    },
  },
  "Hungry Caterpillar": {
    image: "assets/sfts/hungry_caterpillar.webp",
    description: {
      en: "Munching through leaves, the Hungry Caterpillar is always ready for a tasty adventure.",
      pt: "Devorando folhas, a Lagarta Faminta está sempre pronta para uma aventura saborosa.",
      "zh-CN": "嚼着树叶，Hungry Caterpillar 总蓄势等待下一场美味冒险",
      fr: "Se régalant de feuilles, la Chenille Gourmande est toujours prête pour une aventure savoureuse.",
      tk: "Yaprakları yerken Aç Tırtıl her zaman lezzetli bir maceraya hazırdır.",
    },
  },
  "Sunrise Bloom Rug": {
    image: "assets/sfts/sunrise_bloom_rug.webp",
    description: {
      en: "Step onto the Sunrise Bloom Rug, where petals dance around a floral sunrise.",
      pt: "Pise no Tapete de Flores do Amanhecer, onde pétalas dançam ao redor de um nascer do sol floral.",
      "zh-CN": "踏上 Sunrise Bloom Rug，花瓣在之上舞起花香晨光。",
      fr: "Marchez sur le Tapis de l'Éclosion du Soleil, où les pétales dansent autour d'un lever de soleil floral.",
      tk: "Yaprakların çiçekli gün doğumu etrafında dans ettiği Sunrise Bloom Rug'a adım atın.",
    },
  },
  "Flower Rug": {
    image: "assets/sfts/flower_rug.webp",
    description: {
      en: "Add a touch of nature's elegance to your home.",
      pt: "Add a touch of nature's elegance to your home.",
      "zh-CN": "Add a touch of nature's elegance to your home.",
      fr: "Add a touch of nature's elegance to your home.",
      tk: "Add a touch of nature's elegance to your home.",
    },
  },
  "Tea Rug": {
    image: "assets/sfts/tea_rug.webp",
    description: {
      en: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      pt: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      "zh-CN":
        "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      fr: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
      tk: "Rug boasting a warm and inviting tea-colored hue that exudes comfort.",
    },
  },
  "Green Field Rug": {
    image: "assets/sfts/green_field_rug.webp",
    description: {
      en: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      pt: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      "zh-CN":
        "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      fr: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
      tk: "A beautiful rug of deep green hue's reminiscent of a vibrant meadow in full bloom.",
    },
  },
  "Blossom Royale": {
    image: "assets/sfts/blossom_royale.webp",
    description: {
      en: "The Blossom Royale, a giant flower in vibrant blue and pink, stands in majestic bloom.",
      pt: "O Royale da Flor, uma flor gigante em azul e rosa vibrantes, está em majestosa floração.",
      "zh-CN": "Blossom Royale，蓝与粉鲜活荡漾的巨大花朵，挺拔撑起俨然绽放。",
      fr: "Le Blossom Royale, une fleur géante aux couleurs bleues et roses vibrantes, se dresse en majesté.",
      tk: "Canlı mavi ve pembe renkte dev bir çiçek olan Blossom Royale, görkemli bir çiçek içinde duruyor.",
    },
  },
  Rainbow: {
    image: "assets/sfts/rainbow.webp",
    description: {
      en: "A cheerful Rainbow, bridging sky and earth with its colorful arch.",
      pt: "Um Arco-íris alegre, unindo o céu e a terra com seu arco colorido.",
      "zh-CN": "欢乐彩虹，为天地搭起七彩拱桥。",
      fr: "Un arc-en-ciel joyeux, reliant le ciel et la terre avec son arc-en-ciel coloré.",
      tk: "Rengarenk kemeriyle gökyüzü ile yeryüzü arasında köprü oluşturan neşeli bir Gökkuşağı.",
    },
  },
  "Enchanted Rose": {
    image: "assets/sfts/enchanted_rose.webp",
    description: {
      en: "The Enchanted Rose, a symbol of eternal beauty, captivates with its magical allure.",
      pt: "A Rosa Encantada, um símbolo de beleza eterna, cativa com seu fascínio mágico.",
      "zh-CN": "Enchanted Rose，永生美丽的象征，沉迷在她的魔法魅力里吧。",
      fr: "La Rose Enchantée, symbole de beauté éternelle, captive par son charme magique.",
      tk: "Sonsuz güzelliğin sembolü olan Büyülü Gül, büyülü cazibesiyle büyülüyor.",
    },
  },
  "Flower Cart": {
    image: "assets/sfts/flower_cart.webp",
    description: {
      en: "The Flower Cart, brimming with blooms, is a mobile garden of floral delights.",
      pt: "O Carrinho de Flores, transbordante de flores, é um jardim móvel de delícias florais.",
      "zh-CN": "Flower Cart，满盛花开，移动花园推动鲜花喜悦。",
      fr: "Le Chariot de Fleurs, débordant de fleurs, est un jardin mobile de délices floraux.",
      tk: "Çiçeklerle dolu Çiçek Arabası, çiçek lezzetleriyle dolu hareketli bir bahçedir.",
    },
  },
  Capybara: {
    image: "assets/sfts/capybara.webp",
    description: {
      en: "The Capybara, a laid-back friend, enjoys lazy days by the water's edge.",
      pt: "A Capivara, uma amiga tranquila, desfruta de dias preguiçosos à beira da água.",
      "zh-CN": "Capybara，悠闲伙伴，享受水边的慵懒时光。",
      fr: "Le Capybara, un ami décontracté, apprécie les journées paisibles au bord de l'eau.",
      tk: "Rahat bir arkadaş olan Kapibara, su kenarında tembel günlerin tadını çıkarır.",
    },
  },
  "Prism Petal": {
    image: "assets/flowers/prism_petal.webp",
    description: {
      en: "Wow! What a beautiful flower! I think this one is worthy of placing on your farm.",
      pt: "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
      "zh-CN": "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
      fr: "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
      tk: "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
    },
  },
  "Celestial Frostbloom": {
    image: "assets/flowers/celestial_frostbloom.webp",
    description: {
      en: "Wow! What a beautiful flower! I think this one is worthy of placing on your farm.",
      pt: "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
      "zh-CN": "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
      fr: "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
      tk: "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
    },
  },
  "Primula Enigma": {
    image: "assets/flowers/primula_enigma.webp",
    description: {
      en: "Wow! What a beautiful flower! I think this one is worthy of placing on your farm.",
      pt: "Uau! Que flor bonita! Acho que esta vale a pena colocar em sua fazenda.",
      "zh-CN": "哇！好一朵漂亮鲜花！我看这朵很值得你放在农场上。",
      fr: "Waouh ! Quelle belle fleur ! Je pense que celle-ci mérite d'être placée sur votre ferme.",
      tk: "Vay! Ne güzel bir çiçek! Bunun çiftliğinize yerleştirmeye değer olduğunu düşünüyorum.",
    },
  },
  "Red Daffodil": {
    image: "assets/flowers/red_daffodil.webp",
    description: {
      en: "A red daffodil.",
      pt: "Um narciso vermelho.",
      "zh-CN": "红水仙花。一朵红水仙花。",
      fr: "Une red daffodil.",
      tk: "Kırmızı bir nergis.",
    },
  },
  "Yellow Daffodil": {
    image: "assets/flowers/yellow_daffodil.webp",
    description: {
      en: "A yellow daffodil.",
      pt: "Um narciso amarelo.",
      "zh-CN": "黄水仙花。一朵黄水仙花。",
      fr: "Une yellow daffodil.",
      tk: "Sarı bir nergis.",
    },
  },
  "Purple Daffodil": {
    image: "assets/flowers/purple_daffodil.webp",
    description: {
      en: "A purple daffodil.",
      pt: "Um narciso roxo.",
      "zh-CN": "紫水仙花。一朵紫水仙花l。",
      fr: "Une purple daffodil.",
      tk: "Mor bir nergis.",
    },
  },
  "White Daffodil": {
    image: "assets/flowers/white_daffodil.webp",
    description: {
      en: "A white daffodil.",
      pt: "Um narciso branco.",
      "zh-CN": "白水仙花。一朵白水仙花。",
      fr: "Une white daffodil.",
      tk: "Beyaz bir nergis.",
    },
  },
  "Blue Daffodil": {
    image: "assets/flowers/blue_daffodil.webp",
    description: {
      en: "A blue daffodil.",
      pt: "Um narciso azul.",
      "zh-CN": "蓝水仙花。一朵蓝水仙花。",
      fr: "Une blue daffodil.",
      tk: "Mavi bir nergis.",
    },
  },
  "Red Lotus": {
    image: "assets/flowers/red_lotus.webp",
    description: {
      en: "A red lotus.",
      pt: "Um lótus vermelho.",
      "zh-CN": "红莲花。一朵红莲花。",
      fr: "Un red lotus.",
      tk: "Kırmızı bir nilüfer.",
    },
  },
  "Yellow Lotus": {
    image: "assets/flowers/yellow_lotus.webp",
    description: {
      en: "A yellow lotus.",
      pt: "Um lótus amarelo.",
      "zh-CN": "黄莲花。一朵黄莲花。",
      fr: "Un yellow lotus.",
      tk: "Sarı bir nilüfer.",
    },
  },
  "Purple Lotus": {
    image: "assets/flowers/purple_lotus.webp",
    description: {
      en: "A purple lotus.",
      pt: "Um lótus roxo.",
      "zh-CN": "紫莲花。一朵紫莲花。",
      fr: "Un purple lotus.",
      tk: "Mor bir nilüfer.",
    },
  },
  "White Lotus": {
    image: "assets/flowers/white_lotus.webp",
    description: {
      en: "A white lotus.",
      pt: "Um lótus branco.",
      "zh-CN": "白莲花。一朵白莲花。",
      fr: "Un white lotus.",
      tk: "Beyaz bir nilüfer.",
    },
  },
  "Blue Lotus": {
    image: "assets/flowers/blue_lotus.webp",
    description: {
      en: "A blue lotus.",
      pt: "Um lótus azul.",
      "zh-CN": "蓝莲花。一朵蓝莲花。",
      fr: "Un blue lotus.",
      tk: "Mavi bir nilüfer.",
    },
  },
  "Earn Alliance Banner": {
    image: "assets/sfts/earn_alliance_banner.png",
    description: {
      en: "A special event banner",
      pt: "Um banner de evento especial",
      "zh-CN": "一杆特别活动的旗帜",
      fr: "A special event banner",
      tk: "Özel bir etkinlik bayrağı",
    },
  },
  "Luxury Key": {
    image: "assets/sfts/quest/luxury_key.png",
    description: {
      en: "Visit the plaza near woodlands to unlock your reward",
      pt: "Visite o Plaza perto de Woodlands para desbloquear sua recompensa",
      "zh-CN": "Visit the plaza near woodlands to unlock your reward",
      fr: "Visitez la place près des bois pour débloquer votre récompense",
      tk: "Plazanın Ağaç diyarına yakın olan kısmında sandığınızı açın",
    },
  },
  "Rare Key": {
    image: "assets/sfts/quest/rare_key.png",
    description: {
      en: "Visit the beach to unlock your reward",
      pt: "Visite a praia para desbloquear sua recompensa",
      "zh-CN": "Visit the beach to unlock your reward",
      fr: "Visitez la plage pour débloquer votre récompense",
      tk: "Sahili ziyaret edin ve sandığınızı açın",
    },
  },
  "Prize Ticket": {
    image: "assets/icons/prize_ticket.png",
    description: {
      en: "A prized ticket. You can use it to enter the monthly goblin raffle.",
      pt: "Um ticket para entrar nos sorteios de prêmios",
      "zh-CN":
        "A prized ticket. You can use it to enter the monthly goblin raffle.",
      fr: "Un ticket pour participer au concours de fin de saison",
      tk: "Ödül çekilişlerine katılmak için bir bilet",
    },
  },
  "Baby Panda": {
    image: "assets/sfts/baby_panda.png",
    description: {
      en: "A cute panda from the Gas Hero event. Double experience for beginners during March.",
      pt: "A cute panda from the Gas Hero event. Double experience for beginners during March.",
      "zh-CN":
        "A cute panda from the Gas Hero event. Double experience for beginners during March.",
      fr: "Un adorable panda de l'événement Gas Hero.",
      tk: "Gas Hero etkinliğinden sevimli bir panda. Mart ayında yeni başlayanlar için 2x XP.",
    },
  },
  Baozi: {
    image: "assets/sfts/baozi.webp",
    description: {
      en: "A delicious treat from the Lunar New Year event.",
      pt: "A delicious treat from the Lunar New Year event.",
      "zh-CN": "A delicious treat from the Lunar New Year event.",
      fr: "Une délicieuse friandise de l'événement du Nouvel An lunaire.",
      tk: "Ay Yeni Yılı etkinliğinden lezzetli bir ikram.",
    },
  },
  "Community Egg": {
    image: "assets/sfts/easter_donation_egg.webp",
    description: {
      en: "Wow, you must really care about the community!",
      pt: "Wow, you must really care about the community!",
      "zh-CN": "哇，你一定非常关心社区！",
      fr: "Wow, vous devez vraiment vous soucier de la communauté !",
      tk: "Wow, you must really care about the community!",
    },
  },
  "Hungry Hare": {
    image: "assets/sfts/hungryHare.png",
    description: {
      en: "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
      pt: "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
      "zh-CN": "这只贪吃的小兔子跳进了你的农场。2024年复活节的特别活动物品",
      fr: "Ce lapin vorace saute dans votre ferme. Un objet spécial de l'événement de Pâques 2024.",
      tk: "This ravenous rabbit hops through your farm. A special event item from Easter 2024",
    },
  },
  "Turbo Sprout": {
    image: "assets/sfts/turbo_sprout.webp",
    description: {
      en: "An engine that reduces the Green House's growth time by 50%.",
      pt: "An engine that reduces the Green House's growth time by 50%.",
      "zh-CN": "一台为温室减少 50 % 生长时间的引擎。",
      fr: "An engine that reduces the Green House's growth time by 50%.",
      tk: "An engine that reduces the Green House's growth time by 50%.",
    },
  },
  Soybliss: {
    image: "assets/sfts/soybliss.webp",
    description: {
      en: "A unique soy creature that gives +1 Soybean yield.",
      pt: "A unique soy creature that gives +1 Soybean yield.",
      "zh-CN": "为大豆 +1 产出的奇特豆豆生物。",
      fr: "A unique soy creature that gives +1 Soybean yield.",
      tk: "A unique soy creature that gives +1 Soybean yield.",
    },
  },
  "Grape Granny": {
    image: "assets/sfts/grape_granny.webp",
    description: {
      en: "Wise matriarch nurturing grapes to flourish with +1 yield.",
      pt: "Wise matriarch nurturing grapes to flourish with +1 yield.",
      "zh-CN": "女族长悉心睿智的照料助长葡萄 +1 产出。",
      fr: "Wise matriarch nurturing grapes to flourish with +1 yield.",
      tk: "Wise matriarch nurturing grapes to flourish with +1 yield.",
    },
  },
  "Royal Throne": {
    image: "assets/sfts/royal_throne.webp",
    description: {
      en: "A throne fit for the highest ranking farmer.",
      pt: "A throne fit for the highest ranking farmer.",
      "zh-CN": "为至高阶农夫打造的王位。",
      fr: "A throne fit for the highest ranking farmer.",
      tk: "A throne fit for the highest ranking farmer.",
    },
  },
  "Lily Egg": {
    image: "assets/sfts/lily_egg.webp",
    description: {
      en: "Tiny delight, grand beauty, endless wonder.",
      pt: "Tiny delight, grand beauty, endless wonder.",
      "zh-CN": "小小欣喜，大大美丽，久久惊奇。",
      fr: "Tiny delight, grand beauty, endless wonder.",
      tk: "Tiny delight, grand beauty, endless wonder.",
    },
  },
  Goblet: {
    image: "assets/sfts/goblet.webp",
    description: {
      en: "A goblet that holds the finest of wines.",
      pt: "A goblet that holds the finest of wines.",
      "zh-CN": "至珍美酒高杯藏。",
      fr: "A goblet that holds the finest of wines.",
      tk: "A goblet that holds the finest of wines.",
    },
  },
  "Fancy Rug": {
    image: "assets/sfts/fancy_rug.webp",
    description: {
      en: "A rug that brings a touch of elegance to any room.",
      pt: "A rug that brings a touch of elegance to any room.",
      "zh-CN": "叫任何房间都蓬荜生辉的地毯。",
      fr: "A rug that brings a touch of elegance to any room.",
      tk: "A rug that brings a touch of elegance to any room.",
    },
  },
  Clock: {
    image: "assets/sfts/clock.webp",
    description: {
      en: "A Clock that keeps time with the gentle ticking of the seasons.",
      pt: "A Clock that keeps time with the gentle ticking of the seasons.",
      "zh-CN": "时钟的脚步轻响时季的滴答",
      fr: "A Clock that keeps time with the gentle ticking of the seasons.",
      tk: "A Clock that keeps time with the gentle ticking of the seasons.",
    },
  },
  Vinny: {
    image: "assets/sfts/vinny.webp",
    description: {
      en: "Vinny, a friendly grapevine, is always ready for a chat.",
      pt: "Vinny, a friendly grapevine, is always ready for a chat.",
      "zh-CN": "Vinny，友善葡萄藤，随时欢迎闲聊。",
      fr: "Vinny, a friendly grapevine, is always ready for a chat.",
      tk: "Vinny, a friendly grapevine, is always ready for a chat.",
    },
  },
  "Beetroot Blaze": {
    image: "assets/food/beetroot_blaze.png",
    description: {
      en: "A spicy beetroot-infused magic mushroom dish",
      pt: "A spicy beetroot-infused magic mushroom dish",
      "zh-CN": "A spicy beetroot-infused magic mushroom dish",
      fr: "A spicy beetroot-infused magic mushroom dish",
      tk: "A spicy beetroot-infused magic mushroom dish",
    },
  },
  "Rapid Roast": {
    image: "assets/food/rapid_roast.png",
    description: {
      en: "For Bumpkins in a hurry...",
      pt: "For Bumpkins in a hurry...",
      "zh-CN": "对于急着赶路的乡巴佬来说……",
      fr: "For Bumpkins in a hurry...",
      tk: "For Bumpkins in a hurry...",
    },
  },
  "Shroom Syrup": {
    image: "assets/food/shroom_syrup.png",
    description: {
      en: "The essence of bees and enchanted fungi",
      pt: "The essence of bees and enchanted fungi",
      "zh-CN": "The essence of bees and enchanted fungi",
      fr: "The essence of bees and enchanted fungi",
      tk: "The essence of bees and enchanted fungi",
    },
  },
  "Gaucho Rug": {
    image: "assets/sfts/gaucho_rug.webp",
    description: {
      en: "A commerative rug to support South Brazil.",
      pt: "A commerative rug to support South Brazil.",
      "zh-CN": "纪念驰援南巴西的地毯。",
      fr: "A commerative rug to support South Brazil.",
      tk: "A commerative rug to support South Brazil.",
    },
  },
  "Battlecry Drum": {
    image: "assets/sfts/battlecry_drum.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Bullseye Board": {
    image: "assets/sfts/bullseye_board.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Chess Rug": {
    image: "assets/sfts/chess_rug.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  Cluckapult: {
    image: "assets/sfts/cluckapult.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Golden Gallant": {
    image: "assets/sfts/golden_gallant.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Golden Garrison": {
    image: "assets/sfts/golden_garrison.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Golden Guardian": {
    image: "assets/sfts/golden_guardian.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Novice Knight": {
    image: "assets/sfts/novice_knight.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Regular Pawn": {
    image: "assets/sfts/regular_pawn.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Rookie Rook": {
    image: "assets/sfts/rookie_rook.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Silver Sentinel": {
    image: "assets/sfts/silver_sentinel.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Silver Squire": {
    image: "assets/sfts/silver_squire.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Silver Stallion": {
    image: "assets/sfts/silver_stallion.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Trainee Target": {
    image: "assets/sfts/trainee_target.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Twister Rug": {
    image: "assets/sfts/twister_rug.webp",
    description: {
      en: "",
      pt: "",
      "zh-CN": "",
      fr: "",
      tk: "",
    },
  },
  "Grape Seed": {
    image: "assets/greenhouse/grape_seed.webp",
    description: {
      en: "A zesty and desired fruit.",
      pt: "A zesty and desired fruit.",
      "zh-CN": "一种甜美神往的水果",
      fr: "A zesty and desired fruit.",
      tk: "A zesty and desired fruit.",
    },
  },
  "Olive Seed": {
    image: "assets/greenhouse/olive_seed.webp",
    description: {
      en: "A luxury for advanced farmers.",
      pt: "A luxury for advanced farmers.",
      "zh-CN": "高端农夫的奢品",
      fr: "A luxury for advanced farmers.",
      tk: "A luxury for advanced farmers.",
    },
  },
  "Rice Seed": {
    image: "assets/greenhouse/rice_seed.webp",
    description: {
      en: "Perfect for rations!",
      pt: "Perfect for rations!",
      "zh-CN": "完美口粮！",
      fr: "Perfect for rations!",
      tk: "Perfect for rations!",
    },
  },
  Grape: {
    image: "assets/greenhouse/grape.webp",
    description: {
      en: "A zesty and desired fruit.",
      pt: "A zesty and desired fruit.",
      "zh-CN": "一种甜美神往的水果",
      fr: "A zesty and desired fruit.",
      tk: "A zesty and desired fruit.",
    },
  },
  Olive: {
    image: "assets/greenhouse/olive.webp",
    description: {
      en: "A luxury for advanced farmers.",
      pt: "A luxury for advanced farmers.",
      "zh-CN": "高端农夫的奢品",
      fr: "A luxury for advanced farmers.",
      tk: "A luxury for advanced farmers.",
    },
  },
  Rice: {
    image: "assets/greenhouse/rice.webp",
    description: {
      en: "Perfect for rations!",
      pt: "Perfect for rations!",
      "zh-CN": "完美口粮！",
      fr: "Perfect for rations!",
      tk: "Perfect for rations!",
    },
  },
  Antipasto: {
    image: "assets/food/antipasto.webp",
    description: {
      en: "Assorted bites, perfect for sharing.",
      pt: "Assorted bites, perfect for sharing.",
      "zh-CN": "Assorted bites, perfect for sharing.",
      fr: "Assorted bites, perfect for sharing.",
      tk: "Assorted bites, perfect for sharing.",
    },
  },
  "Carrot Juice": {
    image: "assets/food/carrot_juice.webp",
    description: {
      en: "Refreshing juice, pressed fresh by bumpkins.",
      pt: "Refreshing juice, pressed fresh by bumpkins.",
      "zh-CN": "Refreshing juice, pressed fresh by bumpkins.",
      fr: "Refreshing juice, pressed fresh by bumpkins.",
      tk: "Refreshing juice, pressed fresh by bumpkins.",
    },
  },
  "Seafood Basket": {
    image: "assets/food/seafood_basket.webp",
    description: {
      en: "Oceanic flavors, sourced by goblins.",
      pt: "Oceanic flavors, sourced by goblins.",
      "zh-CN": "Oceanic flavors, sourced by goblins.",
      fr: "Oceanic flavors, sourced by goblins.",
      tk: "Oceanic flavors, sourced by goblins.",
    },
  },
  "Fish Burger": {
    image: "assets/food/fish_burger.webp",
    description: {
      en: "Succulent burger, loved by seaside adventurers.",
      pt: "Succulent burger, loved by seaside adventurers.",
      "zh-CN": "Succulent burger, loved by seaside adventurers.",
      fr: "Succulent burger, loved by seaside adventurers.",
      tk: "Succulent burger, loved by seaside adventurers.",
    },
  },
  "Fish n Chips": {
    image: "assets/food/fish_and_chips.webp",
    description: {
      en: "Classic seaside meal, loved by all.",
      pt: "Classic seaside meal, loved by all.",
      "zh-CN": "Classic seaside meal, loved by all.",
      fr: "Classic seaside meal, loved by all.",
      tk: "Classic seaside meal, loved by all.",
    },
  },
  "Fish Omelette": {
    image: "assets/food/fish_omelette.webp",
    description: {
      en: "Flavorful omelette, filled with oceanic treasures.",
      pt: "Flavorful omelette, filled with oceanic treasures.",
      "zh-CN": "Flavorful omelette, filled with oceanic treasures.",
      fr: "Flavorful omelette, filled with oceanic treasures.",
      tk: "Flavorful omelette, filled with oceanic treasures.",
    },
  },
  "Fried Calamari": {
    image: "assets/food/fried_calamari.webp",
    description: {
      en: "Crispy calamari rings, a delicious indulgence.",
      pt: "Crispy calamari rings, a delicious indulgence.",
      "zh-CN": "Crispy calamari rings, a delicious indulgence.",
      fr: "Crispy calamari rings, a delicious indulgence.",
      tk: "Crispy calamari rings, a delicious indulgence.",
    },
  },
  "Fried Tofu": {
    image: "assets/food/fried_tofu.png",
    description: {
      en: "Golden fried tofu, crafted with care.",
      pt: "Golden fried tofu, crafted with care.",
      "zh-CN": "Golden fried tofu, crafted with care.",
      fr: "Golden fried tofu, crafted with care.",
      tk: "Golden fried tofu, crafted with care.",
    },
  },
  "Grape Juice": {
    image: "assets/food/grape_juice.webp",
    description: {
      en: "Sweet and tangy juice, freshly squeezed.",
      pt: "Sweet and tangy juice, freshly squeezed.",
      "zh-CN": "Sweet and tangy juice, freshly squeezed.",
      fr: "Sweet and tangy juice, freshly squeezed.",
      tk: "Sweet and tangy juice, freshly squeezed.",
    },
  },
  "Ocean's Olive": {
    image: "assets/food/oceans_olive.webp",
    description: {
      en: "Delightful oceanic dish, a true Sunflorian delicacy.",
      pt: "Delightful oceanic dish, a true Sunflorian delicacy.",
      "zh-CN": "Delightful oceanic dish, a true Sunflorian delicacy.",
      fr: "Delightful oceanic dish, a true Sunflorian delicacy.",
      tk: "Delightful oceanic dish, a true Sunflorian delicacy.",
    },
  },
  "Quick Juice": {
    image: "assets/food/quick_juice.webp",
    description: {
      en: "Quick energy boost, a Goblin favourite.",
      pt: "Quick energy boost, a Goblin favourite.",
      "zh-CN": "Quick energy boost, a Goblin favourite.",
      fr: "Quick energy boost, a Goblin favourite.",
      tk: "Quick energy boost, a Goblin favourite.",
    },
  },
  "Rice Bun": {
    image: "assets/food/rice_bun.webp",
    description: {
      en: "Soft and fluffy rice bun, a favorite.",
      pt: "Soft and fluffy rice bun, a favorite.",
      "zh-CN": "Soft and fluffy rice bun, a favorite.",
      fr: "Soft and fluffy rice bun, a favorite.",
      tk: "Soft and fluffy rice bun, a favorite.",
    },
  },
  "Slow Juice": {
    image: "assets/food/slow_juice.webp",
    description: {
      en: "Nutrient-rich juice, handcrafted by bumpkins.",
      pt: "Nutrient-rich juice, handcrafted by bumpkins.",
      "zh-CN": "Nutrient-rich juice, handcrafted by bumpkins.",
      fr: "Nutrient-rich juice, handcrafted by bumpkins.",
      tk: "Nutrient-rich juice, handcrafted by bumpkins.",
    },
  },
  "Steamed Red Rice": {
    image: "assets/food/red_rice.webp",
    description: {
      en: "Perfectly steamed red rice, a bumpkin's delight.",
      pt: "Perfectly steamed red rice, a bumpkin's delight.",
      "zh-CN": "Perfectly steamed red rice, a bumpkin's delight.",
      fr: "Perfectly steamed red rice, a bumpkin's delight.",
      tk: "Perfectly steamed red rice, a bumpkin's delight.",
    },
  },
  "Sushi Roll": {
    image: "assets/food/sushi_roll.webp",
    description: {
      en: "Delicious sushi roll, skillfully prepared.",
      pt: "Delicious sushi roll, skillfully prepared.",
      "zh-CN": "Delicious sushi roll, skillfully prepared.",
      fr: "Delicious sushi roll, skillfully prepared.",
      tk: "Delicious sushi roll, skillfully prepared.",
    },
  },
  "The Lot": {
    image: "assets/food/the_lot.webp",
    description: {
      en: "Flavorful fruit blend, refreshing and nutritious.",
      pt: "Flavorful fruit blend, refreshing and nutritious.",
      "zh-CN": "Flavorful fruit blend, refreshing and nutritious.",
      fr: "Flavorful fruit blend, refreshing and nutritious.",
      tk: "Flavorful fruit blend, refreshing and nutritious.",
    },
  },
  "Tofu Scramble": {
    image: "assets/food/tofu_scramble.png",
    description: {
      en: "Hearty scramble, packed with protein and flavor.",
      pt: "Hearty scramble, packed with protein and flavor.",
      "zh-CN": "Hearty scramble, packed with protein and flavor.",
      fr: "Hearty scramble, packed with protein and flavor.",
      tk: "Hearty scramble, packed with protein and flavor.",
    },
  },
  Greenhouse: {
    image: "assets/buildings/greenhouse.webp",
    description: {
      en: "A sanctuary for sensitive crops",
      pt: "A sanctuary for sensitive crops",
      "zh-CN": "温室。娇弱庄稼的庇护所（消耗石油运转）",
      fr: "A sanctuary for sensitive crops",
      tk: "A sanctuary for sensitive crops",
    },
  },
  "Rice Panda": {
    image: "assets/sfts/rice_panda.webp",
    description: {
      en: "A smart panda never forgets to water the rice.",
      pt: "A smart panda never forgets to water the rice.",
      "zh-CN": "熊猫很聪明，从不忘记给稻米浇水。",
      fr: "A smart panda never forgets to water the rice.",
      tk: "A smart panda never forgets to water the rice.",
    },
  },
  "Benevolence Flag": {
    image: "assets/sfts/benevolence_flag.png",
    description: {
      en: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      pt: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      "zh-CN":
        "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      fr: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
      tk: "For players who have shown great benevolence by contributing significantly to the Bumpkins.",
    },
  },
  "Devotion Flag": {
    image: "assets/sfts/devotion_flag.png",
    description: {
      en: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      pt: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      "zh-CN":
        "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      fr: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
      tk: "For players who have shown unwavering devotion by donating extensively to the Nightshades, reflecting their cult-like dedication",
    },
  },
  "Generosity Flag": {
    image: "assets/sfts/generosity_flag.png",
    description: {
      en: "For players who have donated substantial resources to the Goblins.",
      pt: "For players who have donated substantial resources to the Goblins.",
      "zh-CN":
        "For players who have donated substantial resources to the Goblins.",
      fr: "For players who have donated substantial resources to the Goblins.",
      tk: "For players who have donated substantial resources to the Goblins.",
    },
  },
  "Splendor Flag": {
    image: "assets/sfts/splendor_flag.png",
    description: {
      en: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      pt: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      "zh-CN":
        "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      fr: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
      tk: "For players who have generously supported the Sunflorians, symbolizing their splendor in generosity.",
    },
  },
  "Jelly Lamp": {
    image: "assets/sfts/jelly_lamp.webp",
    description: {
      en: "A lamp that brings a touch of luxury to any room.",
      pt: "A lamp that brings a touch of luxury to any room.",
      "zh-CN": "A lamp that brings a touch of luxury to any room.",
      fr: "A lamp that brings a touch of luxury to any room.",
      tk: "A lamp that brings a touch of luxury to any room.",
    },
  },
  "Paint Can": {
    image: "assets/sfts/paint_can.png",
    description: {
      en: "A paint can discovered in the festival of colors",
      pt: "A paint can discovered in the festival of colors",
      "zh-CN": "A paint can discovered in the festival of colors",
      fr: "A paint can discovered in the festival of colors",
      tk: "A paint can discovered in the festival of colors",
    },
  },
  "Sunflorian Throne": {
    image: "assets/factions/sunflorian_throne.webp",
    description: {
      en: "A throne fit for a Sunflorian.",
      pt: "A throne fit for a Sunflorian.",
      "zh-CN": "A throne fit for a Sunflorian.",
      fr: "A throne fit for a Sunflorian.",
      tk: "A throne fit for a Sunflorian.",
    },
  },
  "Nightshade Throne": {
    image: "assets/factions/nightshade_throne.webp",
    description: {
      en: "A throne fit for a Nightshade.",
      pt: "A throne fit for a Nightshade.",
      "zh-CN": "A throne fit for a Nightshade.",
      fr: "A throne fit for a Nightshade.",
      tk: "A throne fit for a Nightshade.",
    },
  },
  "Goblin Throne": {
    image: "assets/factions/goblin_throne.webp",
    description: {
      en: "A throne fit for a Goblin.",
      pt: "A throne fit for a Goblin.",
      "zh-CN": "A throne fit for a Goblin.",
      fr: "A throne fit for a Goblin.",
      tk: "A throne fit for a Goblin.",
    },
  },
  "Bumpkin Throne": {
    image: "assets/factions/bumpkins_throne.webp",
    description: {
      en: "A throne fit for a Bumpkin.",
      pt: "A throne fit for a Bumpkin.",
      "zh-CN": "A throne fit for a Bumpkin.",
      fr: "A throne fit for a Bumpkin.",
      tk: "A throne fit for a Bumpkin.",
    },
  },
  "Golden Sunflorian Egg": {
    image: "assets/factions/golden_sunflorian_egg.webp",
    description: {
      en: "A jewelled egg created by the House of Sunflorian.",
      pt: "A jewelled egg created by the House of Sunflorian.",
      "zh-CN": "A jewelled egg created by the House of Sunflorian.",
      fr: "A jewelled egg created by the House of Sunflorian.",
      tk: "A jewelled egg created by the House of Sunflorian.",
    },
  },
  "Goblin Mischief Egg": {
    image: "assets/factions/goblin_mischief_egg.webp",
    description: {
      en: "A jewelled egg created by the House of Goblin.",
      pt: "A jewelled egg created by the House of Goblin.",
      "zh-CN": "A jewelled egg created by the House of Goblin.",
      fr: "A jewelled egg created by the House of Goblin.",
      tk: "A jewelled egg created by the House of Goblin.",
    },
  },
  "Bumpkin Charm Egg": {
    image: "assets/factions/bumpkin_charm_egg.webp",
    description: {
      en: "A jewelled egg created by the House of Bumpkin.",
      pt: "A jewelled egg created by the House of Bumpkin.",
      "zh-CN": "A jewelled egg created by the House of Bumpkin.",
      fr: "A jewelled egg created by the House of Bumpkin.",
      tk: "A jewelled egg created by the House of Bumpkin.",
    },
  },
  "Nightshade Veil Egg": {
    image: "assets/factions/nightshade_veil_egg.webp",
    description: {
      en: "A jewelled egg created by the House of Nightshade.",
      pt: "A jewelled egg created by the House of Nightshade.",
      "zh-CN": "A jewelled egg created by the House of Nightshade.",
      fr: "A jewelled egg created by the House of Nightshade.",
      tk: "A jewelled egg created by the House of Nightshade.",
    },
  },
  "Emerald Goblin Goblet": {
    image: "assets/factions/emerald_goblin_goblet.webp",
    description: {
      en: "An emerald encrusted goblet.",
      pt: "An emerald encrusted goblet.",
      "zh-CN": "An emerald encrusted goblet.",
      fr: "An emerald encrusted goblet.",
      tk: "An emerald encrusted goblet.",
    },
  },
  "Opal Sunflorian Goblet": {
    image: "assets/factions/opal_sunflorian_goblet.webp",
    description: {
      en: "An opal encrusted goblet.",
      pt: "An opal encrusted goblet.",
      "zh-CN": "An opal encrusted goblet.",
      fr: "An opal encrusted goblet.",
      tk: "An opal encrusted goblet.",
    },
  },
  "Sapphire Bumpkin Goblet": {
    image: "assets/factions/sapphire_bumpkin_goblet.webp",
    description: {
      en: "A sapphire encrusted goblet.",
      pt: "A sapphire encrusted goblet.",
      "zh-CN": "A sapphire encrusted goblet.",
      fr: "A sapphire encrusted goblet.",
      tk: "A sapphire encrusted goblet.",
    },
  },
  "Amethyst Nightshade Goblet": {
    image: "assets/factions/amethyst_nightshade_goblet.webp",
    description: {
      en: "An amethyst encrusted goblet.",
      pt: "An amethyst encrusted goblet.",
      "zh-CN": "An amethyst encrusted goblet.",
      fr: "An amethyst encrusted goblet.",
      tk: "An amethyst encrusted goblet.",
    },
  },
  "Golden Faction Goblet": {
    image: "assets/factions/golden_faction_goblet.webp",
    description: {
      en: "A golden goblet.",
      pt: "A golden goblet.",
      "zh-CN": "A golden goblet.",
      fr: "A golden goblet.",
      tk: "A golden goblet.",
    },
  },
  "Ruby Faction Goblet": {
    image: "assets/factions/ruby_faction_goblet.webp",
    description: {
      en: "A ruby encrusted goblet.",
      pt: "A ruby encrusted goblet.",
      "zh-CN": "A ruby encrusted goblet.",
      fr: "A ruby encrusted goblet.",
      tk: "A ruby encrusted goblet.",
    },
  },
  "Sunflorian Bunting": {
    image: "assets/factions/sunflorian_victory_bunting.webp",
    description: {
      en: "Colorful flags celebrating the Sunflorian Faction.",
      pt: "Colorful flags celebrating the Sunflorian Faction.",
      "zh-CN": "Colorful flags celebrating the Sunflorian Faction.",
      fr: "Colorful flags celebrating the Sunflorian Faction.",
      tk: "Colorful flags celebrating the Sunflorian Faction.",
    },
  },
  "Nightshade Bunting": {
    image: "assets/factions/nightshade_victory_bunting.webp",
    description: {
      en: "Colorful flags celebrating the Nightshade faction.",
      pt: "Colorful flags celebrating the Nightshade faction.",
      "zh-CN": "Colorful flags celebrating the Nightshade faction.",
      fr: "Colorful flags celebrating the Nightshade faction.",
      tk: "Colorful flags celebrating the Nightshade faction.",
    },
  },
  "Goblin Bunting": {
    image: "assets/factions/goblin_victory_bunting.webp",
    description: {
      en: "Colorful flags celebrating the Goblin faction.",
      pt: "Colorful flags celebrating the Goblin faction.",
      "zh-CN": "Colorful flags celebrating the Goblin faction.",
      fr: "Colorful flags celebrating the Goblin faction.",
      tk: "Colorful flags celebrating the Goblin faction.",
    },
  },
  "Bumpkin Bunting": {
    image: "assets/factions/bumpkin_victory_bunting.webp",
    description: {
      en: "Colorful flags celebrating the Bumpkin faction.",
      pt: "Colorful flags celebrating the Bumpkin faction.",
      "zh-CN": "Colorful flags celebrating the Bumpkin faction.",
      fr: "Colorful flags celebrating the Bumpkin faction.",
      tk: "Colorful flags celebrating the Bumpkin faction.",
    },
  },
  "Sunflorian Candles": {
    image: "assets/factions/sunflorian_candles.webp",
    description: {
      en: "Sunflorian Faction decorative candles.",
      pt: "Sunflorian Faction decorative candles.",
      "zh-CN": "Sunflorian Faction decorative candles.",
      fr: "Sunflorian Faction decorative candles.",
      tk: "Sunflorian Faction decorative candles.",
    },
  },
  "Nightshade Candles": {
    image: "assets/factions/nightshade_candles.webp",
    description: {
      en: "Nightshade Faction decorative candles.",
      pt: "Nightshade Faction decorative candles.",
      "zh-CN": "Nightshade Faction decorative candles.",
      fr: "Nightshade Faction decorative candles.",
      tk: "Nightshade Faction decorative candles.",
    },
  },
  "Goblin Candles": {
    image: "assets/factions/goblin_candles.webp",
    description: {
      en: "Goblin Faction decorative candles.",
      pt: "Goblin Faction decorative candles.",
      "zh-CN": "Goblin Faction decorative candles.",
      fr: "Goblin Faction decorative candles.",
      tk: "Goblin Faction decorative candles.",
    },
  },
  "Bumpkin Candles": {
    image: "assets/factions/bumpkin_candles.webp",
    description: {
      en: "Bumpkin Faction decorative candles.",
      pt: "Bumpkin Faction decorative candles.",
      "zh-CN": "Bumpkin Faction decorative candles.",
      fr: "Bumpkin Faction decorative candles.",
      tk: "Bumpkin Faction decorative candles.",
    },
  },
  "Sunflorian Left Wall Sconce": {
    image: "assets/factions/sunflorian_left_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      pt: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      fr: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      tk: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    },
  },
  "Nightshade Left Wall Sconce": {
    image: "assets/factions/nightshade_left_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      pt: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Nightshade Wall Sconce.",
      fr: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      tk: "Illuminate your living quarters with a Nightshade Wall Sconce.",
    },
  },
  "Goblin Left Wall Sconce": {
    image: "assets/factions/goblin_left_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Goblin Wall Sconce.",
      pt: "Illuminate your living quarters with a Goblin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Goblin Wall Sconce.",
      fr: "Illuminate your living quarters with a Goblin Wall Sconce.",
      tk: "Illuminate your living quarters with a Goblin Wall Sconce.",
    },
  },
  "Bumpkin Left Wall Sconce": {
    image: "assets/factions/bumpkin_left_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      pt: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      fr: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      tk: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    },
  },
  "Sunflorian Right Wall Sconce": {
    image: "assets/factions/sunflorian_right_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      pt: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      fr: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
      tk: "Illuminate your living quarters with a Sunflorian Wall Sconce.",
    },
  },
  "Nightshade Right Wall Sconce": {
    image: "assets/factions/nightshade_right_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      pt: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Nightshade Wall Sconce.",
      fr: "Illuminate your living quarters with a Nightshade Wall Sconce.",
      tk: "Illuminate your living quarters with a Nightshade Wall Sconce.",
    },
  },
  "Goblin Right Wall Sconce": {
    image: "assets/factions/goblin_right_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Goblin Wall Sconce.",
      pt: "Illuminate your living quarters with a Goblin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Goblin Wall Sconce.",
      fr: "Illuminate your living quarters with a Goblin Wall Sconce.",
      tk: "Illuminate your living quarters with a Goblin Wall Sconce.",
    },
  },
  "Bumpkin Right Wall Sconce": {
    image: "assets/factions/bumpkin_right_wall_candle.webp",
    description: {
      en: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      pt: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      "zh-CN": "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      fr: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
      tk: "Illuminate your living quarters with a Bumpkin Wall Sconce.",
    },
  },
  "Gourmet Hourglass": {
    image: "assets/factions/boosts/cooking_boost_full.webp",
    description: {
      en: "Reduces cooking time by 50% for 4 hours.",
      pt: "Reduces cooking time by 50% for 4 hours.",
      "zh-CN": "Reduces cooking time by 50% for 4 hours.",
      fr: "Reduces cooking time by 50% for 4 hours.",
      tk: "Reduces cooking time by 50% for 4 hours.",
    },
  },
  "Harvest Hourglass": {
    image: "assets/factions/boosts/crop_boost_full.webp",
    description: {
      en: "Reduces crop growth time by 25% for 6 hours.",
      pt: "Reduces crop growth time by 25% for 6 hours.",
      "zh-CN": "Reduces crop growth time by 25% for 6 hours.",
      fr: "Reduces crop growth time by 25% for 6 hours.",
      tk: "Reduces crop growth time by 25% for 6 hours.",
    },
  },
  "Timber Hourglass": {
    image: "assets/factions/boosts/wood_boost_full.webp",
    description: {
      en: "Reduces tree recovery time by 25% for 4 hours.",
      pt: "Reduces tree recovery time by 25% for 4 hours.",
      "zh-CN": "Reduces tree recovery time by 25% for 4 hours.",
      fr: "Reduces tree recovery time by 25% for 4 hours.",
      tk: "Reduces tree recovery time by 25% for 4 hours.",
    },
  },
  "Ore Hourglass": {
    image: "assets/factions/boosts/mineral_boost_full.webp",
    description: {
      en: "Reduces mineral replenish cooldown by 50% for 3 hours.",
      pt: "Reduces mineral replenish cooldown by 50% for 3 hours.",
      "zh-CN": "Reduces mineral replenish cooldown by 50% for 3 hours.",
      fr: "Reduces mineral replenish cooldown by 50% for 3 hours.",
      tk: "Reduces mineral replenish cooldown by 50% for 3 hours.",
    },
  },
  "Orchard Hourglass": {
    image: "assets/factions/boosts/fruit_boost_full.webp",
    description: {
      en: "Reduces fruit growth time by 25% for 6 hours.",
      pt: "Reduces fruit growth time by 25% for 6 hours.",
      "zh-CN": "Reduces fruit growth time by 25% for 6 hours.",
      fr: "Reduces fruit growth time by 25% for 6 hours.",
      tk: "Reduces fruit growth time by 25% for 6 hours.",
    },
  },
  "Blossom Hourglass": {
    image: "assets/factions/boosts/flower_boost_full.webp",
    description: {
      en: "Reduces flower growth time by 25% for 4 hours.",
      pt: "Reduces flower growth time by 25% for 4 hours.",
      "zh-CN": "Reduces flower growth time by 25% for 4 hours.",
      fr: "Reduces flower growth time by 25% for 4 hours.",
      tk: "Reduces flower growth time by 25% for 4 hours.",
    },
  },
  "Fisher's Hourglass": {
    image: "assets/factions/boosts/fish_boost_full.webp",
    description: {
      en: "Gives a 50% chance of +1 fish for 4 hours.",
      pt: "Gives a 50% chance of +1 fish for 4 hours.",
      "zh-CN": "Gives a 50% chance of +1 fish for 4 hours.",
      fr: "Gives a 50% chance of +1 fish for 4 hours.",
      tk: "Gives a 50% chance of +1 fish for 4 hours.",
    },
  },
  "Sunflorian Faction Rug": {
    image: "assets/factions/sunflorian_faction_rug.webp",
    description: {
      en: "A magnificent rug made by the talented Sunflorian faction artisans.",
      pt: "A magnificent rug made by the talented Sunflorian faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Sunflorian faction artisans.",
      fr: "A magnificent rug made by the talented Sunflorian faction artisans.",
      tk: "A magnificent rug made by the talented Sunflorian faction artisans.",
    },
  },
  "Nightshade Faction Rug": {
    image: "assets/factions/nightshade_faction_rug.webp",
    description: {
      en: "A magnificent rug made by the talented Nightshade faction artisans.",
      pt: "A magnificent rug made by the talented Nightshade faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Nightshade faction artisans.",
      fr: "A magnificent rug made by the talented Nightshade faction artisans.",
      tk: "A magnificent rug made by the talented Nightshade faction artisans.",
    },
  },
  "Goblin Faction Rug": {
    image: "assets/factions/goblin_faction_rug.webp",
    description: {
      en: "A magnificent rug made by the talented Goblin faction artisans.",
      pt: "A magnificent rug made by the talented Goblin faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Goblin faction artisans.",
      fr: "A magnificent rug made by the talented Goblin faction artisans.",
      tk: "A magnificent rug made by the talented Goblin faction artisans.",
    },
  },
  "Bumpkin Faction Rug": {
    image: "assets/factions/bumpkin_faction_rug.webp",
    description: {
      en: "A magnificent rug made by the talented Bumpkin faction artisans.",
      pt: "A magnificent rug made by the talented Bumpkin faction artisans.",
      "zh-CN":
        "A magnificent rug made by the talented Bumpkin faction artisans.",
      fr: "A magnificent rug made by the talented Bumpkin faction artisans.",
      tk: "A magnificent rug made by the talented Bumpkin faction artisans.",
    },
  },
  "Goblin Gold Champion": {
    image: "public/sfts/goblin_gold_champion.png",
    description: {
      en: "TODO",
      pt: "TODO",
      "zh-CN": "TODO",
      fr: "TODO",
      tk: "TODO",
    },
  },
  "Goblin Silver Champion": {
    image: "public/sfts/goblin_silver_champion.png",
    description: {
      en: "TODO",
      pt: "TODO",
      "zh-CN": "TODO",
      fr: "TODO",
      tk: "TODO",
    },
  },
};

const merged = Object.keys(items).reduce((acc, name) => {
  const openseaDetails = opensea[name as keyof typeof opensea];
  const item = items[name as keyof typeof items];
  if (!openseaDetails) {
    return {
      ...acc,
      [name]: item,
    };
  }

  return {
    ...acc,
    [name]: {
      ...item,
      opensea: {
        description: openseaDetails.description,
        decimals: openseaDetails.decimals,
        attributes: openseaDetails.attributes,
        image: openseaDetails.image,
      },
    },
  };
}, {} as object);
fs.writeFileSync("merged.json", JSON.stringify(merged, null, 2));
