import pickaxe from "../images/ui/pickaxe.png";
import axe from "../images/ui/axe.png";
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
    | "Pickaxe"
    | "Stone"
    | "Wood"
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
    name: "Pickaxe",
    description: "Used for mining and collecting stone",
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
