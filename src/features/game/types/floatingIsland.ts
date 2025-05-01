import { BumpkinItem } from "./bumpkin";
import { GameState, InventoryItemName } from "./game";

export function getActiveFloatingIsland({ state }: { state: GameState }) {
  const schedule = state.floatingIsland.schedule;
  const now = Date.now();
  return schedule.find(
    (schedule) => now >= schedule.startAt && now <= schedule.endAt,
  );
}

type FloatingShopBase = {
  cost: { items: Partial<Record<InventoryItemName, number>> };
  type: "wearable" | "collectible";
};

export type FloatingShopCollectibleName = Extract<
  InventoryItemName,
  | "Bronze Love Box"
  | "Silver Love Box"
  | "Time Warp Totem"
  | "Super Totem"
  | "Gourmet Hourglass"
  | "Harvest Hourglass"
  | "Fisher's Hourglass"
  | "Cetus"
  | "Streamer's Statue"
  | "Mermaid Fountain"
  | "Heartstruck Tree"
  | "Flower Coin"
  | "Floral Arch"
  | "Flower Statue"
  | "Mysterious Entrance"
  | "Goldcrest Mosaic Rug"
  | "Sandy Mosaic Rug"
  | "Twilight Rug"
  | "Orchard Rug"
  | "Bronze Tool Box"
  | "Silver Tool Box"
  | "Gold Tool Box"
  | "Bronze Food Box"
  | "Silver Food Box"
  | "Gold Food Box"
  | "Gold Love Box"
>;

export type FloatingShopWearableName = Extract<
  BumpkinItem,
  | "Luvvy Head"
  | "Grumpy Cat"
  | "Dino Onesie"
  | "Golden Wings"
  | "Love Puff Aura"
>;

export type FloatingShopCollectible = {
  name: FloatingShopCollectibleName;
  type: "collectible";
  cost: { items: Partial<Record<InventoryItemName, number>> };
};

export type FloatingShopWearable = {
  name: FloatingShopWearableName;
  type: "wearable";
  cost: { items: Partial<Record<InventoryItemName, number>> };
};

export type FloatingIslandShop = Partial<
  Record<FloatingShopItemName, FloatingShopItem>
>;
export type FloatingShopItem = FloatingShopCollectible | FloatingShopWearable;
export type FloatingShopItemName = InventoryItemName | BumpkinItem;
export const FLOATING_ISLAND_SHOP_ITEMS: Record<
  FloatingShopCollectibleName | FloatingShopWearableName,
  FloatingShopItem
> = {
  "Time Warp Totem": {
    type: "collectible",
    cost: { items: { "Love Charm": 100 } },
    name: "Time Warp Totem",
  },
  "Super Totem": {
    type: "collectible",
    cost: { items: { "Love Charm": 1500 } },
    name: "Super Totem",
  },
  "Gourmet Hourglass": {
    type: "collectible",
    cost: { items: { "Love Charm": 250 } },
    name: "Gourmet Hourglass",
  },
  "Harvest Hourglass": {
    type: "collectible",
    cost: { items: { "Love Charm": 350 } },
    name: "Harvest Hourglass",
  },
  "Fisher's Hourglass": {
    type: "collectible",
    cost: { items: { "Love Charm": 250 } },
    name: "Fisher's Hourglass",
  },
  Cetus: {
    type: "collectible",
    cost: { items: { "Love Charm": 3000 } },
    name: "Cetus",
  },
  "Love Puff Aura": {
    type: "wearable",
    cost: { items: { "Love Charm": 10000 } },
    name: "Love Puff Aura",
  },
  "Streamer's Statue": {
    type: "collectible",
    cost: { items: { "Love Charm": 500 } },
    name: "Streamer's Statue",
  },
  "Mermaid Fountain": {
    type: "collectible",
    cost: { items: { "Love Charm": 1500 } },
    name: "Mermaid Fountain",
  },
  "Heartstruck Tree": {
    type: "collectible",
    cost: { items: { "Love Charm": 500 } },
    name: "Heartstruck Tree",
  },
  "Flower Coin": {
    type: "collectible",
    cost: { items: { "Love Charm": 1500 } },
    name: "Flower Coin",
  },
  "Floral Arch": {
    type: "collectible",
    cost: { items: { "Love Charm": 1500 } },
    name: "Floral Arch",
  },
  "Flower Statue": {
    type: "collectible",
    cost: { items: { "Love Charm": 2000 } },
    name: "Flower Statue",
  },
  "Mysterious Entrance": {
    type: "collectible",
    cost: { items: { "Love Charm": 2500 } },
    name: "Mysterious Entrance",
  },
  "Orchard Rug": {
    type: "collectible",
    cost: { items: { "Love Charm": 500 } },
    name: "Orchard Rug",
  },
  "Goldcrest Mosaic Rug": {
    type: "collectible",
    cost: { items: { "Love Charm": 1500 } },
    name: "Goldcrest Mosaic Rug",
  },
  "Sandy Mosaic Rug": {
    type: "collectible",
    cost: { items: { "Love Charm": 2000 } },
    name: "Sandy Mosaic Rug",
  },
  "Twilight Rug": {
    type: "collectible",
    cost: { items: { "Love Charm": 2500 } },
    name: "Twilight Rug",
  },
  "Bronze Tool Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 50 } },
    name: "Bronze Tool Box",
  },
  "Silver Tool Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 350 } },
    name: "Silver Tool Box",
  },
  "Gold Tool Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 1200 } },
    name: "Gold Tool Box",
  },
  "Bronze Food Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 50 } },
    name: "Bronze Food Box",
  },
  "Silver Food Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 500 } },
    name: "Silver Food Box",
  },
  "Gold Food Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 1000 } },
    name: "Gold Food Box",
  },
  "Bronze Love Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 100 } },
    name: "Bronze Love Box",
  },
  "Silver Love Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 500 } },
    name: "Silver Love Box",
  },
  "Gold Love Box": {
    type: "collectible",
    cost: { items: { "Love Charm": 1000 } },
    name: "Gold Love Box",
  },

  "Luvvy Head": {
    type: "wearable",
    cost: { items: { "Love Charm": 500 } },
    name: "Luvvy Head",
  },
  "Grumpy Cat": {
    type: "wearable",
    cost: { items: { "Love Charm": 1000 } },
    name: "Grumpy Cat",
  },
  "Dino Onesie": {
    type: "wearable",
    cost: { items: { "Love Charm": 2000 } },
    name: "Dino Onesie",
  },
  "Golden Wings": {
    type: "wearable",
    cost: { items: { "Love Charm": 5000 } },
    name: "Golden Wings",
  },
};
