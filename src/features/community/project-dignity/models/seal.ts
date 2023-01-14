export const SEAL_RARITIES: SealRarities = {
  common: { weight: 0, name: "Common", visibleSeals: 3, color: "#ffffff" },
  uncommon: { weight: 1, name: "Uncommon", visibleSeals: 6, color: "#1eff00" },
  rare: { weight: 2, name: "Rare", visibleSeals: 9, color: "#0070dd" },
  epic: { weight: 3, name: "Epic", visibleSeals: 12, color: "#a335ee" },
  legendary: {
    weight: 4,
    name: "Legendary",
    visibleSeals: 15,
    color: "#ff8000",
  },
  mythic: {
    weight: 5,
    name: "Mythic",
    visibleSeals: 18,
    color: "#9500ff",
  },
};

export const SEAL_SIZE = 64;

export interface Seal {
  name: string;
  pixel_image: string;
  attributes: SealAttribute[];
  rarity: SealRarity;
  [key: string]: any;
}

interface SealAttribute {
  trait_type: string;
  value: string;
  rarity?: string;
}

interface SealRarities {
  common: SealRarity;
  uncommon: SealRarity;
  rare: SealRarity;
  epic: SealRarity;
  legendary: SealRarity;
  mythic: SealRarity;
}

interface SealRarity {
  weight: number;
  name: string;
  visibleSeals: number;
  color: string;
}
