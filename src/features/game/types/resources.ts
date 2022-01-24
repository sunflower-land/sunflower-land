export type ResourceName = "Wood" | "Stone" | "Iron" | "Gold" | "Egg";

export type Resource = {
  id: number;
  description: string;
};
export const RESOURCES: Record<ResourceName, Resource> = {
  Wood: {
    description: "Used to craft items",
    id: 301,
  },
  Stone: {
    description: "Used to craft items",
    id: 302,
  },
  Iron: {
    description: "Used to craft items",
    id: 303,
  },
  Gold: {
    description: "Used to craft items",
    id: 304,
  },
  Egg: {
    description: "Used to craft items",
    id: 305,
  },
};
