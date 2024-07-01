export enum Section {
  Crops = "crops",
  Water = "water",
  Animals = "animals",
  Shop = "shop",
  Town = "town",
  Forest = "forest",
  GoblinVillage = "goblin-village",
  Merchant = "merchant",
  Boat = "boat",
  Home = "home",

  // NFT IDs
  "Sunflower Statue" = "sunflower-statue",
  "Potato Statue" = "potato-statue",
  "Christmas Tree" = "christmas-tree",
  Scarecrow = "scarecrow",
  "Farm Cat" = "farm-cat",
  "Farm Dog" = "farm-dog",
  Gnome = "gnome",
  "Chicken Coop" = "chicken-coop",
  "Sunflower Tombstone" = "sunflower-tombstone",
  "Sunflower Rock" = "sunflower-rock",
  "Goblin Crown" = "goblin-crown",
  Fountain = "fountain",
  Flags = "flags",
  Beaver = "beaver",
  "Nyon Statue" = "nyon-statue",
  Tent = "tent",
  Bath = "bath",
  "Easter Bunny" = "easter-bunny",
  "Pablo The Bunny" = "pablo-bunny",
  Observatory = "observatory",
  "Mysterious Head" = "mysterious-head",
  "Golden Bonsai" = "golden-bonsai",
  Mole = "mole",
  "Rock Golem" = "rock-golem",
  "Speed Chicken" = "speed-chicken",
  "Rich Chicken" = "rich-chicken",
  "Fat Chicken" = "fat-chicken",
  "Rooster" = "rooster",
  "Wicker Man" = "wicker-man",
  "War Recruiter" = "war-recruiter",
  "Christmas Bear" = "christmas-bear",

  // Land
  GenesisBlock = "genesisBlock",
  HeliosBackGround = "heliosBackground",
  RetreatBackground = "retreatBackground",
  SnowKingdomBackground = "snowKingdomBackground",
  TreasureIsland = "treasureIslandBackground",
  StoneHaven = "stoneHavenBackground",
  PumpkinPlaza = "pumpkinPlaza",
  BeachParty = "beachParty",
  DawnBreakerBackGround = "dawnBreakerBackground",
}

export const useScrollIntoView = () => {
  const scrollIntoView = (
    id: Section | undefined,
    behavior?: ScrollBehavior,
  ) => {
    if (!id) return;

    const el = document.getElementById(id);

    el?.scrollIntoView({
      behavior: behavior || "smooth",
      block: "center",
      inline: "center",
    });
  };

  return [scrollIntoView];
};
