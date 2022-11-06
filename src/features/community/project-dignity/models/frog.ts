export const FROG_RARITIES: FrogRarities = {
  common: { weight: 0, name: "Common", visibleFrogs: 3, color: "#ffffff" },
  uncommon: { weight: 1, name: "Uncommon", visibleFrogs: 4, color: "#1eff00" },
  rare: { weight: 2, name: "Rare", visibleFrogs: 5, color: "#0070dd" },
  epic: { weight: 3, name: "Epic", visibleFrogs: 6, color: "#a335ee" },
  legendary: {
    weight: 4,
    name: "Legendary",
    visibleFrogs: 7,
    color: "#ff8000",
  },
};

export const FROG_SIZE = 32;

export interface Frog {
  name: string;
  pixel_image: string;
  attributes: FrogAttribute[];
  rarity: FrogRarity;
  [key: string]: any;
}

interface FrogAttribute {
  trait_type: string;
  value: string;
  rarity?: string;
}

interface FrogRarities {
  common: FrogRarity;
  uncommon: FrogRarity;
  rare: FrogRarity;
  epic: FrogRarity;
  legendary: FrogRarity;
}

interface FrogRarity {
  weight: number;
  name: string;
  visibleFrogs: number;
  color: string;
}
