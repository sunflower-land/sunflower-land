import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { getTimeUntilNextFreeReset, resetSkills } from "./resetSkills";

describe("resetSkills", () => {
  const dateNow = Date.now();

  it("requires Bumpkin to have skills", () => {
    expect(() => {
      resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {},
          },
        },
        action: { type: "skills.reset", paymentType: "free" },
        createdAt: dateNow,
      });
    }).toThrow("You do not have any skills to reset");
  });

  describe("free reset", () => {
    it("requires Bumpkin to wait 180 days before free reset", () => {
      const oneSeventyDaysAgo = new Date(dateNow);
      oneSeventyDaysAgo.setDate(oneSeventyDaysAgo.getDate() - 170);

      const timeUntilNextReset = getTimeUntilNextFreeReset(
        oneSeventyDaysAgo.getTime(),
        dateNow,
      );
      const daysRemaining = Math.ceil(
        timeUntilNextReset / (1000 * 60 * 60 * 24),
      );

      expect(() => {
        resetSkills({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...TEST_BUMPKIN,
              skills: { "Green Thumb": 1 },
              previousFreeSkillResetAt: oneSeventyDaysAgo.getTime(),
            },
          },
          action: { type: "skills.reset", paymentType: "free" },
          createdAt: dateNow,
        });
      }).toThrow(`Wait ${daysRemaining} more days for free reset or use gems`);
    });

    it("resets Bumpkin skills after 6 months for free", () => {
      const sixMonthsAgo = new Date(dateNow);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            previousFreeSkillResetAt: sixMonthsAgo.getTime(),
            paidSkillResets: 2, // Should be cleared after free reset
          },
        },
        action: { type: "skills.reset", paymentType: "free" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
      expect(state.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
      expect(state.bumpkin?.paidSkillResets ?? 0).toEqual(0);
    });
  });

  describe("gem reset", () => {
    it("requires enough gems for first reset", () => {
      expect(() => {
        resetSkills({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...TEST_BUMPKIN,
              skills: { "Green Thumb": 1 },
            },
            inventory: {
              Gem: new Decimal(100),
            },
          },
          action: { type: "skills.reset", paymentType: "gems" },
          createdAt: dateNow,
        });
      }).toThrow("Not enough gems. Cost: 200 gems");
    });

    it("doubles gem cost for each reset within 4 months", () => {
      const state = {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: { "Green Thumb": 1 },
          paidSkillResets: 1, // One previous reset
        },
        inventory: {
          Gem: new Decimal(400),
        },
      };

      const result = resetSkills({
        state,
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(result.bumpkin?.paidSkillResets).toEqual(2);
      expect(result.inventory.Gem?.toNumber()).toEqual(0);
      expect(result.bumpkin?.skills).toEqual({});
    });

    it("successfully resets skills with gems", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
          },
          inventory: {
            Gem: new Decimal(300),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
      expect(state.bumpkin?.paidSkillResets).toEqual(1);
      expect(state.inventory.Gem?.toNumber()).toEqual(100);
      expect(state.bumpkin?.previousFreeSkillResetAt).toBeUndefined();
    });
  });

  describe("validation checks", () => {
    it("succeeds reset with crops in additional slots (post-split no restriction)", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Green Thumb": 1,
              "Field Expansion Module": 1,
            },
          },
          buildings: {
            "Crop Machine": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
                queue: new Array(6).fill({}), // 6 crops (more than 5)
              },
            ],
          },
          inventory: {
            Gem: new Decimal(300),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
    });

    it("succeeds reset with excess oil in tank (post-split no restriction)", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: {
              "Green Thumb": 1,
              "Leak-Proof Tank": 1,
            },
          },
          buildings: {
            "Crop Machine": [
              {
                unallocatedOilTime: 49 * 60 * 60 * 1000, // 49 hours (more than 48)
                id: "123",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
          inventory: {
            Gem: new Decimal(300),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
    });
  });
});
