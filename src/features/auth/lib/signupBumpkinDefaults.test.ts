import { ALLOWED_BUMPKIN_ITEMS } from "features/game/types/bumpkin";
import {
  getSignupWardrobe,
  DEFAULT_SIGNUP_EQUIPMENT,
} from "./signupBumpkinDefaults";

describe("signupBumpkinDefaults", () => {
  describe("getSignupWardrobe", () => {
    it("returns an object with each ALLOWED_BUMPKIN_ITEMS key and value 1", () => {
      const wardrobe = getSignupWardrobe();
      expect(ALLOWED_BUMPKIN_ITEMS.every((name) => wardrobe[name] === 1)).toBe(
        true,
      );
      expect(Object.keys(wardrobe).length).toBe(ALLOWED_BUMPKIN_ITEMS.length);
    });
  });

  describe("DEFAULT_SIGNUP_EQUIPMENT", () => {
    const requiredSlots = [
      "background",
      "body",
      "hair",
      "shirt",
      "pants",
      "shoes",
      "tool",
    ] as const;

    it("has all required slots", () => {
      for (const slot of requiredSlots) {
        expect(DEFAULT_SIGNUP_EQUIPMENT[slot]).toBeDefined();
        expect(typeof DEFAULT_SIGNUP_EQUIPMENT[slot]).toBe("string");
      }
    });

    it("has shirt and pants and no dress (no dress+shirt conflict)", () => {
      expect(DEFAULT_SIGNUP_EQUIPMENT.shirt).toBeDefined();
      expect(DEFAULT_SIGNUP_EQUIPMENT.pants).toBeDefined();
      expect(DEFAULT_SIGNUP_EQUIPMENT.dress).toBeUndefined();
    });

    it("values are from allowed sets (each key present in getSignupWardrobe)", () => {
      const wardrobe = getSignupWardrobe();
      for (const value of Object.values(DEFAULT_SIGNUP_EQUIPMENT)) {
        if (value) expect(wardrobe[value]).toBe(1);
      }
    });
  });
});
