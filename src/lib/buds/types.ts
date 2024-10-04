import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { PlaceableLocation } from "features/game/types/collectibles";

export type Trait<T> = {
  name: T;
  supply: number;
  multiplier?: number;
};

export type TraitGroup =
  | "types"
  | "colours"
  | "stems"
  | "auras"
  | "ears"
  | "backgrounds";

export type TypeTrait =
  | "Plaza"
  | "Woodlands"
  | "Cave"
  | "Sea"
  | "Castle"
  | "Port"
  | "Retreat"
  | "Saphiro"
  | "Snow"
  | "Beach";

export const types: Trait<TypeTrait>[] = [
  { name: "Plaza", supply: 500 },
  { name: "Woodlands", supply: 500 },
  { name: "Cave", supply: 500 },
  { name: "Sea", supply: 500 },
  { name: "Castle", supply: 500 },
  { name: "Port", supply: 500 },
  { name: "Retreat", supply: 500 },
  { name: "Saphiro", supply: 500 },
  { name: "Snow", supply: 500 },
  { name: "Beach", supply: 500 },
];

type EarTrait = "Ears" | "No Ears";

export const ears: Trait<EarTrait>[] = [
  { name: "Ears", supply: 2500 },
  { name: "No Ears", supply: 2500 },
];

export type AuraTrait = "No Aura" | "Basic" | "Green" | "Rare" | "Mythical";

export const auras: Trait<AuraTrait>[] = [
  // No Aura = 2500 Buds
  { name: "No Aura", multiplier: 0, supply: 2500 },
  { name: "Basic", multiplier: 1, supply: 1750 },
  { name: "Green", multiplier: 1, supply: 500 },
  { name: "Rare", multiplier: 2, supply: 200 },
  { name: "Mythical", multiplier: 5, supply: 50 },
];

export type StemTrait =
  | "3 Leaf Clover"
  | "Fish Hat"
  | "Diamond Gem"
  | "Gold Gem"
  | "Miner Hat"
  | "Carrot Head"
  | "Basic Leaf"
  | "Sunflower Hat"
  | "Ruby Gem"
  | "Mushroom"
  | "Magic Mushroom"
  | "Acorn Hat"
  | "Banana"
  | "Tree Hat"
  | "Egg Head"
  | "Apple Head"
  | "Axe Head"
  | "Sunshield Foliage"
  | "Sunflower Headband"
  | "Seashell"
  | "Tender Coral"
  | "Red Bow"
  | "Hibiscus"
  | "Rainbow Horn"
  | "Silver Horn";

export const stems: Trait<StemTrait>[] = [
  { name: "3 Leaf Clover", supply: 50 },
  { name: "Fish Hat", supply: 50 },
  { name: "Diamond Gem", supply: 100 },
  { name: "Gold Gem", supply: 100 },
  { name: "Miner Hat", supply: 100 },
  { name: "Carrot Head", supply: 100 },
  { name: "Basic Leaf", supply: 100 },
  { name: "Sunflower Hat", supply: 100 },
  { name: "Ruby Gem", supply: 100 },
  { name: "Mushroom", supply: 100 },
  { name: "Magic Mushroom", supply: 100 },
  { name: "Acorn Hat", supply: 150 },
  { name: "Banana", supply: 200 },
  { name: "Tree Hat", supply: 200 },
  { name: "Egg Head", supply: 200 },
  { name: "Apple Head", supply: 200 },
  { name: "Axe Head", supply: 300 },
  { name: "Sunshield Foliage", supply: 300 },
  { name: "Sunflower Headband", supply: 350 },
  { name: "Seashell", supply: 350 },
  { name: "Tender Coral", supply: 350 },
  { name: "Red Bow", supply: 350 },
  { name: "Hibiscus", supply: 350 },
  { name: "Rainbow Horn", supply: 350 },
  { name: "Silver Horn", supply: 350 },
];

type ColorTrait = PaletteColor | "Rainbow";

export const colours: Trait<ColorTrait>[] = [
  { name: "Beige", supply: 500 },
  { name: "Green", supply: 500 },
  { name: "Silver", supply: 500 },
  { name: "Stone", supply: 500 },
  { name: "Brown", supply: 500 },
  { name: "Orange", supply: 500 },
  { name: "Red", supply: 500 },
  { name: "Purple", supply: 500 },
  { name: "Blue", supply: 500 },
  { name: "Gold", supply: 350 },
  { name: "Diamond", supply: 120 },
  { name: "Rainbow", supply: 30 },
];

export type PaletteColor =
  | "Default"
  | "Beige"
  | "Green"
  | "Silver"
  | "Stone"
  | "Brown"
  | "Orange"
  | "Red"
  | "Purple"
  | "Blue"
  | "Gold"
  | "Diamond";

type Palette = {
  primary: string;
  secondary: string;
  lightShadow: string;
  darkShadow: string;
  highlight?: string;
};

export const RAINBOW_COLORS: PaletteColor[] = [
  "Silver",
  "Silver",
  "Silver",
  "Stone",
  "Stone",
  "Stone",
  "Beige",
  "Beige",
  "Beige",
  "Brown",
  "Brown",
  "Brown",
  "Orange",
  "Orange",
  "Orange",
  "Red",
  "Red",
  "Red",
  "Purple",
  "Purple",
  "Purple",
  "Green",
  "Green",
  "Green",
  "Blue",
  "Blue",
  "Blue",
];

export const COLOR_PALETTES: Record<PaletteColor, Palette> = {
  Default: {
    primary: "#e4a672",
    secondary: "#ead4aa",
    lightShadow: "#d77643",
    darkShadow: "#be4a2f",
    highlight: "#fffae0",
  },
  Beige: {
    primary: "#e4a672",
    secondary: "#ead4aa",
    lightShadow: "#d77643",
    darkShadow: "#be4a2f",
  },
  Green: {
    primary: "#3e8948",
    secondary: "#63c74d",
    lightShadow: "#265c42",
    darkShadow: "#193c3e",
  },
  Silver: {
    primary: "#c0cbdc",
    secondary: "#ffffff",
    lightShadow: "#8b9bb4",
    darkShadow: "#5a6988",
  },
  Stone: {
    primary: "#8b9bb4",
    secondary: "#c0cbdc",
    lightShadow: "#5a6988",
    darkShadow: "#3a4466",
  },
  Brown: {
    primary: "#b86f50",
    secondary: "#e4a672",
    lightShadow: "#743f39",
    darkShadow: "#3f2832",
  },
  Orange: {
    primary: "#f77622",
    secondary: "#feae34",
    lightShadow: "#be4a2f",
    darkShadow: "#733e39",
  },
  Red: {
    primary: "#e43b44",
    secondary: "#f6757a",
    lightShadow: "#a22633",
    darkShadow: "#791f29",
  },
  Purple: {
    primary: "#b55088",
    secondary: "#f6757a",
    lightShadow: "#68386c",
    darkShadow: "#3e2731",
  },
  Blue: {
    primary: "#0d62a4",
    secondary: "#0baaec",
    lightShadow: "#1b4973",
    darkShadow: "#243655",
  },
  Gold: {
    primary: "#fbaa20",
    secondary: "#fee761",
    lightShadow: "#f77622",
    darkShadow: "#be4a2f",
    highlight: "#fffae0",
  },
  Diamond: {
    primary: "#49c5ce",
    secondary: "#7ce7ef",
    lightShadow: "#0095e9",
    darkShadow: "#0d62a4",
    highlight: "#e4fdff",
  },
};

export type Bud = {
  type: TypeTrait;
  colour: ColorTrait;
  stem: StemTrait;
  aura: AuraTrait;
  ears: EarTrait;
  coordinates?: Coordinates;
  location?: PlaceableLocation;
};
