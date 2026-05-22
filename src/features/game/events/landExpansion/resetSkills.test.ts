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
    it("charges 1 gem per skill point at history 0", () => {
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
      expect(state.inventory.Gem?.toNumber()).toEqual(9);
      expect(state.bumpkin?.skillPointsUsed).toEqual(1);
    });

    it("requires enough gems to cover the cost", () => {
      expect(() => {
        resetSkills({
          state: {
            ...INITIAL_FARM,
            bumpkin: {
              ...TEST_BUMPKIN,
              skills: { "Green Thumb": 1 },
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

    it("doubles the gem rate past 200 points used", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            skillPointsUsed: 200,
          },
          inventory: {
            Gem: new Decimal(10),
          },
        },
        action: { type: "skills.reset", paymentType: "gems" },
        createdAt: dateNow,
      });

      expect(state.inventory.Gem?.toNumber()).toEqual(8);
      expect(state.bumpkin?.skillPointsUsed).toEqual(201);
    });

    it("splits gem cost across a 200-point boundary", () => {
      // Player has 190 history. Removing 20 points costs:
      //   first 10 points at rate 1 = 10 gems
      //   next  10 points at rate 2 = 20 gems
      //   total 30 gems; history ends at 210
      // We can't easily make `skills` total exactly 20 points without a long
      // list, so this case is covered by the unit test on getGemCostForSkillPoints.
      expect(getGemCostForSkillPoints(20, 190)).toEqual(30);
      expect(getGemCostForSkillPoints(10, 0)).toEqual(10);
      expect(getGemCostForSkillPoints(10, 190)).toEqual(10);
      expect(getGemCostForSkillPoints(10, 200)).toEqual(20);
      expect(getGemCostForSkillPoints(400, 0)).toEqual(0 + 200 + 400);
    });

    it("does not write to skillPointsUsed nor charge gems on pure addition (not reachable via reset, but ensures helper is safe)", () => {
      expect(getGemCostForSkillPoints(0, 100)).toEqual(0);
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
