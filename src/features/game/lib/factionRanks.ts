import { FactionName } from "../types/game";

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

export const RANKS: Record<FactionRank, Rank> = {
  // Bumpkins
  forager: {
    name: "rancher",
    faction: "bumpkins",
    emblemsRequired: 0,
    icon: bumpkins_chevron_zero,
  },
  rancher: {
    name: "rancher",
    faction: "bumpkins",
    emblemsRequired: 35,
    icon: bumpkins_chevron_one,
    boost: "+5% Marks",
  },
  agrarian: {
    name: "agrarian",
    faction: "bumpkins",
    emblemsRequired: 300,
    icon: bumpkins_chevron_two,
    boost: "+150% Marks",
  },
  steward: {
    name: "steward",
    faction: "bumpkins",
    emblemsRequired: 2500,
    icon: bumpkins_chevron_three,
    boost: "+300% Marks",
  },
  sentinel: {
    name: "sentinel",
    faction: "bumpkins",
    emblemsRequired: 5000,
    icon: bumpkins_chevron_four,
    boost: "+350% Marks",
  },
  warden: {
    name: "warden",
    faction: "bumpkins",
    emblemsRequired: 9000,
    icon: bumpkins_chevron_five,
    boost: "+380% Marks",
  },
  overseer: {
    name: "overseer",
    faction: "bumpkins",
    emblemsRequired: 16000,
    icon: bumpkins_chevron_six,
    boost: "+400% Marks",
  },
  // Nightshades
  pagan: {
    name: "pagan",
    faction: "nightshades",
    emblemsRequired: 0,
    icon: nightshades_chevron_zero,
  },
  occultist: {
    name: "occultist",
    faction: "nightshades",
    emblemsRequired: 35,
    icon: nightshades_chevron_one,
    boost: "+5% Marks",
  },
  enchanter: {
    name: "enchanter",
    faction: "nightshades",
    emblemsRequired: 350,
    icon: nightshades_chevron_two,
    boost: "+150% Marks",
  },
  raver: {
    name: "raver",
    faction: "nightshades",
    emblemsRequired: 2700,
    icon: nightshades_chevron_three,
    boost: "+300% Marks",
  },
  witch: {
    name: "witch",
    faction: "nightshades",
    emblemsRequired: 5500,
    icon: nightshades_chevron_four,
    boost: "+350% Marks",
  },
  sorcerer: {
    name: "sorcerer",
    faction: "nightshades",
    emblemsRequired: 8500,
    icon: nightshades_chevron_five,
    boost: "+380% Marks",
  },
  lich: {
    name: "lich",
    faction: "nightshades",
    emblemsRequired: 15000,
    icon: nightshades_chevron_six,
    boost: "+400% Marks",
  },
  // Goblins
  hobgoblin: {
    name: "hobgoblin",
    faction: "goblins",
    emblemsRequired: 0,
    icon: goblins_chevron_zero,
  },
  grunt: {
    name: "grunt",
    faction: "goblins",
    emblemsRequired: 45,
    icon: goblins_chevron_one,
    boost: "+5% Marks",
  },
  marauder: {
    name: "marauder",
    faction: "goblins",
    emblemsRequired: 500,
    icon: goblins_chevron_two,
    boost: "+150% Marks",
  },
  elite: {
    name: "elite",
    faction: "goblins",
    emblemsRequired: 4200,
    icon: goblins_chevron_three,
    boost: "+300% Marks",
  },
  commander: {
    name: "commander",
    faction: "goblins",
    emblemsRequired: 8000,
    icon: goblins_chevron_four,
    boost: "+350% Marks",
  },
  warchief: {
    name: "warchief",
    faction: "goblins",
    emblemsRequired: 13000,
    icon: goblins_chevron_five,
    boost: "+380% Marks",
  },
  warlord: {
    name: "warlord",
    faction: "goblins",
    emblemsRequired: 17000,
    icon: goblins_chevron_six,
    boost: "+400% Marks",
  },
  // Sunflorians
  initiate: {
    name: "initiate",
    faction: "sunflorians",
    emblemsRequired: 0,
    icon: sunflorians_chevron_zero,
  },
  squire: {
    name: "squire",
    faction: "sunflorians",
    emblemsRequired: 45,
    icon: sunflorians_chevron_one,
    boost: "+5% Marks",
  },
  captain: {
    name: "captain",
    faction: "sunflorians",
    emblemsRequired: 400,
    icon: sunflorians_chevron_two,
    boost: "+150% Marks",
  },
  knight: {
    name: "knight",
    faction: "sunflorians",
    emblemsRequired: 3000,
    icon: sunflorians_chevron_three,
    boost: "+300% Marks",
  },
  guardian: {
    name: "guardian",
    faction: "sunflorians",
    emblemsRequired: 6000,
    icon: sunflorians_chevron_four,
    boost: "+350% Marks",
  },
  paladin: {
    name: "paladin",
    faction: "sunflorians",
    emblemsRequired: 11000,
    icon: sunflorians_chevron_five,
    boost: "+380% Marks",
  },
  archduke: {
    name: "archduke",
    faction: "sunflorians",
    emblemsRequired: 17000,
    icon: sunflorians_chevron_six,
    boost: "+400% Marks",
  },
};

export const getFactionRanking = (
  faction: FactionName,
  emblems: number,
): Rank => {
  const ranks = Object.values(RANKS)
    .filter((rank) => rank.faction === faction)
    .sort((a, b) => a.emblemsRequired - b.emblemsRequired);
  const rank = ranks.find((rank) => rank.emblemsRequired > emblems);

  return rank!;
};
