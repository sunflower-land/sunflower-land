import { getKeys } from "./decorations";
import { GameState, InventoryItemName } from "./game";
import { ChapterName, getCurrentChapter } from "./chapters";
import { BeachBountyChapterArtefact } from "./treasure";

export const DESERT_GRID_HEIGHT = 10;
export const DESERT_GRID_WIDTH = 10;

type FormationPlot = {
  x: number;
  y: number;
  name: InventoryItemName | "Seasonal Artefact";
};

export type DiggingFormation = FormationPlot[];

export const CHAPTER_ARTEFACT: Record<ChapterName, BeachBountyChapterArtefact> =
  {
    "Bull Run": "Cow Skull",
    "Pharaoh's Treasure": "Scarab",
    "Solar Flare": "Scarab",
    "Dawn Breaker": "Scarab",
    "Witches' Eve": "Scarab",
    "Catch the Kraken": "Scarab",
    "Spring Blossom": "Scarab",
    "Clash of Factions": "Scarab",
    "Winds of Change": "Ancient Clock",
    "Great Bloom": "Broken Pillar",
    "Better Together": "Coprolite",
    "Paw Prints": "Moon Crystal",
  };

export const DIGGING_FORMATIONS = {
  // Horizontal Zig Zag - X Coins
  MONDAY_ARTEFACT_FORMATION: [
    { x: 0, y: -1, name: "Camel Bone" },
    { x: 1, y: -1, name: "Seasonal Artefact" },
  ],
  // Upside T - X Coins
  TUESDAY_ARTEFACT_FORMATION: [
    { x: 1, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: 2, name: "Camel Bone" },
  ],

  // Star - X Coins
  WEDNESDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Seasonal Artefact" },
  ],

  // Square - X Coins
  THURSDAY_ARTEFACT_FORMATION: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: -1, name: "Seasonal Artefact" },
  ],

  // Horizontal - X Coins
  FRIDAY_ARTEFACT_FORMATION: [
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 3, y: 0, name: "Seasonal Artefact" },
  ],

  // U Shape - X Coins
  SATURDAY_ARTEFACT_FORMATION: [
    { x: 1, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: -1, name: "Camel Bone" },
  ],

  // Horizontal - X Coins
  SUNDAY_ARTEFACT_FORMATION: [{ x: 0, y: -2, name: "Seasonal Artefact" }],

  ARTEFACT_ONE: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 0, y: 2, name: "Camel Bone" },
  ],

  ARTEFACT_TWO: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 0, y: 2, name: "Camel Bone" },
  ],

  ARTEFACT_THREE: [{ x: 0, y: 0, name: "Seasonal Artefact" }],

  ARTEFACT_FOUR: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 0, y: 2, name: "Camel Bone" },
    { x: 0, y: 3, name: "Camel Bone" },
  ],

  ARTEFACT_FIVE: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: -1, y: 0, name: "Camel Bone" },
    { x: -2, y: 0, name: "Camel Bone" },
  ],

  ARTEFACT_SIX: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: -1, y: 0, name: "Camel Bone" },
    { x: -2, y: -1, name: "Camel Bone" },
  ],

  ARTEFACT_SEVEN: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_EIGHT: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 0, y: 2, name: "Camel Bone" },
  ],

  ARTEFACT_NINE: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 0, y: -1, name: "Camel Bone" },
    { x: -1, y: -1, name: "Camel Bone" },
  ],

  ARTEFACT_TEN: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: -1, y: 0, name: "Camel Bone" },
    { x: -1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_ELEVEN: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_TWELVE: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: -1, y: 1, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_THIRTEEN: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 2, y: 0, name: "Camel Bone" },
  ],

  ARTEFACT_FOURTEEN: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 0, y: 2, name: "Camel Bone" },
  ],

  ARTEFACT_FIFTEEN: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Seasonal Artefact" },
    { x: 2, y: 0, name: "Camel Bone" },
  ],

  ARTEFACT_SIXTEEN: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_SEVENTEEN: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 1, y: 1, name: "Seasonal Artefact" },
  ],

  ARTEFACT_EIGHTEEN: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_NINETEEN: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 1, y: 1, name: "Seasonal Artefact" },
  ],

  ARTEFACT_TWENTY: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 0, y: 1, name: "Seasonal Artefact" },
    { x: 1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_TWENTY_ONE: [
    { x: 0, y: 0, name: "Seasonal Artefact" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
  ],

  ARTEFACT_TWENTY_TWO: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 1, y: 1, name: "Seasonal Artefact" },
  ],

  ARTEFACT_TWENTY_THREE: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Camel Bone" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 1, y: 1, name: "Camel Bone" },
    { x: 2, y: 1, name: "Seasonal Artefact" },
  ],

  ARTEFACT_TWENTY_FOUR: [
    { x: 0, y: 0, name: "Camel Bone" },
    { x: 1, y: 0, name: "Seasonal Artefact" },
    { x: 2, y: 0, name: "Camel Bone" },
    { x: 0, y: 1, name: "Camel Bone" },
    { x: 2, y: 1, name: "Camel Bone" },
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

  CORAL: [
    { x: 0, y: 1, name: "Stone" },
    { x: 0, y: 0, name: "Coral" },
    { x: 0, y: -1, name: "Stone" },
  ],
  PEARL: [
    { x: 0, y: 1, name: "Stone" },
    { x: 0, y: 0, name: "Pearl" },
    { x: 0, y: -1, name: "Stone" },
  ],
  PIRATE_BOUNTY: [{ x: 0, y: 0, name: "Pirate Bounty" }],
} satisfies Record<string, DiggingFormation>;

export type DiggingFormationName = keyof typeof DIGGING_FORMATIONS;

export type DiggingGrid = InventoryItemName[][];

/**
 * Whether a site was from a previous period (daily)
 * TODO - change to .slice(0, 10) - currently set to hourly
 */
export function siteHasExpired({
  now,
  generatedAt,
}: {
  now: number;
  generatedAt: number;
}) {
  return (
    new Date(now).toISOString().slice(0, 13) !==
    new Date(generatedAt).toISOString().slice(0, 13)
  );
}

/**
 * When the archaeology site resets
 * TODO - change to daily after testing
 */
export function secondsTillDesertStorm() {
  const currentTime = Date.now();

  // Calculate the time until the next day in milliseconds
  const nextDay = new Date(currentTime);
  nextDay.setUTCHours(24, 0, 0, 0);

  const timeUntilNextDay = nextDay.getTime() - currentTime;

  // Convert milliseconds to seconds
  const secondsUntilNextDay = Math.floor(timeUntilNextDay / 1000);

  return secondsUntilNextDay;
}

// Testing purposes only - reset every hour
function secondsTillNextHour() {
  const currentTime = new Date();

  // Calculate the time until the next hour in milliseconds
  const nextHour = new Date(currentTime);
  nextHour.setUTCMinutes(0, 0, 0); // Set to the start of the next hour
  nextHour.setUTCHours(nextHour.getUTCHours() + 1);

  const timeUntilNextHour = nextHour.getTime() - currentTime.getTime();

  // Convert milliseconds to seconds
  const secondsUntilNextHour = Math.floor(timeUntilNextHour / 1000);

  return secondsUntilNextHour;
}

export function getTreasuresFound({ game }: { game: GameState }) {
  return game.desert.digging.grid
    .flat()
    .filter((hole) => {
      return (
        getKeys(hole.items)[0] !== "Sand" && getKeys(hole.items)[0] !== "Crab"
      );
    })
    .map((hole) => getKeys(hole.items)[0]);
}

export function getArtefactsFound({
  game,
  now,
}: {
  game: GameState;
  now: number;
}) {
  return game.desert.digging.grid.flat().filter((hole) => {
    return getKeys(hole.items)[0] === CHAPTER_ARTEFACT[getCurrentChapter(now)];
  }).length;
}

export function hasClaimedReward({ game }: { game: GameState }) {
  const streak = game.desert.digging.streak ?? {
    count: 0,
    collectedAt: 0,
    totalClaimed: 0,
  };

  return (
    new Date().toISOString().substring(0, 10) ===
    new Date(streak.collectedAt).toISOString().substring(0, 10)
  );
}

export function getTreasureCount({ game }: { game: GameState }) {
  const { patterns } = game.desert.digging;

  const count = patterns.reduce(
    (total, pattern) => DIGGING_FORMATIONS[pattern].length + total,
    0,
  );

  return count;
}
