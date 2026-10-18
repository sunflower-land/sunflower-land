import { ITEM_DETAILS } from "features/game/types/images";
import { CROPS, CROP_SEEDS, GREENHOUSE_CROPS } from "features/game/types/crops";
import {
  FLOWERS,
  FLOWER_SEEDS,
  FLOWER_CROSS_BREED_AMOUNTS,
} from "features/game/types/flowers";
import { FISH, CHUM_AMOUNTS } from "features/game/types/fishing";
import { COOKABLES } from "features/game/types/consumables";
import { EXOTIC_CROPS } from "features/game/types/beans";
import { ANIMAL_FOODS } from "features/game/types/animals";
import { WORKBENCH_TOOLS } from "features/game/types/tools";
import { PATCH_FRUIT_SEEDS } from "features/game/types/fruits";
import { BUILDINGS } from "features/game/types/buildings";
import {
  CHAPTER_ORDER,
  CHAPTER_MARVEL_FISH,
} from "features/game/types/chapters";
import {
  BLACKSMITH_ITEMS,
  MARKET_ITEMS,
  BARN_ITEMS,
} from "features/game/types/craftables";
import { NPC_WEARABLES, type NPCName } from "lib/npcs";
import { hashString, mulberry32 } from "./sim";

/**
 * A dynamically-generated trivia question. Everything is a pure function of
 * `(giveawayId, index)` so every client generates the identical question, image
 * included.
 */
export interface TriviaQuestion {
  question: string;
  answers: [string, string, string, string];
  correct: number;
  /** Image shown in the question (item icon) — a runtime asset URL. */
  image?: string;
  /** …or an NPC to render from their wearables ("Who is this Bumpkin?"). */
  npc?: NPCName;
}

// --- Seeded helpers ---------------------------------------------------------

type Rand = () => number;

const pick = <T>(rand: Rand, arr: readonly T[]): T =>
  arr[Math.floor(rand() * arr.length)];

/** Sample up to `n` distinct items from `pool`, excluding `exclude`. */
function sample<T>(
  rand: Rand,
  pool: readonly T[],
  n: number,
  exclude: T[] = [],
) {
  const remaining = pool.filter((x) => !exclude.includes(x));
  const out: T[] = [];
  while (out.length < n && remaining.length > 0) {
    const i = Math.floor(rand() * remaining.length);
    out.push(remaining.splice(i, 1)[0]);
  }
  return out;
}

/** Fisher–Yates with the seeded RNG — in place. */
function shuffle<T>(rand: Rand, arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Shuffle correct + distractors into four answers; report where correct sits. */
function choose<T>(
  rand: Rand,
  correct: T,
  distractors: T[],
  toStr: (t: T) => string,
): { answers: [string, string, string, string]; correct: number } | null {
  if (distractors.length < 3) return null;
  const opts = shuffle(rand, [correct, ...distractors.slice(0, 3)]);
  const answers = opts.map(toStr);
  // Reject if any two answers render identically (ambiguous).
  if (new Set(answers).size !== 4) return null;
  return {
    answers: answers as [string, string, string, string],
    correct: opts.indexOf(correct),
  };
}

const image = (name: string): string | undefined =>
  (ITEM_DETAILS as Record<string, { image?: string }>)[name]?.image;

// Only capitalise after a space or hyphen — capitalising after an apostrophe
// turns "Ocean's Olive" into "Ocean'S Olive".
const title = (s: string) =>
  s.replace(/(^|[\s-])([a-z])/g, (_, p, c) => p + c.toUpperCase());

/**
 * Display name. NPC keys are all lowercase ("old salty") and need title-casing;
 * every other pool is already correctly cased, and title-casing those would
 * mangle them ("Crabs and Traps" -> "Crabs And Traps").
 */
const label = (s: string) => (/[A-Z]/.test(s) ? s : title(s));

const article = (s: string) => (/^[aeiou]/i.test(s) ? "an" : "a");

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

/**
 * Exact durations only — never rounded. Rounding would print a wrong answer
 * (the Greenhouse's 32-hour Rice became "1 day"), and two different durations
 * could round to the same string.
 */
const formatSeconds = (s: number): string => {
  if (s >= 86400 && s % 86400 === 0) return plural(s / 86400, "day");
  if (s >= 3600 && s % 3600 === 0) return plural(s / 3600, "hour");
  if (s >= 60 && s % 60 === 0) return plural(s / 60, "min");
  return plural(s, "second");
};

/** Thousands separators without relying on the runtime locale. */
const formatNumber = (n: number): string => {
  const [whole, fraction] = `${n}`.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
};

const coins = (n: number) => `${formatNumber(n)} Coin${n === 1 ? "" : "s"}`;

/** "3 x Wood + 5 x Stone" — a recipe rendered as a single answer string. */
const formatIngredients = (
  ingredients: Record<string, { toNumber?: () => number } | number>,
): string =>
  Object.entries(ingredients)
    .map(([name, amount]) => {
      const n =
        typeof amount === "number" ? amount : (amount?.toNumber?.() ?? 0);
      return `${formatNumber(n)} x ${name}`;
    })
    .join(" + ");

// --- Data pools -------------------------------------------------------------

const CROP_NAMES = Object.keys(CROPS) as (keyof typeof CROPS)[];
const FLOWER_NAMES = Object.keys(FLOWERS) as (keyof typeof FLOWERS)[];
const FISH_NAMES = Object.keys(FISH) as (keyof typeof FISH)[];
const DISH_NAMES = Object.keys(COOKABLES) as (keyof typeof COOKABLES)[];
const EXOTIC_NAMES = Object.keys(EXOTIC_CROPS) as (keyof typeof EXOTIC_CROPS)[];
const TOOL_NAMES = Object.keys(
  WORKBENCH_TOOLS,
) as (keyof typeof WORKBENCH_TOOLS)[];
const FRUIT_SEED_NAMES = Object.keys(
  PATCH_FRUIT_SEEDS,
) as (keyof typeof PATCH_FRUIT_SEEDS)[];
const FLOWER_SEED_NAMES = Object.keys(
  FLOWER_SEEDS,
) as (keyof typeof FLOWER_SEEDS)[];
const GREENHOUSE_NAMES = Object.keys(
  GREENHOUSE_CROPS,
) as (keyof typeof GREENHOUSE_CROPS)[];
const CHUM_NAMES = Object.keys(CHUM_AMOUNTS) as (keyof typeof CHUM_AMOUNTS)[];
const ANIMAL_FOOD_NAMES = Object.keys(
  ANIMAL_FOODS,
) as (keyof typeof ANIMAL_FOODS)[];
const CHAPTER_NAMES = Object.keys(
  CHAPTER_ORDER,
) as (keyof typeof CHAPTER_ORDER)[];

/** Buildings you can actually unlock and pay for (skips the Infinity entries). */
const UNLOCKABLE_BUILDINGS = (
  Object.keys(BUILDINGS) as (keyof typeof BUILDINGS)[]
).filter((b) => Number.isFinite(BUILDINGS[b].unlocksAtLevel.level));

/** Legacy collectible sets — grouped so distractors come from the same shop. */
const COLLECTIBLE_SETS: string[][] = [
  Object.keys(BLACKSMITH_ITEMS),
  Object.keys(MARKET_ITEMS),
  Object.keys(BARN_ITEMS),
].map((set) => set.filter((n) => image(n)));

const SEASONS = ["spring", "summer", "autumn", "winter"] as const;

/** NPCs that clearly appear in a named scene (from the scene placement arrays). */
const SCENE_NPCS: Record<string, NPCName[]> = {
  Plaza: [
    "bailey",
    "bert",
    "betty",
    "blacksmith",
    "cornwell",
    "grimbly",
    "grimtooth",
    "hammerin harry",
    "hank",
    "peggy",
    "poppy",
    "pumpkin' pete",
    "raven",
    "stella",
    "timmy",
    "tywin",
  ] as NPCName[],
  Kingdom: [
    "barlow",
    "billy",
    "gambit",
    "graxle",
    "jester",
    "nyx",
    "victoria",
  ] as NPCName[],
  Beach: [
    "corale",
    "digby",
    "finley",
    "finn",
    "miranda",
    "old salty",
    "tango",
  ] as NPCName[],
  "Goblin Retreat": [
    "garbo",
    "goblet",
    "gordo",
    "grubnuk",
    "guria",
  ] as NPCName[],
};
// Keep only NPCs actually in NPC_WEARABLES so the render never fails.
const SCENE_NAMES = Object.keys(SCENE_NPCS);
for (const s of SCENE_NAMES) {
  SCENE_NPCS[s] = SCENE_NPCS[s].filter((n) => !!NPC_WEARABLES[n]);
}
/** Reverse lookup: which scene is this NPC in? */
const NPC_SCENE = new Map<NPCName, string>();
for (const s of SCENE_NAMES) {
  SCENE_NPCS[s].forEach((n) => NPC_SCENE.set(n, s));
}

const COOK_BUILDINGS = [
  "Fire Pit",
  "Kitchen",
  "Bakery",
  "Deli",
  "Smoothie Shack",
];

// --- Question shapes --------------------------------------------------------
// Each returns a question or null (if it can't build a fair one this seed).

type Template = (rand: Rand) => TriviaQuestion | null;

/** "How much / how long is X?" — one numeric fact, distractors from a pool. */
function numeric(
  rand: Rand,
  question: string,
  correct: number,
  pool: number[],
  fmt: (n: number) => string,
  img?: string,
): TriviaQuestion | null {
  const distractors = [...new Set(pool)].filter((p) => p !== correct);
  const c = choose(rand, correct, sample(rand, distractors, 3), fmt);
  return c && { question, ...(img ? { image: img } : {}), ...c };
}

/** "Which of these is the MOST/FASTEST …?" — self-validating, always fair. */
function superlative<T extends string>(
  rand: Rand,
  question: string,
  pool: readonly T[],
  value: (t: T) => number,
  best: "max" | "min",
): TriviaQuestion | null {
  const four = sample(rand, pool, 4);
  if (four.length < 4) return null;
  const sorted = [...four].sort((a, b) =>
    best === "max" ? value(b) - value(a) : value(a) - value(b),
  );
  // A tie at the top would make two answers correct.
  if (value(sorted[0]) === value(sorted[1])) return null;
  const answers = four.map((n) => label(n));
  if (new Set(answers).size !== 4) return null;
  return {
    question,
    answers: answers as [string, string, string, string],
    correct: four.indexOf(sorted[0]),
  };
}

/** "Which of these is NOT a …?" — three from the group, one from outside. */
function oddOneOut(
  rand: Rand,
  question: string,
  group: readonly string[],
  outsiders: readonly string[],
  img?: string,
): TriviaQuestion | null {
  const three = sample(rand, group, 3);
  const odd = sample(rand, outsiders, 1)[0];
  if (three.length < 3 || odd === undefined) return null;
  const opts = shuffle(rand, [odd, ...three]);
  const answers = opts.map((n) => label(n));
  if (new Set(answers).size !== 4) return null;
  return {
    question,
    ...(img ? { image: img } : {}),
    answers: answers as [string, string, string, string],
    correct: opts.indexOf(odd),
  };
}

/** Pick an item with an image, ask its name, distractors from `related`. */
function identify(
  rand: Rand,
  question: string,
  answer: string,
  related: readonly string[],
): TriviaQuestion | null {
  const img = image(answer);
  if (!img) return null;
  const c = choose(
    rand,
    answer,
    sample(
      rand,
      related.filter((n) => n !== answer && image(n)),
      3,
    ),
    title,
  );
  return c && { question, image: img, ...c };
}

// --- A. Image identification ------------------------------------------------

/** "What collectible is this?" — distractors from the same shop. */
const collectibleImage: Template = (rand) => {
  const set = pick(
    rand,
    COLLECTIBLE_SETS.filter((s) => s.length >= 4),
  );
  if (!set) return null;
  return identify(rand, "What collectible is this?", pick(rand, set), set);
};

/** "What crop is this?" with same-tier distractors (similar grow time). */
const cropImage: Template = (rand) => {
  const answer = pick(rand, CROP_NAMES);
  const target = CROPS[answer].harvestSeconds;
  const near = [...CROP_NAMES]
    .filter((n) => n !== answer && image(n))
    .sort(
      (a, b) =>
        Math.abs(CROPS[a].harvestSeconds - target) -
        Math.abs(CROPS[b].harvestSeconds - target),
    )
    .slice(0, 6);
  return identify(rand, "What crop is this?", answer, near);
};

/** "What flower is this?" — distractors share the colour prefix where possible. */
const flowerImage: Template = (rand) => {
  const answer = pick(rand, FLOWER_NAMES);
  const colour = answer.split(" ")[0];
  const sameColour = FLOWER_NAMES.filter(
    (n) => n !== answer && n.startsWith(`${colour} `),
  );
  const related = sameColour.length >= 3 ? sameColour : FLOWER_NAMES;
  return identify(rand, "What flower is this?", answer, related);
};

/** "What fish is this?" — distractors of the same rarity tier. */
const fishImage: Template = (rand) => {
  const answer = pick(rand, FISH_NAMES);
  const tier = FISH[answer].type;
  const sameTier = FISH_NAMES.filter(
    (n) => n !== answer && FISH[n].type === tier,
  );
  const related = sameTier.length >= 3 ? sameTier : FISH_NAMES;
  return identify(rand, "What fish is this?", answer, related);
};

/** "What dish is this?" — distractors cooked in the same building. */
const dishImage: Template = (rand) => {
  const answer = pick(rand, DISH_NAMES);
  const building = COOKABLES[answer].building;
  const sameBuilding = DISH_NAMES.filter(
    (n) => n !== answer && COOKABLES[n].building === building,
  );
  const related = sameBuilding.length >= 3 ? sameBuilding : DISH_NAMES;
  return identify(rand, "What dish is this?", answer, related);
};

/** "Who is this Bumpkin?" — render the NPC, distractors from the same scene. */
const npcWho: Template = (rand) => {
  const scenes = SCENE_NAMES.filter((s) => SCENE_NPCS[s].length >= 4);
  if (scenes.length === 0) return null;
  const scene = pick(rand, scenes);
  const answer = pick(rand, SCENE_NPCS[scene]);
  const c = choose(
    rand,
    answer,
    sample(rand, SCENE_NPCS[scene], 3, [answer]),
    label,
  );
  return c && { question: "Who is this Bumpkin?", npc: answer, ...c };
};

/** "Which of these is a Marine Marvel?" */
const marineMarvel: Template = (rand) => {
  const marvels = FISH_NAMES.filter((n) => FISH[n].type === "marine marvel");
  const ordinary = FISH_NAMES.filter((n) => FISH[n].type !== "marine marvel");
  const answer = sample(rand, marvels, 1)[0];
  if (!answer) return null;
  const c = choose(rand, answer, sample(rand, ordinary, 3), label);
  return c && { question: "Which of these is a Marine Marvel?", ...c };
};

// --- B. Economy & prices ----------------------------------------------------

/** "At Betty's, what does one {Seed} cost?" */
const seedPrice: Template = (rand) => {
  const seeds = Object.keys(CROP_SEEDS) as (keyof typeof CROP_SEEDS)[];
  const answer = pick(rand, seeds);
  return numeric(
    rand,
    `At Betty's Market, how much does one ${label(answer)} cost?`,
    CROP_SEEDS[answer].price,
    seeds.map((n) => CROP_SEEDS[n].price),
    coins,
    image(answer),
  );
};

/** "How much does one {Crop} sell for?" */
const cropSell: Template = (rand) => {
  const answer = pick(rand, CROP_NAMES);
  return numeric(
    rand,
    `How much does one ${label(answer)} sell for?`,
    CROPS[answer].sellPrice,
    CROP_NAMES.map((n) => CROPS[n].sellPrice),
    coins,
    image(answer),
  );
};

/** "Which of these sells for the MOST?" (four crops). */
const sellMost: Template = (rand) =>
  superlative(
    rand,
    "Which of these sells for the MOST?",
    CROP_NAMES,
    (n) => CROPS[n].sellPrice,
    "max",
  );

/** "Which Exotic Crop is the most valuable?" */
const exoticMost: Template = (rand) =>
  superlative(
    rand,
    "Which Exotic Crop is the most valuable?",
    EXOTIC_NAMES,
    (n) => EXOTIC_CROPS[n].sellPrice,
    "max",
  );

/** "How much does an {Tool} cost at the Workbench?" */
const toolPrice: Template = (rand) => {
  const answer = pick(rand, TOOL_NAMES);
  return numeric(
    rand,
    `How much does ${article(label(answer))} ${label(answer)} cost at the Workbench?`,
    WORKBENCH_TOOLS[answer].price,
    TOOL_NAMES.map((n) => WORKBENCH_TOOLS[n].price),
    coins,
    image(answer),
  );
};

/** "What do you need to craft a {Tool}?" */
const toolRecipe: Template = (rand) => {
  const withRecipe = TOOL_NAMES.filter(
    (n) => Object.keys(WORKBENCH_TOOLS[n].ingredients()).length > 0,
  );
  const answer = sample(rand, withRecipe, 1)[0];
  if (!answer) return null;
  const recipe = formatIngredients(WORKBENCH_TOOLS[answer].ingredients());
  const others = withRecipe
    .filter((n) => n !== answer)
    .map((n) => formatIngredients(WORKBENCH_TOOLS[n].ingredients()))
    .filter((r) => r !== recipe);
  const c = choose(
    rand,
    recipe,
    sample(rand, [...new Set(others)], 3),
    (r) => r,
  );
  return (
    c && {
      question: `What do you need to craft ${article(label(answer))} ${label(answer)}?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "How much does a {Fruit} Seed cost?" */
const fruitSeedPrice: Template = (rand) => {
  const answer = pick(rand, FRUIT_SEED_NAMES);
  return numeric(
    rand,
    `How much does one ${label(answer)} cost?`,
    PATCH_FRUIT_SEEDS[answer].price,
    FRUIT_SEED_NAMES.map((n) => PATCH_FRUIT_SEEDS[n].price),
    coins,
    image(PATCH_FRUIT_SEEDS[answer].yield),
  );
};

/** "How much {Chum} do you need as chum?" */
const chumAmount: Template = (rand) => {
  const answer = pick(rand, CHUM_NAMES);
  return numeric(
    rand,
    `How much ${label(answer)} do you need as chum?`,
    CHUM_AMOUNTS[answer],
    CHUM_NAMES.map((n) => CHUM_AMOUNTS[n]),
    (n) => `${n} x ${label(answer)}`,
    image(answer),
  );
};

// --- C. Growth & timing -----------------------------------------------------

/** "How long does {Crop} take to grow?" */
const cropGrow: Template = (rand) => {
  const answer = pick(rand, CROP_NAMES);
  return numeric(
    rand,
    `How long does ${label(answer)} take to grow?`,
    CROPS[answer].harvestSeconds,
    CROP_NAMES.map((n) => CROPS[n].harvestSeconds),
    formatSeconds,
    image(answer),
  );
};

/** "Which of these grows the FASTEST?" */
const growsFastest: Template = (rand) =>
  superlative(
    rand,
    "Which of these grows the FASTEST?",
    CROP_NAMES,
    (n) => CROPS[n].harvestSeconds,
    "min",
  );

/** "How long does a {Flower} Seed take to bloom?" */
const flowerSeedBloom: Template = (rand) => {
  const answer = pick(rand, FLOWER_SEED_NAMES);
  return numeric(
    rand,
    `How long does ${article(label(answer))} ${label(answer)} take to bloom?`,
    FLOWER_SEEDS[answer].plantSeconds,
    FLOWER_SEED_NAMES.map((n) => FLOWER_SEEDS[n].plantSeconds),
    formatSeconds,
  );
};

/** "How long does {Crop} take in the Greenhouse?" */
const greenhouseGrow: Template = (rand) => {
  const answer = pick(rand, GREENHOUSE_NAMES);
  // Only two greenhouse crops, so distractors come from other long grow times.
  const pool = [
    ...GREENHOUSE_NAMES.map((n) => GREENHOUSE_CROPS[n].harvestSeconds),
    ...CROP_NAMES.map((n) => CROPS[n].harvestSeconds).filter(
      (s) => s >= 12 * 60 * 60,
    ),
    ...FRUIT_SEED_NAMES.map((n) => PATCH_FRUIT_SEEDS[n].plantSeconds).filter(
      (s) => s >= 12 * 60 * 60,
    ),
  ];
  return numeric(
    rand,
    `How long does ${label(answer)} take to grow in the Greenhouse?`,
    GREENHOUSE_CROPS[answer].harvestSeconds,
    pool,
    formatSeconds,
    image(answer),
  );
};

// --- D. Fishing -------------------------------------------------------------

/** "What bait do you need to catch a {Fish}?" — single-bait fish only. */
const fishBait: Template = (rand) => {
  const single = FISH_NAMES.filter((n) => FISH[n].baits.length === 1);
  const answer = sample(rand, single, 1)[0];
  if (!answer) return null;
  const bait = FISH[answer].baits[0];
  const allBaits = [...new Set(FISH_NAMES.flatMap((n) => FISH[n].baits))];
  const c = choose(rand, bait, sample(rand, allBaits, 3, [bait]), (b) =>
    label(b),
  );
  return (
    c && {
      question: `What bait do you need to catch ${article(label(answer))} ${label(answer)}?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "What chum does a {Fish} like?" — single-like fish only. */
const fishChum: Template = (rand) => {
  const single = FISH_NAMES.filter((n) => (FISH[n].likes ?? []).length === 1);
  const answer = sample(rand, single, 1)[0];
  if (!answer) return null;
  const likes = FISH[answer].likes ?? [];
  const chum = likes[0] as string;
  // Distractors must not also be liked by this fish.
  const others = CHUM_NAMES.filter((n) => !likes.includes(n as never));
  const c = choose(rand, chum, sample(rand, others, 3), label);
  return (
    c && {
      question: `What chum does ${article(label(answer))} ${label(answer)} like?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "In which season can you catch a {Fish}?" — single-season fish only. */
const fishSeason: Template = (rand) => {
  const single = FISH_NAMES.filter((n) => (FISH[n].seasons ?? []).length === 1);
  const answer = sample(rand, single, 1)[0];
  if (!answer) return null;
  const season = (FISH[answer].seasons ?? [])[0] as string;
  const c = choose(
    rand,
    season,
    SEASONS.filter((s) => s !== season).map((s) => s as string),
    title,
  );
  return (
    c && {
      question: `In which season can you catch ${article(label(answer))} ${label(answer)}?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "Which of these is NOT a fish?" (three fish + one crop/flower). */
const notAFish: Template = (rand) =>
  oddOneOut(
    rand,
    "Which of these is NOT a fish?",
    FISH_NAMES,
    rand() < 0.5 ? CROP_NAMES : FLOWER_NAMES,
  );

/** "Which Marvel belongs to the {Chapter} chapter?" */
const chapterMarvel: Template = (rand) => {
  const chapter = pick(rand, CHAPTER_NAMES);
  const marvel = CHAPTER_MARVEL_FISH[chapter] as string;
  // Several early chapters share the Crimson Carp — distractors must differ.
  const others = [
    ...new Set(
      CHAPTER_NAMES.map((c) => CHAPTER_MARVEL_FISH[c] as string).filter(
        (m) => m !== marvel,
      ),
    ),
  ];
  const c = choose(rand, marvel, sample(rand, others, 3), label);
  return (
    c && {
      question: `Which Marvel belongs to the ${chapter} chapter?`,
      ...c,
    }
  );
};

// --- E. Flowers -------------------------------------------------------------

/** "Which seed grows a {Flower}?" */
const flowerSeedFor: Template = (rand) => {
  const answer = pick(rand, FLOWER_NAMES);
  const seed = FLOWERS[answer].seed as string;
  const c = choose(
    rand,
    seed,
    sample(rand, FLOWER_SEED_NAMES as string[], 3, [seed]),
    title,
  );
  return (
    c && {
      question: `Which seed grows ${article(label(answer))} ${label(answer)}?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "Which of these does NOT come from a {Seed}?" */
const notFromSeed: Template = (rand) => {
  const seed = pick(rand, FLOWER_SEED_NAMES);
  const fromSeed = FLOWER_NAMES.filter((n) => FLOWERS[n].seed === seed);
  const others = FLOWER_NAMES.filter((n) => FLOWERS[n].seed !== seed);
  if (fromSeed.length < 3) return null;
  return oddOneOut(
    rand,
    `Which of these does NOT come from ${article(label(seed))} ${label(seed)}?`,
    fromSeed,
    others,
  );
};

/** "How many {Crop} do you need to cross-breed a {Seed}?" */
const crossBreed: Template = (rand) => {
  const seed = pick(rand, FLOWER_SEED_NAMES);
  const amounts = FLOWER_CROSS_BREED_AMOUNTS[seed] ?? {};
  const breeds = Object.keys(amounts) as (keyof typeof amounts)[];
  const answer = sample(rand, breeds, 1)[0];
  if (!answer) return null;
  const value = amounts[answer];
  if (value === undefined) return null;
  return numeric(
    rand,
    `How many ${label(answer as string)} do you need to cross-breed ${article(label(seed))} ${label(seed)}?`,
    value,
    breeds.map((b) => amounts[b]).filter((v): v is number => v !== undefined),
    (n) => `${formatNumber(n)} x ${label(answer as string)}`,
    image(answer as string),
  );
};

// --- F. NPCs & world --------------------------------------------------------

/** "Where can you find {NPC}?" */
const npcLocation: Template = (rand) => {
  const npcs = [...NPC_SCENE.keys()];
  const answer = pick(rand, npcs);
  const scene = NPC_SCENE.get(answer) as string;
  const c = choose(
    rand,
    scene,
    SCENE_NAMES.filter((s) => s !== scene),
    (s) => s,
  );
  return (
    c && { question: `Where can you find ${label(answer)}?`, npc: answer, ...c }
  );
};

/** "Which of these does NOT live in {Scene}?" */
const npcNotIn: Template = (rand) => {
  const scene = pick(
    rand,
    SCENE_NAMES.filter((s) => SCENE_NPCS[s].length >= 3),
  );
  if (!scene) return null;
  const outsiders = SCENE_NAMES.filter((s) => s !== scene).flatMap(
    (s) => SCENE_NPCS[s],
  );
  return oddOneOut(
    rand,
    `Which of these does NOT live in the ${scene}?`,
    SCENE_NPCS[scene],
    outsiders,
  );
};

// --- G. Cooking -------------------------------------------------------------

/** "Which building cooks {Dish}?" */
const cookBuilding: Template = (rand) => {
  const dish = pick(rand, DISH_NAMES);
  const building = COOKABLES[dish].building;
  const c = choose(
    rand,
    building as string,
    sample(rand, COOK_BUILDINGS, 3, [building as string]),
    (b) => b,
  );
  return (
    c && {
      question: `Which building cooks ${label(dish)}?`,
      image: image(dish),
      ...c,
    }
  );
};

/** "How many {Ingredient} does a {Dish} need?" */
const dishIngredientAmount: Template = (rand) => {
  const dish = pick(rand, DISH_NAMES);
  const ingredients = Object.entries(COOKABLES[dish].ingredients ?? {});
  const entry = sample(rand, ingredients, 1)[0];
  if (!entry) return null;
  const [ingredient, amount] = entry;
  const needed = amount?.toNumber?.() ?? 0;
  if (!needed) return null;
  // Distractors: real amounts other dishes ask for.
  const pool = DISH_NAMES.flatMap((n) =>
    Object.values(COOKABLES[n].ingredients ?? {}).map(
      (a) => a?.toNumber?.() ?? 0,
    ),
  ).filter((n) => n > 0);
  return numeric(
    rand,
    `How many ${label(ingredient)} does ${article(label(dish))} ${label(dish)} need?`,
    needed,
    pool,
    (n) => `${formatNumber(n)} x ${label(ingredient)}`,
    image(dish),
  );
};

/** "Which of these is NOT cooked in the {Building}?" */
const notCookedIn: Template = (rand) => {
  const building = pick(rand, COOK_BUILDINGS);
  const inside = DISH_NAMES.filter((n) => COOKABLES[n].building === building);
  const outside = DISH_NAMES.filter((n) => COOKABLES[n].building !== building);
  if (inside.length < 3) return null;
  return oddOneOut(
    rand,
    `Which of these is NOT cooked in the ${building}?`,
    inside,
    outside,
  );
};

/** "Which dish gives the most XP?" */
const dishMostXP: Template = (rand) =>
  superlative(
    rand,
    "Which dish gives the most XP?",
    DISH_NAMES,
    (n) => COOKABLES[n].experience,
    "max",
  );

/** "What's in a {Dish}?" */
const dishRecipe: Template = (rand) => {
  const dish = pick(rand, DISH_NAMES);
  const recipe = formatIngredients(COOKABLES[dish].ingredients ?? {});
  if (!recipe) return null;
  const others = DISH_NAMES.filter((n) => n !== dish)
    .map((n) => formatIngredients(COOKABLES[n].ingredients ?? {}))
    .filter((r) => r && r !== recipe);
  const c = choose(
    rand,
    recipe,
    sample(rand, [...new Set(others)], 3),
    (r) => r,
  );
  return (
    c && {
      question: `What's in ${article(label(dish))} ${label(dish)}?`,
      image: image(dish),
      ...c,
    }
  );
};

// --- H. Progression & animals -----------------------------------------------

/** "What level unlocks the {Building}?" */
const buildingUnlock: Template = (rand) => {
  const answer = pick(rand, UNLOCKABLE_BUILDINGS);
  return numeric(
    rand,
    `What level unlocks the ${label(answer)}?`,
    BUILDINGS[answer].unlocksAtLevel.level,
    UNLOCKABLE_BUILDINGS.map((b) => BUILDINGS[b].unlocksAtLevel.level),
    (n) => `Level ${n}`,
    image(answer),
  );
};

/** "How much does the {Building} cost to build?" */
const buildingCost: Template = (rand) => {
  const payable = UNLOCKABLE_BUILDINGS.filter((b) => BUILDINGS[b].coins > 0);
  const answer = sample(rand, payable, 1)[0];
  if (!answer) return null;
  return numeric(
    rand,
    `How much does the ${label(answer)} cost to build?`,
    BUILDINGS[answer].coins,
    payable.map((b) => BUILDINGS[b].coins),
    coins,
    image(answer),
  );
};

/** "What is {Feed} made from?" */
const animalFood: Template = (rand) => {
  const answer = pick(rand, ANIMAL_FOOD_NAMES);
  const recipe = formatIngredients(ANIMAL_FOODS[answer].ingredients ?? {});
  if (!recipe) return null;
  const others = ANIMAL_FOOD_NAMES.filter((n) => n !== answer)
    .map((n) => formatIngredients(ANIMAL_FOODS[n].ingredients ?? {}))
    .filter((r) => r && r !== recipe);
  const c = choose(
    rand,
    recipe,
    sample(rand, [...new Set(others)], 3),
    (r) => r,
  );
  return (
    c && {
      question: `What is ${label(answer)} made from?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "Which chapter came FIRST?" */
const chapterFirst: Template = (rand) =>
  superlative(
    rand,
    "Which chapter came FIRST?",
    CHAPTER_NAMES,
    (c) => CHAPTER_ORDER[c],
    "min",
  );

/**
 * Templates grouped by TOPIC. A round draws a shuffled spread across topics
 * (see `roundTemplates`), capped so no single topic dominates.
 */
interface Category {
  key: string;
  templates: Template[];
}

const CATEGORIES: Category[] = [
  { key: "collectible", templates: [collectibleImage] },
  {
    key: "crop",
    templates: [
      cropImage,
      cropSell,
      seedPrice,
      cropGrow,
      sellMost,
      growsFastest,
    ],
  },
  {
    key: "flower",
    templates: [
      flowerImage,
      flowerSeedFor,
      notFromSeed,
      flowerSeedBloom,
      crossBreed,
    ],
  },
  {
    key: "fish",
    templates: [
      fishImage,
      notAFish,
      marineMarvel,
      fishBait,
      fishChum,
      fishSeason,
      chapterMarvel,
    ],
  },
  {
    key: "cooking",
    templates: [
      dishImage,
      cookBuilding,
      dishIngredientAmount,
      notCookedIn,
      dishMostXP,
      dishRecipe,
    ],
  },
  { key: "npc", templates: [npcWho, npcLocation, npcNotIn] },
  {
    key: "economy",
    templates: [toolPrice, toolRecipe, fruitSeedPrice, chumAmount, exoticMost],
  },
  {
    key: "progression",
    templates: [
      buildingUnlock,
      buildingCost,
      animalFood,
      chapterFirst,
      greenhouseGrow,
    ],
  },
];

/** Every template, flattened — used as a last-resort fallback sweep. */
const ALL_TEMPLATES = CATEGORIES.flatMap((c) => c.templates);

/** Default round length — kept in sync with TRIVIA_ROUNDS (passed in below). */
const DEFAULT_ROUND = 10;

/** At most this many questions from any one topic, so a round stays varied. */
const MAX_PER_CATEGORY = 2;

/**
 * A deterministic plan of `count` DISTINCT templates for a round (same on every
 * client). Every template across every topic goes into one shuffled pile and the
 * round takes the first `count` that don't breach `MAX_PER_CATEGORY` — so which
 * topics show up, and how many of each, changes from giveaway to giveaway. The
 * old version dealt one question per topic before anything else, which pinned
 * every single-template topic (npc, exotic crops, flowers) into all ten-question
 * rounds and made every game feel identical.
 */
function roundTemplates(giveawayId: string, count: number): Template[] {
  const rand = mulberry32(hashString(`trivia-plan:${giveawayId}`));

  const pool = shuffle(
    rand,
    CATEGORIES.flatMap((c) => c.templates.map((t) => ({ key: c.key, t }))),
  );

  const plan: Template[] = [];
  const used = new Map<string, number>();
  for (const { key, t } of pool) {
    if (plan.length >= count) break;
    const n = used.get(key) ?? 0;
    if (n >= MAX_PER_CATEGORY) continue;
    used.set(key, n + 1);
    plan.push(t);
  }
  // Relax the cap only if there genuinely aren't enough templates to fill.
  for (const { t } of pool) {
    if (plan.length >= count) break;
    if (!plan.includes(t)) plan.push(t);
  }

  return plan;
}

/** Build a question from one template, retrying a few seeds; null if it can't. */
function build(
  template: Template,
  giveawayId: string,
  index: number,
): TriviaQuestion | null {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const rand = mulberry32(
      hashString(`trivia:${giveawayId}:${index}:${attempt}`),
    );
    const q = template(rand);
    if (q) return q;
  }
  return null;
}

const FALLBACK: TriviaQuestion = {
  question: "What crop is this?",
  image: image("Sunflower"),
  answers: ["Sunflower", "Potato", "Pumpkin", "Carrot"],
  correct: 0,
};

/**
 * Build a whole round of `count` questions, guaranteed distinct (no repeated
 * question text). Uses the round plan's template for each slot; if that one
 * fails or would duplicate an earlier question, it sweeps the other templates
 * for a fresh one. Deterministic, so every client agrees.
 */
function generateRound(giveawayId: string, count: number): TriviaQuestion[] {
  const plan = roundTemplates(giveawayId, count);
  const round: TriviaQuestion[] = [];
  const seen = new Set<string>();

  for (let index = 0; index < count; index += 1) {
    let q = build(plan[index % plan.length], giveawayId, index);

    // Failed, or its text already appeared this round — find a fresh template.
    if (!q || seen.has(q.question)) {
      const rand = mulberry32(hashString(`trivia-alt:${giveawayId}:${index}`));
      for (const template of shuffle(rand, [...ALL_TEMPLATES])) {
        const alt = build(template, giveawayId, index);
        if (alt && !seen.has(alt.question)) {
          q = alt;
          break;
        }
      }
    }

    if (!q) q = FALLBACK;
    seen.add(q.question);
    round.push(q);
  }

  return round;
}

/** Rounds are deterministic, so cache each giveaway's round (built once). */
const roundCache = new Map<string, TriviaQuestion[]>();

/**
 * Deterministic question for a round — identical on every client. Delegates to
 * `generateRound`, which guarantees the round's questions are all distinct.
 */
export function generateQuestion(
  giveawayId: string,
  index: number,
  count: number = DEFAULT_ROUND,
): TriviaQuestion {
  const key = `${giveawayId}:${count}`;
  let round = roundCache.get(key);
  if (!round) {
    round = generateRound(giveawayId, count);
    roundCache.set(key, round);
  }
  return round[index % round.length];
}
