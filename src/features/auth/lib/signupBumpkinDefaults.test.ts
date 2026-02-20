import {
  ALLOWED_BUMPKIN_ITEMS,
  BUMPKIN_ITEM_PART,
} from "features/game/types/bumpkin";
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

    it("contains no dress items (signup requires shirt and pants only)", () => {
      const wardrobe = getSignupWardrobe();
      const signupItemNames = Object.keys(wardrobe);
      const dressItems = signupItemNames.filter(
        (name) => BUMPKIN_ITEM_PART[name] === "dress",
      );
      expect(dressItems).toHaveLength(0);
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

    it("has all required slots (shirt and pants required; no default dress)", () => {
      for (const slot of requiredSlots) {
        expect(DEFAULT_SIGNUP_EQUIPMENT[slot]).toBeDefined();
        expect(typeof DEFAULT_SIGNUP_EQUIPMENT[slot]).toBe("string");
      }
    });

    it("uses shirt and pants only (no dress, since there is no dress in signup allowed set)", () => {
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
