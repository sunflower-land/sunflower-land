import { ITEM_DETAILS } from "features/game/types/images";
import { CROPS, CROP_SEEDS } from "features/game/types/crops";
import { FLOWERS } from "features/game/types/flowers";
import { FISH } from "features/game/types/fishing";
import { COOKABLES } from "features/game/types/consumables";
import { EXOTIC_CROPS } from "features/game/types/beans";
import { ANIMALS } from "features/game/types/animals";
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

/** Shuffle correct + distractors into four answers; report where correct sits. */
function choose<T>(
  rand: Rand,
  correct: T,
  distractors: T[],
  toStr: (t: T) => string,
): { answers: [string, string, string, string]; correct: number } | null {
  if (distractors.length < 3) return null;
  const opts = [correct, ...distractors.slice(0, 3)];
  // Fisher–Yates with the seeded RNG.
  for (let i = opts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
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

const title = (s: string) =>
  s.replace(/(^|[\s'-])([a-z])/g, (_, p, c) => p + c.toUpperCase());

const formatSeconds = (s: number): string => {
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  if (s < 86400) return `${Math.round(s / 3600)} hr`;
  return `${Math.round(s / 86400)} days`;
};

// --- Data pools -------------------------------------------------------------

const CROP_NAMES = Object.keys(CROPS) as (keyof typeof CROPS)[];
const FLOWER_NAMES = Object.keys(FLOWERS) as (keyof typeof FLOWERS)[];
const FISH_NAMES = Object.keys(FISH) as (keyof typeof FISH)[];
const DISH_NAMES = Object.keys(COOKABLES) as (keyof typeof COOKABLES)[];
const EXOTIC_NAMES = Object.keys(EXOTIC_CROPS) as (keyof typeof EXOTIC_CROPS)[];

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

const COOK_BUILDINGS = [
  "Fire Pit",
  "Kitchen",
  "Bakery",
  "Deli",
  "Smoothie Shack",
];

// --- Templates --------------------------------------------------------------
// Each returns a question or null (if it can't build a fair one this seed).

type Template = (rand: Rand) => TriviaQuestion | null;

/** Pick an item with an image, ask its name, distractors from the same pool. */
const imageId =
  (pool: readonly string[], label: string): Template =>
  (rand) => {
    const withImage = pool.filter((n) => image(n));
    if (withImage.length < 4) return null;
    const answer = pick(rand, withImage);
    const c = choose(rand, answer, sample(rand, withImage, 6, [answer]), title);
    if (!c) return null;
    return { question: label, image: image(answer), ...c };
  };

/** "What crop is this?" with same-tier distractors (similar grow time). */
const cropImage: Template = (rand) => {
  const answer = pick(rand, CROP_NAMES);
  if (!image(answer)) return null;
  const target = CROPS[answer].harvestSeconds;
  const near = [...CROP_NAMES]
    .filter((n) => n !== answer && image(n))
    .sort(
      (a, b) =>
        Math.abs(CROPS[a].harvestSeconds - target) -
        Math.abs(CROPS[b].harvestSeconds - target),
    )
    .slice(0, 6);
  const c = choose(rand, answer, sample(rand, near, 3), title);
  return c && { question: "What crop is this?", image: image(answer), ...c };
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
    (n) => title(n),
  );
  return c && { question: "Who is this Bumpkin?", npc: answer, ...c };
};

/** "How much does {Crop} sell for?" */
const cropSell: Template = (rand) => {
  const answer = pick(rand, CROP_NAMES);
  const price = CROPS[answer].sellPrice;
  const distractors = sample(rand, CROP_NAMES, 6, [answer])
    .map((n) => CROPS[n].sellPrice)
    .filter((p) => p !== price);
  const c = choose(rand, price, [...new Set(distractors)], (p) => `${p}`);
  return (
    c && {
      question: `How much does one ${title(answer)} sell for?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "What does one {Seed} cost at Betty's Market?" */
const seedPrice: Template = (rand) => {
  const seeds = Object.keys(CROP_SEEDS) as (keyof typeof CROP_SEEDS)[];
  const answer = pick(rand, seeds);
  const price = CROP_SEEDS[answer].price;
  const distractors = sample(rand, seeds, 6, [answer])
    .map((n) => CROP_SEEDS[n].price)
    .filter((p) => p !== price);
  const c = choose(rand, price, [...new Set(distractors)], (p) => `${p}`);
  return (
    c && {
      question: `At Betty's, what does one ${title(answer)} cost?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "How long does {Crop} take to grow?" */
const cropGrow: Template = (rand) => {
  const answer = pick(rand, CROP_NAMES);
  const secs = CROPS[answer].harvestSeconds;
  const distractors = sample(rand, CROP_NAMES, 6, [answer])
    .map((n) => CROPS[n].harvestSeconds)
    .filter((s) => s !== secs);
  const c = choose(rand, secs, [...new Set(distractors)], formatSeconds);
  return (
    c && {
      question: `How long does ${title(answer)} take to grow?`,
      image: image(answer),
      ...c,
    }
  );
};

/** "Which of these sells for the MOST?" (four crops). */
const sellMost: Template = (rand) => {
  const four = sample(rand, CROP_NAMES, 4);
  if (four.length < 4) return null;
  const sorted = [...four].sort(
    (a, b) => CROPS[b].sellPrice - CROPS[a].sellPrice,
  );
  if (CROPS[sorted[0]].sellPrice === CROPS[sorted[1]].sellPrice) return null;
  const answers = four.map((n) => title(n)) as [string, string, string, string];
  return {
    question: "Which of these sells for the MOST?",
    answers,
    correct: four.indexOf(sorted[0]),
  };
};

/** "Which Exotic Crop is the most valuable?" */
const exoticMost: Template = (rand) => {
  const four = sample(rand, EXOTIC_NAMES, 4);
  if (four.length < 4) return null;
  const sorted = [...four].sort(
    (a, b) => EXOTIC_CROPS[b].sellPrice - EXOTIC_CROPS[a].sellPrice,
  );
  if (EXOTIC_CROPS[sorted[0]].sellPrice === EXOTIC_CROPS[sorted[1]].sellPrice)
    return null;
  const answers = four.map((n) => title(n)) as [string, string, string, string];
  return {
    question: "Which Exotic Crop is the most valuable?",
    answers,
    correct: four.indexOf(sorted[0]),
  };
};

/** "Which of these is NOT a fish?" (three fish + one crop/flower). */
const notAFish: Template = (rand) => {
  const nonFish = pick(rand, rand() < 0.5 ? CROP_NAMES : FLOWER_NAMES);
  const fish = sample(rand, FISH_NAMES, 3);
  if (fish.length < 3) return null;
  const opts = [nonFish, ...fish];
  for (let i = opts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const answers = opts.map((n) => title(n as string)) as [
    string,
    string,
    string,
    string,
  ];
  return {
    question: "Which of these is NOT a fish?",
    answers,
    correct: opts.indexOf(nonFish),
  };
};

/** "Which building cooks {Dish}?" */
const cookBuilding: Template = (rand) => {
  const dish = pick(rand, DISH_NAMES);
  const building = COOKABLES[dish].building;
  const c = choose(
    rand,
    building,
    sample(rand, COOK_BUILDINGS, 3, [building]),
    (b) => b,
  );
  return (
    c && {
      question: `Which building cooks ${title(dish)}?`,
      image: image(dish),
      ...c,
    }
  );
};

/** "Which animal lives in the {building}?" */
const animalBuilding: Template = (rand) => {
  const animals = Object.keys(ANIMALS) as (keyof typeof ANIMALS)[];
  const answer = pick(rand, animals);
  const building = ANIMALS[answer].buildingRequired;
  const c = choose(rand, answer, sample(rand, animals, 3, [answer]), (a) => a);
  return c && { question: `Which animal lives in the ${building}?`, ...c };
};

/**
 * Templates grouped by TOPIC. A round draws one question from each of several
 * distinct topics (see `generateQuestion`), so you never get six crop questions
 * in a row — the mixture is guaranteed, only which topics/items vary by seed.
 */
interface Category {
  key: string;
  templates: Template[];
}

const CATEGORIES: Category[] = [
  {
    key: "crop",
    templates: [cropImage, cropSell, seedPrice, cropGrow, sellMost],
  },
  { key: "flower", templates: [imageId(FLOWER_NAMES, "What flower is this?")] },
  {
    key: "fish",
    templates: [imageId(FISH_NAMES, "What fish is this?"), notAFish],
  },
  {
    key: "cooking",
    templates: [imageId(DISH_NAMES, "What dish is this?"), cookBuilding],
  },
  { key: "npc", templates: [npcWho] },
  { key: "exotic", templates: [exoticMost] },
  { key: "animal", templates: [animalBuilding] },
];

/** Every template, flattened — used as a last-resort fallback sweep. */
const ALL_TEMPLATES = CATEGORIES.flatMap((c) => c.templates);

/** A deterministic per-giveaway ordering of the topics (same on every client). */
function categoryOrder(giveawayId: string): Category[] {
  const rand = mulberry32(hashString(`trivia-cats:${giveawayId}`));
  const order = [...CATEGORIES];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** The ordered topics a round will cover — one per question. Exported so the
 * variety guarantee (distinct topics across a round) is testable. */
export function topicsForRound(giveawayId: string, count: number): string[] {
  const order = categoryOrder(giveawayId);
  return Array.from({ length: count }, (_, i) => order[i % order.length].key);
}

/** Try a list of templates (seeded per attempt) until one builds a question. */
function buildFrom(
  templates: Template[],
  giveawayId: string,
  index: number,
): TriviaQuestion | null {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const rand = mulberry32(
      hashString(`trivia:${giveawayId}:${index}:${attempt}`),
    );
    const template = templates[Math.floor(rand() * templates.length)];
    const q = template(rand);
    if (q) return q;
  }
  return null;
}

/**
 * Deterministic question for a round — identical on every client. Question N
 * comes from the Nth topic in this giveaway's shuffled topic order, so a round
 * of six spans six different topics (crop, fish, npc, cooking, …). Within the
 * topic the specific template + item are seed-picked. Falls back across all
 * templates only if a topic can't produce a fair question this seed.
 */
export function generateQuestion(
  giveawayId: string,
  index: number,
): TriviaQuestion {
  const order = categoryOrder(giveawayId);
  const category = order[index % order.length];

  return (
    buildFrom(category.templates, giveawayId, index) ??
    buildFrom(ALL_TEMPLATES, giveawayId, index) ?? {
      // Fallback (should never hit): a trivially valid question.
      question: "What crop is this?",
      image: image("Sunflower"),
      answers: ["Sunflower", "Potato", "Pumpkin", "Carrot"],
      correct: 0,
    }
  );
}
