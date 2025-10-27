import { PetNFTType } from "features/game/types/pets";

export type Trait<T> = {
  name: T;
  supply: number;
  multiplier?: number;
};

export type TraitGroup =
  | "types"
  | "fur_patterns"
  | "accessory_patterns"
  | "bibs"
  | "aura"
  | "backgrounds";

export const types: Trait<PetNFTType>[] = [
  { name: "Dragon", supply: 300 },
  { name: "Phoenix", supply: 450 },
  { name: "Griffin", supply: 450 },
  { name: "Ram", supply: 450 },
  { name: "Warthog", supply: 450 },
  { name: "Wolf", supply: 450 },
  { name: "Bear", supply: 450 },
];

export const COLOR_TRAITS_BY_TYPE = {
  Dragon: [
    "DragonColor1",
    "DragonColor2",
    "DragonColor3",
    "DragonColor4",
    "DragonColor5",
    "DragonColor6",
    "DragonColor7",
    "DragonColor8",
    "DragonColor9",
    "DragonColor10",
    "DragonColor11",
    "DragonColor12",
    "DragonColor13",
    "DragonColor14",
    "DragonColor15",
  ],
  Phoenix: [
    "PhoenixColor1",
    "PhoenixColor2",
    "PhoenixColor3",
    "PhoenixColor4",
    "PhoenixColor5",
    "PhoenixColor6",
    "PhoenixColor7",
    "PhoenixColor8",
    "PhoenixColor9",
    "PhoenixColor10",
    "PhoenixColor11",
    "PhoenixColor12",
    "PhoenixColor13",
    "PhoenixColor14",
    "PhoenixColor15",
  ],
  Griffin: [
    "GriffinColor1",
    "GriffinColor2",
    "GriffinColor3",
    "GriffinColor4",
    "GriffinColor5",
    "GriffinColor6",
    "GriffinColor7",
    "GriffinColor8",
    "GriffinColor9",
    "GriffinColor10",
    "GriffinColor11",
    "GriffinColor12",
    "GriffinColor13",
    "GriffinColor14",
    "GriffinColor15",
  ],
  Ram: [
    "RamColor1",
    "RamColor2",
    "RamColor3",
    "RamColor4",
    "RamColor5",
    "RamColor6",
    "RamColor7",
    "RamColor8",
    "RamColor9",
    "RamColor10",
    "RamColor11",
    "RamColor12",
    "RamColor13",
    "RamColor14",
    "RamColor15",
  ],
  Warthog: [
    "WarthogColor1",
    "WarthogColor2",
    "WarthogColor3",
    "WarthogColor4",
    "WarthogColor5",
    "WarthogColor6",
    "WarthogColor7",
    "WarthogColor8",
    "WarthogColor9",
    "WarthogColor10",
    "WarthogColor11",
    "WarthogColor12",
    "WarthogColor13",
    "WarthogColor14",
    "WarthogColor15",
  ],
  Wolf: [
    "WolfColor1",
    "WolfColor2",
    "WolfColor3",
    "WolfColor4",
    "WolfColor5",
    "WolfColor6",
    "WolfColor7",
    "WolfColor8",
    "WolfColor9",
    "WolfColor10",
    "WolfColor11",
    "WolfColor12",
    "WolfColor13",
    "WolfColor14",
    "WolfColor15",
  ],
  Bear: [
    "BearColor1",
    "BearColor2",
    "BearColor3",
    "BearColor4",
    "BearColor5",
    "BearColor6",
    "BearColor7",
    "BearColor8",
    "BearColor9",
    "BearColor10",
    "BearColor11",
    "BearColor12",
    "BearColor13",
    "BearColor14",
    "BearColor15",
  ],
} as const;

export const ACCESSORY_TRAITS_BY_TYPE = {
  Dragon: [
    "DragonAccessory1",
    "DragonAccessory2",
    "DragonAccessory3",
    "DragonAccessory4",
    "DragonAccessory5",
    "DragonAccessory6",
    "DragonAccessory7",
    "DragonAccessory8",
    "DragonAccessory9",
    "DragonAccessory10",
  ],
  Phoenix: [
    "PhoenixAccessory1",
    "PhoenixAccessory2",
    "PhoenixAccessory3",
    "PhoenixAccessory4",
    "PhoenixAccessory5",
    "PhoenixAccessory6",
    "PhoenixAccessory7",
    "PhoenixAccessory8",
    "PhoenixAccessory9",
    "PhoenixAccessory10",
  ],
  Griffin: [
    "GriffinAccessory1",
    "GriffinAccessory2",
    "GriffinAccessory3",
    "GriffinAccessory4",
    "GriffinAccessory5",
    "GriffinAccessory6",
    "GriffinAccessory7",
    "GriffinAccessory8",
    "GriffinAccessory9",
    "GriffinAccessory10",
  ],
  Ram: [
    "RamAccessory1",
    "RamAccessory2",
    "RamAccessory3",
    "RamAccessory4",
    "RamAccessory5",
    "RamAccessory6",
    "RamAccessory7",
    "RamAccessory8",
    "RamAccessory9",
    "RamAccessory10",
  ],
  Warthog: [
    "WarthogAccessory1",
    "WarthogAccessory2",
    "WarthogAccessory3",
    "WarthogAccessory4",
    "WarthogAccessory5",
    "WarthogAccessory6",
    "WarthogAccessory7",
    "WarthogAccessory8",
    "WarthogAccessory9",
    "WarthogAccessory10",
  ],
  Wolf: [
    "WolfAccessory1",
    "WolfAccessory2",
    "WolfAccessory3",
    "WolfAccessory4",
    "WolfAccessory5",
    "WolfAccessory6",
    "WolfAccessory7",
    "WolfAccessory8",
    "WolfAccessory9",
    "WolfAccessory10",
  ],
  Bear: [
    "BearAccessory1",
    "BearAccessory2",
    "BearAccessory3",
    "BearAccessory4",
    "BearAccessory5",
    "BearAccessory6",
    "BearAccessory7",
    "BearAccessory8",
    "BearAccessory9",
    "BearAccessory10",
  ],
} as const;

export const BIB_TRAITS = ["Basic Bib", "Mid Bib", "Great Bib"] as const;

export type FurTraitsByType = typeof COLOR_TRAITS_BY_TYPE;
export type FurTrait = FurTraitsByType[keyof FurTraitsByType][number];

export type AccessoryTraitsByType = typeof ACCESSORY_TRAITS_BY_TYPE;
export type AccessoryTrait =
  AccessoryTraitsByType[keyof AccessoryTraitsByType][number];

export type BibTrait = (typeof BIB_TRAITS)[number];

export type AuraTrait = "No Aura" | "Basic Aura" | "Epic Aura" | "Mega Aura";

export type PetTraits = {
  type: PetNFTType;
  fur: FurTrait;
  accessory: AccessoryTrait;
  bib: BibTrait;
  aura: AuraTrait;
};
