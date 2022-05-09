export type ContributorRole = "coder" | "artist" | "moderator" | "ambassador";
export type Contributor = {
  name: string;
  url: string;
  farmId: number;
  role: ContributorRole[];
  avatar:
    | "woman"
    | "man"
    | "goblin"
    | "bumpkin"
    | "finn"
    | "andejaus"
    | "dee"
    | "tiff"
    | "vp"
    | "aestnelis"
    | "kaiojans"
    | "benahol"
    | "denlon"
    | "manbino"
    | "gobleyh"
    | "baalex"
    | "minion"
    | "chicken"
    | "inu"
    | "telknub"
    | "littleeinst"
    | "ant"
    | "complic"
    | "shykun";
};

function shuffledArrary(array: Contributor[]) {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

/**
 * Randomize the list of contributors
 */
export const CONTRIBUTORS = shuffledArrary([
  {
    name: "Bumpkin Builder",
    url: "https://twitter.com/bumpkinbuilder",
    farmId: 1,
    role: ["coder", "artist"],
    avatar: "bumpkin",
  },

  {
    name: "Romy",
    url: "https://twitter.com/rofrtd",
    farmId: 2,
    role: ["coder", "artist"],
    avatar: "goblin",
  },
  {
    name: "InuBakaBo",
    url: "",
    farmId: 57,
    role: ["ambassador"],
    avatar: "inu",
  },
  {
    name: "Beastrong23",
    url: "https://github.com/j923sneaks",
    farmId: 33,
    role: ["coder"],
    avatar: "man",
  },
  {
    name: "Alex Hurley",
    url: "https://github.com/ahh1539",
    farmId: 4574,
    role: ["coder"],
    avatar: "man",
  },
  {
    name: "NIGHT",
    url: "https://mobile.twitter.com/ayoubrha1",
    farmId: 24,
    role: ["artist"],
    avatar: "goblin",
  },
  {
    name: "Vergel",
    url: "https://mobile.twitter.com/Vergelsxtn",
    farmId: 63,
    role: ["artist"],
    avatar: "man",
  },
  {
    name: "Telk",
    url: "",
    farmId: 86,
    role: ["artist"],
    avatar: "telknub",
  },
  {
    name: "Zakaria TIBTIBA",
    url: "https://mobile.twitter.com/ZikouTib",
    role: ["artist", "coder"],
    farmId: 87,
    avatar: "goblin",
  },
  {
    name: "Rafael",
    url: "https://github.com/jcads",
    role: ["coder"],
    farmId: 11,
    avatar: "man",
  },
  {
    name: "Paluras",
    url: "https://mobile.twitter.com/andrei_palura",
    role: ["artist"],
    farmId: 60,
    avatar: "andejaus",
  },
  {
    name: "Alvin Valdez",
    url: "https://github.com/alvinphoebeartemis",
    role: ["coder"],
    farmId: 2965,
    avatar: "man",
  },
  {
    name: "Pranav",
    url: "https://github.com/pranav-yadav",
    role: ["coder"],
    farmId: 43,
    avatar: "man",
  },
  {
    name: "Denlon",
    url: "https://discordapp.com/users/373402771678035969",
    role: ["ambassador", "coder"],
    farmId: 1970,
    avatar: "denlon",
  },
  {
    name: "Aestnelis",
    url: "https://twitter.com/containsapathy",
    role: ["artist"],
    farmId: 10,
    avatar: "aestnelis",
  },
  {
    name: "Tiffanydys",
    url: "https://github.com/tiffanydys",
    role: ["coder"],
    farmId: 49,
    avatar: "tiff",
  },
  {
    name: "Ancient Horse",
    url: "",
    role: ["coder"],
    farmId: 28,
    avatar: "goblin",
  },
  {
    name: "IHanser",
    url: "",
    role: ["coder"],
    farmId: 95,
    avatar: "man",
  },
  {
    name: "Kyle M.",
    url: "https://github.com/newb23",
    role: ["coder"],
    farmId: 68453,
    avatar: "goblin",
  },
  {
    name: "Sacul",
    url: "",
    role: ["moderator"],
    farmId: 51,
    avatar: "goblin",
  },
  {
    name: "na66ime",
    url: "",
    role: ["moderator"],
    farmId: 100,
    avatar: "goblin",
  },
  {
    name: "Bubbagump",
    url: "",
    role: ["moderator"],
    farmId: 12,
    avatar: "goblin",
  },
  {
    name: "Cody",
    url: "",
    role: ["moderator"],
    farmId: 209,
    avatar: "man",
  },
  {
    name: "Toxic",
    url: "",
    role: ["moderator"],
    farmId: 48,
    avatar: "man",
  },
  {
    name: "MrDay",
    url: "",
    role: ["moderator"],
    farmId: 30,
    avatar: "man",
  },
  {
    name: "Labochi",
    url: "",
    role: ["moderator"],
    farmId: 26,
    avatar: "man",
  },
  {
    name: "Slayer",
    url: "",
    role: ["moderator"],
    farmId: 68,
    avatar: "man",
  },
  {
    name: "Gobleyh",
    url: "https://www.instagram.com/gobleyh/",
    role: ["moderator"],
    farmId: 44,
    avatar: "gobleyh",
  },
  {
    name: "Reymar | READY",
    url: "",
    role: ["moderator"],
    farmId: 168,
    avatar: "goblin",
  },
  {
    name: "Aeon",
    url: "",
    role: ["moderator"],
    farmId: 29,
    avatar: "goblin",
  },
  {
    name: "Jack_Fresko",
    url: "",
    role: ["moderator"],
    farmId: 52,
    avatar: "man",
  },
  {
    name: "Zikou",
    url: "",
    role: ["moderator"],
    farmId: 87,
    avatar: "goblin",
  },
  {
    name: "K' 🍯",
    url: "",
    role: ["moderator"],
    farmId: 70,
    avatar: "man",
  },
  {
    name: "Labochi",
    url: "",
    role: ["moderator"],
    farmId: 26,
    avatar: "man",
  },
  {
    name: "percusSHOn",
    url: "",
    role: ["moderator"],
    farmId: 19,
    avatar: "man",
  },
  {
    name: "Lucifer⁶⁶⁶死神",
    url: "",
    role: ["moderator"],
    farmId: 37,
    avatar: "man",
  },
  {
    name: "IBTrollin",
    url: "",
    role: ["moderator"],
    farmId: 40,
    avatar: "goblin",
  },
  {
    name: "AKCH1N",
    url: "",
    role: ["moderator"],
    farmId: 15,
    avatar: "goblin",
  },
  {
    name: "Complic",
    url: "",
    role: ["moderator"],
    farmId: 20,
    avatar: "complic",
  },
  {
    name: "wendin",
    url: "",
    role: ["moderator"],
    farmId: 21,
    avatar: "man",
  },
  {
    name: "Danjo",
    url: "",
    role: ["moderator"],
    farmId: 31,
    avatar: "man",
  },
  {
    name: "MaikeruKonare",
    url: "",
    role: ["moderator"],
    farmId: 229,
    avatar: "goblin",
  },
  {
    name: "PecelTumpang",
    url: "",
    role: ["moderator"],
    farmId: 13,
    avatar: "man",
  },
  {
    name: "Manbino",
    url: "https://twitter.com/onibnam",
    role: ["moderator"],
    farmId: 16,
    avatar: "manbino",
  },
  {
    name: "Ant",
    url: "",
    role: ["moderator"],
    farmId: 39,
    avatar: "ant",
  },
  {
    name: "Rhaegal",
    url: "",
    role: ["moderator"],
    farmId: 0,
    avatar: "goblin",
  },
  {
    name: "Citwouille",
    url: "",
    role: ["moderator"],
    farmId: 80,
    avatar: "man",
  },
  {
    name: "maxbrand99",
    url: "",
    role: ["moderator", "coder"],
    farmId: 9,
    avatar: "goblin",
  },
  {
    name: "AetherZapdos",
    url: "https://twitter.com/Netherzapdoss",
    role: ["artist"],
    farmId: 591,
    avatar: "finn",
  },
  {
    name: "vp",
    url: "",
    role: ["artist"],
    farmId: 1815,
    avatar: "vp",
  },
  {
    name: "Dee",
    url: "",
    role: ["ambassador"],
    farmId: 14,
    avatar: "dee",
  },
  {
    name: "Kaio Jansen",
    url: "https://twitter.com/KaioJansen2",
    role: ["ambassador", "artist"],
    farmId: 82,
    avatar: "kaiojans",
  },
  {
    name: "Benahol",
    url: "https://twitter.com/BenaHold",
    role: ["artist"],
    farmId: 18,
    avatar: "benahol",
  },
  {
    name: "baalex",
    url: "",
    role: ["artist"],
    farmId: 58,
    avatar: "baalex",
  },
  {
    name: "ShiningMinions",
    url: "",
    role: ["coder"],
    farmId: 31878,
    avatar: "minion",
  },
  {
    name: "ChickenCX",
    url: "",
    role: ["moderator", "coder"],
    farmId: 45,
    avatar: "chicken",
  },
  {
    name: "LittleEinstein",
    url: "",
    role: ["artist"],
    farmId: 73795,
    avatar: "littleeinst",
  },
  {
    name: "Shykun",
    url: "",
    role: ["artist"],
    farmId: 27,
    avatar: "shykun",
  },
  {
    name: "Tourist",
    url: "",
    role: ["coder"],
    farmId: 49035,
    avatar: "man",
  },
]);
