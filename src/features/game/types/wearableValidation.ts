import { getKeys } from "./craftables";
import { BumpkinItem } from "./bumpkin";
import { GoblinState } from "../lib/goblinMachine";
import { getDailyFishingCount } from "./fishing";

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
    return getKeys(state.crops).every((id) => !state.crops[id].crop);
  }

  if (wearable === "Sunflower Amulet") {
    return getKeys(state.crops).every(
      (id) => state.crops[id].crop?.name !== "Sunflower"
    );
  }

  if (wearable === "Carrot Amulet") {
    return getKeys(state.crops).every(
      (id) => state.crops[id].crop?.name !== "Carrot"
    );
  }

  if (wearable === "Beetroot Amulet") {
    return getKeys(state.crops).every(
      (id) => state.crops[id].crop?.name !== "Beetroot"
    );
  }

  if (wearable === "Parsnip") {
    return getKeys(state.crops).every(
      (id) => state.crops[id].crop?.name !== "Parsnip"
    );
  }

  if (wearable === "Eggplant Onesie") {
    return getKeys(state.crops).every(
      (id) => state.crops[id].crop?.name !== "Eggplant"
    );
  }

  if (wearable === "Corn Onesie") {
    return getKeys(state.crops).every(
      (id) => state.crops[id].crop?.name !== "Corn"
    );
  }

  if (wearable === "Fruit Picker Apron") {
    return getKeys(state.fruitPatches).every(
      (id) => state.fruitPatches[id].fruit === undefined
    );
  }

  if (wearable === "Banana Amulet") {
    return getKeys(state.fruitPatches).every(
      (id) => state.fruitPatches[id].fruit?.name !== "Banana"
    );
  }

  if (wearable === "Cattlegrim") {
    return getKeys(state.chickens).every((id) => !state.chickens[id].fedAt);
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
