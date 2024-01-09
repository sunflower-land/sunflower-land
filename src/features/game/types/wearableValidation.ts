import { BumpkinItem } from "./bumpkin";
import { GoblinState } from "../lib/goblinMachine";
import { getDailyFishingCount } from "./fishing";
import {
  areAnyChickensFed,
  areAnyCropsGrowing,
  areAnyFruitsGrowing,
  areFruitsGrowing,
  cropIsGrowing,
} from "./removeables";

export const canWithdrawBoostedWearable = (
  wearable: BumpkinItem,
  state?: GoblinState
) => {
  if (!state) return false;

  if (
    wearable === "Green Amulet" ||
    wearable === "Angel Wings" ||
    wearable === "Devil Wings" ||
    wearable === "Infernal Pitchfork"
  ) {
    return !areAnyCropsGrowing(state)[0];
  }

  if (wearable === "Sunflower Amulet") {
    return !cropIsGrowing({ item: "Sunflower", game: state })[0];
  }

  if (wearable === "Carrot Amulet") {
    return !cropIsGrowing({ item: "Carrot", game: state })[0];
  }

  if (wearable === "Beetroot Amulet") {
    return !cropIsGrowing({ item: "Beetroot", game: state })[0];
  }

  if (wearable === "Parsnip") {
    return !cropIsGrowing({ item: "Parsnip", game: state })[0];
  }

  if (wearable === "Eggplant Onesie") {
    return !cropIsGrowing({ item: "Eggplant", game: state })[0];
  }

  if (wearable === "Corn Onesie") {
    return !cropIsGrowing({ item: "Corn", game: state })[0];
  }

  if (wearable === "Fruit Picker Apron") {
    return !areAnyFruitsGrowing(state)[0];
  }

  if (wearable === "Banana Amulet") {
    return !areFruitsGrowing(state, "Banana")[0];
  }

  if (wearable === "Cattlegrim") {
    return !areAnyChickensFed(state)[0];
  }

  if (wearable === "Luna's Hat") {
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

  if (wearable === "Ancient Rod") {
    return getDailyFishingCount(state) == 0;
  }

  // Safety check
  return false;
};
