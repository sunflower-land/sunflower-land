import { Coordinates } from "../expansion/components/MapPlacement";
import { BuildingName } from "./buildings";
import { CollectibleLocation } from "./collectibles";
import { CollectibleName } from "./craftables";
import { InventoryItemName } from "./game";

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

type EarTrait = "Ears" | "No Ears";

export type AuraTrait = "No Aura" | "Basic" | "Green" | "Rare" | "Mythical";

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

type ColorTrait = PaletteColor | "Rainbow";

export type Bud = {
  type: TypeTrait;
  colour: ColorTrait;
  stem: StemTrait;
  aura: AuraTrait;
  ears: EarTrait;
  coordinates?: Coordinates;
  location?: CollectibleLocation;
};

export type BudName = `Bud-${number}`;

export function isBudName(
  name:
    | InventoryItemName
    | BudName
    | "Chicken"
    | BuildingName
    | CollectibleName
    | undefined,
): name is BudName {
  if (!name) return false;

  return name.startsWith(`Bud-`);
}
