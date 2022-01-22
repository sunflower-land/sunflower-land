import { CROPS } from "features/crops/lib/crops";

import { NFTs, TOOLS } from "features/blacksmith/lib/craftables";

import { InventoryItemName } from "./types";
import { RESOURCES } from "./resources";

export type ItemDetails = {
  image: any;
  description: string;
};

type Items = Record<InventoryItemName, ItemDetails>;

export const ITEM_DETAILS: Items = {
  Sunflower: {
    image: CROPS.Sunflower.images.shop,
    description: CROPS.Sunflower.description,
  },
  Potato: {
    image: CROPS.Potato.images.shop,
    description: CROPS.Potato.description,
  },
  Pumpkin: {
    image: CROPS.Pumpkin.images.shop,
    description: CROPS.Potato.description,
  },
  Carrot: {
    image: CROPS.Carrot.images.shop,
    description: CROPS.Carrot.description,
  },
  Cabbage: {
    image: CROPS.Cabbage.images.shop,
    description: CROPS.Cabbage.description,
  },
  Beetroot: {
    image: CROPS.Beetroot.images.shop,
    description: CROPS.Beetroot.description,
  },
  Cauliflower: {
    image: CROPS.Cauliflower.images.shop,
    description: CROPS.Cauliflower.description,
  },
  Parsnip: {
    image: CROPS.Parsnip.images.shop,
    description: CROPS.Parsnip.description,
  },
  Radish: {
    image: CROPS.Radish.images.shop,
    description: CROPS.Radish.description,
  },
  Wheat: {
    image: CROPS.Wheat.images.shop,
    description: CROPS.Wheat.description,
  },

  "Sunflower Seed": {
    image: CROPS.Sunflower.images.seed,
    description: "Grows a sunflower",
  },
  "Potato Seed": {
    image: CROPS.Potato.images.seed,
    description: "Grows a potato",
  },
  "Pumpkin Seed": {
    image: CROPS.Pumpkin.images.seed,
    description: "Grows a pumpkin",
  },
  "Carrot Seed": {
    image: CROPS.Carrot.images.seed,
    description: "Grows a carrot",
  },
  "Cabbage Seed": {
    image: CROPS.Cabbage.images.seed,
    description: "Grows a cabbage",
  },
  "Beetroot Seed": {
    image: CROPS.Beetroot.images.seed,
    description: "Grows a beetroot",
  },
  "Cauliflower Seed": {
    image: CROPS.Cauliflower.images.seed,
    description: "Grows a cauliflower",
  },
  "Parsnip Seed": {
    image: CROPS.Parsnip.images.seed,
    description: "Grows a parsnip",
  },
  "Radish Seed": {
    image: CROPS.Radish.images.seed,
    description: "Grows a radish",
  },
  "Wheat Seed": {
    image: CROPS.Wheat.images.seed,
    description: "Grows a wheat",
  },

  ...RESOURCES,

  // TODO add tools
  ...TOOLS,

  // TODO add NFTs
  ...NFTs,
};
