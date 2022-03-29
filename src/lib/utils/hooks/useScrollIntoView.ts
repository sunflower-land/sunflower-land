export enum Section {
  Crops = "crops",
  Water = "water",
  Animals = "animals",
  Shop = "shop",
  Town = "town",
  Forest = "forest",

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
}

export const useScrollIntoView = () => {
  const scrollIntoView = (id: Section | undefined) => {
    if (!id) return;

    const el = document.getElementById(id);

    el?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  return [scrollIntoView];
};
