import { FactionName, GameState } from "../types/game";

import sunflorians_chevron_zero from "assets/icons/factions/sunflorians/chevron_zero.webp";
import sunflorians_chevron_one from "assets/icons/factions/sunflorians/chevron_one.webp";
import sunflorians_chevron_two from "assets/icons/factions/sunflorians/chevron_two.webp";
import sunflorians_chevron_three from "assets/icons/factions/sunflorians/chevron_three.webp";
import sunflorians_chevron_four from "assets/icons/factions/sunflorians/chevron_four.webp";
import sunflorians_chevron_five from "assets/icons/factions/sunflorians/chevron_five.webp";
import sunflorians_chevron_six from "assets/icons/factions/sunflorians/chevron_six.webp";

import bumpkins_chevron_zero from "assets/icons/factions/bumpkins/chevron_zero.webp";
import bumpkins_chevron_one from "assets/icons/factions/bumpkins/chevron_one.webp";
import bumpkins_chevron_two from "assets/icons/factions/bumpkins/chevron_two.webp";
import bumpkins_chevron_three from "assets/icons/factions/bumpkins/chevron_three.webp";
import bumpkins_chevron_four from "assets/icons/factions/bumpkins/chevron_four.webp";
import bumpkins_chevron_five from "assets/icons/factions/bumpkins/chevron_five.webp";
import bumpkins_chevron_six from "assets/icons/factions/bumpkins/chevron_six.webp";

import nightshades_chevron_zero from "assets/icons/factions/nightshades/chevron_zero.webp";
import nightshades_chevron_one from "assets/icons/factions/nightshades/chevron_one.webp";
import nightshades_chevron_two from "assets/icons/factions/nightshades/chevron_two.webp";
import nightshades_chevron_three from "assets/icons/factions/nightshades/chevron_three.webp";
import nightshades_chevron_four from "assets/icons/factions/nightshades/chevron_four.webp";
import nightshades_chevron_five from "assets/icons/factions/nightshades/chevron_five.webp";
import nightshades_chevron_six from "assets/icons/factions/nightshades/chevron_six.webp";

import goblins_chevron_zero from "assets/icons/factions/goblins/chevron_zero.webp";
import goblins_chevron_one from "assets/icons/factions/goblins/chevron_one.webp";
import goblins_chevron_two from "assets/icons/factions/goblins/chevron_two.webp";
import goblins_chevron_three from "assets/icons/factions/goblins/chevron_three.webp";
import goblins_chevron_four from "assets/icons/factions/goblins/chevron_four.webp";
import goblins_chevron_five from "assets/icons/factions/goblins/chevron_five.webp";
import goblins_chevron_six from "assets/icons/factions/goblins/chevron_six.webp";
import { FACTION_EMBLEMS } from "../events/landExpansion/joinFaction";
import Decimal from "decimal.js-light";
import { BoostType, BoostValue } from "../types/boosts";
import { getKeys } from "../types/decorations";

type BumpkinRank =
  | "forager"
  | "rancher"
  | "agrarian"
  | "steward"
  | "sentinel"
  | "warden"
  | "overseer";
type NightshadeRank =
  | "pagan"
  | "occultist"
  | "enchanter"
  | "raver"
  | "witch"
  | "sorcerer"
  | "lich";
type GoblinRank =
  | "hobgoblin"
  | "grunt"
  | "marauder"
  | "elite"
  | "commander"
  | "warchief"
  | "warlord";
type SunflorianRank =
  | "initiate"
  | "squire"
  | "captain"
  | "knight"
  | "guardian"
  | "paladin"
  | "archduke";

export type FactionRank =
  | BumpkinRank
  | NightshadeRank
  | GoblinRank
  | SunflorianRank;

type Rank = {
  name: FactionRank;
  faction: FactionName;
  emblemsRequired: number;
  boost?: string;
  icon: string;
};

const RANK_DATA: Record<FactionRank, Omit<Rank, "icon">> = {
  // Bumpkins
  forager: {
    name: "forager",
    faction: "bumpkins",
    emblemsRequired: 0,
  },
  rancher: {
    name: "rancher",
    faction: "bumpkins",
    emblemsRequired: 25,
  },
  agrarian: {
    name: "agrarian",
    faction: "bumpkins",
    emblemsRequired: 300,
  },
  steward: {
    name: "steward",
    faction: "bumpkins",
    emblemsRequired: 2500,
  },
  sentinel: {
    name: "sentinel",
    faction: "bumpkins",
    emblemsRequired: 5200,
  },
  warden: {
    name: "warden",
    faction: "bumpkins",
    emblemsRequired: 9700,
  },
  overseer: {
    name: "overseer",
    faction: "bumpkins",
    emblemsRequired: 23300,
  },
  // Nightshades
  pagan: {
    name: "pagan",
    faction: "nightshades",
    emblemsRequired: 0,
  },
  occultist: {
    name: "occultist",
    faction: "nightshades",
    emblemsRequired: 20,
  },
  enchanter: {
    name: "enchanter",
    faction: "nightshades",
    emblemsRequired: 290,
  },
  raver: {
    name: "raver",
    faction: "nightshades",
    emblemsRequired: 2700,
  },
  witch: {
    name: "witch",
    faction: "nightshades",
    emblemsRequired: 5500,
  },
  sorcerer: {
    name: "sorcerer",
    faction: "nightshades",
    emblemsRequired: 8700,
  },
  lich: {
    name: "lich",
    faction: "nightshades",
    emblemsRequired: 16850,
  },
  // Goblins
  hobgoblin: {
    name: "hobgoblin",
    faction: "goblins",
    emblemsRequired: 0,
  },
  grunt: {
    name: "grunt",
    faction: "goblins",
    emblemsRequired: 20,
  },
  marauder: {
    name: "marauder",
    faction: "goblins",
    emblemsRequired: 500,
  },
  elite: {
    name: "elite",
    faction: "goblins",
    emblemsRequired: 4200,
  },
  commander: {
    name: "commander",
    faction: "goblins",
    emblemsRequired: 8000,
  },
  warchief: {
    name: "warchief",
    faction: "goblins",
    emblemsRequired: 13300,
  },
  warlord: {
    name: "warlord",
    faction: "goblins",
    emblemsRequired: 23500,
  },
  // Sunflorians
  initiate: {
    name: "initiate",
    faction: "sunflorians",
    emblemsRequired: 0,
  },
  squire: {
    name: "squire",
    faction: "sunflorians",
    emblemsRequired: 15,
  },
  captain: {
    name: "captain",
    faction: "sunflorians",
    emblemsRequired: 250,
  },
  knight: {
    name: "knight",
    faction: "sunflorians",
    emblemsRequired: 3000,
  },
  guardian: {
    name: "guardian",
    faction: "sunflorians",
    emblemsRequired: 6000,
  },
  paladin: {
    name: "paladin",
    faction: "sunflorians",
    emblemsRequired: 11000,
  },
  archduke: {
    name: "archduke",
    faction: "sunflorians",
    emblemsRequired: 24000,
  },
};

export const RANK_DISPLAY: Record<FactionRank, Pick<Rank, "icon" | "boost">> = {
  // Bumpkins
  forager: {
    icon: bumpkins_chevron_zero,
  },
  rancher: {
    icon: bumpkins_chevron_one,
    boost: "+5% Marks",
  },
  agrarian: {
    icon: bumpkins_chevron_two,
    boost: "+150% Marks",
  },
  steward: {
    icon: bumpkins_chevron_three,
    boost: "+300% Marks",
  },
  sentinel: {
    icon: bumpkins_chevron_four,
    boost: "+350% Marks",
  },
  warden: {
    icon: bumpkins_chevron_five,
    boost: "+380% Marks",
  },
  overseer: {
    icon: bumpkins_chevron_six,
    boost: "+400% Marks",
  },
  // Nightshades
  pagan: {
    icon: nightshades_chevron_zero,
  },
  occultist: {
    icon: nightshades_chevron_one,
    boost: "+5% Marks",
  },
  enchanter: {
    icon: nightshades_chevron_two,
    boost: "+150% Marks",
  },
  raver: {
    icon: nightshades_chevron_three,
    boost: "+300% Marks",
  },
  witch: {
    icon: nightshades_chevron_four,
    boost: "+350% Marks",
  },
  sorcerer: {
    icon: nightshades_chevron_five,
    boost: "+380% Marks",
  },
  lich: {
    icon: nightshades_chevron_six,
    boost: "+400% Marks",
  },
  // Goblins
  hobgoblin: {
    icon: goblins_chevron_zero,
  },
  grunt: {
    icon: goblins_chevron_one,
    boost: "+5% Marks",
  },
  marauder: {
    icon: goblins_chevron_two,
    boost: "+150% Marks",
  },
  elite: {
    icon: goblins_chevron_three,
    boost: "+300% Marks",
  },
  commander: {
    icon: goblins_chevron_four,
    boost: "+350% Marks",
  },
  warchief: {
    icon: goblins_chevron_five,
    boost: "+380% Marks",
  },
  warlord: {
    icon: goblins_chevron_six,
    boost: "+400% Marks",
  },
  // Sunflorians
  initiate: {
    icon: sunflorians_chevron_zero,
  },
  squire: {
    icon: sunflorians_chevron_one,
    boost: "+5% Marks",
  },
  captain: {
    icon: sunflorians_chevron_two,
    boost: "+150% Marks",
  },
  knight: {
    icon: sunflorians_chevron_three,
    boost: "+300% Marks",
  },
  guardian: {
    icon: sunflorians_chevron_four,
    boost: "+350% Marks",
  },
  paladin: {
    icon: sunflorians_chevron_five,
    boost: "+380% Marks",
  },
  archduke: {
    icon: sunflorians_chevron_six,
    boost: "+400% Marks",
  },
};

export const RANKS: Record<FactionRank, Rank> = getKeys(RANK_DATA).reduce(
  (acc, name) => ({
    ...acc,
    [name]: {
      ...RANK_DATA[name],
      ...RANK_DISPLAY[name],
    },
  }),
  {} as Record<FactionRank, Rank>,
);

export const getFactionRanking = (
  faction: FactionName,
  emblems: number,
): Rank => {
  const ranks = Object.values(RANKS)
    .filter((rank) => rank.faction === faction)
    .sort((a, b) => b.emblemsRequired - a.emblemsRequired);

  const rank = ranks.find((rank) => emblems >= rank.emblemsRequired);

  return rank!;
};

export const rankBoostPercentage = (rank: FactionRank): number => {
  switch (rank) {
    case "forager":
    case "pagan":
    case "hobgoblin":
    case "initiate":
      return 0;
    case "rancher":
    case "occultist":
    case "grunt":
    case "squire":
      return 0.05;
    case "agrarian":
    case "enchanter":
    case "marauder":
    case "captain":
      return 1.5;
    case "steward":
    case "raver":
    case "elite":
    case "knight":
      return 3;
    case "sentinel":
    case "witch":
    case "commander":
    case "guardian":
      return 3.5;
    case "warden":
    case "sorcerer":
    case "warchief":
    case "paladin":
      return 3.8;
    case "overseer":
    case "lich":
    case "warlord":
    case "archduke":
      return 4;
  }
};

export const getFactionRankBoostAmount = (
  game: GameState,
  base: number,
): [number, Partial<Record<BoostType, BoostValue>>] => {
  const factionName = game.faction?.name as FactionName;
  const emblems = (
    game.inventory[FACTION_EMBLEMS[factionName]] ?? new Decimal(0)
  ).toNumber();

  const rank = getFactionRanking(factionName, emblems);
  const boost = rankBoostPercentage(rank.name);

  const boosts: Partial<Record<BoostType, BoostValue>> = {};
  if (boost > 0) {
    boosts[`${rank.name} rank`] = `+${boost * 100}%`;
  }

  return [boost * base, boosts] as const;
};
