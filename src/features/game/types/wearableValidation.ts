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
import { isWearableActive } from "../lib/wearables";

export const canWithdrawBoostedWearable = (
  _: BumpkinItem,
  state?: GoblinState
) => {
  if (!state) return false;

  if (
    isWearableActive({ name: "Green Amulet", game: state }) ||
    isWearableActive({ name: "Angel Wings", game: state }) ||
    isWearableActive({ name: "Devil Wings", game: state }) ||
    isWearableActive({ name: "Infernal Pitchfork", game: state })
  ) {
    return !areAnyCropsGrowing(state)[0];
  }

  if (isWearableActive({ name: "Sunflower Amulet", game: state })) {
    return !cropIsGrowing({ item: "Sunflower", game: state })[0];
  }

  if (isWearableActive({ name: "Carrot Amulet", game: state })) {
    return !cropIsGrowing({ item: "Carrot", game: state })[0];
  }

  if (isWearableActive({ name: "Beetroot Amulet", game: state })) {
    return !cropIsGrowing({ item: "Beetroot", game: state })[0];
  }

  if (isWearableActive({ name: "Parsnip", game: state })) {
    return !cropIsGrowing({ item: "Parsnip", game: state })[0];
  }

  if (isWearableActive({ name: "Eggplant Onesie", game: state })) {
    return !cropIsGrowing({ item: "Eggplant", game: state })[0];
  }

  if (isWearableActive({ name: "Corn Onesie", game: state })) {
    return !cropIsGrowing({ item: "Corn", game: state })[0];
  }

  if (isWearableActive({ name: "Fruit Picker Apron", game: state })) {
    return !areAnyFruitsGrowing(state)[0];
  }

  if (isWearableActive({ name: "Banana Amulet", game: state })) {
    return !areFruitsGrowing(state, "Banana")[0];
  }

  if (isWearableActive({ name: "Cattlegrim", game: state })) {
    return !areAnyChickensFed(state)[0];
  }

  if (isWearableActive({ name: "Luna's Hat", game: state })) {
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

  if (isWearableActive({ name: "Ancient Rod", game: state })) {
    return getDailyFishingCount(state) == 0;
  }

  // Safety check
  return false;
};
