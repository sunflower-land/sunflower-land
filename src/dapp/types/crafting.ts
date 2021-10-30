import pickaxe from "../images/ui/pickaxe.png";
import axe from "../images/ui/axe.png";
import wood from "../images/ui/wood.png";
import coin from "../images/ui/sunflower_coin.png";

export interface Ingredient {
  name: "Wood" | "Stone" | "$SFF";
  image: any;
  amount: number;
}

export interface Recipe {
  name: string;
  description: string;
  image: any;
  type: "ERC20" | "NFT";
  ingredients: Ingredient[];
}

export const recipes: Recipe[] = [
  {
    name: "Axe",
    description: "Used for cutting and collecting wood",
    image: axe,
    type: "ERC20",
    ingredients: [
      {
        name: "$SFF",
        amount: 10,
        image: coin,
      },
    ],
  },
  {
    name: "Pickaxe",
    description: "Used for mining and collecting stone",
    image: pickaxe,
    type: "ERC20",
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
