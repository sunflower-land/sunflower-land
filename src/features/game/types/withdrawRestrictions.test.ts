import {
  FLOWER_WITHDRAW_BUD_COOLDOWN_DAYS,
  hasBoostRestriction,
} from "./withdrawRestrictions";

const ONE_DAY = 24 * 60 * 60 * 1000;
const now = new Date("2025-06-01T00:00:00Z").getTime();

describe("hasBoostRestriction", () => {
  describe("boost cooldowns", () => {
    it("does not restrict an item that has never been used", () => {
      expect(
        hasBoostRestriction({ boostUsedAt: {}, createdAt: now, item: "Nancy" }),
      ).toEqual({ isRestricted: false, cooldownTimeLeft: 0 });
    });

    it("restricts an item used within its cooldown", () => {
      const { isRestricted } = hasBoostRestriction({
        boostUsedAt: { Nancy: now - ONE_DAY },
        createdAt: now,
        item: "Nancy",
      });

      expect(isRestricted).toBe(true);
    });

    it("restricts a bud used within its 2 day cooldown", () => {
      const { isRestricted } = hasBoostRestriction({
        boostUsedAt: { "Bud #1": now - ONE_DAY },
        createdAt: now,
        item: "Bud #1",
      });

      expect(isRestricted).toBe(true);
    });

    it("does not restrict a bud once its 2 day cooldown has passed", () => {
      const { isRestricted } = hasBoostRestriction({
        boostUsedAt: { "Bud #1": now - 3 * ONE_DAY },
        createdAt: now,
        item: "Bud #1",
      });

      expect(isRestricted).toBe(false);
    });
  });

  describe("FLOWER withdrawal cooldown", () => {
    it("restricts every bud for 7 days after a FLOWER withdrawal", () => {
      const { isRestricted, cooldownTimeLeft } = hasBoostRestriction({
        boostUsedAt: {},
        createdAt: now,
        item: "Bud #1",
        flowerWithdrawnAt: now - ONE_DAY,
      });

      expect(isRestricted).toBe(true);
      expect(cooldownTimeLeft).toEqual(
        ONE_DAY * (FLOWER_WITHDRAW_BUD_COOLDOWN_DAYS - 1),
      );
    });

    it("restricts a bud that has never been used as a boost", () => {
      const { isRestricted } = hasBoostRestriction({
        boostUsedAt: undefined,
        createdAt: now,
        item: "Bud #9999",
        flowerWithdrawnAt: now,
      });

      expect(isRestricted).toBe(true);
    });

    it("stops restricting once 7 days have passed", () => {
      const { isRestricted } = hasBoostRestriction({
        boostUsedAt: {},
        createdAt: now,
        item: "Bud #1",
        flowerWithdrawnAt:
          now - ONE_DAY * FLOWER_WITHDRAW_BUD_COOLDOWN_DAYS - 1,
      });

      expect(isRestricted).toBe(false);
    });

    it("does not restrict non bud items", () => {
      const { isRestricted } = hasBoostRestriction({
        boostUsedAt: {},
        createdAt: now,
        item: "Nancy",
        flowerWithdrawnAt: now,
      });

      expect(isRestricted).toBe(false);
    });

    it("does not restrict buds when no FLOWER has been withdrawn", () => {
      const { isRestricted } = hasBoostRestriction({
        boostUsedAt: {},
        createdAt: now,
        item: "Bud #1",
        flowerWithdrawnAt: undefined,
      });

      expect(isRestricted).toBe(false);
    });

    it("keeps the longest remaining cooldown when a bud is also boost locked", () => {
      // Boost cooldown (2 days) has 1 day left, FLOWER lock has 6 days left
      const { cooldownTimeLeft } = hasBoostRestriction({
        boostUsedAt: { "Bud #1": now - ONE_DAY },
        createdAt: now,
        item: "Bud #1",
        flowerWithdrawnAt: now - ONE_DAY,
      });

      expect(cooldownTimeLeft).toEqual(
        ONE_DAY * (FLOWER_WITHDRAW_BUD_COOLDOWN_DAYS - 1),
      );
    });

    it("keeps the boost cooldown when it outlasts the FLOWER lock", () => {
      const { cooldownTimeLeft } = hasBoostRestriction({
        boostUsedAt: { "Bud #1": now },
        createdAt: now,
        item: "Bud #1",
        flowerWithdrawnAt:
          now - ONE_DAY * (FLOWER_WITHDRAW_BUD_COOLDOWN_DAYS - 1),
      });

      expect(cooldownTimeLeft).toEqual(ONE_DAY * 2);
    });
  });
});
