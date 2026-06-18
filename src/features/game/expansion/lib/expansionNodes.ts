import type { ResourceName } from "features/game/types/resources";

export type Nodes = Record<
  Exclude<
    ResourceName,
    | "Ancient Tree"
    | "Sacred Tree"
    | "Refined Iron Rock"
    | "Tempered Iron Rock"
    | "Pure Gold Rock"
    | "Prime Gold Rock"
    | "Fused Stone Rock"
    | "Reinforced Stone Rock"
    | "Boulder"
  >,
  number
>;

export function isNode(value: string): value is keyof Nodes {
  const nodeTypes: Array<keyof Nodes> = [
    "Crop Plot",
    "Tree",
    "Stone Rock",
    "Iron Rock",
    "Gold Rock",
    "Crimstone Rock",
    "Sunstone Rock",
    "Fruit Patch",
    "Flower Bed",
    "Beehive",
    "Oil Reserve",
    "Lava Pit",
  ];

  return nodeTypes.includes(value as keyof Nodes);
}
