import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  getGemCostForSkillPoints,
  getTimeUntilNextFreeReset,
  resetSkills,
} from "./resetSkills";

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

    it("resets Bumpkin skills after 6 months for free and zeroes skillPointsUsed", () => {
      const sixMonthsAgo = new Date(dateNow);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            previousFreeSkillResetAt: sixMonthsAgo.getTime(),
            skillPointsUsed: 50,
          },
        },
        action: { type: "skills.reset", paymentType: "free" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
      expect(state.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
      expect(state.bumpkin?.skillPointsUsed).toEqual(0);
    });
  });

  describe("gem reset", () => {
    it("charges nothing for resets inside the first 200 points of history", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
          },
          inventory: {
            Gem: new Decimal(10),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
      expect(state.inventory.Gem?.toNumber()).toEqual(10);
      expect(state.bumpkin?.skillPointsUsed).toEqual(1);
    });

    it("starts charging 1 gem per point once history passes 200", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            skillPointsUsed: 200,
            previousFreeSkillResetAt: dateNow,
          },
          inventory: {
            Gem: new Decimal(10),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.inventory.Gem?.toNumber()).toEqual(9);
      expect(state.bumpkin?.skillPointsUsed).toEqual(201);
    });

    it("doubles the gem rate every 200 points past the free window", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            skillPointsUsed: 400,
            previousFreeSkillResetAt: dateNow,
          },
          inventory: {
            Gem: new Decimal(10),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.inventory.Gem?.toNumber()).toEqual(8);
      expect(state.bumpkin?.skillPointsUsed).toEqual(401);
    });

    it("requires enough gems to cover the cost once past the free window", () => {
      expect(() => {
        resetSkills({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...TEST_BUMPKIN,
              skills: { "Green Thumb": 1 },
              skillPointsUsed: 200,
              previousFreeSkillResetAt: dateNow,
            },
            inventory: {
              Gem: new Decimal(0),
            },
          },
          action: { type: "skills.reset", paymentType: "gems" },
          createdAt: dateNow,
        });
      }).toThrow("Not enough gems. Cost: 1 gems");
    });

    it("auto-resets skillPointsUsed and stamps the timer when the 180-day window has elapsed", () => {
      const sixMonthsAgo = new Date(dateNow);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            skillPointsUsed: 500,
            previousFreeSkillResetAt: sixMonthsAgo.getTime(),
          },
          inventory: {
            Gem: new Decimal(10),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      // Window had expired, so history is treated as 0 and the 1 point removed
      // sits inside the new free window. No gem cost; new timer stamped.
      expect(state.inventory.Gem?.toNumber()).toEqual(10);
      expect(state.bumpkin?.skillPointsUsed).toEqual(1);
      expect(state.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
    });

    it("computes the cost ramp correctly across the free window and rate doublings", () => {
      // First 200 are free.
      expect(getGemCostForSkillPoints(0, 100)).toEqual(0);
      expect(getGemCostForSkillPoints(200, 0)).toEqual(0);
      // Single-point cost at each doubling boundary.
      expect(getGemCostForSkillPoints(1, 200)).toEqual(1);
      expect(getGemCostForSkillPoints(1, 400)).toEqual(2);
      expect(getGemCostForSkillPoints(1, 600)).toEqual(4);
      // Split across the free-window boundary.
      expect(getGemCostForSkillPoints(20, 190)).toEqual(10); // 10 free + 10 at 1/pt
      // Split across a doubling boundary inside the paid window.
      expect(getGemCostForSkillPoints(20, 390)).toEqual(30); // 10 at 1/pt + 10 at 2/pt
      // Sweep from 0 across two ramps: 200 free + 200 at 1/pt + 200 at 2/pt.
      expect(getGemCostForSkillPoints(600, 0)).toEqual(0 + 200 + 400);
    });
  });

  describe("ticket reset", () => {
    it("throws when the player has no Skill Reset Ticket", () => {
      expect(() => {
        resetSkills({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...TEST_BUMPKIN,
              skills: { "Green Thumb": 1 },
            },
            inventory: {},
          },
          action: { type: "skills.reset", paymentType: "ticket" },
          createdAt: dateNow,
        });
      }).toThrow("You do not have a Skill Reset Ticket");
    });

    it("throws when the ticket balance is below 1", () => {
      expect(() => {
        resetSkills({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...TEST_BUMPKIN,
              skills: { "Green Thumb": 1 },
            },
            inventory: {
              "Skill Reset Ticket": new Decimal(0),
            },
          },
          action: { type: "skills.reset", paymentType: "ticket" },
          createdAt: dateNow,
        });
      }).toThrow("You do not have a Skill Reset Ticket");
    });

    it("consumes exactly 1 Skill Reset Ticket", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
          },
          inventory: {
            "Skill Reset Ticket": new Decimal(3),
          },
        },
        action: { type: "skills.reset", paymentType: "ticket" },
        createdAt: dateNow,
      });

      expect(state.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(2);
      expect(state.bumpkin?.skills).toEqual({});
    });

    it("increments skillPointsUsed by points removed even without paying gems", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            skillPointsUsed: 10,
            previousFreeSkillResetAt: dateNow,
          },
          inventory: {
            "Skill Reset Ticket": new Decimal(1),
          },
        },
        action: { type: "skills.reset", paymentType: "ticket" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skillPointsUsed).toEqual(11);
    });

    it("does not touch previousFreeSkillResetAt when using a ticket", () => {
      const threeMonthsAgo = new Date(dateNow);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            previousFreeSkillResetAt: threeMonthsAgo.getTime(),
          },
          inventory: {
            "Skill Reset Ticket": new Decimal(1),
          },
        },
        action: { type: "skills.reset", paymentType: "ticket" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.previousFreeSkillResetAt).toEqual(
        threeMonthsAgo.getTime(),
      );
    });

    it("does not deduct gems when using a ticket", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
          },
          inventory: {
            "Skill Reset Ticket": new Decimal(1),
            Gem: new Decimal(500),
          },
        },
        action: { type: "skills.reset", paymentType: "ticket" },
        createdAt: dateNow,
      });

      expect(state.inventory.Gem?.toNumber()).toEqual(500);
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
                queue: new Array(6).fill({}),
              },
            ],
          },
          inventory: {
            Gem: new Decimal(50),
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
                unallocatedOilTime: 49 * 60 * 60 * 1000,
                id: "123",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
          inventory: {
            Gem: new Decimal(50),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
    });
  });
});
