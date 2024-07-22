import { InventoryItemName } from "./game";

export const DESERT_GRID_HEIGHT = 10;
export const DESERT_GRID_WIDTH = 10;

type FormationPlot = { x: number; y: number; name: InventoryItemName };

export type DiggingFormation = FormationPlot[];

export const DIGGING_FORMATIONS = {
  // Horizontal Zig Zag - X Coins
  MONDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 0, y: -1, name: "Camel Bone" },
    { x: 1, y: -1, name: "Scarab" },
  ],
  // Upside T - X Coins
  TUESDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Scarab" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
    { x: 1, y: 2, name: "Camel Bone" },
  ],

  // Star - X Coins
  WEDNESDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 1, y: -1, name: "Camel Bone" },
    { x: 1, y: 0, name: "Scarab" },
  ],

  // Square - X Coins
  THURSDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 0, y: -1, name: "Camel Bone" },
    { x: 1, y: -1, name: "Scarab" },
  ],

  // Horizontal - X Coins
  FRIDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 3, y: 0, name: "Scarab" },
  ],

  // U Shape - X Coins
  SATURDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 0, y: -1, name: "Camel Bone" },
    { x: 1, y: 0, name: "Scarab" },
    { x: 1, y: -1, name: "Camel Bone" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 2, y: -1, name: "Camel Bone" },
  ],

  // Horizontal - X Coins
  SUNDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 0, y: -1, name: "Camel Bone" },
    { x: 0, y: -2, name: "Scarab" },
    { x: 0, y: -3, name: "Camel Bone" },
  ],

  // Small L - X Coins
  HIEROGLYPH: [
    { x: 0, y: 0, name: "Vase" },
    { x: 1, y: 0, name: "Vase" },
    { x: 0, y: 1, name: "Hieroglyph" },
  ],

  // Square - X Coins
  OLD_BOTTLE: [
    { x: 0, y: 0, name: "Old Bottle" },
    { x: 1, y: 0, name: "Old Bottle" },
    { x: 0, y: 1, name: "Old Bottle" },
    { x: 1, y: 1, name: "Old Bottle" },
  ],

  // Diagonal - X Coins
  COCKLE: [
    { x: 0, y: 0, name: "Cockle Shell" },
    { x: 1, y: 1, name: "Cockle Shell" },
    { x: 2, y: 2, name: "Cockle Shell" },
  ],

  // Horizontal - X Coins
  WOODEN_COMPASS: [
    { x: 0, y: 0, name: "Wood" },
    { x: 1, y: 0, name: "Wooden Compass" },
    { x: 2, y: 0, name: "Wood" },
  ],

  SEA_CUCUMBERS: [
    { x: 0, y: 0, name: "Sea Cucumber" },
    { x: 1, y: 0, name: "Sea Cucumber" },
    { x: 2, y: 0, name: "Sea Cucumber" },
    { x: 3, y: 0, name: "Pipi" },
  ],

  SEAWEED: [
    { x: 0, y: 0, name: "Seaweed" },
    { x: 1, y: 0, name: "Seaweed" },
    { x: 2, y: 0, name: "Seaweed" },
    { x: 2, y: 1, name: "Starfish" },
  ],

  CLAM_SHELLS: [
    { x: 0, y: 0, name: "Clam Shell" },
    { x: 1, y: 0, name: "Clam Shell" },
    { x: 0, y: -1, name: "Clam Shell" },
    { x: 1, y: -1, name: "Clam Shell" },
  ],

  CORAL: [{ x: 0, y: 0, name: "Coral" }],
  PEARL: [{ x: 0, y: 0, name: "Pearl" }],
  PIRATE_BOUNTY: [{ x: 0, y: 0, name: "Pirate Bounty" }],
} satisfies Record<string, DiggingFormation>;

export const DAILY_ARTEFACT: Record<number, DiggingFormationName> = {
  0: "SUNDAY_ARTEFACT_FORMATION",
  1: "MONDAY_ARTEFACT_FORMATION",
  2: "TUESDAY_ARTEFACT_FORMATION",
  3: "WEDNESDAY_ARTEFACT_FORMATION",
  4: "THURSDAY_ARTEFACT_FORMATION",
  5: "FRIDAY_ARTEFACT_FORMATION",
  6: "SATURDAY_ARTEFACT_FORMATION",
};

export type DiggingFormationName = keyof typeof DIGGING_FORMATIONS;

export type DiggingGrid = InventoryItemName[][];
