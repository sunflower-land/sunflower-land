import { BumpkinItem } from "./bumpkin";
import {
  areAnyChickensFed,
  areAnyCrimstonesMined,
  areAnyFruitsGrowing,
  areAnyOilReservesDrilled,
  areFlowersGrowing,
  areFruitsGrowing,
  cropIsGrowing,
  greenhouseCropIsGrowing,
  isProducingHoney,
  isBeehivesFull,
  isCrimstoneHammerActive,
  areAnyOGFruitsGrowing,
  hasFishedToday,
  areBonusTreasureHolesDug,
  areAnyCropsOrGreenhouseCropsGrowing,
  hasOpenedPirateChest,
  areAnySheepSleeping,
  areAnyCowsSleeping,
} from "./removeables";
import { GameState } from "./game";

interface isWithdrawable {
  (state: GameState): boolean;
}

const withdrawConditions: Partial<Record<BumpkinItem, isWithdrawable>> = {
  "Green Amulet": (state) => !areAnyCropsOrGreenhouseCropsGrowing(state)[0],
  "Angel Wings": (state) => !areAnyCropsOrGreenhouseCropsGrowing(state)[0],
  "Devil Wings": (state) => !areAnyCropsOrGreenhouseCropsGrowing(state)[0],
  "Infernal Pitchfork": (state) =>
    !areAnyCropsOrGreenhouseCropsGrowing(state)[0],
  "Sunflower Amulet": (state) =>
    !cropIsGrowing({ item: "Sunflower", game: state })[0],
  "Carrot Amulet": (state) =>
    !cropIsGrowing({ item: "Carrot", game: state })[0],
  "Beetroot Amulet": (state) =>
    !cropIsGrowing({ item: "Beetroot", game: state })[0],
  Parsnip: (state) => !cropIsGrowing({ item: "Parsnip", game: state })[0],
  "Eggplant Onesie": (state) =>
    !cropIsGrowing({ item: "Eggplant", game: state })[0],
  "Corn Onesie": (state) => !cropIsGrowing({ item: "Corn", game: state })[0],
  "Tofu Mask": (state) => !cropIsGrowing({ item: "Soybean", game: state })[0],
  "Non La Hat": (state) =>
    !greenhouseCropIsGrowing({ crop: "Rice", game: state })[0],
  "Olive Shield": (state) =>
    !greenhouseCropIsGrowing({ crop: "Olive", game: state })[0],
  "Olive Royalty Shirt": (state) =>
    !greenhouseCropIsGrowing({ crop: "Olive", game: state })[0],
  "Fruit Picker Apron": (state) => !areAnyOGFruitsGrowing(state)[0],
  "Camel Onesie": (state) => !areAnyFruitsGrowing(state)[0],
  "Banana Amulet": (state) => !areFruitsGrowing(state, "Banana")[0],
  "Banana Onesie": (state) => !areFruitsGrowing(state, "Banana")[0],
  "Grape Pants": (state) =>
    !greenhouseCropIsGrowing({ crop: "Grape", game: state })[0],
  "Lemon Shield": (state) => !areFruitsGrowing(state, "Lemon")[0],
  Cattlegrim: (state) => !areAnyChickensFed(state)[0],
  "Luna's Hat": (state) =>
    !(
      state.buildings["Fire Pit"]?.[0].crafting ||
      state.buildings["Kitchen"]?.[0].crafting ||
      state.buildings["Bakery"]?.[0].crafting ||
      state.buildings["Deli"]?.[0].crafting ||
      state.buildings["Smoothie Shack"]?.[0].crafting
    ),
  "Ancient Rod": (state) => !hasFishedToday(state)[0],
  "Flower Crown": (state) => !areFlowersGrowing(state)[0],
  "Beekeeper Hat": (state) => !isProducingHoney(state)[0],
  "Bee Suit": (state) => !isProducingHoney(state)[0],
  "Honeycomb Shield": (state) => !isProducingHoney(state)[0],
  "Crimstone Amulet": (state) => !areAnyCrimstonesMined(state)[0],
  "Crimstone Armor": (state) => !areAnyCrimstonesMined(state)[0],
  "Crimstone Hammer": (state) => !isCrimstoneHammerActive(state)[0],
  "Oil Can": (state) => !areAnyOilReservesDrilled(state)[0],
  "Infernal Drill": (state) => !areAnyOilReservesDrilled(state)[0],
  "Dev Wrench": (state) => !areAnyOilReservesDrilled(state)[0],
  "Oil Overalls": (state) => !areAnyOilReservesDrilled(state)[0],
  "Hornet Mask": (state) => isBeehivesFull(state)[0],
  "Ancient Shovel": (state) => areBonusTreasureHolesDug(state)[0],
  "Pirate Potion": (state) => !hasOpenedPirateChest(state)[0],
  "Dream Scarf": (state) => !areAnySheepSleeping(state)[0],
  "Milk Apron": (state) => !areAnyCowsSleeping(state)[0],
  "Infernal Bullwhip": (state) =>
    !areAnySheepSleeping(state)[0] || !areAnyCowsSleeping(state)[0],
  "Black Sheep Onesie": (state) => !areAnySheepSleeping(state)[0],
  "Chicken Suit": (state) => !areAnyChickensFed(state)[0],
  "Merino Jumper": (state) => !areAnySheepSleeping(state)[0],
  "Cowbell Necklace": (state) => !areAnyCowsSleeping(state)[0],
};

export const canWithdrawBoostedWearable = (
  name: BumpkinItem,
  state?: GameState,
): boolean => {
  if (!state) return false;

  if ((state.wardrobe?.[name] ?? 0) > 1) return true;

  return withdrawConditions[name]?.(state) ?? false;
};
