import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  getGemCostForSkillPoints,
  getSkillEditCost,
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
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });
    }).toThrow("You do not have any skills to reset");
  });

  describe("cost ramp", () => {
    it("charges nothing while history stays inside the free 200", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            previousFreeSkillResetAt: dateNow,
          },
          inventory: {
            Gem: new Decimal(10),
          },
        },
        action: { type: "skills.reset" },
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
        action: { type: "skills.reset" },
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
        action: { type: "skills.reset" },
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
          action: { type: "skills.reset" },
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
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });

      // History was treated as 0, so the 1 point sits inside the new free
      // window — no gem cost — and the timer is stamped to now.
      expect(state.inventory.Gem?.toNumber()).toEqual(10);
      expect(state.bumpkin?.skillPointsUsed).toEqual(1);
      expect(state.bumpkin?.previousFreeSkillResetAt).toEqual(dateNow);
    });

    it("computes the cost ramp correctly across the free window and rate doublings", () => {
      expect(getGemCostForSkillPoints(0, 100)).toEqual(0);
      expect(getGemCostForSkillPoints(200, 0)).toEqual(0);
      expect(getGemCostForSkillPoints(1, 200)).toEqual(1);
      expect(getGemCostForSkillPoints(1, 400)).toEqual(2);
      expect(getGemCostForSkillPoints(1, 600)).toEqual(4);
      expect(getGemCostForSkillPoints(20, 190)).toEqual(10);
      expect(getGemCostForSkillPoints(20, 390)).toEqual(30);
      expect(getGemCostForSkillPoints(600, 0)).toEqual(0 + 200 + 400);
    });
  });

  describe("ticket auto-use", () => {
    it("auto-consumes a ticket to absorb the next 200 paid points", () => {
      const TestBumpkin = {
        ...TEST_BUMPKIN,
        // Player has used 200 points already (so the build below puts another
        // 200 into the paid window).
        skillPointsUsed: 200,
        previousFreeSkillResetAt: dateNow,
        // A made-up build large enough to bring skillPointsUsed past 200.
        // We use multiple skills totalling many points; for simplicity we keep
        // just one skill in the build and lean on the helper test below for
        // proportionate absorption math.
        skills: { "Green Thumb": 1 },
      };
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: TestBumpkin,
          inventory: {
            "Skill Reset Ticket": new Decimal(1),
            Gem: new Decimal(0),
          },
        },
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });

      // Removing 1 point at history 200 = 1 paid point → ticket covers it.
      expect(state.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(0);
      expect(state.inventory.Gem?.toNumber()).toEqual(0);
      expect(state.bumpkin?.skillPointsUsed).toEqual(201);
    });

    it("does not consume a ticket when the transaction has no paid points", () => {
      const state = resetSkills({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Green Thumb": 1 },
            previousFreeSkillResetAt: dateNow,
          },
          inventory: {
            "Skill Reset Ticket": new Decimal(1),
          },
        },
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });

      expect(state.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(1);
      expect(state.bumpkin?.skillPointsUsed).toEqual(1);
    });
  });

  describe("ticket cost helper", () => {
    it("returns no cost and no tickets when all removals are inside the free window", () => {
      expect(getSkillEditCost(50, 100, 5)).toEqual({
        gemCost: 0,
        ticketsToUse: 0,
      });
    });

    it("absorbs the next 200 paid points with one ticket", () => {
      // Player at history 250 removes 200, 1 ticket available
      // → ticket covers positions 251–450, no gem cost.
      expect(getSkillEditCost(200, 250, 1)).toEqual({
        gemCost: 0,
        ticketsToUse: 1,
      });
    });

    it("falls back to gems on the highest-position remainder when tickets run out", () => {
      // Player at history 250 removes 300, 1 ticket.
      // Paid points = 300; ticket absorbs the first 200 (positions 251–450).
      // Remaining 100 paid points sit at positions 451–550 (rate 2/pt).
      expect(getSkillEditCost(300, 250, 1)).toEqual({
        gemCost: 200,
        ticketsToUse: 1,
      });
    });

    it("stacks multiple tickets when one is not enough", () => {
      // Player at history 250 removes 300, 2 tickets.
      // Paid points = 300; tickets absorb the first 400 → all 300 covered.
      // Both tickets consumed (no fractional consumption).
      expect(getSkillEditCost(300, 250, 2)).toEqual({
        gemCost: 0,
        ticketsToUse: 2,
      });
    });

    it("returns 0/0 for pure additions", () => {
      expect(getSkillEditCost(0, 250, 5)).toEqual({
        gemCost: 0,
        ticketsToUse: 0,
      });
    });
  });

  describe("180-day cooldown", () => {
    it("does not move previousFreeSkillResetAt for in-window edits", () => {
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
            Gem: new Decimal(100),
          },
        },
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.previousFreeSkillResetAt).toEqual(
        threeMonthsAgo.getTime(),
      );
    });

    it("reports a sane next-reset time via getTimeUntilNextFreeReset", () => {
      // Sanity check that the helper is exported (used by UI as well).
      expect(getTimeUntilNextFreeReset(dateNow, dateNow)).toEqual(
        180 * 24 * 60 * 60 * 1000,
      );
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
        action: { type: "skills.reset" },
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
        action: { type: "skills.reset" },
        createdAt: dateNow,
      });

      expect(state.bumpkin?.skills).toEqual({});
    });
  });
});
