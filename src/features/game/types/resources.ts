export type ResourceName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Egg"
  | "Chicken";

export type Resource = {
  description: string;
  experience: number;
};
export const RESOURCES: Record<ResourceName, Resource> = {
  Wood: {
    description: "Used to craft items",
    experience: 0.02,
  },
  Stone: {
    description: "Used to craft items",
    experience: 0.05,
  },
  Iron: {
    description: "Used to craft items",
    experience: 2,
  },
  Gold: {
    description: "Used to craft items",
    experience: 5,
  },
  Egg: {
    description: "Used to craft items",
    experience: 0,
  },
  Chicken: {
    description: "Used to lay eggs",
    experience: 0,
  },
};
