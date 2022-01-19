import stone from "assets/resources/stone.png";
import wood from "assets/resources/wood.png";
import egg from "assets/resources/egg.png";
import iron from "assets/resources/iron_ore.png";
import gold from "assets/resources/gold_ore.png";

import { ItemDetails } from "./items";

export type ResourceName = "Wood" | "Stone" | "Iron" | "Gold" | "Egg";

export const RESOURCES: Record<ResourceName, ItemDetails> = {
  Wood: {
    image: wood,
    description: "Used to craft items",
  },
  Stone: {
    image: stone,
    description: "Used to craft items",
  },
  Iron: {
    image: iron,
    description: "Used to craft items",
  },
  Gold: {
    image: gold,
    description: "Used to craft items",
  },
  Egg: {
    image: egg,
    description: "Used to craft items",
  },
};
