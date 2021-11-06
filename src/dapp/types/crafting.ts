import pickaxe from "../images/ui/pickaxe.png";
import woodPickaxe from "../images/ui/wood_pickaxe.png";
import axe from "../images/ui/axe.png";
import hammer from "../images/ui/hammer.png";
import rod from "../images/ui/rod.png";
import sword from "../images/ui/sword.png";
import wood from "../images/ui/wood.png";
import stone from "../images/ui/rock.png";
import chickenCoop from "../images/ui/chicken_coop.png";
import coin from "../images/ui/sunflower_coin.png";
import statue from "../images/ui/sunflower_statue.png";

export interface Ingredient {
  name: "Wood" | "Stone" | "$SFF";
  image: any;
  amount: number;
}

export interface Recipe extends Item {
  ingredients: Ingredient[];
}

export interface Item {
  name:
    | "Axe"
    | "Wood pickaxe"
    | "Stone Pickaxe"
    | "Fishing rod"
    | "Hammer"
    | "Stone"
    | "Wood"
    | "Sword"
    | "Chicken coop"
    | "Sunflower Statue";
  description: string;
  address: string;
  image: any;
  type: "ERC20" | "NFT";
  isLocked?: boolean;
}

export const recipes: Recipe[] = [
  {
    name: "Axe",
    description: "Used for cutting and collecting wood",
    image: axe,
    type: "ERC20",
    address: "0xf7B363F60f4Fed06049F6B469e6506a231AB274A",
    ingredients: [
      {
        name: "$SFF",
        amount: 5,
        image: coin,
      },
    ],
  },
  {
    name: "Wood pickaxe",
    description: "Used for mining and collecting stone",
    image: woodPickaxe,
    type: "ERC20",
    address: "TODO",
    ingredients: [
      {
        name: "Wood",
        amount: 2,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Stone Pickaxe",
    description: "Used for mining and collecting ore",
    image: pickaxe,
    type: "ERC20",
    address: "0x7d55828BbA54feA2fcd8d9E4D9330c8CBb5Fa079",
    ingredients: [
      {
        name: "Wood",
        amount: 2,
        image: wood,
      },
      {
        name: "Stone",
        amount: 2,
        image: stone,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Hammer",
    description: "Used for building barns, coops & other structures",
    image: hammer,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Fishing rod",
    description: "Used for fishing and gathering fish",
    image: rod,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Sword",
    description: "Used for fighting monsters and collecting rewards",
    image: sword,
    type: "ERC20",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Chicken coop",
    description: "A unique coop that produces chickens & eggs",
    image: chickenCoop,
    type: "NFT",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Wood",
        amount: 100,
        image: wood,
      },
      {
        name: "Stone",
        amount: 50,
        image: stone,
      },
      {
        name: "$SFF",
        amount: 100,
        image: coin,
      },
    ],
  },
  {
    name: "Sunflower Statue",
    description: "A symbol of the holy token",
    image: statue,
    type: "NFT",
    address: "TODO",
    isLocked: true,
    ingredients: [
      {
        name: "Stone",
        amount: 500,
        image: stone,
      },
      {
        name: "$SFF",
        amount: 1000,
        image: coin,
      },
    ],
  },
];

export const items: Item[] = [
  ...recipes,
  {
    name: "Stone",
    description: "A natural resource in Sunflower Land used for crafting",
    image: stone,
    type: "ERC20",
    address: "0x2B17CD53EaeaDcb4377e3a99BE478669e49f5F19",
  },
  {
    name: "Wood",
    description: "A bountiful resource in Sunflower Land used for crafting",
    image: wood,
    type: "ERC20",
    address: "0xb655186C7dbA1A2EFCd9949Bbfb95A49E6aF9407",
  },
];

export interface Inventory {
  axe: number;
  pickaxe: number;
  wood: number;
  stone: number;
}
