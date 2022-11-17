export type ResourceName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Diamond"
  | "Egg"
  | "Honey"
  | "Chicken"
  | "Wild Mushroom"
  | "Magic Mushroom";

export type Resource = {
  description: string;
};
export const RESOURCES: Record<ResourceName, Resource> = {
  Wood: {
    description: "Used to craft items",
  },
  Stone: {
    description: "Used to craft items",
  },
  Iron: {
    description: "Used to craft items",
  },
  Gold: {
    description: "Used to craft items",
  },
  Diamond: {
    description: "Used to craft items",
  },
  Egg: {
    description: "Used to craft items",
  },
  Chicken: {
    description: "Used to lay eggs",
  },
  Honey: {
    description: "Used to sweeten your cooking",
  },
  "Wild Mushroom": {
    description: "Used to cook basic recipes",
  },
  "Magic Mushroom": {
    description: "Used to cook advanced recipes",
  },
};
