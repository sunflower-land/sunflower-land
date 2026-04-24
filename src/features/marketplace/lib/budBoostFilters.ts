import { Bud } from "lib/buds/types";

export const BUD_BOOST_FILTER_OPTIONS = [
  "Basic Crops",
  "Medium Crops",
  "Advanced Crops",
  "All Crops",
  "Crop Growth Time",
  "Carrot",
  "Sunflower",
  "Fruit",
  "Mushroom",
  "Magic Mushroom",
  "Wood",
  "Stone",
  "Iron",
  "Gold",
  "Minerals",
  "Egg",
  "Animal Produce",
  "Fish",
  "Bumpkin XP from Fish",
];

const BUD_TYPE_BOOST_FILTERS: Partial<Record<Bud["type"], string>> = {
  Plaza: "Basic Crops",
  Woodlands: "Wood",
  Cave: "Minerals",
  Sea: "Fish",
  Castle: "Medium Crops",
  Port: "Bumpkin XP from Fish",
  Retreat: "Animal Produce",
  Saphiro: "Crop Growth Time",
  Snow: "Advanced Crops",
  Beach: "Fruit",
};

const BUD_STEM_BOOST_FILTERS: Partial<Record<Bud["stem"], string>> = {
  "3 Leaf Clover": "All Crops",
  "Fish Hat": "Fish",
  "Diamond Gem": "Minerals",
  "Gold Gem": "Gold",
  "Miner Hat": "Iron",
  "Carrot Head": "Carrot",
  "Sunflower Hat": "Sunflower",
  "Basic Leaf": "Basic Crops",
  "Ruby Gem": "Stone",
  Mushroom: "Mushroom",
  "Magic Mushroom": "Magic Mushroom",
  "Acorn Hat": "Wood",
  Banana: "Fruit",
  "Tree Hat": "Wood",
  "Egg Head": "Egg",
  "Apple Head": "Fruit",
};

export const getBudBoostFilterLabels = (
  bud?: Pick<Bud, "type" | "stem"> | undefined,
) => {
  const labels = new Set<string>();

  const typeBoost = bud?.type ? BUD_TYPE_BOOST_FILTERS[bud.type] : undefined;
  const stemBoost = bud?.stem ? BUD_STEM_BOOST_FILTERS[bud.stem] : undefined;

  if (typeBoost) {
    labels.add(typeBoost);
  }

  if (stemBoost) {
    labels.add(stemBoost);
  }

  return [...labels];
};
