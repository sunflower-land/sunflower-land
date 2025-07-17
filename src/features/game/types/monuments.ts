import Decimal from "decimal.js-light";
import { Decoration } from "./decorations";

type LoveCharmMonumentName =
  | "Farmer's Monument"
  | "Miner's Monument"
  | "Woodcutter's Monument";

type MegastoreMonumentName = "Teamwork Monument";

export type LandscapingMonumentName =
  | LoveCharmMonumentName
  | "Big Orange"
  | "Big Apple"
  | "Big Banana"
  | "Basic Cooking Pot"
  | "Expert Cooking Pot"
  | "Advanced Cooking Pot";

type LoveCharmMonument = Omit<Decoration, "name"> & {
  name: LoveCharmMonumentName;
};

type MegastoreMonument = Omit<Decoration, "name"> & {
  name: MegastoreMonumentName;
};

export type LandscapingMonument = Omit<Decoration, "name"> & {
  name: LandscapingMonumentName;
};

export type Monument =
  | LoveCharmMonument
  | LandscapingMonument
  | MegastoreMonument;

export const MEGASTORE_MONUMENTS: Record<
  MegastoreMonumentName,
  MegastoreMonument
> = {
  "Teamwork Monument": {
    name: "Teamwork Monument",
    description: "",
    coins: 0,
    ingredients: {},
  },
};

export const LOVE_CHARM_MONUMENTS: Record<
  LoveCharmMonumentName,
  LoveCharmMonument
> = {
  "Farmer's Monument": {
    name: "Farmer's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(100),
    },
  },
  "Woodcutter's Monument": {
    name: "Woodcutter's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(200),
    },
  },
  "Miner's Monument": {
    name: "Miner's Monument",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(300),
    },
  },
};

export const LANDSCAPING_MONUMENTS: Record<
  LandscapingMonumentName,
  LandscapingMonument
> = {
  ...LOVE_CHARM_MONUMENTS,
  "Big Orange": {
    name: "Big Orange",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(100),
    },
  },
  "Big Apple": {
    name: "Big Apple",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(200),
    },
  },
  "Big Banana": {
    name: "Big Banana",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(300),
    },
  },
  "Basic Cooking Pot": {
    name: "Basic Cooking Pot",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(10),
    },
  },
  "Expert Cooking Pot": {
    name: "Expert Cooking Pot",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(50),
    },
  },
  "Advanced Cooking Pot": {
    name: "Advanced Cooking Pot",
    description: "",
    coins: 0,
    ingredients: {
      Gem: new Decimal(100),
    },
  },
};

export type MonumentName =
  | LandscapingMonumentName
  | LoveCharmMonumentName
  | MegastoreMonumentName;
