import { BumpkinItem } from "./bumpkin";
import { getDailyFishingCount } from "./fishing";
import {
  areAnyChickensFed,
  areAnyCrimstonesMined,
  areAnyCropsGrowing,
  areAnyFruitsGrowing,
  areAnyOilReservesDrilled,
  areFlowersGrowing,
  areFruitsGrowing,
  cropIsGrowing,
  greenhouseCropIsGrowing,
  isProducingHoney,
  isBeehivesFull,
} from "./removeables";
import { GameState } from "./game";

export const canWithdrawBoostedWearable = (
  name: BumpkinItem,
  state?: GameState,
) => {
  if (!state) return false;

  if (
    name === "Green Amulet" ||
    name === "Angel Wings" ||
    name === "Devil Wings" ||
    name === "Infernal Pitchfork"
  ) {
    return !areAnyCropsGrowing(state)[0];
  }

  if (name === "Sunflower Amulet") {
    return !cropIsGrowing({ item: "Sunflower", game: state })[0];
  }

  if (name === "Carrot Amulet") {
    return !cropIsGrowing({ item: "Carrot", game: state })[0];
  }

  if (name === "Beetroot Amulet") {
    return !cropIsGrowing({ item: "Beetroot", game: state })[0];
  }

  if (name === "Parsnip") {
    return !cropIsGrowing({ item: "Parsnip", game: state })[0];
  }

  if (name === "Eggplant Onesie") {
    return !cropIsGrowing({ item: "Eggplant", game: state })[0];
  }

  if (name === "Corn Onesie") {
    return !cropIsGrowing({ item: "Corn", game: state })[0];
  }

  if (name === "Tofu Mask") {
    return !cropIsGrowing({ item: "Soybean", game: state })[0];
  }

  if (name === "Non La Hat") {
    return !greenhouseCropIsGrowing({ crop: "Rice", game: state })[0];
  }

  if (name === "Olive Shield") {
    return !greenhouseCropIsGrowing({ crop: "Olive", game: state })[0];
  }

  if (name === "Fruit Picker Apron") {
    return !areAnyFruitsGrowing(state)[0];
  }

  if (name === "Banana Amulet" || name === "Banana Onesie") {
    return !areFruitsGrowing(state, "Banana")[0];
  }

  if (name === "Cattlegrim") {
    return !areAnyChickensFed(state)[0];
  }

  if (name === "Luna's Hat") {
    if (
      state.buildings["Fire Pit"]?.[0].crafting ||
      state.buildings["Kitchen"]?.[0].crafting ||
      state.buildings["Bakery"]?.[0].crafting ||
      state.buildings["Deli"]?.[0].crafting ||
      state.buildings["Smoothie Shack"]?.[0].crafting
    ) {
      return false;
    }
    return true;
  }

  if (name === "Ancient Rod") {
    return getDailyFishingCount(state) == 0;
  }

  if (name === "Flower Crown") {
    return !areFlowersGrowing(state)[0];
  }

  if (
    name === "Beekeeper Hat" ||
    name === "Bee Suit" ||
    name === "Honeycomb Shield"
  ) {
    return !isProducingHoney(state)[0];
  }

  if (name === "Crimstone Amulet" || name === "Crimstone Armor") {
    return !areAnyCrimstonesMined(state)[0];
  }

  if (name === "Oil Can") {
    return !areAnyOilReservesDrilled(state)[0];
  }

  if (name === "Hornet Mask") {
    return isBeehivesFull(state)[0];
  }

  // Safety check
  return false;
};
