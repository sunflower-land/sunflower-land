import pickaxe from "../images/ui/pickaxe.png";
import axe from "../images/ui/axe.png";
import wood from "../images/ui/wood.png";
import stone from "../images/ui/rock.png";
import coin from "../images/ui/sunflower_coin.png";

export interface Ingredient {
  name: "Wood" | "Stone" | "$SFF";
  image: any;
  amount: number;
}

export interface Recipe extends Item {
  ingredients: Ingredient[];
}

export interface Item {
  name: "Axe" | "Pickaxe" | "Stone" | "Wood";
  description: string;
  address: string;
  image: any;
  type: "ERC20" | "NFT";
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
    address: "TODO",
    ingredients: [
      {
        name: "Wood",
        amount: 5,
        image: wood,
      },
      {
        name: "$SFF",
        amount: 5,
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
    address: "TODO",
  },
  {
    name: "Wood",
    description: "A bountiful resource in Sunflower Land used for crafting",
    image: wood,
    type: "ERC20",
    address: "TODO",
  },
];
